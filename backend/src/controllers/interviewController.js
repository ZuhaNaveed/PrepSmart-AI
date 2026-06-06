const interviewService = require("../services/interviewService");
const savedQuestionRepository = require("../repositories/savedQuestionRepository");

const startMockInterview = async (req, res, next) => {
  try {
    const { role, category, company, experienceLevel } = req.body;
    if (!role || !category) {
      return res.status(400).json({ message: "Role and category are required" });
    }

    const interview = await interviewService.startInterview(
      req.user.id, role, category, company || "General", experienceLevel || "Fresh Graduate"
    );
    res.status(201).json(interview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const submitInterviewAnswer = async (req, res, next) => {
  try {
    const { interviewId, questionIndex, answerText } = req.body;
    if (!interviewId || questionIndex === undefined || answerText === undefined) {
      return res.status(400).json({ message: "interviewId, questionIndex, and answerText are required" });
    }

    const result = await interviewService.submitAnswer(interviewId, questionIndex, answerText);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyInterviews = async (req, res, next) => {
  try {
    const interviews = await interviewService.getUserInterviews(req.user.id);
    res.json(interviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSavedQuestions = async (req, res, next) => {
  try {
    const saved = await savedQuestionRepository.getSavedQuestionsByUser(req.user.id);
    res.json(saved);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const toggleSaveQuestion = async (req, res, next) => {
  try {
    const { questionId } = req.body;
    if (!questionId) {
      return res.status(400).json({ message: "questionId is required" });
    }

    const isCurrentlySaved = await savedQuestionRepository.isSaved(req.user.id, questionId);
    if (isCurrentlySaved) {
      await savedQuestionRepository.unsaveQuestion(req.user.id, questionId);
      res.json({ saved: false, message: "Question unsaved successfully" });
    } else {
      await savedQuestionRepository.saveQuestion(req.user.id, questionId);
      res.json({ saved: true, message: "Question saved successfully" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  startMockInterview,
  submitInterviewAnswer,
  getMyInterviews,
  getSavedQuestions,
  toggleSaveQuestion,
};
