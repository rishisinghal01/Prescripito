import appointmentMessageModel from "../models/appointmentMessageModel.js";
import { saveFileLocally } from "../utils/fileUpload.js";

// Fetch all messages for a specific appointment
export const getAppointmentMessages = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const messages = await appointmentMessageModel
      .find({ appointmentId })
      .sort({ timestamp: 1 }); // Oldest first

    res.json({ success: true, messages });
  } catch (error) {
    console.error("Error fetching appointment messages:", error.message);
    res.json({ success: false, message: error.message });
  }
};

export const uploadMessageAttachment = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.json({ success: false, message: "No file uploaded" });
    }

    const isPdf = file.mimetype === "application/pdf" || file.originalname.toLowerCase().endsWith(".pdf");
    
    // Save file locally to bypass Cloudinary PDF delivery block
    const uniqueFileName = saveFileLocally(file);

    // Determine backend URL dynamically based on the request
    const protocol = req.headers['x-forwarded-proto'] || req.protocol;
    const host = req.headers['x-forwarded-host'] || req.get('host');
    const backendUrl = `${protocol}://${host}`;
    const fileUrl = `${backendUrl}/uploads/${uniqueFileName}`;

    res.json({ 
      success: true, 
      attachmentUrl: fileUrl,
      attachmentName: file.originalname,
      attachmentType: isPdf ? 'pdf' : 'image'
    });
  } catch (error) {
    console.error("Error uploading attachment locally:", error.message);
    res.json({ success: false, message: error.message });
  }
};
