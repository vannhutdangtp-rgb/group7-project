// backend/controllers/userController.js

let users = [
  { id: 1, name: "Đặng Văn Nhựt", email: "nhutdangvantp.@gmail.com" },
  { id: 2, name: "Hoàng Nguyễn Hữu Lộc", email: "dangbenh" },
  { id: 3, name: "Lê Hoàng Hảo", email: "lehoanghaokk@gmail.com" }
];

// Lấy danh sách người dùng (GET)
exports.getUsers = (req, res) => {
  return res.json({ success: true, data: users });
};

// Tạo user mới (POST)
exports.createUser = (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ success: false, message: "Vui lòng gửi name và email" });
  }

  const newId = users.length ? users[users.length - 1].id + 1 : 1;
  const newUser = { id: newId, name, email };
  users.push(newUser);

  return res.status(201).json({ success: true, data: newUser });
};

// ✅ Sửa user (PUT)
exports.updateUser = (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  const index = users.findIndex(u => u.id == id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: "Không tìm thấy user" });
  }

  // Cập nhật thông tin (nếu có)
  if (name) users[index].name = name;
  if (email) users[index].email = email;

  return res.json({ success: true, data: users[index] });
};

// ✅ Xóa user (DELETE)
exports.deleteUser = (req, res) => {
  const { id } = req.params;
  const index = users.findIndex(u => u.id == id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: "Không tìm thấy user" });
  }

  const deletedUser = users[index];
  users.splice(index, 1);

  return res.json({ success: true, message: "Đã xóa user thành công", data: deletedUser });
};

// (Tuỳ chọn) Export users để test / reset
exports._getStore = () => users;
