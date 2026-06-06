const User = require("../models/User");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const memoryUsers = [];

// Seed memory users
const seedMemoryUsers = async () => {
  const adminPassword = await bcrypt.hash("admin123", 10);
  const userPassword = await bcrypt.hash("user123", 10);

  memoryUsers.push({
    _id: "60c72b2f9b1d8b2bad000001",
    name: "Admin User",
    email: "admin@prepsmart.ai",
    password: adminPassword,
    role: "admin",
    skills: ["System Architecture", "AI Integration", "Product Management"],
    targetRole: "Platform Administrator",
    readinessScore: 95,
    createdAt: new Date(),
  });

  memoryUsers.push({
    _id: "60c72b2f9b1d8b2bad000002",
    name: "Sample Candidate",
    email: "candidate@prepsmart.ai",
    password: userPassword,
    role: "student",
    skills: ["React", "Tailwind CSS", "JavaScript", "HTML"],
    targetRole: "Frontend Developer",
    readinessScore: 72,
    createdAt: new Date(),
  });
};
seedMemoryUsers();

const findByEmail = async (email) => {
  if (global.isMongoConnected) {
    return await User.findOne({ email });
  }
  return memoryUsers.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
};

const createUser = async (data) => {
  if (global.isMongoConnected) {
    return await User.create(data);
  }
  const newUser = {
    _id: new mongoose.Types.ObjectId().toString(),
    skills: [],
    targetRole: "",
    readinessScore: 70,
    ...data,
    createdAt: new Date(),
  };
  memoryUsers.push(newUser);
  return newUser;
};

const findById = async (id) => {
  if (global.isMongoConnected) {
    return await User.findById(id);
  }
  const strId = id.toString();
  return memoryUsers.find((u) => u._id.toString() === strId) || null;
};

const updateUser = async (id, data) => {
  if (global.isMongoConnected) {
    return await User.findByIdAndUpdate(id, data, { new: true });
  }
  const strId = id.toString();
  const userIdx = memoryUsers.findIndex((u) => u._id.toString() === strId);
  if (userIdx === -1) throw new Error("User not found");

  const updated = {
    ...memoryUsers[userIdx],
    ...data,
  };
  memoryUsers[userIdx] = updated;
  return updated;
};

const findAll = async () => {
  if (global.isMongoConnected) {
    return await User.find({}).select("-password");
  }
  return memoryUsers.map(({ password, ...u }) => u);
};

module.exports = {
  findByEmail,
  createUser,
  findById,
  updateUser,
  findAll,
};