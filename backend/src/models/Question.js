const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: false, // Frontend, Backend, Full Stack, UI/UX Designer
    },
    category: {
      type: String,
      required: true, // HR, Technical, Behavioral, JavaScript, etc.
    },
    text: {
      type: String,
      required: false,
    },
    question: {
      type: String,
      required: false, // User requested field
    },
    difficulty: {
      type: String,
      default: "Medium", // Easy, Medium, Hard
    },
    company: {
      type: String,
      default: "General", // e.g. Google, Meta
    },
    type: {
      type: String,
      default: "Technical", // e.g. Technical, Behavioral, HR
    },
    suggestedAnswer: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Question", questionSchema);
