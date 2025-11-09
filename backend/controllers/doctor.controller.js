import doctorModel from "../models/doctorModel.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import appointmentModel from "../models/appointmentModel.js";
const changeAvailiblity =async (req,res)=>{
    try{
         const {docId}=req.body;
         const docData=await doctorModel.findById(docId);
         await doctorModel.findByIdAndUpdate(docId,{available:!docData.available})
         res.json({success:true,message:"Doctor availability updated",available:docData.available})
            if(!docData){
                return res.json({success:false,message:"Doctor not found"})
            }
    }
    catch(error){
        console.log(error); 
    res.json({success:false,message:error.message})
    }
}

const doctorList=async(req,res)=>{
try{
    const doctors=await doctorModel.find({}).select(["-password","-email"])
   res.json({success:true,doctors})
}
catch(error){
        console.log(error); 
    res.json({success:false,message:error.message})
    }
}

const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;
    const data = await doctorModel.findOne({ email });

    if (!data) {
      return res.json({ success: false, message: "Invalid Email" });
    }

    const isMatch = await bcrypt.compare(password, data.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid Credentials" });
    }

    // ✅ FIXED: use data._id (the doctor record)
    const token = jwt.sign(
      { id: data._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    console.log("✅ Token Created with Doctor ID:", data._id);
    console.log("🔐 Token:", token);

    return res.json({ success: true, token });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

const allappointments = async (req, res) => {
  try {
    const docId = req.docId; // from middleware
    const appointments = await appointmentModel.find({ docId });
    res.json({ success: true, appointment: appointments });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

const markAppointmentComplete = async (req, res) => {
  try {
    const docId = req.docId;
    const { appointmentId } = req.body;
 
    const appointmentData = await appointmentModel.findById(appointmentId);

    if (appointmentData && appointmentData.docId === docId) {
      await appointmentModel.findOneAndUpdate(
        { _id: appointmentId }, // ✅ FIX: wrap in an object
        { isCompleted: true }
      );

      return res.json({ success: true, message: "Appointment marked as completed" });
    } else {
      return res.json({ success: false, message: "Unauthorized or invalid appointment" });
    }
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

const CancelAppointment = async (req,res)=>{
  try{

    const docId = req.docId;
    const {appointmentId}= req.body;
    const appointmentData= await appointmentModel.findById(appointmentId)
    if(appointmentData && appointmentData.docId==docId){
      await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true})
      return res.json({success:true,message:"Appointment Cancelled"})
    }
    else{
      return res.json({success:false,message:"Cancellation Failed"})
      
    }
  }
  catch(err){
    res.json({success:false,message:err.message})
  }
}


const doctorDashboard = async (req, res) => {
  try {
    const docId = req.docId;
    const appointments = await appointmentModel.find({ docId });
    let earning = 0;
    appointments.forEach(item => {
      if (item.isCompleted || item.payment) {
        earning += Number(item.amount);
      }
    });

    let patients = [];
    appointments.forEach(item => {
      if (!patients.includes(item.userId)) {
        patients.push(item.userId);
      }
    });
    
    const dashdata = {
      earning,
      appointments: appointments.length,
      patients: patients.length,
      latestAppointments: [...appointments].reverse().slice(0, 5)
    };


    res.json({ success: true, dashdata });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

const doctorprofile = async(req,res)=>{
  try{

    const docId =req.docId;
    const profileData= await doctorModel.findById(docId).select('-password');
    res.json({success:true,profileData})
  }
  catch(err){
        res.json({ success: false, message: err.message });

  }
}


const updateDocProfile = async (req, res) => {
  try {
    const docId = req.docId; // ✅ get from token (middleware)
    const { fees, address, available, name } = req.body;

    if (!docId) {
      return res.json({ success: false, message: "Doctor ID not found in token" });
    }

    // ✅ Update doctor profile
    await doctorModel.findByIdAndUpdate(docId, { fees, address, available, name });

    // ✅ Return updated doc data
    const updatedDoc = await doctorModel.findById(docId).select("-password");
    res.json({ success: true, message: "Profile Updated", updatedDoc });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};



export {changeAvailiblity,doctorList,loginDoctor,allappointments,CancelAppointment,markAppointmentComplete,doctorDashboard,doctorprofile,updateDocProfile}