import dotenv from "dotenv";
dotenv.config({ override: true });
import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import adminRouter from "./routes/admin.route.js";
import doctorRoute from "./routes/doctor.route.js";
import userRoute from "./routes/user.route.js";
import chatRoute from "./routes/chat.route.js";
import messageRouter from "./routes/message.route.js";
import creditRoute from "./routes/credit.routes.js";
import appointmentMessageRouter from "./routes/appointmentMessage.route.js";
import { stripeHooks } from "./controllers/webhooks.controller.js";
import appointmentMessageModel from "./models/appointmentMessageModel.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // allow all for dev
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 4000;

// ✅ Connect Database and Cloudinary
connectDB();
connectCloudinary();
app.post('/api/stripe', express.raw({ type: 'application/json' }), stripeHooks);

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cors());

// Serve uploads folder locally for chat attachments
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.get("/", (req, res) => {
  res.send("Hello World! Server is running with Socket.io");
});

app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRoute);
app.use("/api/user", userRoute)
app.use("/api/chat", chatRoute)
app.use("/api/message", messageRouter)
app.use("/api/credit", creditRoute)
app.use("/api/appointment-chat", appointmentMessageRouter)

// ⚡ Socket.io Connection Logic
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("join_appointment_room", (appointmentId) => {
    socket.join(appointmentId);
    console.log(`Socket ${socket.id} joined room ${appointmentId}`);
  });

  socket.on("send_message", async (data) => {
    console.log(`Received send_message from ${data.senderType}:`, data.text || data.attachmentName);
    // data: { appointmentId, senderType, senderId, text, attachmentUrl, attachmentType }
    try {
      const newMsg = new appointmentMessageModel({
        appointmentId: data.appointmentId,
        senderType: data.senderType,
        senderId: data.senderId,
        text: data.text || "",
        attachmentUrl: data.attachmentUrl || "",
        attachmentName: data.attachmentName || "",
        attachmentType: data.attachmentType || "",
        timestamp: Date.now(),
      });
      await newMsg.save();

      // Broadcast to everyone in the room (including sender)
      io.to(data.appointmentId).emit("receive_message", newMsg);
    } catch (error) {
      console.error("Socket error saving message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
