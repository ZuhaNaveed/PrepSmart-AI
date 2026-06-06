const Quiz = require("../models/Quiz");
const Question = require("../models/Question");
const mongoose = require("mongoose");

const memoryQuizzes = [
  {
    _id: "60c72b2f9b1d8b2bad000100",
    title: "JavaScript Basics Quiz",
    category: "JavaScript",
    questions: 10,
    timeLimit: 15,
  },
  {
    _id: "60c72b2f9b1d8b2bad000101",
    category: "JavaScript",
    question: "Which of the following is NOT a primitive data type in JavaScript?",
    options: ["String", "Number", "Boolean", "Object"],
    correctAnswer: 3,
    suggestions: "Understand the difference between primitive values (which are immutable and passed by value) and objects (which are passed by reference).",
    refinedAnswer: "Objects are non-primitive; primitive types are String, Number, Boolean, Null, Undefined, Symbol, and BigInt.",
  },
  {
    _id: "60c72b2f9b1d8b2bad000102",
    category: "JavaScript",
    question: "What is the output of 'typeof null' in JavaScript?",
    options: ["'null'", "'undefined'", "'object'", "'string'"],
    correctAnswer: 2,
    suggestions: "This is a historic bug in JavaScript where null is treated as an object type check.",
    refinedAnswer: "'typeof null' returns 'object', which is a well-known legacy behavior in JavaScript.",
  },
  {
    _id: "60c72b2f9b1d8b2bad000103",
    category: "React",
    question: "Which hook should be used to memoize the result of a computationally expensive function?",
    options: ["useEffect", "useMemo", "useCallback", "useState"],
    correctAnswer: 1,
    suggestions: "useMemo caches values; useCallback caches callback function references.",
    refinedAnswer: "useMemo is specifically designed to memoize computed values, preventing recalculation on every render unless dependencies change.",
  },
  {
    _id: "60c72b2f9b1d8b2bad000104",
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
    _id: "60c72b2f9b1d8b2bad000105",
    category: "Node.js",
    question: "Which core Node.js module is used to handle file paths?",
    options: ["fs", "path", "http", "url"],
    correctAnswer: 1,
    suggestions: "The path module resolves absolute and relative paths across operating systems.",
    refinedAnswer: "The 'path' module provides utilities for working with file and directory paths in Node.js.",
  },
  {
    _id: "60c72b2f9b1d8b2bad000106",
    category: "Databases",
    question: "In MongoDB, what represents a record inside a table-equivalent structure (collection)?",
    options: ["Row", "Document", "Tuple", "Field"],
    correctAnswer: 1,
    suggestions: "MongoDB uses BSON document structures to represent individual records.",
    refinedAnswer: "In MongoDB collections, a 'Document' is the basic unit of data and represents a record, similar to a row in SQL.",
  },
];

