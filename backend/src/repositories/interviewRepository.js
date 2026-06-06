const Interview = require("../models/Interview");
const mongoose = require("mongoose");

const memoryInterviews = [
  {
    _id: "60c72b2f9b1d8b2bad000401",
    company: "Google",
    role: "Frontend Developer",
    experienceLevel: "Fresh Graduate",
    questions: [
      "What is Virtual DOM?",
      "Explain React Hooks."
    ],
    overallFeedback: "Demonstrated clear conceptual understanding of React concepts.",
    overallScore: 85,
    status: "completed",
    createdAt: new Date(),
  }
];

const createInterview = async (data) => {
  if (global.isMongoConnected) {
    return await Interview.create(data);
  }
  const newInterview = {
    _id: new mongoose.Types.ObjectId().toString(),
    questions: [],
    overallFeedback: "",
    overallScore: 0,
    status: "in-progress",
    createdAt: new Date(),
    ...data,
  };
  // Emulate mongoose save/update helpers
  newInterview.save = async function() {
    const idx = memoryInterviews.findIndex(i => i._id === this._id);
    if (idx !== -1) {
      memoryInterviews[idx] = this;
    }
  };
  memoryInterviews.push(newInterview);
  return newInterview;
};

const findById = async (id) => {
  if (global.isMongoConnected) {
    return await Interview.findById(id).populate("user", "name email");
  }
  const strId = id.toString();
  const found = memoryInterviews.find((i) => i._id.toString() === strId) || null;
  if (found) {
    // Attach save helper for service calls
    found.save = async function() {
      const idx = memoryInterviews.findIndex(i => i._id === this._id);
      if (idx !== -1) {
        memoryInterviews[idx] = this;
      }
    };
  }
  return found;
};

const findByUser = async (userId) => {
  if (global.isMongoConnected) {
    return await Interview.find({ user: userId }).sort({ createdAt: -1 });
  }
  const strUserId = userId.toString();
  return memoryInterviews
    .filter((i) => i.user.toString() === strUserId)
    .sort((a, b) => b.createdAt - a.createdAt);
};

const updateInterview = async (id, data) => {
  if (global.isMongoConnected) {
    return await Interview.findByIdAndUpdate(id, data, { new: true });
  }
  const strId = id.toString();
  const idx = memoryInterviews.findIndex((i) => i._id.toString() === strId);
  if (idx === -1) throw new Error("Interview not found");
  
  const updated = {
    ...memoryInterviews[idx],
    ...data,
  };
  memoryInterviews[idx] = updated;
  return updated;
};

module.exports = {
  createInterview,
  findById,
  findByUser,
  updateInterview,
};
