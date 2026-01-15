import express from "express";
import {
  register,
  login,
  logout,
  getMyProfile,
  getAllMembers,
  updateMemberStatus,
  searchMembers
} from "../controllers/memberController.js";

import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

router.get("/me", protect, getMyProfile);
router.get("/", protect, adminOnly, getAllMembers);
router.put("/:id/status", protect, adminOnly, updateMemberStatus);
router.get("/search", protect, adminOnly, searchMembers);

export default router;
