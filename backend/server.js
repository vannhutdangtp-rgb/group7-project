// server.js
const express = require('express');
const app = express();

// Middleware để parse JSON
app.use(express.json());

// Biến PORT lấy từ file .env (nếu có), mặc định = 3000
const PORT = process.env.PORT || 3000;

// Khởi động server
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));