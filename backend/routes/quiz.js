import express from "express";
import QuizResult from "../models/quizResult.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();


/**
 * POST /api/quiz/save
 * Protected — save a completed quiz result
 */
router.post("/save", protect, async (req, res) => {
  try {
    const {
      part1Answers,
      part2Answers,
      part1Images,
      part2Images,
      probabilities,
      yesCount,
      stage,
      stageLabel
    } = req.body;

    const result = await QuizResult.create({
      user: req.user._id,
      phone: req.user.phone,
      part1Answers: part1Answers || [],
      part2Answers: part2Answers || [],
      part1Images: part1Images || [],
      part2Images: part2Images || [],
      probabilities: probabilities || [],
      yesCount: yesCount || 0,
      stage: stage || "mild",
      stageLabel: stageLabel || "Stage 1 — Mild Photosensitivity Risk",
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
