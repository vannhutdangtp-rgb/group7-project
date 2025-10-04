import React, { useEffect, useState } from "react";
import { getUsers, addUser, updateUser, deleteUser } from "../api";

function UserList() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "" });
  const [editingId, setEditingId] = useState(null);

  const loadUsers = () => {
    getUsers().then(res => setUsers(res.data.data));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleSubmit = async () => {
    if (!form.name || !form.email) return alert("Nhập đủ thông tin");
    if (editingId) {
      await updateUser(editingId, form);
      setEditingId(null);
    } else {
      await addUser(form);
    }
    setForm({ name: "", email: "" });
    loadUsers();
  };

  const handleEdit = (user) => {
    setForm({ name: user.name, email: user.email });
    setEditingId(user.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Xóa user này?")) {
      await deleteUser(id);
      loadUsers();
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Quản lý User</h1>
      <h3>{editingId ? "Sửa User" : "Thêm User"}</h3>

      <input
        placeholder="Tên"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <input
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <button onClick={handleSubmit}>{editingId ? "Cập nhật" : "Thêm"}</button>

      <h3>Danh sách User</h3>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.name} - {user.email}{" "}
            <button onClick={() => handleEdit(user)}>Sửa</button>{" "}
            <button onClick={() => handleDelete(user.id)}>Xóa</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserList;
