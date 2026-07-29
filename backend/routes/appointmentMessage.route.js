import express from "express";
import { getAppointmentMessages, uploadMessageAttachment } from "../controllers/appointmentMessage.controller.js";
import upload from "../middlewares/multer.js";

const appointmentMessageRouter = express.Router();

appointmentMessageRouter.get("/:appointmentId", getAppointmentMessages);
appointmentMessageRouter.post("/upload", upload.single("attachment"), uploadMessageAttachment);

export default appointmentMessageRouter;
