import React, { useEffect, useState } from "react";
import { getUsers, addUser, updateUser, deleteUser } from "./services/api"; // import file API

function UserList() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Lấy danh sách user khi load trang
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await getUsers();
      setUsers(res.data.data);
    } catch (err) {
      console.error("Lỗi khi tải users:", err);
    }
  };

  // ================== Thêm User ==================
  const handleAdd = async () => {
    if (!name || !email) return alert("Vui lòng nhập đủ tên và email");
    try {
      await addUser({ name, email });
      setName("");
      setEmail("");
      fetchUsers();
    } catch (err) {
      console.error("Lỗi khi thêm user:", err);
    }
  };

  // ================== Sửa User ==================
  const handleEdit = async (id) => {
    const newName = prompt("Nhập tên mới:");
    if (!newName) return;

    try {
      await updateUser(id, { name: newName });
      fetchUsers();
    } catch (err) {
      console.error("Lỗi khi sửa user:", err);
    }
  };

  // ================== Xóa User ==================
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa user này không?")) return;
    try {
      await deleteUser(id);
      setUsers(users.filter((u) => u._id !== id));
    } catch (err) {
      console.error("Lỗi khi xóa user:", err);
    }
  };

  return (
    <div>
      <h1>Quản lý User</h1>

      <h3>Thêm User</h3>
      <input
        type="text"
        placeholder="Tên"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleAdd}>Thêm</button>

      <h3>Danh sách User</h3>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} - {user.email}{" "}
            <button onClick={() => handleEdit(user.id)}>Sửa</button>{" "}
            <button onClick={() => handleDelete(user.id)}>Xóa</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserList;
