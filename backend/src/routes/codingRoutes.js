const express = require("express");
const router = express.Router();

const {
  getProblemsList,
  getProblemDetail,
  submitCodeSolution,
  addCodingProblem,
} = require("../controllers/codingController");

const { protect } = require("../middlewares/authMiddleware");

router.get("/", protect, getProblemsList);
router.get("/:id", protect, getProblemDetail);
router.post("/submit", protect, submitCodeSolution);
router.post("/add-problem", protect, addCodingProblem);

module.exports = router;
