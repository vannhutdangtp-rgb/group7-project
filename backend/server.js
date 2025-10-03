const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");

dotenv.config(); // Đọc file .env

const app = express();
app.use(express.json());

// 🔹 Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// 🔹 Routes
// GET all users
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST add user
app.post("/users", async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ success: false, message: "Vui lòng gửi name và email" });
  }
  try {
    const newUser = new User({ name, email });
    await newUser.save();
    res.status(201).json({ success: true, data: newUser });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 🔹 Server listen
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
// backend/server.js
require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.json());

// Routes
const userRoutes = require('./routes/user');
app.use('/api/users', userRoutes);

// Root test
app.get('/', (req, res) => res.send('API is running'));

// PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
