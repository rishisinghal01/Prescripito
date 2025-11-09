
import validator from "validator"
import bcrypt, { hash } from 'bcrypt'
import userModel from "../models/userModel.js"
import jwt from 'jsonwebtoken'
import { cloudinary } from "../config/cloudinary.js"; // ✅ Correct import
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import razorpay from 'razorpay'
const registeruser = async (req, res) => {
  try {

    const { name, email, password } = req.body
    if (!name || !email || !password) {
      return res.json({ success: false, message: "Mising Details" })
    }
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Invalid Email" })

    }
    if (password.length < 8) {
      return res.json({ success: false, message: "Enter a strong password" })
    }


    const salt = await bcrypt.genSalt(10)
    const hashpassword = await bcrypt.hash(password, salt)

    const userData = {
      email,
      name,
      password: hashpassword
    }

    const newUser = new userModel(userData);
    const user = await newUser.save()

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY)

    res.json({ success: true, token })



  }
  catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message })
  }
};

const loginuser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check user exists
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User doesn't exist" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    // Send token
    res.json({ success: true, token });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const getprofile = async (req, res) => {
  try {
    // ✅ userId now comes from middleware (req.userId)
    const userId = req.userId;

    // ✅ No need for destructuring "data" from findById (it’s not an axios call)
    const user = await userModel.findById(userId).select("-password");

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const updateprofile = async (req, res) => {
  try {
    const { name, phone, address, dob, gender } = req.body;
    const userId = req.userId; // ✅ from middleware
    const image = req.file; // ✅ correctly accessed

    // ✅ validate required fields
    if (!name || !phone || !dob || !gender) {
      return res.json({ success: false, message: "Missing details" });
    }

    // ✅ safely parse address
    let parsedAddress = {};
    try {
      parsedAddress = JSON.parse(address);
    } catch {
      parsedAddress = address || {};
    }

    // ✅ update main profile info
    await userModel.findByIdAndUpdate(userId, {
      name,
      phone,
      address: parsedAddress,
      dob,
      gender,
    });

    // ✅ upload image if provided
    if (image) {
      const uploaded = await cloudinary.uploader.upload(image.path, {
        resource_type: "image", // ✅ fixed: must be a string
        folder: "prescripto_users",
      });

      await userModel.findByIdAndUpdate(userId, {
        image: uploaded.secure_url,
      });
    }

    res.json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    console.error("Update Profile Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};

const bookAppointment = async (req, res) => {
  try {
    const userId = req.userId; // ✅ from auth middleware
    const { docId, slotDate, slotTime } = req.body;

    // ✅ Get doctor
    const docData = await doctorModel.findById(docId).select("-password");
    if (!docData) {
      return res.json({ success: false, message: "Doctor not found" });
    }

    if (!docData.available) {
      return res.json({ success: false, message: "Doctor is not available" });
    }

    // ✅ Manage booked slots
    let slots_booked = docData.slots_booked || {};
    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        return res.json({ success: false, message: "Slot is not available" });
      } else {
        slots_booked[slotDate].push(slotTime);
      }
    } else {
      slots_booked[slotDate] = [slotTime];
    }

    // ✅ Get user
    const userData = await userModel.findById(userId).select("-password");

    // ✅ Remove unnecessary doctor field before embedding
    const docInfo = docData.toObject();
    delete docInfo.slots_booked;

    // ✅ Create appointment
    const appointmentData = new appointmentModel({
      userId,
      docId,
      userData,
      docData: docInfo,
      amount: docInfo.fees,
      slotTime,
      slotDate,
      date: new Date(),
    });

    await appointmentData.save();

    // ✅ Update doctor’s booked slots
    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    res.json({ success: true, message: "Appointment booked successfully!" });
  } catch (error) {
    console.error("Book Appointment Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};

const getAllAppointment = async (req, res) => {
  try {

    const userId = req.userId
    const appointments = await appointmentModel.find({ userId })
    res.json({ success: true, appointments })
  }
  catch (error) {
    res.json({ success: false, message: error.message });
  }
}

const cancelAppointment = async (req, res) => {
  try {
    const userId = req.userId; // ✅ from auth middleware
    const { appointmentId } = req.body; // ✅ destructure correctly

    // ✅ find appointment by ID
    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData) {
      return res.json({ success: false, message: "Appointment not found" });
    }

    // ✅ validate ownership
    if (appointmentData.userId !== userId) {
      return res.json({ success: false, message: "Unauthorized Action" });
    }

    // ✅ mark appointment as cancelled
    await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

    const { docId, slotDate, slotTime } = appointmentData; // ✅ pull from DB object, not req.body

    // ✅ find doctor
    const doctorData = await doctorModel.findById(docId);

    if (!doctorData) {
      return res.json({ success: false, message: "Doctor not found" });
    }

    // ✅ remove the cancelled slot from doctor's booked slots
    let slots_booked = doctorData.slots_booked || {};
    if (slots_booked[slotDate]) {
      slots_booked[slotDate] = slots_booked[slotDate].filter((time) => time !== slotTime);
    }

    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    res.json({ success: true, message: "Appointment Cancelled Successfully" });
  } catch (error) {
    console.error("Cancel Appointment Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};

const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "kk", // ✅ Use env for safety
  key_secret: process.env.RAZORPAY_SECRET || "djhdjchjdjchj",
});

const paymentRazorpay = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    // ✅ Validate ID
    if (!appointmentId) {
      return res.json({ success: false, message: "Missing appointment ID" });
    }

    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData || appointmentData.cancelled) {
      return res.json({
        success: false,
        message: "Appointment cancelled or not found",
      });
    }

    // ✅ Build order details
    const options = {
      amount: Number(appointmentData.amount) * 100, // convert to paise
      currency: "INR",
      receipt: String(appointmentId),
    };

    // ✅ Create Razorpay order safely
    const order = await razorpayInstance.orders.create(options);

    res.json({
      success: true,
      message: "Payment order created successfully",
      order,
    });
  } catch (error) {
    // ✅ Safely handle all possible error formats
    console.error("Razorpay Payment Error:", error);
    res.json({
      success: false,
      message:
        error?.message ||
        error?.error?.description ||
        "Payment order creation failed",
    });
  }
};

const verifyRazorpay = async (req,res)=>{
   try{
  const {razorpay_order_id}=req.body;
  const orderinfo= await razorpayInstance.orders.fetch(razorpay_order_id )

  console.log(orderinfo)

  if(orderinfo.status==="paid"){
    await appointmentModel.findById(orderinfo.receipt,{payment:true}) 
    return res.json({success:true,message:"Payment Successfull"})
  }
   else{
   return res.json({success:false,message:"Payment Failed"})
   }
  }
  catch(error){
    console.log(error);
    res.json({success:false,message:error.message})
  }
}






export { registeruser, loginuser, getprofile, updateprofile, bookAppointment, getAllAppointment, cancelAppointment, paymentRazorpay ,verifyRazorpay}