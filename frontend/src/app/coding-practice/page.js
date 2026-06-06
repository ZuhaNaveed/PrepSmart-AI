"use client";

import { useEffect, useState } from "react";
import { Code, Play, CheckCircle2, AlertTriangle, Loader2, ArrowLeft, Terminal, Cpu } from "lucide-react";
import api from "@/lib/axios";
import DashboardShell from "@/components/DashboardShell";

export default function CodingPracticePage() {
  const [problems, setProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);
  
  // Code editor states
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    setLoading(true);
    try {
      const res = await api.get("/coding");
      setProblems(res.data);
    } catch (err) {
      setErrorMsg("Failed to load programming problems.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProblem = (prob) => {
    setSelectedProblem(prob);
    setCode(prob.starterCode);
    setResult(null);
    setErrorMsg("");
  };

  const handleBackToList = () => {
    setSelectedProblem(null);
    setResult(null);
    setErrorMsg("");
  };

  const handleSubmit = async () => {
    setSubmitLoading(true);
    setResult(null);
    setErrorMsg("");
    try {
      const res = await api.post("/coding/submit", {
        problemId: selectedProblem._id,
        code,
      });
      setResult(res.data);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to compile your code.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const getDifficultyColor = (diff) => {
    switch (diff) {
      case "Easy": return "bg-green-50 text-green-600 border-green-100";
      case "Medium": return "bg-yellow-50 text-yellow-600 border-yellow-100";
      case "Hard": return "bg-red-50 text-red-600 border-red-100";
      default: return "bg-gray-50 text-gray-400";
    }
  };

  return (
    <DashboardShell>
      <div className="space-y-6 font-sans text-gray-800">
      {/* HEADER SECTION */}
      {!selectedProblem && (
        <div className="space-y-6">
          <div className="flex flex-col items-center text-center">
            <div className="bg-yellow-50 text-yellow-600 p-4.5 rounded-2xl mb-4 border border-yellow-100">
              <Code size={32} />
            </div>
            <h1 className="text-3xl font-extrabold text-[#1E2A5A]">
              PrepSmart <span className="text-[#6D5DF6]">Coding Sandbox</span>
            </h1>
            <p className="text-gray-400 mt-2 text-sm max-w-md">
              Improve your algorithmic efficiency. Complete starter code structures and submit to evaluate assertions.
            </p>
          </div>

          {errorMsg && (
            <div className="bg-red-50 text-red-500 p-4 rounded-xl border border-red-100 text-sm">
              {errorMsg}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin text-[#6D5DF6]" size={36} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {problems.map((prob) => (
                <div
                  key={prob._id}
                  className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between h-48 hover:shadow-md transition"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getDifficultyColor(prob.difficulty)}`}>
                        {prob.difficulty}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-[#1E2A5A]">{prob.title}</h3>
                    <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                      {prob.description.split("\n")[0]}
                    </p>
                  </div>

                  <button
                    onClick={() => handleSelectProblem(prob)}
                    className="w-full mt-4 bg-gray-50 hover:bg-[#6D5DF6] hover:text-white text-gray-600 text-xs font-bold py-3 rounded-xl transition flex items-center justify-center gap-1.5"
                  >
                    Solve Problem
                    <Play size={12} fill="currentColor" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* CODE EDITOR VIEW */}
      {selectedProblem && (
        <div className="space-y-6">
          <button
            onClick={handleBackToList}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#6D5DF6] font-semibold transition"
          >
            <ArrowLeft size={16} />
            Back to Problem List
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Problem Details */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-[#1E2A5A]">{selectedProblem.title}</h2>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getDifficultyColor(selectedProblem.difficulty)}`}>
                    {selectedProblem.difficulty}
                  </span>
                </div>

                <div className="text-sm text-gray-500 leading-relaxed whitespace-pre-line border-t border-gray-50 pt-4">
                  {selectedProblem.description}
                </div>

                {selectedProblem.constraints && selectedProblem.constraints.length > 0 && (
                  <div className="space-y-2 border-t border-gray-50 pt-4">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide">Constraints</h4>
                    <ul className="text-xs text-gray-500 space-y-1 list-disc pl-4">
                      {selectedProblem.constraints.map((c, idx) => <li key={idx}>{c}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Code Sandbox */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-[#1E2A5A] flex items-center gap-2">
                    <Terminal size={18} className="text-[#6D5DF6]" />
                    JavaScript Editor
                  </label>
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                    main.js
                  </span>
                </div>

                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  rows={14}
                  className="w-full font-mono bg-[#1E2538] text-gray-200 border-none rounded-xl p-4 outline-none text-xs leading-relaxed transition"
                  disabled={submitLoading}
                />

                <button
                  onClick={handleSubmit}
                  disabled={submitLoading}
                  className="w-full bg-[#6D5DF6] hover:bg-[#5C4EE3] text-white py-3.5 rounded-xl font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-[#6D5DF6]/10"
                >
                  {submitLoading ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Compiling & executing solution...
                    </>
                  ) : (
                    <>
                      Run Solution
                      <Play size={14} fill="currentColor" />
                    </>
                  )}
                </button>
              </div>

              {/* Console log outputs */}
              {(result || errorMsg) && (
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4 animate-fade-in">
                  <h3 className="text-sm font-bold text-[#1E2A5A] flex items-center gap-2">
                    <Cpu size={18} className="text-[#6D5DF6]" />
                    Execution Console
                  </h3>

                  {errorMsg && (
                    <div className="bg-red-50 text-red-500 p-3 rounded-xl border border-red-100 text-xs">
                      {errorMsg}
                    </div>
                  )}

                  {result && (
                    <div className="space-y-4 text-xs">
                      <div className="flex items-center justify-between border-b border-gray-50 pb-3">
                        <div className="flex items-center gap-2">
                          {result.success ? (
                            <span className="flex items-center gap-1 text-green-500 font-bold">
                              <CheckCircle2 size={16} />
                              Success
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-red-500 font-bold">
                              <AlertTriangle size={16} />
                              Failed
                            </span>
                          )}
                        </div>
                        {result.success && (
                          <div className="flex items-center gap-6 text-gray-400">
                            <span>Time: <span className="font-bold text-gray-600">{result.executionTimeMs} ms</span></span>
                            <span>Memory: <span className="font-bold text-gray-600">{result.memoryUsedKb} KB</span></span>
                          </div>
                        )}
                      </div>

                      <p className={`font-bold ${result.success ? "text-green-600" : "text-red-500"}`}>
                        {result.message}
                      </p>

                      <div className="bg-gray-900 text-green-400 p-3 rounded-xl font-mono text-[10px] space-y-1">
                        {result.logs.map((log, idx) => <p key={idx}>{log}</p>)}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
    </DashboardShell>
  );
}
