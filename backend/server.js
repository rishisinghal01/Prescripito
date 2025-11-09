import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js"; // ✅ Correct import
import adminRouter from "./routes/admin.route.js";
import doctorRoute from "./routes/doctor.route.js";
import userRoute from "./routes/user.route.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

// ✅ Connect Database and Cloudinary
connectDB();
connectCloudinary();

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
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
