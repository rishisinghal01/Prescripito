import express from "express"
import { bookAppointment, cancelAppointment, getAllAppointment, getprofile, loginuser, paymentRazorpay, registeruser, updateprofile, verifyRazorpay } from "../controllers/user.controller.js";
import authuser from "../middlewares/authUser.js";
import upload from "../middlewares/multer.js";

const userRoute=express.Router();

userRoute.post("/register",registeruser)
userRoute.post("/login",loginuser)
userRoute.get("/get-profile",authuser,getprofile)
userRoute.post('/update-profile',upload.single("image"),authuser,updateprofile)
userRoute.post("/book-appointment",authuser,bookAppointment);
userRoute.get("/get-appointments",authuser,getAllAppointment)
userRoute.post("/cancel-appointment",authuser,cancelAppointment)
userRoute.post("/payment-razorpay",authuser,paymentRazorpay)
userRoute.post('/verify-razorpay',authuser,verifyRazorpay)
export default userRoute
