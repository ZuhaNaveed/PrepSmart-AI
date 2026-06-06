require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");
const Question = require("./models/Question");
const Quiz = require("./models/Quiz");
const CodingProblem = require("./models/CodingProblem");
const Interview = require("./models/Interview");
const SavedQuestion = require("./models/SavedQuestion");
const bcrypt = require("bcryptjs");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/prepsmartdb");
    console.log("MongoDB Connected for Seeding...");
  } catch (err) {
    console.error("Database connection failed:", err.message);
    process.exit(1);
  }
};

const interviewQuestions = [
  // ---------- Frontend Developer - Technical ----------
  {
    role: "Frontend Developer",
    category: "Technical",
    text: "Explain the difference between Virtual DOM and Real DOM in React. How does the reconciliation algorithm work?",
    question: "Explain the difference between Virtual DOM and Real DOM in React. How does the reconciliation algorithm work?",
    suggestedAnswer: "The Virtual DOM is a lightweight, in-memory representation of the Real DOM. When a component's state changes, React creates a new Virtual DOM tree and compares it with the previous one using a diffing algorithm (Reconciliation). React then computes the minimal set of changes and batch-updates the Real DOM, which is much faster than re-rendering the entire Real DOM tree directly.",
    company: "Google",
    difficulty: "Medium",
  },
  {
    role: "Frontend Developer",
    category: "Technical",
    text: "What are CSS Custom Properties (Variables), and what are the benefits of using them over SASS/LESS preprocessor variables?",
    question: "What are CSS Custom Properties (Variables), and what are the benefits of using them over SASS/LESS preprocessor variables?",
    suggestedAnswer: "CSS Custom Properties are native variables defined in CSS (e.g. --primary-color: #6d5df6) and can be accessed dynamically in stylesheets. Unlike preprocessor variables which are compiled away at build time, CSS variables exist in the browser DOM. This means they can be updated dynamically at runtime using JavaScript, support cascade inheritance, and facilitate easy theme switching (like Dark Mode).",
    company: "General",
    difficulty: "Easy",
  },
  {
    role: "Frontend Developer",
    category: "Technical",
    text: "What is the difference between let, const, and var in JavaScript?",
    question: "What is the difference between let, const, and var in JavaScript?",
    suggestedAnswer: "var is function-scoped and hoisted. let and const are block-scoped and not hoisted in the same way (temporal dead zone). const variables cannot be reassigned.",
    company: "Google",
    difficulty: "Medium",
  },
  {
    role: "Frontend Developer",
    category: "Technical",
    text: "Explain the concept of React Hooks. What problems do they solve compared to class components?",
    question: "Explain the concept of React Hooks. What problems do they solve compared to class components?",
    suggestedAnswer: "React Hooks (useState, useEffect, useContext, etc.) allow functional components to manage state and side effects without writing class components. They solve problems like: wrapper hell from Higher-Order Components, complex lifecycle methods, difficulty reusing stateful logic, and the confusion around 'this' keyword in classes. Hooks enable cleaner, more composable code with custom hooks for shared logic.",
    company: "Meta",
    difficulty: "Medium",
  },
  {
    role: "Frontend Developer",
    category: "Technical",
    text: "What is the critical rendering path in web browsers, and how can you optimize it for better performance?",
    question: "What is the critical rendering path in web browsers, and how can you optimize it for better performance?",
    suggestedAnswer: "The critical rendering path is the sequence of steps the browser takes to convert HTML, CSS, and JavaScript into pixels on screen: DOM construction → CSSOM construction → Render Tree → Layout → Paint → Compositing. Optimizations include: minimizing render-blocking resources, deferring non-critical JS, inlining critical CSS, using async/defer attributes, reducing DOM depth, and leveraging browser caching.",
    company: "Google",
    difficulty: "Hard",
  },
  {
    role: "Frontend Developer",
    category: "Technical",
    text: "Explain how closures work in JavaScript and give a practical example.",
    question: "Explain how closures work in JavaScript and give a practical example.",
    suggestedAnswer: "A closure is a function that retains access to variables from its outer (enclosing) scope even after the outer function has returned. This happens because JavaScript functions form closures over their lexical environment. A practical example is a counter factory: function createCounter() { let count = 0; return () => ++count; }. Each call to createCounter() creates a new independent counter with its own 'count' variable.",
    company: "Amazon",
    difficulty: "Medium",
  },

  // ---------- Backend Developer - Technical ----------
  {
    role: "Backend Developer",
    category: "Technical",
    text: "What is the event loop in Node.js, and how does it handle asynchronous I/O operations?",
    question: "What is the event loop in Node.js, and how does it handle asynchronous I/O operations?",
    suggestedAnswer: "The Event Loop is the core mechanism that allows Node.js to perform non-blocking I/O operations despite being single-threaded. It offloads I/O tasks (like network calls or disk reads) to the system kernel or Libuv's thread pool. When these tasks complete, they place callback functions into queues. The event loop continuously monitors the call stack and executes callbacks from these queues when the stack is empty, running through phases like Timers, Poll, and Check.",
    company: "General",
    difficulty: "Medium",
  },
  {
    role: "Backend Developer",
    category: "Technical",
    text: "Explain the differences between SQL and NoSQL databases. When would you choose one over the other?",
    question: "Explain the differences between SQL and NoSQL databases. When would you choose one over the other?",
    suggestedAnswer: "SQL databases (PostgreSQL, MySQL) are relational, use structured schemas with tables, support ACID transactions, and are ideal for complex queries with joins. NoSQL databases (MongoDB, Redis) are schema-flexible, use documents/key-value/graphs, offer horizontal scalability, and are ideal for rapidly evolving data models or high-throughput scenarios. Choose SQL for financial systems or complex relationships; NoSQL for real-time apps, content management, or when schema flexibility is needed.",
    company: "Amazon",
    difficulty: "Medium",
  },
  {
    role: "Backend Developer",
    category: "Technical",
    text: "What is middleware in Express.js? Explain the different types and how the middleware chain works.",
    question: "What is middleware in Express.js? Explain the different types and how the middleware chain works.",
    suggestedAnswer: "Middleware functions in Express.js are functions that have access to the request object (req), response object (res), and the next function. They execute sequentially in the order they are defined. Types include: application-level (app.use), router-level (router.use), error-handling (4 parameters), built-in (express.json()), and third-party (cors, helmet). Each middleware can modify req/res, end the cycle, or call next() to pass control.",
    company: "Microsoft",
    difficulty: "Easy",
  },

  // ---------- Full Stack Developer - Technical ----------
  {
    role: "Full Stack Developer",
    category: "Technical",
    text: "How do you secure a REST API? Mention standard practices regarding auth, transport, and injection prevention.",
    question: "How do you secure a REST API? Mention standard practices regarding auth, transport, and injection prevention.",
    suggestedAnswer: "To secure a REST API: 1) Use HTTPS for encrypted transport. 2) Implement robust JWT or OAuth2 authentication and store secrets safely. 3) Use Helmet to set security-oriented HTTP headers and CORS to restrict access. 4) Run express-rate-limit to protect against DDoS. 5) Sanitize all user input to prevent SQL/NoSQL injections, and use parameterized queries.",
    company: "General",
    difficulty: "Hard",
  },
  {
    role: "Full Stack Developer",
    category: "Technical",
    text: "Explain the concept of microservices architecture. What are its advantages and disadvantages compared to a monolithic architecture?",
    question: "Explain the concept of microservices architecture. What are its advantages and disadvantages compared to a monolithic architecture?",
    suggestedAnswer: "Microservices architecture breaks an application into small, independent services that communicate via APIs. Advantages: independent deployment, technology flexibility, scalability per service, fault isolation. Disadvantages: increased complexity, network latency, data consistency challenges, operational overhead (monitoring, logging, tracing). Choose monolith for small teams/early-stage products; microservices for large teams needing independent scaling.",
    company: "Google",
    difficulty: "Hard",
  },

  // ---------- UI/UX Designer - Technical ----------
  {
    role: "UI/UX Designer",
    category: "Technical",
    text: "Explain the concept of Responsive Design and the difference between adaptive layouts and fluid layouts.",
    question: "Explain the concept of Responsive Design and the difference between adaptive layouts and fluid layouts.",
    suggestedAnswer: "Responsive Design ensures a website layout shifts gracefully based on screen size. Fluid layouts use relative units (percentages, viewport units) so elements scale proportionally. Adaptive layouts use media queries to snap to fixed breakpoint widths (e.g., 320px, 768px, 1200px) specifically tailored for target devices. Responsive design usually combines fluid grids and media queries for maximum adaptability.",
    company: "General",
    difficulty: "Easy",
  },
  {
    role: "UI/UX Designer",
    category: "Technical",
    text: "What are the key principles of accessibility (a11y) in web design? How do you ensure your designs are inclusive?",
    question: "What are the key principles of accessibility (a11y) in web design? How do you ensure your designs are inclusive?",
    suggestedAnswer: "Key principles follow WCAG guidelines: Perceivable (text alternatives, captions, sufficient contrast), Operable (keyboard navigation, no time limits, skip navigation), Understandable (readable text, predictable behavior, error prevention), Robust (compatible with assistive technologies). Ensure designs use semantic HTML, ARIA attributes, color contrast ratios ≥ 4.5:1, focus indicators, and test with screen readers.",
    company: "Microsoft",
    difficulty: "Medium",
  },

  // ---------- Behavioral ----------
  {
    role: "Frontend Developer",
    category: "Behavioral",
    text: "Describe a situation where you had a conflict with a teammate or project lead. How did you resolve it?",
    question: "Describe a situation where you had a conflict with a teammate or project lead. How did you resolve it?",
    suggestedAnswer: "I once disagreed with a senior engineer about using a CSS-in-JS library over CSS modules. Instead of arguing, I built a quick, isolated prototype demonstrating the bundle size and rendering performance of both approaches. We sat down, looked at the data together, and agreed that CSS modules were more optimal for our specific performance constraints. This taught me to address conflicts constructively using objective data.",
    company: "General",
    difficulty: "Medium",
  },
  {
    role: "Backend Developer",
    category: "Behavioral",
    text: "Tell me about a time you had to learn a new technology quickly under a tight deadline. How did you approach it?",
    question: "Tell me about a time you had to learn a new technology quickly under a tight deadline. How did you approach it?",
    suggestedAnswer: "When our team needed to migrate from REST to GraphQL within two weeks, I created a structured learning plan: spent 2 days on official docs and tutorials, built a small prototype on day 3, then began the actual migration. I also paired with a colleague who had GraphQL experience. By breaking the learning into focused sprints and seeking mentorship, I delivered on time with a working GraphQL API layer.",
    company: "General",
    difficulty: "Medium",
  },

  // ---------- HR ----------
  {
    role: "Full Stack Developer",
    category: "HR",
    text: "Why do you want to join our company, and where do you see yourself in five years?",
    question: "Why do you want to join our company, and where do you see yourself in five years?",
    suggestedAnswer: "I am deeply inspired by how this company uses technology to solve real-world problems. I want to join to contribute to impactful products while growing my technical expertise. In five years, I see myself taking on leadership roles, mentoring junior engineers, and helping scale the system architecture to support millions of users worldwide.",
    company: "General",
    difficulty: "Easy",
  },
  {
    role: "Frontend Developer",
    category: "HR",
    text: "What motivates you to work in software development, and how do you stay updated with the latest technologies?",
    question: "What motivates you to work in software development, and how do you stay updated with the latest technologies?",
    suggestedAnswer: "I'm motivated by the ability to create solutions that impact people's lives. The constant evolution of technology keeps me curious and engaged. I stay updated by following tech blogs (like CSS-Tricks, Smashing Magazine), watching conference talks, contributing to open-source projects, and actively building side projects to experiment with new frameworks and tools.",
    company: "General",
    difficulty: "Easy",
  },
];

