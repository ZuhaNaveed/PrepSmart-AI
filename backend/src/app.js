const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/authRoutes");
const interviewRoutes = require("./routes/interviewRoutes");
const quizRoutes = require("./routes/quizRoutes");
const codingRoutes = require("./routes/codingRoutes");

const { errorHandler } = require("./middlewares/errorMiddleware");

const app = express();

// Set security HTTP headers
app.use(helmet());

// Enable CORS
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// API Rate Limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { message: "Too many requests from this IP, please try again after 15 minutes" },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to all api routes
app.use("/api", apiLimiter);

// Bind Routes
app.use("/api/auth", authRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/coding", codingRoutes);

// Global Centralized Error Handler
app.use(errorHandler);

module.exports = app;