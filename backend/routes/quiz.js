import express from "express";
import QuizResult from "../models/quizResult.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

function getStage(yesCount) {
  if (yesCount <= 5)
    return { stage: "mild", label: "Stage 1 — Mild Photosensitivity Risk" };
  if (yesCount <= 10)
    return { stage: "moderate", label: "Stage 2 — Moderate Photosensitivity" };
  if (yesCount <= 13)
    return { stage: "severe", label: "Stage 3 — Severe Photosensitivity" };
  return { stage: "critical", label: "Stage 4 — Critical Photosensitivity" };
}

/**
 * POST /api/quiz/save
 * Protected — save a completed quiz result
 */
router.post("/save", protect, async (req, res) => {
  try {
    const { answers } = req.body;
    if (!Array.isArray(answers) || answers.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Answers array is required" });
    }

    const yesCount = answers.filter(Boolean).length;
    const { stage, label } = getStage(yesCount);

    const result = await QuizResult.create({
      user: req.user._id,
      phone: req.user.phone,
      answers,
      yesCount,
      stage,
      stageLabel: label,
    });

    res.status(201).json({ success: true, result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * GET /api/quiz/history
 * Protected — get the logged-in user's past quiz results
 */
router.get("/history", protect, async (req, res) => {
  try {
    const results = await QuizResult.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(10);
    res.status(200).json({ success: true, results });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
