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
    try {
    const res = await getUsers();
    console.log("API response:", res.data);

    // Kiểm tra trả về đúng format không
    if (res.data.success) {
      setUsers(res.data.data); // trường hợp backend có success + data
    } else if (Array.isArray(res.data)) {
      setUsers(res.data); // trường hợp backend trả thẳng array
    } else {
      console.error("Unexpected API format:", res.data);
    }
  } catch (err) {
    console.error("Fetch users error:", err);
  }
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
        {users && users.length > 0 ? (
          users.map((u) => (
            <li key={u._id}>{u.name} - {u.email}</li>
          ))
        ) : (
          <p>Không có user nào</p>
        )}
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
