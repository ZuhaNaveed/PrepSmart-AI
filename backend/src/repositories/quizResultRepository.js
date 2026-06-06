const QuizResult = require("../models/QuizResult");
const mongoose = require("mongoose");

const memoryQuizResults = [];

const createQuizResult = async (data) => {
  if (global.isMongoConnected) {
    return await QuizResult.create(data);
  }
  const newResult = {
    _id: new mongoose.Types.ObjectId().toString(),
    createdAt: new Date(),
    ...data,
  };
  memoryQuizResults.push(newResult);
  return newResult;
};

const getStatsByUser = async (userId) => {
  if (global.isMongoConnected) {
    const results = await QuizResult.find({ user: userId }).sort({ createdAt: -1 });
    const totalCompleted = results.length;
    const perfectScores = results.filter((r) => r.score === 100).length;
    const avgScore = totalCompleted > 0
      ? Math.round(results.reduce((sum, r) => sum + r.score, 0) / totalCompleted)
      : 0;
    return { totalCompleted, perfectScores, avgScore, recentResults: results.slice(0, 10) };
  }

  const strUserId = userId.toString();
  const results = memoryQuizResults
    .filter((r) => r.user.toString() === strUserId)
    .sort((a, b) => b.createdAt - a.createdAt);
  
  const totalCompleted = results.length;
  const perfectScores = results.filter((r) => r.score === 100).length;
  const avgScore = totalCompleted > 0
    ? Math.round(results.reduce((sum, r) => sum + r.score, 0) / totalCompleted)
    : 0;
  return { totalCompleted, perfectScores, avgScore, recentResults: results.slice(0, 10) };
};

module.exports = {
  createQuizResult,
  getStatsByUser,
};
