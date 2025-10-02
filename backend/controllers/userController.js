// backend/controllers/userController.js

let users = [
  { id: 1, name: "Đặng Văn Nhựt", email: "nhutdangvantp.@gmail.com" },
  { id: 2, name: "Hoàng Nguyễn Hữu Lộc", email: "Đangbenh" },
  { id: 3, name: "Lê Hoàng Hảo", email: "lehoanghaokk@gmail.com" }
];

// Lấy danh sách người dùng
exports.getUsers = (req, res) => {
  return res.json({ success: true, data: users });
};

// Tạo user mới
exports.createUser = (req, res) => {
  const { name, email } = req.body;

  // Validate đơn giản
  if (!name || !email) {
    return res.status(400).json({ success: false, message: "Vui lòng gửi name và email" });
  }

  // Tạo id đơn giản (tăng dần)
  const newId = users.length ? users[users.length - 1].id + 1 : 1;
  const newUser = { id: newId, name, email };

  users.push(newUser);

  return res.status(201).json({ success: true, data: newUser });
};

// (Tuỳ chọn) export users để test / reset (không bắt buộc)
exports._getStore = () => users;