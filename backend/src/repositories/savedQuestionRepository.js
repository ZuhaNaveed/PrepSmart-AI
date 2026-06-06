const SavedQuestion = require("../models/SavedQuestion");
const quizRepository = require("./quizRepository");
const mongoose = require("mongoose");

const memorySavedQuestions = [
  {
    _id: "60c72b2f9b1d8b2bad000501",
    userId: "12345",
    questionId: "q001",
    savedAt: new Date("2026-06-02"),
  }
];

const saveQuestion = async (userId, questionId) => {
  if (global.isMongoConnected) {
    return await SavedQuestion.findOneAndUpdate(
      { user: userId, question: questionId },
      { user: userId, question: questionId },
      { upsert: true, new: true }
    );
  }
  const strUserId = userId.toString();
  const strQuestionId = questionId.toString();

  const exists = memorySavedQuestions.some(
    (sq) => sq.user.toString() === strUserId && sq.question.toString() === strQuestionId
  );

  if (!exists) {
    memorySavedQuestions.push({
      _id: new mongoose.Types.ObjectId().toString(),
      user: userId,
      question: questionId,
      createdAt: new Date(),
    });
  }
  return { user: userId, question: questionId };
};

const unsaveQuestion = async (userId, questionId) => {
  if (global.isMongoConnected) {
    return await SavedQuestion.findOneAndDelete({ user: userId, question: questionId });
  }
  const strUserId = userId.toString();
  const strQuestionId = questionId.toString();

  const idx = memorySavedQuestions.findIndex(
    (sq) => sq.user.toString() === strUserId && sq.question.toString() === strQuestionId
  );

  if (idx !== -1) {
    return memorySavedQuestions.splice(idx, 1)[0];
  }
  return null;
};

const getSavedQuestionsByUser = async (userId) => {
  if (global.isMongoConnected) {
    return await SavedQuestion.find({ user: userId })
      .populate("question")
      .sort({ createdAt: -1 });
  }
  const strUserId = userId.toString();
  const matched = memorySavedQuestions.filter((sq) => sq.user.toString() === strUserId);

  const results = [];
  for (const item of matched) {
    const questionObj = await quizRepository.findQuestionById(item.question);
    if (questionObj) {
      results.push({
        _id: item._id,
        user: item.user,
        question: questionObj,
        createdAt: item.createdAt,
      });
    }
  }
  return results.sort((a, b) => b.createdAt - a.createdAt);
};

const isSaved = async (userId, questionId) => {
  if (global.isMongoConnected) {
    const record = await SavedQuestion.findOne({ user: userId, question: questionId });
    return !!record;
  }
  const strUserId = userId.toString();
  const strQuestionId = questionId.toString();

  return memorySavedQuestions.some(
    (sq) => sq.user.toString() === strUserId && sq.question.toString() === strQuestionId
  );
};

module.exports = {
  saveQuestion,
  unsaveQuestion,
  getSavedQuestionsByUser,
  isSaved,
};
