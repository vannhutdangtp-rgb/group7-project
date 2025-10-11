import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "user" },
  avatar: { type: String, default: "" },
  resetPasswordToken: { type: String },
  resetPasswordExpire: { type: Date },
});

export default mongoose.model("User", userSchema);
