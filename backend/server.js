const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Import router
const userRoutes = require("./routes/user");
app.use("/users", userRoutes); // tất cả routes sẽ có prefix /users

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
