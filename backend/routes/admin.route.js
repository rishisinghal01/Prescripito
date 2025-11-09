import express from 'express'
import { addDoctor, adminDashboard, allappointments, allDoctors, cancelAppointment, loginAdmin } from '../controllers/admin.controller.js'
import upload from '../middlewares/multer.js'
import authadmin from '../middlewares/authAdmin.js'
import { changeAvailiblity } from '../controllers/doctor.controller.js'

const adminRouter = express.Router()

adminRouter.post("/add-doctor", authadmin, upload.single("image"), addDoctor)
adminRouter.post("/login", loginAdmin)
adminRouter.post("/all-doctors", authadmin, allDoctors)
adminRouter.post("/change-availability", authadmin, changeAvailiblity) // ✅ fixed function name
adminRouter.get("/appointments",authadmin,allappointments)
adminRouter.post('/cancel-appointment',authadmin,cancelAppointment)
adminRouter.get("/dashboard",authadmin,adminDashboard)
export default adminRouter
