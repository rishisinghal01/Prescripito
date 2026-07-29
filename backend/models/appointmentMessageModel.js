import mongoose from "mongoose";

const appointmentMessageSchema = new mongoose.Schema({
  appointmentId: {
    type: String,
    required: true,
  },
  senderType: {
    type: String, // 'User' or 'Doctor'
    required: true,
  },
  senderId: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    default: "", // text can be empty if only sending an attachment
  },
  attachmentUrl: {
    type: String,
    default: "",
  },
  attachmentName: {
    type: String,
    default: "",
  },
  attachmentType: {
    type: String, // 'image', 'pdf', or ''
    default: "",
  },
  timestamp: {
    type: Number,
    default: Date.now,
  },
});

const appointmentMessageModel =
  mongoose.models.appointmentMessage ||
  mongoose.model("appointmentMessage", appointmentMessageSchema);

export default appointmentMessageModel;
