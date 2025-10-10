import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js"; // 🆕 thêm dòng này
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Kết nối MongoDB
connectDB();

// Định tuyến
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes); // 🆕 thêm dòng này
app.use("/api/users", userRoutes);

// Chạy server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
