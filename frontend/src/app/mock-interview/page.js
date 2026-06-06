"use client";

import { useState } from "react";
import { Brain, Sparkles, Loader2, ArrowRight, ArrowLeft, Target, Heart, CheckCircle2, ChevronRight, Award, HelpCircle } from "lucide-react";
import api from "@/lib/axios";
import DashboardShell from "@/components/DashboardShell";

export default function MockInterviewPage() {
  const [step, setStep] = useState(1); // 1: Setup, 2: Interviewing, 3: Feedback details
  
  // Setup State
  const [role, setRole] = useState("Frontend Developer");
  const [category, setCategory] = useState("Technical");
  const [company, setCompany] = useState("General");
  const [experienceLevel, setExperienceLevel] = useState("Fresh Graduate");
  
  // Active Interview Session
  const [interview, setInterview] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answerText, setAnswerText] = useState("");
  
  // Loading & Error States
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [savedQuestionStatus, setSavedQuestionStatus] = useState({});

  const startInterview = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await api.post("/interview/start", { role, category, company, experienceLevel });
      setInterview(res.data);
      setCurrentQuestionIndex(0);
      setAnswerText("");
      setFeedback(null);
      setStep(2);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to initialize interview session.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSubmit = async () => {
    if (!answerText.trim()) return;
    setSubmitLoading(true);
    setErrorMsg("");
    try {
      const res = await api.post("/interview/submit", {
        interviewId: interview._id,
        questionIndex: currentQuestionIndex,
        answerText,
      });

      setFeedback(res.data.feedback);
      
      // Update local interview object with user response
      const updatedInterview = { ...interview };
      updatedInterview.questions[currentQuestionIndex] = res.data.interview.questions[currentQuestionIndex];
      updatedInterview.status = res.data.interview.status;
      updatedInterview.overallScore = res.data.interview.overallScore;
      updatedInterview.overallFeedback = res.data.interview.overallFeedback;
      setInterview(updatedInterview);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to save answer evaluation.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleNext = () => {
    setFeedback(null);
    setAnswerText("");
    if (currentQuestionIndex + 1 < interview.questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Completed interview!
      setStep(3);
    }
  };

  const toggleSaveQuestion = async (questionId) => {
    try {
      const res = await api.post("/interview/saved/toggle", { questionId });
      setSavedQuestionStatus(prev => ({
        ...prev,
        [questionId]: res.data.saved
      }));
    } catch (err) {
      console.error("Save question error:", err.message);
    }
  };

  return (
    <DashboardShell>
      <div className="space-y-6 font-sans text-gray-800">
      {/* STEP 1: SETUP */}
      {step === 1 && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex flex-col items-center text-center">
            <div className="bg-[#6D5DF6]/10 text-[#6D5DF6] p-4.5 rounded-2xl mb-4">
              <Brain size={32} />
            </div>
            <h1 className="text-3xl font-extrabold text-[#1E2A5A]">
              Setup Your <span className="text-[#6D5DF6]">AI Mock Interview</span>
            </h1>
            <p className="text-gray-400 mt-2 text-sm max-w-md">
              Customize your role and category. Our Gemini evaluation engine will formulate standard, targeted questions.
            </p>
          </div>

          {errorMsg && (
            <div className="bg-red-50 text-red-500 p-4 rounded-xl border border-red-100 text-sm">
              {errorMsg}
            </div>
          )}

          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
            {/* Choose Target Role */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-[#1E2A5A]">Target Position</label>
              <div className="grid grid-cols-2 gap-4">
                {["Frontend Developer", "Backend Developer", "Full Stack Developer", "UI/UX Designer"].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setRole(item)}
                    className={`p-4 rounded-xl border font-semibold text-sm text-left transition ${
                      role === item
                        ? "border-[#6D5DF6] bg-[#6D5DF6]/5 text-[#6D5DF6]"
                        : "border-gray-200 text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Choose Interview Type */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-[#1E2A5A]">Interview Category</label>
              <div className="grid grid-cols-3 gap-4">
                {["Technical", "Behavioral", "HR"].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setCategory(item)}
                    className={`p-4 rounded-xl border font-semibold text-sm text-center transition ${
                      category === item
                        ? "border-[#6D5DF6] bg-[#6D5DF6]/5 text-[#6D5DF6]"
                        : "border-gray-200 text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Choose Company */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-[#1E2A5A]">Target Company</label>
              <div className="grid grid-cols-3 gap-4">
                {["General", "Google", "Meta", "Amazon", "Microsoft", "Other"].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setCompany(item)}
                    className={`p-4 rounded-xl border font-semibold text-sm text-center transition ${
                      company === item
                        ? "border-[#6D5DF6] bg-[#6D5DF6]/5 text-[#6D5DF6]"
                        : "border-gray-200 text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Choose Experience Level */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-[#1E2A5A]">Experience Level</label>
              <div className="grid grid-cols-2 gap-4">
                {["Fresh Graduate", "Junior (1-2 yrs)", "Mid-Level (3-5 yrs)", "Senior (5+ yrs)"].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setExperienceLevel(item)}
                    className={`p-4 rounded-xl border font-semibold text-sm text-center transition ${
                      experienceLevel === item
                        ? "border-[#6D5DF6] bg-[#6D5DF6]/5 text-[#6D5DF6]"
                        : "border-gray-200 text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={startInterview}
              disabled={loading}
              className="w-full bg-[#6D5DF6] hover:bg-[#5C4EE3] text-white py-4 rounded-xl font-bold shadow-lg shadow-[#6D5DF6]/20 transition flex items-center justify-center gap-2 hover:scale-[1.01]"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Formulating questions...
                </>
              ) : (
                <>
                  Start Session
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: INTERVIEW LOOP */}
      {step === 2 && interview && interview.questions?.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Question / Answer Panel */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="bg-[#6D5DF6]/10 text-[#6D5DF6] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  Question {currentQuestionIndex + 1} of {interview.questions.length}
                </span>
                <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                  {role} | {category}
                </span>
              </div>

              <h2 className="text-xl font-bold text-[#1E2A5A] leading-relaxed">
                {interview.questions[currentQuestionIndex]?.questionText || "Loading question..."}
              </h2>

              <div className="flex justify-end">
                <button
                  onClick={() => toggleSaveQuestion(interview.questions[currentQuestionIndex]?.questionId)}
                  className={`flex items-center gap-1.5 text-xs font-bold transition px-3 py-1.5 rounded-lg border ${
                    savedQuestionStatus[interview.questions[currentQuestionIndex]?.questionId]
                      ? "bg-red-50 text-red-500 border-red-100"
                      : "text-gray-400 hover:text-red-500 border-gray-100"
                  }`}
                >
                  <Heart size={14} fill={savedQuestionStatus[interview.questions[currentQuestionIndex]?.questionId] ? "currentColor" : "transparent"} />
                  {savedQuestionStatus[interview.questions[currentQuestionIndex]?.questionId] ? "Saved" : "Save Question"}
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <label className="text-sm font-bold text-[#1E2A5A]">Your Answer Response</label>
              <textarea
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                placeholder="Type your structured answer here (Minimum 2-3 sentences recommended)..."
                rows={6}
                className="w-full border border-gray-200 focus:border-[#6D5DF6] rounded-xl p-4 outline-none text-gray-700 text-sm transition"
                disabled={feedback !== null || submitLoading}
              />

              {errorMsg && (
                <div className="bg-red-50 text-red-500 p-3 rounded-xl border border-red-100 text-xs">
                  {errorMsg}
                </div>
              )}

              {feedback === null ? (
                <button
                  onClick={handleAnswerSubmit}
                  disabled={submitLoading || !answerText.trim()}
                  className="w-full bg-[#6D5DF6] hover:bg-[#5C4EE3] disabled:opacity-50 text-white py-3.5 rounded-xl font-bold transition flex items-center justify-center gap-2"
                >
                  {submitLoading ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      AI evaluating your response...
                    </>
                  ) : (
                    <>
                      Submit Answer
                      <Sparkles size={16} />
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="w-full bg-[#6D5DF6] hover:bg-[#5C4EE3] text-white py-3.5 rounded-xl font-bold transition flex items-center justify-center gap-2"
                >
                  Next Question
                  <ArrowRight size={18} />
                </button>
              )}
            </div>
          </div>

          {/* Real-time Gemini AI Feedback Sidebar */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm min-h-[300px] flex flex-col justify-center relative overflow-hidden">
              <div className="absolute w-20 h-20 bg-[#6D5DF6]/5 rounded-full -right-5 -top-5 blur-lg"></div>
              {feedback === null ? (
                <div className="text-center p-4 space-y-3">
                  <HelpCircle size={40} className="text-[#6D5DF6] mx-auto animate-pulse" />
                  <h3 className="font-bold text-[#1E2A5A]">Real-time AI Evaluator</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Submit your text answer to prompt Gemini's detailed score assessment and STAR alignment tips.
                  </p>
                </div>
              ) : (
                <div className="space-y-5 animate-fade-in relative z-10">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-50">
                    <span className="text-sm font-bold text-[#1E2A5A] flex items-center gap-1.5">
                      <Sparkles size={16} className="text-yellow-500" />
                      Gemini Feedback
                    </span>
                    <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-xs font-bold">
                      Score: {feedback.score}/100
                    </span>
                  </div>

                  {/* Strengths */}
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Strengths</h4>
                    <ul className="text-xs text-gray-600 space-y-1 pl-4 list-disc">
                      {feedback.strengths.map((str, idx) => <li key={idx}>{str}</li>)}
                    </ul>
                  </div>

                  {/* Weaknesses */}
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Areas to Improve</h4>
                    <ul className="text-xs text-gray-600 space-y-1 pl-4 list-disc">
                      {feedback.weaknesses.map((weak, idx) => <li key={idx}>{weak}</li>)}
                    </ul>
                  </div>

                  {/* Model Answer */}
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Refined Model Answer</h4>
                    <p className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-100 max-h-40 overflow-y-auto leading-relaxed">
                      {feedback.improvedAnswer}
                    </p>
                  </div>

                  {/* Tips */}
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Action Tips</h4>
                    <ul className="text-xs text-gray-600 space-y-1 pl-4 list-disc">
                      {feedback.tips.map((tip, idx) => <li key={idx}>{tip}</li>)}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: SESSION COMPLETED SUMMARY */}
      {step === 3 && interview && (
        <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
          {/* Main Success Card */}
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm text-center space-y-6 relative overflow-hidden">
            <div className="absolute w-40 h-40 bg-[#6D5DF6]/5 rounded-full -left-10 -bottom-10 blur-xl"></div>
            <div className="bg-green-50 text-green-600 p-4.5 rounded-full w-fit mx-auto">
              <Award size={36} />
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-extrabold text-[#1E2A5A]">Interview Session Completed!</h2>
              <p className="text-sm text-gray-400 max-w-md mx-auto">
                Excellent work! Gemini evaluated your performance. We updated your overall career readiness score in your profile.
              </p>
            </div>

            <div className="bg-[#F8F9FC] p-6 rounded-2xl border border-gray-100 inline-flex items-center gap-12 text-left mx-auto">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Position</p>
                <p className="font-bold text-[#1E2A5A] text-sm mt-0.5">{role}</p>
              </div>
              <div className="h-8 w-px bg-gray-200"></div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Category</p>
                <p className="font-bold text-[#1E2A5A] text-sm mt-0.5">{category}</p>
              </div>
              <div className="h-8 w-px bg-gray-200"></div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Final Average</p>
                <p className="font-extrabold text-[#6D5DF6] text-xl mt-0.5">{interview.overallScore}%</p>
              </div>
            </div>

            <p className="text-sm text-gray-500 max-w-xl mx-auto leading-relaxed italic">
              "{interview.overallFeedback}"
            </p>

            <button
              onClick={() => setStep(1)}
              className="bg-[#6D5DF6] hover:bg-[#5C4EE3] text-white px-8 py-3.5 rounded-xl font-bold shadow-lg shadow-[#6D5DF6]/20 transition"
            >
              Start New Interview Session
            </button>
          </div>

          {/* Breakdown per question */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-[#1E2A5A]">Detailed Response Breakdown</h3>
            <div className="space-y-4">
              {interview.questions.map((q, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-2.5 border-b border-gray-50">
                    <span className="font-bold text-sm text-[#1E2A5A]">
                      Question {idx + 1}: {(q.questionText || "").slice(0, 60)}...
                    </span>
                    <span className="bg-[#6D5DF6]/10 text-[#6D5DF6] px-2.5 py-0.5 rounded-full text-xs font-bold">
                      Score: {q.score}%
                    </span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <p className="font-bold text-gray-400 uppercase">Your Answer:</p>
                      <p className="text-gray-600 mt-1 pl-3 border-l-2 border-gray-200 leading-relaxed italic">
                        "{q.answerText || "No answer provided"}"
                      </p>
                    </div>
                    <div>
                      <p className="font-bold text-gray-400 uppercase">Gemini Evaluation Summary:</p>
                      <p className="text-gray-500 mt-1 pl-3 border-l-2 border-green-200 leading-relaxed">
                        {q.feedbackText}
                      </p>
                    </div>
                    {q.improvedAnswer && (
                      <div>
                        <p className="font-bold text-gray-400 uppercase">Refined Model Answer:</p>
                        <p className="text-gray-600 mt-1 bg-gray-50 p-3 rounded-lg border border-gray-100 leading-relaxed">
                          {q.improvedAnswer}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
    </DashboardShell>
  );
}
