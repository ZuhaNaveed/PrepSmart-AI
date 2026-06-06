const express = require("express");
const router = express.Router();

const {
  startMockInterview,
  submitInterviewAnswer,
  getMyInterviews,
  getSavedQuestions,
  toggleSaveQuestion,
} = require("../controllers/interviewController");

const { protect } = require("../middlewares/authMiddleware");

router.post("/start", protect, startMockInterview);
router.post("/submit", protect, submitInterviewAnswer);
router.get("/history", protect, getMyInterviews);
router.get("/saved", protect, getSavedQuestions);
router.post("/saved/toggle", protect, toggleSaveQuestion);

module.exports = router;
