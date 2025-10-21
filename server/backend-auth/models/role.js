const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, // Example: "admin", "editor", "user"
    trim: true
  },
  description: {
    type: String
  },
  permissions: [{
    type: String // Example: "read", "write", "delete"
  }]
}, { timestamps: true });

module.exports = mongoose.model("Role", roleSchema);