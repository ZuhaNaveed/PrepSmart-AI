const quizService = require("../services/quizService");
const quizRepository = require("../repositories/quizRepository");
const userRepository = require("../repositories/userRepository");
const cache = require("../utils/cache");

const getQuizzes = async (req, res, next) => {
  try {
    const { category } = req.query;
    const quizzes = await quizService.getQuizzesByCategory(category);
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const submitQuizResults = async (req, res, next) => {
  try {
    const { answers } = req.body; // array of { quizId, selectedAnswerIndex }
    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ message: "answers array is required" });
    }

    const result = await quizService.submitQuiz(req.user.id, answers);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addQuizQuestion = async (req, res, next) => {
  try {
    // Admin check
    const user = await userRepository.findById(req.user.id);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden. Admin access required." });
    }

    const { category, question, options, correctAnswer } = req.body;
    if (!category || !question || !options || correctAnswer === undefined) {
      return res.status(400).json({ message: "All quiz fields are required" });
    }

    const newQuiz = await quizRepository.createQuizQuestion({
      category,
      question,
      options,
      correctAnswer,
    });

    await cache.clearCacheByPrefix("quizzes:");

    res.status(201).json(newQuiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addInterviewQuestion = async (req, res, next) => {
  try {
    // Admin check
    const user = await userRepository.findById(req.user.id);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden. Admin access required." });
    }

    const { role, category, text, suggestedAnswer } = req.body;
    if (!role || !category || !text) {
      return res.status(400).json({ message: "Role, category, and text are required" });
    }

    const newQuestion = await quizRepository.createInterviewQuestion({
      role,
      category,
      text,
      suggestedAnswer,
    });

    res.status(201).json(newQuestion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllInterviewQuestions = async (req, res, next) => {
  try {
    const questions = await quizRepository.findAllInterviewQuestions();
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getQuizStats = async (req, res, next) => {
  try {
    const stats = await quizService.getQuizStats(req.user.id);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getQuizzes,
  submitQuizResults,
  addQuizQuestion,
  addInterviewQuestion,
  getAllInterviewQuestions,
  getQuizStats,
};
