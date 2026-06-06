const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // Make optional to support independent records
    },
    role: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: false,
    },
    company: {
      type: String,
      default: "General", // e.g. Google
    },
    experienceLevel: {
      type: String,
      default: "Fresh Graduate", // e.g. Junior, Senior
    },
    questions: {
      type: mongoose.Schema.Types.Mixed, // Can be array of objects or array of strings
      default: [],
    },
    overallFeedback: {
      type: String,
      default: "",
    },
    overallScore: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["in-progress", "completed"],
      default: "completed",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Interview", interviewSchema);
