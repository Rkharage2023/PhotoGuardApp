import mongoose from "mongoose";

const quizResultSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    phone: { type: String, required: true },
    answers: [{ type: Boolean }], // array of true/false per question
    yesCount: { type: Number, required: true },
    stage: {
      type: String,
      enum: ["mild", "moderate", "severe", "critical"],
      required: true,
    },
    stageLabel: { type: String }, // human-readable label saved for display
  },
  { timestamps: true },
);

/* ── Performance indexes ── */
quizResultSchema.index({ user: 1, createdAt: -1 }); // history: user's results newest first
quizResultSchema.index({ stage: 1 }); // analytics: results by stage

export default mongoose.model("QuizResult", quizResultSchema);
