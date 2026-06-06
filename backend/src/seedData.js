require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");
const Question = require("./models/Question");
const CodingProblem = require("./models/CodingProblem");
const Quiz = require("./models/Quiz");
const Interview = require("./models/Interview");
const SavedQuestion = require("./models/SavedQuestion");

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/prepsmartdb";
    console.log(`Connecting to MongoDB at ${mongoUri}...`);
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB.");

    // Clear target collections
    await Question.deleteMany({});
    await CodingProblem.deleteMany({});
    await Quiz.deleteMany({});
    await Interview.deleteMany({});
    await SavedQuestion.deleteMany({});
    console.log("Cleared questions, codingproblems, quizzes, interviews, and savedquestions collections.");

    // 1. Seed 10 Interview Questions
    const questionsData = [
      {
        question: "What is the difference between let, const, and var in JavaScript?",
        category: "JavaScript",
        difficulty: "Medium",
        company: "Google",
        type: "Technical",
        text: "What is the difference between let, const, and var in JavaScript?",
        suggestedAnswer: "var is function-scoped and hoisted. let and const are block-scoped and not hoisted in the same way (temporal dead zone). const variables cannot be reassigned.",
        role: "Frontend Developer"
      },
      {
        question: "Explain the concept of Virtual DOM and the difference between adaptive layouts and fluid layouts.",
        category: "React",
        difficulty: "Medium",
        company: "Google",
        type: "Technical",
        text: "Explain the concept of Virtual DOM and the difference between adaptive layouts and fluid layouts.",
        suggestedAnswer: "The Virtual DOM is a lightweight, in-memory representation of the Real DOM. Adaptive layouts use fixed media query breakpoints, while fluid layouts use percentage-based styling.",
        role: "Frontend Developer"
      },
      {
        question: "What are React Hooks and how do they work?",
        category: "React",
        difficulty: "Medium",
        company: "Google",
        type: "Technical",
        text: "What are React Hooks and how do they work?",
        suggestedAnswer: "React Hooks allow function components to use state, lifecycle methods, and other features without writing a class. Examples include useState and useEffect.",
        role: "Frontend Developer"
      },
      {
        question: "Explain the event loop in Node.js.",
        category: "Node.js",
        difficulty: "Hard",
        company: "Netflix",
        type: "Technical",
        text: "Explain the event loop in Node.js.",
        suggestedAnswer: "The Event Loop is Node.js's core engine that handles non-blocking asynchronous operations by offloading tasks to the kernel or thread pool and executing callbacks on completion.",
        role: "Backend Developer"
      },
      {
        question: "How do you secure a REST API?",
        category: "Security",
        difficulty: "Hard",
        company: "Amazon",
        type: "Technical",
        text: "How do you secure a REST API?",
        suggestedAnswer: "API security features HTTPS, JWT auth, input validation, Helmet headers, CORS policies, and rate-limiting to block brute-force attempts.",
        role: "Backend Developer"
      },
      {
        question: "Describe a conflict you had with a coworker and how you resolved it.",
        category: "Behavioral",
        difficulty: "Easy",
        company: "Google",
        type: "Behavioral",
        text: "Describe a conflict you had with a coworker and how you resolved it.",
        suggestedAnswer: "I resolved our design dispute by setting up a live sandbox to test performance benchmarks of both layouts, letting neutral data guide the final choice.",
        role: "Full Stack Developer"
      },
      {
        question: "Why do you want to join PrepSmart AI?",
        category: "HR",
        difficulty: "Easy",
        company: "PrepSmart",
        type: "HR",
        text: "Why do you want to join PrepSmart AI?",
        suggestedAnswer: "I want to contribute to democratization of AI-powered technical mock training tools, expanding learning availability globally.",
        role: "Full Stack Developer"
      },
      {
        question: "What is the difference between SQL and NoSQL?",
        category: "Databases",
        difficulty: "Medium",
        company: "Microsoft",
        type: "Technical",
        text: "What is the difference between SQL and NoSQL?",
        suggestedAnswer: "SQL databases are relational, structured, and use schemas. NoSQL databases are non-relational, distributed, dynamic, and document/key-value oriented.",
        role: "Full Stack Developer"
      },
      {
        question: "What is a Closure in JavaScript?",
        category: "JavaScript",
        difficulty: "Medium",
        company: "Apple",
        type: "Technical",
        text: "What is a Closure in JavaScript?",
        suggestedAnswer: "A closure is the combination of a function bundled together with references to its surrounding state (the lexical environment).",
        role: "Frontend Developer"
      },
      {
        question: "Explain CSS Custom Properties.",
        category: "CSS",
        difficulty: "Easy",
        company: "Meta",
        type: "Technical",
        text: "Explain CSS Custom Properties.",
        suggestedAnswer: "CSS custom properties (variables) are entities defined by CSS authors that contain specific values to be reused throughout a document.",
        role: "UI/UX Designer"
      }
    ];

    const seededQuestions = await Question.insertMany(questionsData);
    console.log(`Seeded ${seededQuestions.length} interview questions.`);

    // 2. Seed 5 Coding Problems
    const codingProblemsData = [
      {
        title: "Two Sum",
        difficulty: "Easy",
        category: "Arrays",
        description: "Find two numbers whose sum equals target.",
        company: "Meta",
        starterCode: "function twoSum(nums, target) {\n  // Write your code here\n}",
        constraints: ["2 <= nums.length <= 10^4"],
        testCases: [{ input: "[2, 7, 11, 15], 9", output: "[0, 1]" }]
      },
      {
        title: "Reverse a String",
        difficulty: "Easy",
        category: "Strings",
        description: "Write a function that takes a string and returns it reversed.",
        company: "Google",
        starterCode: "function reverseString(str) {\n  // Write your code here\n}",
        constraints: ["0 <= str.length <= 10^5"],
        testCases: [{ input: "'hello'", output: "'olleh'" }]
      },
      {
        title: "Fibonacci Number",
        difficulty: "Medium",
        category: "Recursion",
        description: "Calculate the Fibonacci number F(n).",
        company: "Apple",
        starterCode: "function fib(n) {\n  // Write your code here\n}",
        constraints: ["0 <= n <= 30"],
        testCases: [{ input: "4", output: "3" }]
      },
      {
        title: "Fizz Buzz",
        difficulty: "Easy",
        category: "Basic",
        description: "Return an array containing Fizz, Buzz, or FizzBuzz.",
        company: "Amazon",
        starterCode: "function fizzBuzz(n) {\n  // Write your code here\n}",
        constraints: ["1 <= n <= 10^4"],
        testCases: [{ input: "3", output: "['1','2','Fizz']" }]
      },
      {
        title: "Valid Parentheses",
        difficulty: "Medium",
        category: "Stacks",
        description: "Determine if the input string bracket patterns are valid.",
        company: "Meta",
        starterCode: "function isValid(s) {\n  // Write your code here\n}",
        constraints: ["1 <= s.length <= 10^4"],
        testCases: [{ input: "'()[]{}'", output: "true" }]
      }
    ];

    const seededCoding = await CodingProblem.insertMany(codingProblemsData);
    console.log(`Seeded ${seededCoding.length} coding problems.`);

    // 3. Seed 3 Quizzes
    const quizzesData = [
      {
        title: "JavaScript Basics Quiz",
        category: "JavaScript",
        question: "Which of the following is NOT a primitive data type in JavaScript?",
        options: ["String", "Number", "Boolean", "Object"],
        correctAnswer: 3,
        timeLimit: 15,
        suggestions: "Primitive types in JavaScript include String, Number, Boolean, Null, Undefined, Symbol, and BigInt. Objects are reference types.",
        refinedAnswer: "Object is not a primitive type in JavaScript; it is a reference type."
      },
      {
        title: "React Fundamentals Quiz",
        category: "React",
        question: "Which hook should be used to memoize the result of a computationally expensive function?",
        options: ["useEffect", "useMemo", "useCallback", "useState"],
        correctAnswer: 1,
        timeLimit: 12,
        suggestions: "Use useMemo for caching values, and useCallback for caching callback function references.",
        refinedAnswer: "useMemo memoizes the returned value of a function so it is only recomputed when dependencies change."
      },
      {
        title: "Node.js Essentials Quiz",
        category: "Node.js",
        question: "Which core Node.js module is used to handle file paths?",
        options: ["fs", "path", "http", "url"],
        correctAnswer: 1,
        timeLimit: 10,
        suggestions: "The path module offers cross-platform utilities to resolve and normalize directory and file paths.",
        refinedAnswer: "The 'path' module provides utilities for working with file and directory paths."
      }
    ];

    const seededQuizzes = await Quiz.insertMany(quizzesData);
    console.log(`Seeded ${seededQuizzes.length} quizzes.`);

    // 4. Seed 5 Interview Records
    const interviewsData = [
      {
        company: "Google",
        role: "Frontend Developer",
        experienceLevel: "Fresh Graduate",
        questions: ["What is Virtual DOM?", "Explain React Hooks."],
        overallFeedback: "Demonstrated strong basic component knowledge.",
        overallScore: 85,
        status: "completed"
      },
      {
        company: "Amazon",
        role: "Backend Developer",
        experienceLevel: "Junior",
        questions: ["How do you secure a REST API?", "Explain the event loop in Node.js."],
        overallFeedback: "Solid technical core and security practices.",
        overallScore: 78,
        status: "completed"
      },
      {
        company: "Meta",
        role: "Frontend Developer",
        experienceLevel: "Mid-level",
        questions: ["Explain CSS Custom Properties.", "What is the difference between let, const, and var in JavaScript?"],
        overallFeedback: "Clean explanations and dynamic responsive designs.",
        overallScore: 90,
        status: "completed"
      },
      {
        company: "Netflix",
        role: "Full Stack Developer",
        experienceLevel: "Senior",
        questions: ["What is the difference between SQL and NoSQL?", "Why do you want to join PrepSmart AI?"],
        overallFeedback: "High systemic architecture insights.",
        overallScore: 88,
        status: "completed"
      },
      {
        company: "Microsoft",
        role: "Software Engineer",
        experienceLevel: "Junior",
        questions: ["What is a Closure in JavaScript?"],
        overallFeedback: "In-progress evaluation loop.",
        overallScore: 0,
        status: "in-progress"
      }
    ];

    const seededInterviews = await Interview.insertMany(interviewsData);
    console.log(`Seeded ${seededInterviews.length} interview records.`);

    // 5. Seed 5 SavedQuestions (linked only if a user exists)
    const existingUser = await User.findOne();
    if (existingUser) {
      const userObjId = existingUser._id;
      const savedQuestionsData = [];
      
      // Save up to 5 questions
      for (let i = 0; i < Math.min(5, seededQuestions.length); i++) {
        savedQuestionsData.push({
          user: userObjId,
          question: seededQuestions[i]._id,
          userId: userObjId.toString(),
          questionId: `q00${i + 1}`,
          savedAt: new Date()
        });
      }

      const seededSaved = await SavedQuestion.insertMany(savedQuestionsData);
      console.log(`Seeded ${seededSaved.length} saved question bookmarks for user: ${existingUser.email}`);
    } else {
      console.log("Skipping savedquestions seeding since no User exists in database yet.");
    }

    console.log("Lightweight seed completed successfully.");
    mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error("Seed script encountered an error:", err.message);
    process.exit(1);
  }
};

seedData();
