const quizRepository = require("../repositories/quizRepository");
const quizResultRepository = require("../repositories/quizResultRepository");
const Quiz = require("../models/Quiz");
const cache = require("../utils/cache");

const getQuizzesByCategory = async (category) => {
  const cacheKey = `quizzes:${category || "all"}`;
  
  // Try to load from cache
  const cachedData = await cache.getCache(cacheKey);
  if (cachedData) {
    console.log(`Cache hit for key: ${cacheKey}`);
    return cachedData;
  }

  let quizzes;
  if (category) {
    quizzes = await quizRepository.findQuizzesByCategory(category);
  } else {
    quizzes = await quizRepository.findAllQuizzes();
  }

  // Set cache (store for 10 minutes)
  await cache.setCache(cacheKey, quizzes, 600);
  return quizzes;
};

const submitQuiz = async (userId, answers) => {
  // answers is an array of { quizId, selectedAnswerIndex }
  let correctCount = 0;
  const detailedResults = [];

  for (const ans of answers) {
    const quiz = await quizRepository.findQuizById(ans.quizId);
    if (quiz) {
      const isCorrect = quiz.correctAnswer === ans.selectedAnswerIndex;
      if (isCorrect) correctCount++;
      
      detailedResults.push({
        question: quiz.question,
        options: quiz.options,
        correctAnswer: quiz.correctAnswer,
        userAnswer: ans.selectedAnswerIndex,
        isCorrect,
        suggestions: quiz.suggestions || "Review the key differences between the options and practice similar conceptual questions.",
        refinedAnswer: quiz.refinedAnswer || `The correct option is: "${quiz.options[quiz.correctAnswer]}".`,
      });
    }
  }

  const score = answers.length > 0 ? Math.round((correctCount / answers.length) * 100) : 0;

  // Persist the quiz result for stats tracking
  try {
    await quizResultRepository.createQuizResult({
      user: userId,
      category: detailedResults[0]?.question ? "Mixed" : "General",
      score,
      correctCount,
      totalCount: answers.length,
    });
  } catch (err) {
    console.error("Failed to save quiz result:", err.message);
  }

  return {
    score,
    correctCount,
    totalCount: answers.length,
    results: detailedResults,
  };
};

const getQuizStats = async (userId) => {
  return await quizResultRepository.getStatsByUser(userId);
};

module.exports = {
  getQuizzesByCategory,
  submitQuiz,
  getQuizStats,
};
