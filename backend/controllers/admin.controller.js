import validator from "validator";
import bcrypt from "bcrypt";
import {cloudinary } from "../config/cloudinary.js"; // ✅ Correct import
import doctorModel from "../models/doctorModel.js";
import jwt from "jsonwebtoken"
import appointmentModel from "../models/appointmentModel.js";
import userModel from "../models/userModel.js";
const addDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      about,
      fees,
      address,
    } = req.body;
    const imagefile = req.file;

    if (
      !name ||
      !email ||
      !password ||
      !speciality ||
      !degree ||
      !experience ||
      !about ||
      !fees ||
      !address ||
      !imagefile
    ) {
      return res.json({ success: false, message: "Missing Details" });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter a valid email" });
    }

    if (password.length < 8) {
      return res.json({ success: false, message: "Please enter a strong password" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(password, salt);

    // Upload image to Cloudinary

const imageupload = await cloudinary.uploader.upload(imagefile.path, {
  folder: "doctors_uploads_test",  // ✅ simple, clean folder name
  resource_type: "image",
  use_filename: true,
  unique_filename: false
});




    const imageurl = imageupload.secure_url;

    const doctordata = {
      name,
      email,
      image: imageurl,
      password: hashpassword,
      speciality,
      degree,
      fees: Number(fees),
      experience: Number(experience),
      about,
      address: JSON.parse(address),
      date: Date.now(),
    };

    const newDoctor = new doctorModel(doctordata);
    await newDoctor.save();

    res.json({ success: true, message: "Doctor Added" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const loginAdmin=async(req,res)=>{
  try{
    const {email,password}=req.body;
    if(email===process.env.ADMIN_EMAIL && password===process.env.ADMIN_PASSWORD){
const token = jwt.sign({ data: email + password }, process.env.JWT_SECRET_KEY)
         res.json({success:true,token:token})
    } else{
      res.json({success:false,message:"Invalid credentials"})
    }
  }
  catch(error){
    console.log(error);
    res.json({success:false,message:error.message});
  }
}

const allDoctors=async(req,res)=>{
  try{
    const doctors=await doctorModel.find({}).select('-password')
    res.json({success:true,doctors})
  }
  catch(error){
    console.log(error);
    res.json({success:false,message:error.message})
  }
}


const allappointments =  async (req,res)=>{
    
  try{

    const appointments= await appointmentModel.find({})
    res.json({success:true,appointments})
  }
  catch(error){
    res.json({success:false,message:error.message})
  }
}

const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body; // ✅ destructure correctly

    // ✅ find appointment by ID
    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData) {
      return res.json({ success: false, message: "Appointment not found" });
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

const adminDashboard = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select("-password");
    const users = await userModel.find({}).select("-password");
    const appointments = await appointmentModel.find({});

    const dashdata = {
      doctors: doctors.length,
      patients: users.length,
      appointments: appointments.length,
      latestAppointments: appointments.reverse().slice(0, 5),
    };

    res.json({ success: true, dashdata }); // ✅ FIXED success:true
  } catch (err) {
    console.error("Dashboard Error:", err.message);
    res.json({ success: false, message: err.message });
  }
};


export { addDoctor,loginAdmin ,allDoctors,allappointments,cancelAppointment,adminDashboard};
