import express from "express";
import User from "../models/user.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

/**
 * PUT /api/users/profile
 * Update the logged-in user's profile
 */
router.put("/profile", protect, async (req, res) => {
  try {
    const { name, location, age, gender } = req.body;

    const updates = {};
    if (name) updates.name = name.trim();
    if (location) updates.location = location.trim();
    if (age) updates.age = Number(age);
    if (gender) updates.gender = gender;

    // Mark profile complete if all required fields present
    const merged = { ...req.user.toObject(), ...updates };
    if (merged.name && merged.location && merged.age && merged.gender) {
      updates.profileCompleted = true;
    }

    const updated = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, user: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

/**
 * GET /api/users/profile
 * Get the logged-in user's profile
 */
router.get("/profile", protect, async (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

export default router;