const quizQuestions = [
  // JavaScript
  {
    category: "JavaScript",
    question: "Which of the following is NOT a primitive data type in JavaScript?",
    options: ["String", "Number", "Boolean", "Object"],
    correctAnswer: 3,
    suggestions: "Understand the difference between primitive values (immutable, passed by value) and objects (passed by reference).",
    refinedAnswer: "Objects are non-primitive; primitive types are String, Number, Boolean, Null, Undefined, Symbol, and BigInt.",
  },
  {
    category: "JavaScript",
    question: "What is the output of 'typeof null' in JavaScript?",
    options: ["'null'", "'undefined'", "'object'", "'string'"],
    correctAnswer: 2,
    suggestions: "This is a historic bug in JavaScript where null is treated as an object type check.",
    refinedAnswer: "'typeof null' returns 'object', which is a well-known legacy behavior in JavaScript.",
  },
  {
    category: "JavaScript",
    question: "What does the '===' operator do in JavaScript?",
    options: ["Compares values only", "Compares values and types", "Assigns a value", "Compares references only"],
    correctAnswer: 1,
    suggestions: "The strict equality operator checks both value and type without type coercion.",
    refinedAnswer: "'===' is the strict equality operator that checks both value and type, unlike '==' which performs type coercion.",
  },
  {
    category: "JavaScript",
    question: "Which method is used to convert a JSON string to a JavaScript object?",
    options: ["JSON.stringify()", "JSON.parse()", "JSON.convert()", "JSON.decode()"],
    correctAnswer: 1,
    suggestions: "JSON.parse() deserializes a JSON string into a JavaScript value/object.",
    refinedAnswer: "JSON.parse() converts a JSON-formatted string into a JavaScript object or value.",
  },
  {
    category: "JavaScript",
    question: "What is a Promise in JavaScript?",
    options: [
      "A synchronous operation wrapper",
      "An object representing the eventual completion or failure of an async operation",
      "A type of loop construct",
      "A method to create variables"
    ],
    correctAnswer: 1,
    suggestions: "Promises represent future values and have three states: pending, fulfilled, and rejected.",
    refinedAnswer: "A Promise is an object that represents the eventual completion (or failure) of an asynchronous operation and its resulting value.",
  },

  // React
  {
    category: "React",
    question: "Which hook should be used to memoize the result of a computationally expensive function?",
    options: ["useEffect", "useMemo", "useCallback", "useState"],
    correctAnswer: 1,
    suggestions: "useMemo caches values; useCallback caches callback function references.",
    refinedAnswer: "useMemo is specifically designed to memoize computed values, preventing recalculation on every render unless dependencies change.",
  },
  {
    category: "React",
    question: "What is the purpose of 'keys' in React lists?",
    options: [
      "To uniquely identify elements and help React identify which items changed, are added, or are removed.",
      "To style list elements uniquely.",
      "To securely encrypt list elements.",
      "To automatically sort the array alphabetically.",
    ],
    correctAnswer: 0,
    suggestions: "Keys help React maintain state continuity across renders of list items.",
    refinedAnswer: "Keys provide stable identities for elements in a list, helping React optimize DOM reconciliation and updates.",
  },
  {
    category: "React",
    question: "What is the difference between state and props in React?",
    options: [
      "State is immutable, props are mutable",
      "Props are passed from parent, state is managed within the component",
      "There is no difference",
      "State can only be used in class components"
    ],
    correctAnswer: 1,
    suggestions: "Props flow down from parent to child (unidirectional), while state is local to the component.",
    refinedAnswer: "Props are read-only data passed from a parent component, while state is mutable data managed internally by the component itself.",
  },

  // Node.js
  {
    category: "Node.js",
    question: "Which core Node.js module is used to handle file paths?",
    options: ["fs", "path", "http", "url"],
    correctAnswer: 1,
    suggestions: "The path module resolves absolute and relative paths across operating systems.",
    refinedAnswer: "The 'path' module provides utilities for working with file and directory paths in Node.js.",
  },
  {
    category: "Node.js",
    question: "What is the purpose of package.json in a Node.js project?",
    options: [
      "To store database configurations",
      "To define project metadata, dependencies, and scripts",
      "To compile TypeScript to JavaScript",
      "To manage CSS styles"
    ],
    correctAnswer: 1,
    suggestions: "package.json is the manifest file for Node.js projects containing project info and dependency declarations.",
    refinedAnswer: "package.json defines project metadata (name, version), lists dependencies, specifies scripts for build/test/start, and configures project settings.",
  },
  {
    category: "Node.js",
    question: "Which of the following is NOT a valid HTTP method?",
    options: ["GET", "POST", "PUSH", "DELETE"],
    correctAnswer: 2,
    suggestions: "Standard HTTP methods are GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD. PUSH is not a valid HTTP method.",
    refinedAnswer: "PUSH is not a valid HTTP method. The standard methods include GET, POST, PUT, PATCH, DELETE, OPTIONS, and HEAD.",
  },

  // Databases
  {
    category: "Databases",
    question: "In MongoDB, what represents a record inside a table-equivalent structure (collection)?",
    options: ["Row", "Document", "Tuple", "Field"],
    correctAnswer: 1,
    suggestions: "MongoDB uses BSON document structures to represent individual records.",
    refinedAnswer: "In MongoDB collections, a 'Document' is the basic unit of data and represents a record, similar to a row in SQL.",
  },
  {
    category: "Databases",
    question: "What does ACID stand for in database transactions?",
    options: [
      "Atomicity, Consistency, Isolation, Durability",
      "Access, Control, Integrity, Data",
      "Async, Cache, Index, Deploy",
      "Authentication, Certification, Identity, Decryption"
    ],
    correctAnswer: 0,
    suggestions: "ACID properties ensure reliable database transactions even in case of system failures.",
    refinedAnswer: "ACID stands for Atomicity (all-or-nothing), Consistency (valid state transitions), Isolation (concurrent transactions don't interfere), Durability (committed data persists).",
  },
  {
    category: "Databases",
    question: "What is an index in a database?",
    options: [
      "A backup copy of data",
      "A data structure that improves query performance by enabling faster lookups",
      "A type of database join",
      "A primary key constraint"
    ],
    correctAnswer: 1,
    suggestions: "Indexes trade write performance and storage space for significantly faster read queries.",
    refinedAnswer: "A database index is a data structure (typically B-tree or hash) that speeds up data retrieval by creating a fast lookup reference, similar to a book's index.",
  },
];

