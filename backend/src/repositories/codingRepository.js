const CodingProblem = require("../models/CodingProblem");
const mongoose = require("mongoose");

const memoryProblems = [
  {
    _id: "60c72b2f9b1d8b2bad000301",
    title: "Two Sum",
    difficulty: "Easy",
    category: "Arrays",
    description: "Find two numbers whose sum equals target.",
    company: "Meta",
    starterCode: "function twoSum(nums, target) {\n  // Write your code here\n  \n}",
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
    ],
    testCases: [
      { input: "[2, 7, 11, 15], 9", output: "[0, 1]" },
      { input: "[3, 2, 4], 6", output: "[1, 2]" },
    ],
  },
  {
    _id: "60c72b2f9b1d8b2bad000302",
    title: "Reverse a String",
    difficulty: "Easy",
    description: "Write a function that takes a string as input and returns the string reversed.\n\nExample:\nInput: 'hello'\nOutput: 'olleh'",
    starterCode: "function reverseString(str) {\n  // Write your code here\n  \n}",
    constraints: [
      "0 <= str.length <= 10^5",
      "Inputs consist of printable ASCII characters",
    ],
    testCases: [
      { input: "'hello'", output: "'olleh'" },
      { input: "'PrepSmart'", output: "'tramsperP'" },
    ],
  },
  {
    _id: "60c72b2f9b1d8b2bad000303",
    title: "Fibonacci Number",
    difficulty: "Medium",
    description: "The Fibonacci numbers, commonly denoted F(n) form a sequence, called the Fibonacci sequence, such that each number is the sum of the two preceding ones, starting from 0 and 1.\n\nGiven n, calculate F(n).\n\nExample:\nInput: n = 4\nOutput: 3 (F(0)=0, F(1)=1, F(2)=1, F(3)=2, F(4)=3)",
    starterCode: "function fib(n) {\n  // Write your code here\n  \n}",
    constraints: [
      "0 <= n <= 30",
    ],
    testCases: [
      { input: "2", output: "1" },
      { input: "4", output: "3" },
      { input: "6", output: "8" },
    ],
  },
];

const createCodingProblem = async (data) => {
  if (global.isMongoConnected) {
    return await CodingProblem.create(data);
  }
  const newProblem = {
    _id: new mongoose.Types.ObjectId().toString(),
    constraints: [],
    ...data,
  };
  memoryProblems.push(newProblem);
  return newProblem;
};

const findProblems = async () => {
  if (global.isMongoConnected) {
    return await CodingProblem.find({});
  }
  return memoryProblems;
};

const findProblemById = async (id) => {
  if (global.isMongoConnected) {
    return await CodingProblem.findById(id);
  }
  const strId = id.toString();
  return memoryProblems.find((p) => p._id.toString() === strId) || null;
};

module.exports = {
  createCodingProblem,
  findProblems,
  findProblemById,
};
