let users = [
  { id: 1, name: "Đặng Văn Nhựt", email: "nhutdangvantp@gmail.com" },
  { id: 2, name: "Hoàng Nguyễn Hữu Lộc", email: "loc@gmail.com" },
  { id: 3, name: "Lê Hoàng Hảo", email: "hao@gmail.com" }
];

// GET
exports.getUsers = (req, res) => {
  res.json({ success: true, data: users });
};

// POST
exports.createUser = (req, res) => {
  const { name, email } = req.body;
  if (!name || !email)
    return res.status(400).json({ success: false, message: "Thiếu name hoặc email" });

  const newUser = { id: Date.now(), name, email };
  users.push(newUser);
  res.status(201).json({ success: true, data: newUser });
};

// PUT
exports.updateUser = (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  const index = users.findIndex(u => u.id == id);
  if (index === -1)
    return res.status(404).json({ success: false, message: "Không tìm thấy user" });

  if (name) users[index].name = name;
  if (email) users[index].email = email;

  res.json({ success: true, data: users[index] });
};

// DELETE
exports.deleteUser = (req, res) => {
  const { id } = req.params;
  const index = users.findIndex(u => u.id == id);
  if (index === -1)
    return res.status(404).json({ success: false, message: "Không tìm thấy user" });

  const deleted = users.splice(index, 1);
  res.json({ success: true, message: "Đã xóa user", data: deleted[0] });
};
