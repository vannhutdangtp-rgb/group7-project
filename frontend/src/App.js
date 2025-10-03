import React, { useState } from "react";
import UserList from "./UserList";
import AddUser from "./AddUser";

function App() {
  const [reload, setReload] = useState(false);

  const handleUserAdded = () => {
    setReload(!reload); // toggle để load lại danh sách
  };

  return (
    <div className="App">
      <h1>Quản lý User</h1>
      <AddUser onUserAdded={handleUserAdded} />
      {/* key để reload danh sách khi thêm user */}
      <UserList key={reload} />
    </div>
  );
}

export default App;