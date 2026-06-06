const authService = require("../services/authService");
const generateToken = require("../utils/generateToken");
const userRepository = require("../repositories/userRepository");

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const user = await authService.registerUser(name, email, password);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      skills: user.skills,
      targetRole: user.targetRole,
      readinessScore: user.readinessScore,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await authService.loginUser(email, password);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      skills: user.skills,
      targetRole: user.targetRole,
      readinessScore: user.readinessScore,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

const getProfile = async (req, res, next) => {
  try {
    const user = await userRepository.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      skills: user.skills,
      targetRole: user.targetRole,
      readinessScore: user.readinessScore,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { name, skills, targetRole } = req.body;
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (skills !== undefined) updateData.skills = skills;
    if (targetRole !== undefined) updateData.targetRole = targetRole;

    const user = await userRepository.updateUser(req.user.id, updateData);
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      skills: user.skills,
      targetRole: user.targetRole,
      readinessScore: user.readinessScore,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    // Admin check
    const user = await userRepository.findById(req.user.id);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden. Admin access required." });
    }
    const allUsers = await userRepository.findAll();
    res.json(allUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  getAllUsers,
};