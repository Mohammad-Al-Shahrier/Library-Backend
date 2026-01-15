import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Member from "../models/Member.js";

export const register = async (req, res) => {
  const { name, email, password, role, type } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const member = await Member.create({
    name,
    email,
    password: hashedPassword,
    role,
    type
  });

  res.status(201).json(member);
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const member = await Member.findOne({ email });
  if (!member)
    return res.status(400).json({ message: "Invalid credentials" });

  if (member.status !== "active")
    return res.status(403).json({ message: "Account inactive" });

  const isMatch = await bcrypt.compare(password, member.password);
  if (!isMatch)
    return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { id: member._id, role: member.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "strict",
    secure: false,
    maxAge: 24 * 60 * 60 * 1000
  });

  res.json({ message: "Login successful" });
};

export const logout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
};

export const getMyProfile = async (req, res) => {
  const member = await Member.findById(req.user.id).select("-password");
  res.json(member);
};

export const getAllMembers = async (req, res) => {
  const members = await Member.find().select("-password");
  res.json(members);
};

export const updateMemberStatus = async (req, res) => {
  const member = await Member.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );

  res.json(member);
};


export const searchMembers = async (req, res) => {
  const { name, type } = req.query;

  const members = await Member.find({
    ...(name && { name: new RegExp(name, "i") }),
    ...(type && { type })
  }).select("-password");

  res.json(members);
};
