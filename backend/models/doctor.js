import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    registeredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userPhone: { type: String, required: true },
    role: {
      type: String,
      enum: ["pharmacist", "dermatologist"],
      required: true,
    },
    name: { type: String, required: true, trim: true },
    storeName: { type: String, required: true, trim: true },
    specialty: { type: String, required: true, trim: true },
    experience: { type: Number, required: true, min: 0, max: 50 },
    location: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    qualifications: { type: String, trim: true, default: "" },
  },
  { timestamps: true },
);

/* ── Performance indexes ── */
doctorSchema.index({ registeredBy: 1 }); // fetch a user's own doctors
doctorSchema.index({ role: 1, createdAt: -1 }); // carousel: pharmacists / dermatologists newest first

export default mongoose.model("Doctor", doctorSchema);
