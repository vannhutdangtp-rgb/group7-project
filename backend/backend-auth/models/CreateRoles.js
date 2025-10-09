require("dotenv").config({ path: "../../.env" }); // go up 2 folders from models/
const mongoose = require("mongoose");
const Role = require("./role");

// Debugging line 👇
console.log("Loaded MONGO_URI:", process.env.MONGO_URI);

const MONGO_URI = process.env.MONGO_URI;

async function createRoles() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ Connected to MongoDB");

    const roles = [
      { name: "admin", description: "Full access", permissions: ["create", "read", "update", "delete"] },
      { name: "user", description: "Basic user", permissions: ["read"] },
      { name: "editor", description: "Can edit content", permissions: ["read", "update"] },
    ];

    for (const role of roles) {
      const exists = await Role.findOne({ name: role.name });
      if (!exists) {
        await Role.create(role);
        console.log(`✅ Created role: ${role.name}`);
      } else {
        console.log(`⚠️ Role already exists: ${role.name}`);
      }
    }

    console.log("🎉 Done creating roles!");
    await mongoose.disconnect();
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}

createRoles();