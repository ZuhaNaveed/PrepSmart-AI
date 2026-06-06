const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true, // e.g. Frontend, Backend, databases
    },
    title: {
      type: String,
      default: "", // e.g. JavaScript Basics Quiz
    },
    timeLimit: {
      type: Number,
      default: 15, // time limit in minutes
    },
    questions: {
      type: mongoose.Schema.Types.Mixed, // Can be question count (e.g. 10) or question list
      default: 0,
    },
    question: {
      type: String,
      required: false, // Make optional for flexible sets
    },
    options: {
      type: [String],
      required: false,
    },
    correctAnswer: {
      type: Number,
      required: false, // index of correct answer in the options array
    },
    suggestions: {
      type: String,
      default: "",
    },
    refinedAnswer: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Quiz", quizSchema);
