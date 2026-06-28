import mongoose from "mongoose";

const quizResultSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    phone: { type: String, required: true },
    answers: [{ type: Boolean }], // Keep for backwards compatibility
    part1Answers: [{ type: Boolean }],
    part2Answers: [{ type: Boolean }],
    part1Images: [{ type: String }], // Base64 strings
    part2Images: [{ type: String }], // Base64 strings
    probabilities: [
      {
        id: { type: String },
        label: { type: String },
        percentage: { type: Number },
      }
    ],
    yesCount: { type: Number },
    stage: {
      type: String,
    },
    stageLabel: { type: String },
  },
  { timestamps: true },
);

/* ── Performance indexes ── */
quizResultSchema.index({ user: 1, createdAt: -1 }); // history: user's results newest first
quizResultSchema.index({ stage: 1 }); // analytics: results by stage

export default mongoose.model("QuizResult", quizResultSchema);
