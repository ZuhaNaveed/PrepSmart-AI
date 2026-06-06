"use client";

import { useEffect, useState } from "react";
import { ShieldAlert, Users, PlusCircle, BookOpen, AlertTriangle, Loader2, Sparkles } from "lucide-react";
import api from "@/lib/axios";
import DashboardShell from "@/components/DashboardShell";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("users"); // users, questions, add-interview, add-quiz
  const [users, setUsers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Forms
  const [interviewForm, setInterviewForm] = useState({
    role: "Frontend Developer",
    category: "Technical",
    text: "",
    suggestedAnswer: "",
  });

  const [quizForm, setQuizForm] = useState({
    category: "JavaScript",
    question: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctAnswer: 0,
  });

  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    fetchAdminData();
  }, [activeTab]);

  const fetchAdminData = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      if (activeTab === "users") {
        const res = await api.get("/auth/users");
        setUsers(res.data);
      } else if (activeTab === "questions") {
        const res = await api.get("/quiz/interview-questions");
        setQuestions(res.data);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to fetch administrative records.");
    } finally {
      setLoading(false);
    }
  };

  const handleInterviewSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      await api.post("/quiz/add-interview-question", interviewForm);
      setSuccessMsg("Interview question added successfully!");
      setInterviewForm({
        role: "Frontend Developer",
        category: "Technical",
        text: "",
        suggestedAnswer: "",
      });
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setErrorMsg("Failed to add interview question.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleQuizSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    const options = [quizForm.optionA, quizForm.optionB, quizForm.optionC, quizForm.optionD].filter(o => o.trim() !== "");
    if (options.length < 2) {
      setErrorMsg("At least two valid option inputs are required.");
      setSubmitLoading(false);
      return;
    }

    try {
      await api.post("/quiz/add-quiz", {
        category: quizForm.category,
        question: quizForm.question,
        options,
        correctAnswer: parseInt(quizForm.correctAnswer),
      });
      setSuccessMsg("MCQ Quiz question added successfully!");
      setQuizForm({
        category: "JavaScript",
        question: "",
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: "",
        correctAnswer: 0,
      });
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setErrorMsg("Failed to add quiz question.");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <DashboardShell>
      <div className="space-y-6 font-sans text-gray-800">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-150">
          <div className="bg-[#6D5DF6]/10 text-[#6D5DF6] p-2.5 rounded-xl border border-[#6D5DF6]/10">
            <ShieldAlert size={24} />
          </div>
        <div>
          <h1 className="text-2xl font-extrabold text-[#1E2A5A]">Administration Center</h1>
          <p className="text-sm text-gray-400">
            View student directories, manage databases, and add training material.
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="bg-red-50 text-red-500 p-4 rounded-xl border border-red-100 text-sm">
          {errorMsg}
        </div>
      )}

      {/* Tabs Menu */}
      <div className="flex flex-wrap border-b border-gray-100 gap-1">
        {[
          { id: "users", name: "Registered Candidates", icon: Users },
          { id: "questions", name: "Manage Questions", icon: BookOpen },
          { id: "add-interview", name: "Add Mock Question", icon: PlusCircle },
          { id: "add-quiz", name: "Add MCQ Quiz", icon: PlusCircle },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSuccessMsg("");
                setErrorMsg("");
              }}
              className={`flex items-center gap-2 px-6 py-3.5 border-b-2 font-bold text-xs tracking-wide uppercase transition ${
                active
                  ? "border-[#6D5DF6] text-[#6D5DF6]"
                  : "border-transparent text-gray-400 hover:text-gray-600 hover:border-gray-250"
              }`}
            >
              <Icon size={14} />
              {tab.name}
            </button>
          );
        })}
      </div>

      {/* VIEW: USERS DIRECTORY */}
      {activeTab === "users" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-fade-in">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin text-[#6D5DF6]" size={36} />
            </div>
          ) : users.length === 0 ? (
            <p className="p-8 text-center text-gray-400">No candidates registered.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider">
                    <th className="p-4 pl-6">Candidate Details</th>
                    <th className="p-4">Registered Email</th>
                    <th className="p-4">Target Career</th>
                    <th className="p-4 text-center">Readiness Index</th>
                    <th className="p-4 pr-6">Created On</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-gray-600 font-semibold">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-gray-50/50 transition">
                      <td className="p-4 pl-6 flex items-center gap-3">
                        <div className="h-8 w-8 bg-[#6D5DF6]/10 text-[#6D5DF6] rounded-lg flex items-center justify-center font-bold">
                          {u.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <span className="font-bold text-[#1E2A5A]">{u.name}</span>
                      </td>
                      <td className="p-4">{u.email}</td>
                      <td className="p-4">
                        <span className="bg-[#6D5DF6]/5 text-[#6D5DF6] px-2 py-0.5 rounded text-[10px]">
                          {u.targetRole || "Student"}
                        </span>
                      </td>
                      <td className="p-4 text-center text-[#6D5DF6] font-bold">{u.readinessScore || 70}%</td>
                      <td className="p-4 pr-6 text-gray-400 font-normal">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* VIEW: MANAGE QUESTIONS LIST */}
      {activeTab === "questions" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-fade-in">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin text-[#6D5DF6]" size={36} />
            </div>
          ) : questions.length === 0 ? (
            <p className="p-8 text-center text-gray-400">No mock questions found in database.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider">
                    <th className="p-4 pl-6">Mock Question Text</th>
                    <th className="p-4">Target Role</th>
                    <th className="p-4 pr-6">Category Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-gray-600 font-semibold">
                  {questions.map((q) => (
                    <tr key={q._id} className="hover:bg-gray-50/50 transition">
                      <td className="p-4 pl-6 max-w-md font-medium text-[#1E2A5A] truncate">{q.text}</td>
                      <td className="p-4">
                        <span className="bg-[#6D5DF6]/5 text-[#6D5DF6] px-2 py-0.5 rounded text-[10px]">
                          {q.role}
                        </span>
                      </td>
                      <td className="p-4 pr-6">
                        <span className="bg-gray-100 text-gray-400 px-2 py-0.5 rounded text-[10px]">
                          {q.category}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* FORM: ADD MOCK INTERVIEW QUESTION */}
      {activeTab === "add-interview" && (
        <form onSubmit={handleInterviewSubmit} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-5 max-w-2xl animate-fade-in">
          <h3 className="font-bold text-[#1E2A5A] text-sm border-b border-gray-50 pb-3 flex items-center gap-2">
            <PlusCircle size={18} className="text-[#6D5DF6]" />
            New Mock Interview Question Form
          </h3>

          {successMsg && (
            <div className="bg-green-50 text-green-600 p-3.5 rounded-xl border border-green-100 text-xs font-semibold">
              {successMsg}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Target Role</label>
              <select
                value={interviewForm.role}
                onChange={(e) => setInterviewForm({ ...interviewForm, role: e.target.value })}
                className="w-full border border-gray-200 focus:border-[#6D5DF6] rounded-xl px-3.5 py-3 outline-none text-xs bg-transparent cursor-pointer"
                required
              >
                <option value="Frontend Developer">Frontend Developer</option>
                <option value="Backend Developer">Backend Developer</option>
                <option value="Full Stack Developer">Full Stack Developer</option>
                <option value="UI/UX Designer">UI/UX Designer</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Question Category</label>
              <select
                value={interviewForm.category}
                onChange={(e) => setInterviewForm({ ...interviewForm, category: e.target.value })}
                className="w-full border border-gray-200 focus:border-[#6D5DF6] rounded-xl px-3.5 py-3 outline-none text-xs bg-transparent cursor-pointer"
                required
              >
                <option value="Technical">Technical</option>
                <option value="Behavioral">Behavioral</option>
                <option value="HR">HR</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Question Prompt</label>
            <textarea
              value={interviewForm.text}
              onChange={(e) => setInterviewForm({ ...interviewForm, text: e.target.value })}
              placeholder="e.g. Explain how closure works in JavaScript and mention a practical use-case..."
              rows={3}
              className="w-full border border-gray-200 focus:border-[#6D5DF6] rounded-xl p-4 outline-none text-xs transition"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Suggested Answer Guidelines</label>
            <textarea
              value={interviewForm.suggestedAnswer}
              onChange={(e) => setInterviewForm({ ...interviewForm, suggestedAnswer: e.target.value })}
              placeholder="Provide clean conceptual guidelines or code snippets..."
              rows={4}
              className="w-full border border-gray-200 focus:border-[#6D5DF6] rounded-xl p-4 outline-none text-xs transition"
            />
          </div>

          <button
            type="submit"
            disabled={submitLoading}
            className="bg-[#6D5DF6] hover:bg-[#5C4EE3] text-white px-6 py-3 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2"
          >
            {submitLoading ? (
              <>
                <Loader2 className="animate-spin" size={14} />
                Saving Question...
              </>
            ) : (
              <>
                Save Question
                <Sparkles size={14} />
              </>
            )}
          </button>
        </form>
      )}

      {/* FORM: ADD MCQ QUIZ */}
      {activeTab === "add-quiz" && (
        <form onSubmit={handleQuizSubmit} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-5 max-w-2xl animate-fade-in">
          <h3 className="font-bold text-[#1E2A5A] text-sm border-b border-gray-50 pb-3 flex items-center gap-2">
            <PlusCircle size={18} className="text-[#6D5DF6]" />
            New MCQ Quiz Form
          </h3>

          {successMsg && (
            <div className="bg-green-50 text-green-600 p-3.5 rounded-xl border border-green-100 text-xs font-semibold">
              {successMsg}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Category Topic</label>
            <select
              value={quizForm.category}
              onChange={(e) => setQuizForm({ ...quizForm, category: e.target.value })}
              className="w-full border border-gray-200 focus:border-[#6D5DF6] rounded-xl px-3.5 py-3 outline-none text-xs bg-transparent cursor-pointer"
              required
            >
              <option value="JavaScript">JavaScript</option>
              <option value="React">React</option>
              <option value="Node.js">Node.js</option>
              <option value="Databases">Databases</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Question MCQ Text</label>
            <textarea
              value={quizForm.question}
              onChange={(e) => setQuizForm({ ...quizForm, question: e.target.value })}
              placeholder="e.g. Which keyword is used to prevent variable re-assignment in ES6?"
              rows={2}
              className="w-full border border-gray-200 focus:border-[#6D5DF6] rounded-xl p-4 outline-none text-xs transition"
              required
            />
          </div>

          {/* Option Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Option A</label>
              <input
                type="text"
                value={quizForm.optionA}
                onChange={(e) => setQuizForm({ ...quizForm, optionA: e.target.value })}
                className="w-full border border-gray-200 focus:border-[#6D5DF6] rounded-xl px-3.5 py-3 outline-none text-xs"
                placeholder="Option A text"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Option B</label>
              <input
                type="text"
                value={quizForm.optionB}
                onChange={(e) => setQuizForm({ ...quizForm, optionB: e.target.value })}
                className="w-full border border-gray-200 focus:border-[#6D5DF6] rounded-xl px-3.5 py-3 outline-none text-xs"
                placeholder="Option B text"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Option C</label>
              <input
                type="text"
                value={quizForm.optionC}
                onChange={(e) => setQuizForm({ ...quizForm, optionC: e.target.value })}
                className="w-full border border-gray-200 focus:border-[#6D5DF6] rounded-xl px-3.5 py-3 outline-none text-xs"
                placeholder="Option C text"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Option D</label>
              <input
                type="text"
                value={quizForm.optionD}
                onChange={(e) => setQuizForm({ ...quizForm, optionD: e.target.value })}
                className="w-full border border-gray-200 focus:border-[#6D5DF6] rounded-xl px-3.5 py-3 outline-none text-xs"
                placeholder="Option D text"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Correct Option Index</label>
            <select
              value={quizForm.correctAnswer}
              onChange={(e) => setQuizForm({ ...quizForm, correctAnswer: parseInt(e.target.value) })}
              className="w-full border border-gray-200 focus:border-[#6D5DF6] rounded-xl px-3.5 py-3 outline-none text-xs bg-transparent cursor-pointer"
              required
            >
              <option value={0}>Option A</option>
              <option value={1}>Option B</option>
              <option value={2}>Option C</option>
              <option value={3}>Option D</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={submitLoading}
            className="bg-[#6D5DF6] hover:bg-[#5C4EE3] text-white px-6 py-3 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2"
          >
            {submitLoading ? (
              <>
                <Loader2 className="animate-spin" size={14} />
                Saving MCQ Quiz...
              </>
            ) : (
              <>
                Save MCQ Quiz
                <Sparkles size={14} />
              </>
            )}
          </button>
        </form>
      )}
    </div>
    </DashboardShell>
  );
}
