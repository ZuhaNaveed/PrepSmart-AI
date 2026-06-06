const express = require("express");
const router = express.Router();

const {
  getQuizzes,
  submitQuizResults,
  addQuizQuestion,
  addInterviewQuestion,
  getAllInterviewQuestions,
  getQuizStats,
} = require("../controllers/quizController");

const { protect } = require("../middlewares/authMiddleware");

router.get("/", protect, getQuizzes);
router.get("/stats", protect, getQuizStats);
router.post("/submit", protect, submitQuizResults);
router.post("/add-quiz", protect, addQuizQuestion);
router.post("/add-interview-question", protect, addInterviewQuestion);
router.get("/interview-questions", protect, getAllInterviewQuestions);

module.exports = router;
