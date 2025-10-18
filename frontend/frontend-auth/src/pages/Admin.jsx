import React, { useEffect, useState } from "react";
import { getUsers, deleteUser } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const role = localStorage.getItem("role");
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    if (!token || (role !== "admin" && role !== "editor")) {
      alert("Bạn không có quyền truy cập trang này!");
      navigate("/profile");
    }
  }, [token, role, navigate]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getUsers();
        setUsers(res.data);
      } catch {
        setMessage("❌ Không thể tải danh sách người dùng!");
      }
    };
    if (token) fetchUsers();
  }, [token]);

  const handleDelete = async (id) => {
    if (role !== "admin") {
      alert("Chỉ Admin mới có quyền xóa!");
      return;
    }
    if (!window.confirm("Bạn có chắc muốn xóa user này?")) return;
    try {
      const res = await deleteUser(id);
      setUsers(users.filter((u) => u._id !== id));
      setMessage(res.data.message);
    } catch {
      setMessage("❌ Lỗi khi xóa user!");
    }
  };

  return (
    <div className="container">
      <h2>📋 Quản lý người dùng ({role})</h2>
      {message && <p>{message}</p>}

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Tên</th>
            <th>Email</th>
            <th>Vai trò</th>
            {role === "admin" && <th>Hành động</th>}
          </tr>
        </thead>
        <tbody>
          {users.length ? (
            users.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role?.name || "Không có vai trò"}</td>
                {role === "admin" && (
                  <td>
                    <button onClick={() => handleDelete(u._id)}>Xóa</button>
                  </td>
                )}
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