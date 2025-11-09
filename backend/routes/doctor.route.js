import express from 'express'
import { allappointments, CancelAppointment, doctorDashboard, doctorList, doctorprofile, loginDoctor, markAppointmentComplete, updateDocProfile} from '../controllers/doctor.controller.js';
import authDoctor from '../middlewares/authDoctor.js';

const doctorRoute=express.Router();
doctorRoute.get("/list",doctorList)
doctorRoute.post("/login",loginDoctor)
doctorRoute.get('/appointments',authDoctor,allappointments)
doctorRoute.post("/complete-appointment",authDoctor,markAppointmentComplete)
doctorRoute.post("/cancel-appointment",authDoctor,CancelAppointment)
doctorRoute.get('/dashboard',authDoctor,doctorDashboard)
doctorRoute.get("/profile",authDoctor,doctorprofile)
doctorRoute.post('/update-profile',authDoctor,updateDocProfile);

export default doctorRoute