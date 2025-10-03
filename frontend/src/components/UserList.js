import React, { useEffect, useState } from "react";
import { getUsers, addUser } from "../services/api";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await getUsers();
    setUsers(res.data.data); // chú ý: backend trả { success, data }
  };

  const handleAddUser = async () => {
    if (!name || !email) return alert("Nhập đầy đủ name và email!");
    await addUser({ name, email });
    setName("");
    setEmail("");
    fetchUsers();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Danh sách User từ MongoDB</h2>
      <ul>
        {users.map((u) => (
          <li key={u._id}>{u.name} - {u.email}</li>
        ))}
      </ul>

      <input
        type="text"
        placeholder="Nhập tên user"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="email"
        placeholder="Nhập email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleAddUser}>Thêm User</button>
    </div>
  );
};

export default UserList;
