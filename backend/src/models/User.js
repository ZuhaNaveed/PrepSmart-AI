const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      default: "student",
    },

    skills: {
      type: [String],
      default: [],
    },

    targetRole: {
      type: String,
      default: "",
    },

    readinessScore: {
      type: Number,
      default: 70, // Start with a generic mock readiness score
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);