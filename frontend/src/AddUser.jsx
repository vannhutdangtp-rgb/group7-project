import React, { useState } from "react";
import axios from "axios";

function AddUser({ onUserAdded }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:4000/api/users", { name, email })
      .then(res => {
        onUserAdded(); // gọi lại UserList để load thêm user mới
        setName("");
        setEmail("");
      })
      .catch(err => console.error(err));
  };

  return (
    <div>
      <h2>Thêm User</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Tên" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
        />
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <button type="submit">Thêm</button>
      </form>
    </div>
  );
}

export default AddUser;