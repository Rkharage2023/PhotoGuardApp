import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

function signToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

/**
 * POST /api/auth/login
 * Body: { phone, role }
 * Creates the user if they don't exist (phone-based auth, no password for users)
 */
router.post("/login", async (req, res) => {
  try {
    const { phone, role } = req.body;

    if (!phone || !/^\d{10}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        message: "A valid 10-digit phone number is required",
      });
    }

    const validRoles = ["user", "pharmacist", "dermatologist"];
    if (role && !validRoles.includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }

    // Upsert: find or create
    let user = await User.findOne({ phone });
    if (!user) {
      user = await User.create({ phone, role: role || "user" });
    }

    const token = signToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        phone: user.phone,
        role: user.role,
        name: user.name,
        profileCompleted: user.profileCompleted,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * GET /api/auth/me
 * Returns the currently logged-in user
 */
router.get("/me", protect, (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

export default router;
