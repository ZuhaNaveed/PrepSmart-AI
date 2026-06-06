const codingService = require("../services/codingService");
const codingRepository = require("../repositories/codingRepository");
const userRepository = require("../repositories/userRepository");
const cache = require("../utils/cache");

const getProblemsList = async (req, res, next) => {
  try {
    const problems = await codingService.getProblems();
    res.json(problems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProblemDetail = async (req, res, next) => {
  try {
    const problem = await codingService.getProblemById(req.params.id);
    if (!problem) {
      return res.status(404).json({ message: "Coding problem not found" });
    }
    res.json(problem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const submitCodeSolution = async (req, res, next) => {
  try {
    const { problemId, code } = req.body;
    if (!problemId || code === undefined) {
      return res.status(400).json({ message: "problemId and code are required" });
    }

    const result = await codingService.submitCode(req.user.id, problemId, code);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addCodingProblem = async (req, res, next) => {
  try {
    // Admin check
    const user = await userRepository.findById(req.user.id);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden. Admin access required." });
    }

    const { title, difficulty, description, starterCode, constraints, testCases } = req.body;
    if (!title || !difficulty || !description || !starterCode || !testCases || !Array.isArray(testCases)) {
      return res.status(400).json({ message: "All coding fields (including testCases array) are required" });
    }

    const newProblem = await codingRepository.createCodingProblem({
      title,
      difficulty,
      description,
      starterCode,
      constraints,
      testCases,
    });

    await cache.deleteCache("coding:problems");

    res.status(201).json(newProblem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProblemsList,
  getProblemDetail,
  submitCodeSolution,
  addCodingProblem,
};
