const mongoose = require("mongoose");

const codingProblemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      required: true, // Easy, Medium, Hard
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: "General", // e.g. Arrays, Strings
    },
    company: {
      type: String,
      default: "General", // e.g. Meta, Google
    },
    starterCode: {
      type: String,
      required: false, // Make optional
    },
    constraints: {
      type: [String],
      default: [],
    },
    testCases: [
      {
        input: { type: String, required: true },
        output: { type: String, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("CodingProblem", codingProblemSchema);
