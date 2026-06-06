const interviewRepository = require("../repositories/interviewRepository");
const quizRepository = require("../repositories/quizRepository");
const userRepository = require("../repositories/userRepository");
const geminiService = require("./geminiService");

const startInterview = async (userId, role, category, company = "General", experienceLevel = "Fresh Graduate") => {
  // Find appropriate questions for the interview
  let questions = await quizRepository.findInterviewQuestions(role, category);

  // If a specific company is selected, try to filter for company-specific questions
  if (company && company !== "General" && questions.length > 0) {
    const companyFiltered = questions.filter(
      (q) => q.company && q.company.toLowerCase() === company.toLowerCase()
    );
    // Only use company-filtered if we have enough questions
    if (companyFiltered.length >= 2) {
      questions = companyFiltered;
    }
  }

  // If no questions match, load a few fallback general questions
  if (questions.length === 0) {
    questions = await quizRepository.findInterviewQuestions(null, null);
  }

  // Guard: if still no questions available, throw a descriptive error
  if (questions.length === 0) {
    throw new Error(
      "No interview questions available for this configuration. Please seed the database first (run: node src/seeder.js) or ask an admin to add questions via the Admin Panel."
    );
  }

  // Pick up to 3 random questions for the mock interview session
  const shuffled = questions.sort(() => 0.5 - Math.random());
  const selectedQuestions = shuffled.slice(0, 3);

  const interviewData = {
    user: userId,
    role,
    category,
    company,
    experienceLevel,
    questions: selectedQuestions.map((q) => ({
      questionId: q._id,
      questionText: q.text || q.question || "",
      suggestedAnswer: q.suggestedAnswer || "",
      answerText: "",
      feedbackText: "",
      score: 0,
      strengths: [],
      weaknesses: [],
      improvedAnswer: "",
      tips: [],
    })),
    status: "in-progress",
  };

  return await interviewRepository.createInterview(interviewData);
};

const submitAnswer = async (interviewId, questionIndex, answerText) => {
  const interview = await interviewRepository.findById(interviewId);
  if (!interview) {
    throw new Error("Interview session not found");
  }

  if (interview.status === "completed") {
    throw new Error("Interview is already completed");
  }

  const questionItem = interview.questions[questionIndex];
  if (!questionItem) {
    throw new Error("Question not found at index");
  }

  // Get AI feedback from Gemini
  const feedback = await geminiService.evaluateAnswer(
    interview.role,
    interview.category,
    questionItem.questionText,
    answerText,
    questionItem.suggestedAnswer
  );

  // Update question feedback details
  questionItem.answerText = answerText;
  questionItem.score = feedback.score;
  questionItem.feedbackText = `Score: ${feedback.score}/100. Strengths: ${feedback.strengths.join(", ")}.`;
  questionItem.strengths = feedback.strengths;
  questionItem.weaknesses = feedback.weaknesses;
  questionItem.improvedAnswer = feedback.improvedAnswer;
  questionItem.tips = feedback.tips;

  // Check if this was the last question
  const allAnswered = interview.questions.every((q, idx) => idx === questionIndex || q.answerText !== "");

  if (allAnswered) {
    interview.status = "completed";
    
    // Calculate overall score
    const totalScore = interview.questions.reduce((sum, q) => sum + q.score, 0);
    interview.overallScore = Math.round(totalScore / interview.questions.length);
    interview.overallFeedback = `Great job! You completed your ${interview.role} mock interview with an average score of ${interview.overallScore}%. Focus on the recommended action tips in your weakest areas to raise your performance.`;

    // Update user's readiness score in the DB
    const user = await userRepository.findById(interview.user);
    if (user) {
      // Calculate a rolling average for the readiness score
      const newScore = Math.round((user.readinessScore + interview.overallScore) / 2);
      await userRepository.updateUser(user._id, { readinessScore: newScore });
    }
  }

  await interview.save();
  return {
    interview,
    feedback,
    completed: interview.status === "completed",
  };
};

const getUserInterviews = async (userId) => {
  return await interviewRepository.findByUser(userId);
};

module.exports = {
  startInterview,
  submitAnswer,
  getUserInterviews,
};