const codingProblems = [
  {
    title: "Two Sum",
    difficulty: "Easy",
    category: "Arrays",
    description: "Given an array of integers 'nums' and an integer 'target', return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nExample:\nInput: nums = [2, 7, 11, 15], target = 9\nOutput: [0, 1]\nExplanation: nums[0] + nums[1] = 2 + 7 = 9",
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
    title: "Reverse a String",
    difficulty: "Easy",
    category: "Strings",
    description: "Write a function that takes a string as input and returns the string reversed.\n\nExample:\nInput: 'hello'\nOutput: 'olleh'",
    company: "General",
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
    title: "Fibonacci Number",
    difficulty: "Medium",
    category: "Dynamic Programming",
    description: "The Fibonacci numbers, commonly denoted F(n) form a sequence, called the Fibonacci sequence, such that each number is the sum of the two preceding ones, starting from 0 and 1.\n\nGiven n, calculate F(n).\n\nExample:\nInput: n = 4\nOutput: 3 (F(0)=0, F(1)=1, F(2)=1, F(3)=2, F(4)=3)",
    company: "Google",
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
  {
    title: "Valid Palindrome",
    difficulty: "Easy",
    category: "Strings",
    description: "Given a string s, determine if it is a palindrome, considering only alphanumeric characters and ignoring cases.\n\nExample:\nInput: 'A man, a plan, a canal: Panama'\nOutput: true\n\nInput: 'race a car'\nOutput: false",
    company: "Amazon",
    starterCode: "function isPalindrome(s) {\n  // Write your code here\n  \n}",
    constraints: [
      "1 <= s.length <= 2 * 10^5",
      "s consists only of printable ASCII characters",
    ],
    testCases: [
      { input: "'racecar'", output: "true" },
      { input: "'hello'", output: "false" },
      { input: "'A man a plan a canal Panama'", output: "true" },
    ],
  },
  {
    title: "Maximum Subarray",
    difficulty: "Medium",
    category: "Arrays",
    description: "Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.\n\nExample:\nInput: nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]\nOutput: 6\nExplanation: [4, -1, 2, 1] has the largest sum = 6.",
    company: "Microsoft",
    starterCode: "function maxSubArray(nums) {\n  // Write your code here\n  \n}",
    constraints: [
      "1 <= nums.length <= 10^5",
      "-10^4 <= nums[i] <= 10^4",
    ],
    testCases: [
      { input: "[-2, 1, -3, 4, -1, 2, 1, -5, 4]", output: "6" },
      { input: "[1]", output: "1" },
      { input: "[5, 4, -1, 7, 8]", output: "23" },
    ],
  },
  {
    title: "Merge Two Sorted Arrays",
    difficulty: "Hard",
    category: "Arrays",
    description: "You are given two integer arrays nums1 and nums2, sorted in non-decreasing order. Merge nums2 into nums1 as one sorted array.\n\nThe final sorted array should not be returned by the function, but instead be stored inside the array nums1.\n\nExample:\nInput: nums1 = [1, 2, 3], nums2 = [2, 5, 6]\nOutput: [1, 2, 2, 3, 5, 6]",
    company: "Google",
    starterCode: "function mergeSorted(nums1, nums2) {\n  // Write your code here\n  \n}",
    constraints: [
      "nums1.length == m + n",
      "nums2.length == n",
      "0 <= m, n <= 200",
    ],
    testCases: [
      { input: "[1, 2, 3], [2, 5, 6]", output: "[1, 2, 2, 3, 5, 6]" },
      { input: "[1], [0]", output: "[0, 1]" },
    ],
  },
];

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Question.deleteMany({});
    await Quiz.deleteMany({});
    await CodingProblem.deleteMany({});
    await Interview.deleteMany({});
    await SavedQuestion.deleteMany({});
    console.log("Existing Questions, Quizzes, Coding problems, Interviews, and SavedQuestions cleared.");

    // Seed questions
    await Question.insertMany(interviewQuestions);
    console.log(`${interviewQuestions.length} Mock Interview Questions seeded.`);

    // Seed quizzes
    await Quiz.insertMany(quizQuestions);
    console.log(`${quizQuestions.length} MCQ Quiz Questions seeded.`);

    // Seed coding problems
    await CodingProblem.insertMany(codingProblems);
    console.log(`${codingProblems.length} Coding Problems seeded.`);

    // Create a default admin user if one doesn't exist
    const adminEmail = "admin@prepsmart.ai";
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await User.create({
        name: "Admin User",
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
        skills: ["System Architecture", "AI Integration", "Product Management"],
        targetRole: "Platform Administrator",
        readinessScore: 95,
      });
      console.log(`Default Admin created: ${adminEmail} (password: admin123)`);
    } else {
      console.log(`Admin user already exists: ${adminEmail}`);
    }

    console.log("\n✅ Database successfully seeded!");
    console.log(`   • ${interviewQuestions.length} interview questions`);
    console.log(`   • ${quizQuestions.length} quiz MCQs`);
    console.log(`   • ${codingProblems.length} coding problems`);
    mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error("Error seeding database:", err.message);
    process.exit(1);
  }
};

seedData();
