import express from "express";
import Doctor from "../models/Doctor.js";
import { protect, restrictTo } from "../middleware/auth.js";

const router = express.Router();

/**
 * GET /api/doctors
 * Public — returns all registered doctors (used on HomePage carousel)
 */
router.get("/", async (req, res) => {
  try {
    const { role } = req.query; // ?role=pharmacist or ?role=dermatologist
    const filter = role ? { role } : {};
    const doctors = await Doctor.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: doctors.length, doctors });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * POST /api/doctors
 * Protected — only pharmacist or dermatologist can add
 */
router.post(
  "/",
  protect,
  restrictTo("pharmacist", "dermatologist"),
  async (req, res) => {
    try {
      const {
        name,
        storeName,
        specialty,
        experience,
        location,
        email,
        phone,
        qualifications,
      } = req.body;

      if (
        !name ||
        !storeName ||
        !specialty ||
        !experience ||
        !location ||
        !email ||
        !phone
      ) {
        return res
          .status(400)
          .json({ success: false, message: "All fields are required" });
      }

      const doctor = await Doctor.create({
        registeredBy: req.user._id,
        userPhone: req.user.phone,
        role: req.user.role,
        name,
        storeName,
        specialty,
        experience,
        location,
        email,
        phone,
        qualifications,
      });

      res.status(201).json({ success: true, doctor });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },
);

/**
 * DELETE /api/doctors/:id
 * Protected — only the user who created the record can delete it
 */
router.delete(
  "/:id",
  protect,
  restrictTo("pharmacist", "dermatologist"),
  async (req, res) => {
    try {
      const doctor = await Doctor.findById(req.params.id);
      if (!doctor) {
        return res
          .status(404)
          .json({ success: false, message: "Doctor not found" });
      }

      // Ownership check
      if (doctor.registeredBy.toString() !== req.user._id.toString()) {
        return res
          .status(403)
          .json({ success: false, message: "Not authorised" });
      }

      await doctor.deleteOne();
      res.status(200).json({ success: true, message: "Doctor deleted" });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
);

export default router;
