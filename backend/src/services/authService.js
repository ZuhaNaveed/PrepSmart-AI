const bcrypt = require("bcryptjs");
const userRepository = require("../repositories/userRepository");

const registerUser = async (name, email, password) => {
  const existingUser = await userRepository.findByEmail(email);

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  return await userRepository.createUser({
    name,
    email,
    password: hashedPassword,
  });
};

const loginUser = async (email, password) => {
  const user = await userRepository.findByEmail(email);

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  return user;
};

module.exports = {
  registerUser,
  loginUser,
};