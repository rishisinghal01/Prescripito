import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js"; // ✅ Correct import
import adminRouter from "./routes/admin.route.js";
import doctorRoute from "./routes/doctor.route.js";
import userRoute from "./routes/user.route.js";
import chatRoute from "./routes/chat.route.js";
import messageRouter from "./routes/message.route.js";
import creditRoute from "./routes/credit.routes.js";
import { stripeHooks } from "./controllers/webhooks.controller.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

// ✅ Connect Database and Cloudinary
connectDB();
connectCloudinary();
app.post('/api/stripe', express.raw({ type: 'application/json' }), stripeHooks);

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/admin", adminRouter);
app.use("/api/doctor",doctorRoute);
app.use("/api/user",userRoute)
app.use("/api/chat",chatRoute)
app.use("/api/message",messageRouter)
app.use("/api/credit",creditRoute)


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