const memoryInterviewQuestions = [
  {
    _id: "60c72b2f9b1d8b2bad000200",
    question: "What is the difference between let, const, and var in JavaScript?",
    category: "JavaScript",
    difficulty: "Medium",
    company: "Google",
    type: "Technical",
    text: "What is the difference between let, const, and var in JavaScript?",
    suggestedAnswer: "var is function-scoped and hoisted. let and const are block-scoped and not hoisted in the same way (temporal dead zone). const variables cannot be reassigned.",
    role: "Frontend Developer",
  },
  {
    _id: "60c72b2f9b1d8b2bad000201",
    role: "Frontend Developer",
    category: "Technical",
    text: "Explain the difference between Virtual DOM and Real DOM in React. How does the reconciliation algorithm work?",
    question: "Explain the difference between Virtual DOM and Real DOM in React. How does the reconciliation algorithm work?",
    suggestedAnswer: "The Virtual DOM is a lightweight, in-memory representation of the Real DOM. When a component's state changes, React creates a new Virtual DOM tree and compares it with the previous one using a diffing algorithm (Reconciliation). React then computes the minimal set of changes and batch-updates the Real DOM, which is much faster than re-rendering the entire Real DOM tree directly.",
  },
  {
    _id: "60c72b2f9b1d8b2bad000202",
    role: "Frontend Developer",
    category: "Technical",
    text: "What are CSS Custom Properties (Variables), and what are the benefits of using them over SASS/LESS preprocessor variables?",
    question: "What are CSS Custom Properties (Variables), and what are the benefits of using them over SASS/LESS preprocessor variables?",
    suggestedAnswer: "CSS Custom Properties are native variables defined in CSS (e.g. --primary-color: #6d5df6) and can be accessed dynamically in stylesheets. Unlike preprocessor variables which are compiled away at build time, CSS variables exist in the browser DOM. This means they can be updated dynamically at runtime using JavaScript, support cascade inheritance, and facilitate easy theme switching (like Dark Mode).",
  },
  {
    _id: "60c72b2f9b1d8b2bad000203",
    role: "Backend Developer",
    category: "Technical",
    text: "What is the event loop in Node.js, and how does it handle asynchronous I/O operations?",
    question: "What is the event loop in Node.js, and how does it handle asynchronous I/O operations?",
    suggestedAnswer: "The Event Loop is the core mechanism that allows Node.js to perform non-blocking I/O operations despite being single-threaded. It offloads I/O tasks (like network calls or disk reads) to the system kernel or Libuv's thread pool. When these tasks complete, they place callback functions into queues. The event loop continuously monitors the call stack and executes callbacks from these queues when the stack is empty, running through phases like Timers, Poll, and Check.",
  },
  {
    _id: "60c72b2f9b1d8b2bad000204",
    role: "Full Stack Developer",
    category: "Technical",
    text: "How do you secure a REST API? Mention standard practices regarding auth, transport, and injection prevention.",
    question: "How do you secure a REST API? Mention standard practices regarding auth, transport, and injection prevention.",
    suggestedAnswer: "To secure a REST API: 1) Use HTTPS for encrypted transport. 2) Implement robust JWT or OAuth2 authentication and store secrets safely. 3) Use Helmet to set security-oriented HTTP headers and CORS to restrict access. 4) Run express-rate-limit to protect against DDoS. 5) Sanitize all user input to prevent SQL/NoSQL injections, and use parameterized queries.",
  },
  {
    _id: "60c72b2f9b1d8b2bad000205",
    role: "UI/UX Designer",
    category: "Technical",
    text: "Explain the concept of Responsive Design and the difference between adaptive layouts and fluid layouts.",
    question: "Explain the concept of Responsive Design and the difference between adaptive layouts and fluid layouts.",
    suggestedAnswer: "Responsive Design ensures a website layout shifts gracefully based on screen size. Fluid layouts use relative units (percentages, viewport units) so elements scale proportionally. Adaptive layouts use media queries to snap to fixed breakpoint widths (e.g., 320px, 768px, 1200px) specifically tailored for target devices. Responsive design usually combines fluid grids and media queries for maximum adaptability.",
  },
  {
    _id: "60c72b2f9b1d8b2bad000206",
    role: "Frontend Developer",
    category: "Behavioral",
    text: "Describe a situation where you had a conflict with a teammate or project lead. How did you resolve it?",
    question: "Describe a situation where you had a conflict with a teammate or project lead. How did you resolve it?",
    suggestedAnswer: "I once disagreed with a senior engineer about using a CSS-in-JS library over CSS modules. Instead of arguing, I built a quick, isolated prototype demonstrating the bundle size and rendering performance of both approaches. We sat down, looked at the data together, and agreed that CSS modules were more optimal for our specific performance constraints. This taught me to address conflicts constructively using objective data.",
  },
  {
    _id: "60c72b2f9b1d8b2bad000207",
    role: "Full Stack Developer",
    category: "HR",
    text: "Why do you want to join PrepSmart AI, and where do you see yourself in five years?",
    question: "Why do you want to join PrepSmart AI, and where do you see yourself in five years?",
    suggestedAnswer: "I am deeply inspired by how PrepSmart AI uses generative artificial intelligence to democratize interview coaching. I want to join to help expand its feature sets. In five years, I see myself taking on leadership roles, mentoring junior engineers, and helping scale the system architecture to support millions of active learners worldwide.",
  },
];

const createQuizQuestion = async (data) => {
  if (global.isMongoConnected) {
    return await Quiz.create(data);
  }
  const newQuiz = {
    _id: new mongoose.Types.ObjectId().toString(),
    ...data,
  };
  memoryQuizzes.push(newQuiz);
  return newQuiz;
};

const findQuizzesByCategory = async (category) => {
  if (global.isMongoConnected) {
    return await Quiz.find({ category });
  }
  return memoryQuizzes.filter((q) => q.category.toLowerCase() === category.toLowerCase());
};

const findAllQuizzes = async () => {
  if (global.isMongoConnected) {
    return await Quiz.find({});
  }
  return memoryQuizzes;
};

const createInterviewQuestion = async (data) => {
  if (global.isMongoConnected) {
    return await Question.create(data);
  }
  const newQuestion = {
    _id: new mongoose.Types.ObjectId().toString(),
    suggestedAnswer: "",
    ...data,
  };
  memoryInterviewQuestions.push(newQuestion);
  return newQuestion;
};

const findInterviewQuestions = async (role, category) => {
  if (global.isMongoConnected) {
    const query = {};
    if (role) query.role = role;
    if (category) query.category = category;
    return await Question.find(query);
  }
  return memoryInterviewQuestions.filter((q) => {
    let matches = true;
    if (role && q.role !== role) matches = false;
    if (category && q.category !== category) matches = false;
    return matches;
  });
};

const findQuestionById = async (id) => {
  if (global.isMongoConnected) {
    return await Question.findById(id);
  }
  const strId = id.toString();
  return memoryInterviewQuestions.find((q) => q._id.toString() === strId) || null;
};

const findQuizById = async (id) => {
  if (global.isMongoConnected) {
    return await Quiz.findById(id);
  }
  const strId = id.toString();
  return memoryQuizzes.find((q) => q._id.toString() === strId) || null;
};

const findAllInterviewQuestions = async () => {
  if (global.isMongoConnected) {
    return await Question.find({});
  }
  return memoryInterviewQuestions;
};

module.exports = {
  createQuizQuestion,
  findQuizzesByCategory,
  findAllQuizzes,
  findQuizById,
  createInterviewQuestion,
  findInterviewQuestions,
  findQuestionById,
  findAllInterviewQuestions,
};
