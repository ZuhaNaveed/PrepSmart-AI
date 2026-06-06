const mongoose = require("mongoose");

const savedQuestionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // Make optional
    },
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: false, // Make optional
    },
    userId: {
      type: String,
      default: "", // User requested
    },
    questionId: {
      type: String,
      default: "", // User requested
    },
    savedAt: {
      type: Date,
      default: Date.now, // User requested
    },
  },
  {
    timestamps: true,
  }
);

// Ensure a user can only save a specific question once
savedQuestionSchema.index({ user: 1, question: 1 }, { unique: true });

module.exports = mongoose.model("SavedQuestion", savedQuestionSchema);
