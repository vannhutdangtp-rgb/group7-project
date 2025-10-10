import React, { useEffect, useState } from "react";
import { getUsers, deleteUser } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  // ✅ Nếu không phải admin → tự chuyển về /profile
  useEffect(() => {
    if (!token || role !== "admin") {
      alert("Bạn không có quyền truy cập trang này!");
      navigate("/profile");
    }
  }, [token, role, navigate]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getUsers(token);
        setUsers(res.data);
      } catch (err) {
        setMessage("Không có quyền truy cập hoặc lỗi tải danh sách!");
      }
    };
    if (token && role === "admin") fetchUsers();
  }, [token, role]);

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa user này?")) return;
    try {
      const res = await deleteUser(token, id);
      setUsers(users.filter((u) => u._id !== id));
      setMessage(res.data.message);
    } catch (err) {
      setMessage("Lỗi khi xóa user!");
    }
  };

  return (
    <div className="container">
      <h2>Quản lý người dùng (Admin)</h2>
      {message && <p>{message}</p>}

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Tên</th>
            <th>Email</th>
            <th>Role</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>
                  <button onClick={() => handleDelete(u._id)}>Xóa</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">Không có người dùng nào.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}