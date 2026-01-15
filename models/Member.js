import mongoose from "mongoose";

const MemberSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, enum: ["admin", "member"], default: "member" },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    type: String
  },
  { timestamps: true }
);

export default mongoose.model("Member", MemberSchema);
