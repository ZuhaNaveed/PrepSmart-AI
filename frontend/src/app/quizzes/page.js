"use client";

import { useState, useEffect } from "react";
import { Award, ArrowRight, CheckCircle2, XCircle, RotateCcw, HelpCircle, Loader2, Sparkles, Clock, AlertTriangle } from "lucide-react";
import api from "@/lib/axios";
import DashboardShell from "@/components/DashboardShell";

export default function QuizzesPage() {
  const [step, setStep] = useState(1); // 1: Setup/Select Category, 2: Quiz Loop, 3: Score Results
  const [category, setCategory] = useState("JavaScript");
  const [numQuestions, setNumQuestions] = useState("all");
  const [quizzes, setQuizzes] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
  
  // Scoring / Submission
  const [userAnswers, setUserAnswers] = useState([]); // Array of { quizId, selectedAnswerIndex }
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Timer State
  const [timeLeft, setTimeLeft] = useState(0); // in seconds
  const [timeOver, setTimeOver] = useState(false);

  // Timer effect
  useEffect(() => {
    if (step !== 2 || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeOver();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [step, timeLeft]);

  const startQuiz = async () => {
    setLoading(true);
    setErrorMsg("");
    setTimeOver(false);
    try {
      const res = await api.get(`/quiz?category=${category}`);
      let fetchedQuizzes = res.data;
      if (fetchedQuizzes.length === 0) {
        throw new Error(`No quizzes available in category ${category}.`);
      }

      // Shuffle the fetched quizzes
      fetchedQuizzes = fetchedQuizzes.sort(() => 0.5 - Math.random());

      // Slice to selected count
      if (numQuestions !== "all") {
        const limit = parseInt(numQuestions, 10);
        fetchedQuizzes = fetchedQuizzes.slice(0, limit);
      }

      setQuizzes(fetchedQuizzes);
      setCurrentIdx(0);
      setSelectedAnswerIndex(null);
      setUserAnswers([]);
      setResults(null);

      // Set 90 seconds per question
      const totalSeconds = fetchedQuizzes.length * 90;
      setTimeLeft(totalSeconds);
      setStep(2);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || "Failed to load quizzes.");
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (optionIdx) => {
    setSelectedAnswerIndex(optionIdx);
  };

  const submitQuizForcefully = async (answersToSubmit) => {
    setSubmitLoading(true);
    try {
      const res = await api.post("/quiz/submit", { answers: answersToSubmit });
      setResults(res.data);
      setStep(3);
    } catch (err) {
      setErrorMsg("Failed to score quiz submission.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleTimeOver = () => {
    setTimeOver(true);
    // For any unanswered questions, fill in null for selectedAnswerIndex
    const finalAnswers = [...userAnswers];
    
    // Add the current question's answer if selected
    if (selectedAnswerIndex !== null && finalAnswers.length === currentIdx) {
      finalAnswers.push({ quizId: quizzes[currentIdx]._id, selectedAnswerIndex });
    }
    
    // Fill remaining with null
    for (let i = finalAnswers.length; i < quizzes.length; i++) {
      finalAnswers.push({ quizId: quizzes[i]._id, selectedAnswerIndex: null });
    }
    
    submitQuizForcefully(finalAnswers);
  };

  const handleNext = async () => {
    const currentQuiz = quizzes[currentIdx];
    const newAnswers = [...userAnswers, { quizId: currentQuiz._id, selectedAnswerIndex }];
    setUserAnswers(newAnswers);
    setSelectedAnswerIndex(null);

    if (currentIdx + 1 < quizzes.length) {
      setCurrentIdx(currentIdx + 1);
    } else {
      // Submit normally
      submitQuizForcefully(newAnswers);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <DashboardShell>
      <div className="space-y-6 font-sans text-gray-800">
      {/* STEP 1: SETUP CATEGORY & QUESTIONS */}
      {step === 1 && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex flex-col items-center text-center">
            <div className="bg-[#8B7CF8]/10 text-[#8B7CF8] p-4.5 rounded-2xl mb-4">
              <Award size={32} />
            </div>
            <h1 className="text-3xl font-extrabold text-[#1E2A5A]">
              PrepSmart <span className="text-[#6D5DF6]">Quiz Hub</span>
            </h1>
            <p className="text-gray-400 mt-2 text-sm max-w-md">
              Configure your topic, choose the number of questions, and test your knowledge against dynamic time limits.
            </p>
          </div>

          {errorMsg && (
            <div className="bg-red-50 text-red-500 p-4 rounded-xl border border-red-100 text-sm">
              {errorMsg}
            </div>
          )}

          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
            {/* Category selection */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-[#1E2A5A]">Select Category Topic</label>
              <div className="grid grid-cols-2 gap-4">
                {["JavaScript", "React", "Node.js", "Databases"].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setCategory(item)}
                    className={`p-4 rounded-xl border font-semibold text-sm text-left transition flex items-center justify-between ${
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

            {/* Questions count selection */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-[#1E2A5A]">Number of Questions</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: "1", label: "1 Question (1.5 min)" },
                  { value: "3", label: "3 Questions (4.5 min)" },
                  { value: "5", label: "5 Questions (7.5 min)" },
                  { value: "10", label: "10 Questions (15 min)" },
                  { value: "all", label: "All Available" }
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setNumQuestions(opt.value)}
                    className={`p-3 rounded-xl border font-bold text-[11px] text-center transition ${
                      numQuestions === opt.value
                        ? "border-[#6D5DF6] bg-[#6D5DF6]/5 text-[#6D5DF6]"
                        : "border-gray-200 text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={startQuiz}
              disabled={loading}
              className="w-full bg-[#6D5DF6] hover:bg-[#5C4EE3] text-white py-4 rounded-xl font-bold shadow-lg shadow-[#6D5DF6]/20 transition flex items-center justify-center gap-2 hover:scale-[1.01]"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Loading Quiz...
                </>
              ) : (
                <>
                  Start Quiz
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: ACTIVE TIMED QUIZ LOOP */}
      {step === 2 && quizzes.length > 0 && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="bg-[#8B7CF8]/10 text-[#8B7CF8] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                Question {currentIdx + 1} of {quizzes.length}
              </span>
              <div className="flex items-center gap-2">
                <Clock size={16} className={timeLeft < 30 ? "text-red-500 animate-pulse" : "text-gray-400"} />
                <span className={`px-3 py-1 rounded-lg text-xs font-extrabold transition-colors ${
                  timeLeft < 30 ? "bg-red-50 text-red-600 animate-pulse" : "bg-gray-50 text-[#1E2A5A]"
                }`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>

            <h2 className="text-lg font-bold text-[#1E2A5A] leading-relaxed">
              {quizzes[currentIdx].question}
            </h2>
          </div>

          <div className="space-y-3">
            {quizzes[currentIdx].options.map((option, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleOptionSelect(idx)}
                className={`w-full p-4.5 rounded-xl border text-left font-semibold text-sm transition flex items-center gap-4 ${
                  selectedAnswerIndex === idx
                    ? "border-[#6D5DF6] bg-[#6D5DF6]/5 text-[#6D5DF6]"
                    : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
                }`}
              >
                <span className={`h-6 w-6 rounded-lg font-bold text-xs flex items-center justify-center border shrink-0 ${
                  selectedAnswerIndex === idx
                    ? "bg-[#6D5DF6] text-white border-[#6D5DF6]"
                    : "bg-gray-50 text-gray-400 border-gray-200"
                }`}>
                  {String.fromCharCode(65 + idx)}
                </span>
                {option}
              </button>
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={selectedAnswerIndex === null || submitLoading}
            className="w-full bg-[#6D5DF6] hover:bg-[#5C4EE3] disabled:opacity-50 text-white py-4 rounded-xl font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-[#6D5DF6]/10"
          >
            {submitLoading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Submitting for grading...
              </>
            ) : currentIdx + 1 === quizzes.length ? (
              "Complete & Submit Quiz"
            ) : (
              "Next Question"
            )}
          </button>
        </div>
      )}

      {/* STEP 3: SCORE BREAKDOWN WITH CORRECTIONS */}
      {step === 3 && results && (
        <div className="max-w-2xl mx-auto space-y-6">
          {timeOver && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-2xl flex items-center gap-3 text-red-700 text-sm font-semibold animate-shake">
              <AlertTriangle size={20} className="shrink-0 animate-bounce" />
              <span>Time limit exceeded! Unanswered questions have been graded as incorrect.</span>
            </div>
          )}

          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm text-center space-y-6 relative overflow-hidden">
            <div className="absolute w-40 h-40 bg-[#8B7CF8]/5 rounded-full -right-10 -bottom-10 blur-xl"></div>
            <div className="bg-[#8B7CF8]/10 text-[#8B7CF8] p-4.5 rounded-full w-fit mx-auto">
              <Sparkles size={36} />
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-extrabold text-[#1E2A5A]">Quiz Completed!</h2>
              <p className="text-sm text-gray-400">
                You successfully solved the MCQ quiz. Here is your structured points breakdown.
              </p>
            </div>

            <div className="flex justify-center gap-8 text-left">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-center min-w-[120px]">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Score</p>
                <p className="font-extrabold text-[#6D5DF6] text-3xl mt-0.5">{results.score}%</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-center min-w-[120px]">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Correct</p>
                <p className="font-extrabold text-green-500 text-3xl mt-0.5">
                  {results.correctCount}/{results.totalCount}
                </p>
              </div>
            </div>

            <button
              onClick={() => setStep(1)}
              className="bg-[#6D5DF6] hover:bg-[#5C4EE3] text-white px-8 py-3.5 rounded-xl font-bold transition flex items-center justify-center gap-2 mx-auto"
            >
              <RotateCcw size={16} />
              Take Another Quiz
            </button>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-[#1E2A5A]">Answers Review</h3>
            <div className="space-y-4">
              {results.results.map((q, idx) => (
                <div key={idx} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <h4 className="font-bold text-sm text-[#1E2A5A] leading-relaxed">
                      {idx + 1}. {q.question}
                    </h4>
                    {q.isCorrect ? (
                      <span className="flex items-center gap-1 text-green-500 text-xs font-bold shrink-0">
                        <CheckCircle2 size={16} />
                        Correct
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-500 text-xs font-bold shrink-0">
                        <XCircle size={16} />
                        Incorrect
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <p className="text-gray-400">
                      Your Answer: <span className={`font-bold ${q.isCorrect ? "text-green-500" : "text-red-500"}`}>
                        {q.userAnswer !== null && q.userAnswer !== undefined ? q.options[q.userAnswer] : "No Answer (Time Out)"}
                      </span>
                    </p>
                    {!q.isCorrect && (
                      <>
                        <p className="text-gray-400">
                          Correct Answer: <span className="font-bold text-green-500">
                            {q.options[q.correctAnswer]}
                          </span>
                        </p>
                        <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
                          <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-3">
                            <p className="font-bold text-amber-800">Suggestions:</p>
                            <p className="text-amber-700 mt-0.5 leading-relaxed">{q.suggestions}</p>
                          </div>
                          <div className="bg-[#6D5DF6]/5 border border-[#6D5DF6]/10 rounded-xl p-3">
                            <p className="font-bold text-[#6D5DF6]">Short Refined Answer:</p>
                            <p className="text-gray-600 mt-0.5 leading-relaxed">{q.refinedAnswer}</p>
                          </div>
                        </div>
                      </>
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
