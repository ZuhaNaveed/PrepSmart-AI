"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, Trash2, ArrowRight, Loader2, Sparkles, Filter, ChevronDown, ChevronUp } from "lucide-react";
import api from "@/lib/axios";
import DashboardShell from "@/components/DashboardShell";

export default function SavedQuestionsPage() {
  const [savedItems, setSavedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  
  // Filtering States
  const [roleFilter, setRoleFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetchSavedQuestions();
  }, []);

  const fetchSavedQuestions = async () => {
    setLoading(true);
    try {
      const res = await api.get("/interview/saved");
      setSavedItems(res.data);
    } catch (err) {
      setErrorMsg("Failed to load saved questions.");
    } finally {
      setLoading(false);
    }
  };

  const handleUnsave = async (questionId) => {
    try {
      await api.post("/interview/saved/toggle", { questionId });
      // Remove item from UI state
      setSavedItems(savedItems.filter(item => item.question._id !== questionId));
    } catch (err) {
      console.error("Unsave error:", err.message);
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Run filters
  const filteredQuestions = savedItems.filter((item) => {
    const q = item.question;
    if (!q) return false;

    let matchRole = true;
    if (roleFilter !== "All" && q.role !== roleFilter) matchRole = false;

    let matchCategory = true;
    if (categoryFilter !== "All" && q.category !== categoryFilter) matchCategory = false;

    return matchRole && matchCategory;
  });

  return (
    <DashboardShell>
      <div className="space-y-6 font-sans text-gray-800">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-gray-150">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1E2A5A]">Saved Interview Questions</h1>
          <p className="text-sm text-gray-400">
            Review and bookmark your weak spots or highly detailed technical concepts.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs">
            <Filter size={14} className="text-gray-400" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-transparent border-none outline-none font-semibold text-gray-600 cursor-pointer"
            >
              <option value="All">All Roles</option>
              <option value="Frontend Developer">Frontend</option>
              <option value="Backend Developer">Backend</option>
              <option value="Full Stack Developer">Full Stack</option>
              <option value="UI/UX Designer">UI/UX</option>
            </select>
          </div>

          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs">
            <Filter size={14} className="text-gray-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-transparent border-none outline-none font-semibold text-gray-600 cursor-pointer"
            >
              <option value="All">All Categories</option>
              <option value="Technical">Technical</option>
              <option value="Behavioral">Behavioral</option>
              <option value="HR">HR</option>
            </select>
          </div>
        </div>
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
      ) : filteredQuestions.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-gray-100 shadow-sm text-center max-w-lg mx-auto space-y-4">
          <Heart size={44} className="text-gray-200 mx-auto fill-gray-50" />
          <h3 className="font-bold text-[#1E2A5A] text-lg">No saved questions found</h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            Bookmarks help you quickly review challenging questions. Check them off inside active Mock Interviews!
          </p>
          <Link
            href="/mock-interview"
            className="inline-flex items-center gap-2 bg-[#6D5DF6] text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-md hover:opacity-90 transition mx-auto"
          >
            Start Preparing
            <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="space-y-4 max-w-4xl">
          {filteredQuestions.map((item) => {
            const q = item.question;
            const isExpanded = expandedId === item._id;
            return (
              <div
                key={item._id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition hover:shadow-md"
              >
                {/* Header Summary Row */}
                <div
                  onClick={() => toggleExpand(item._id)}
                  className="p-5 flex items-center justify-between gap-6 cursor-pointer select-none"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-wider">
                      <span className="bg-[#6D5DF6]/10 text-[#6D5DF6] px-2.5 py-0.5 rounded-full">
                        {q.role}
                      </span>
                      <span className="bg-gray-100 text-gray-400 px-2.5 py-0.5 rounded-full">
                        {q.category}
                      </span>
                    </div>
                    <h3 className="font-bold text-[#1E2A5A] text-sm md:text-base leading-relaxed">
                      {q.text}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUnsave(q._id);
                      }}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition"
                    >
                      <Trash2 size={16} />
                    </button>
                    <div className="text-gray-400">
                      {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                  </div>
                </div>

                {/* Expanding suggested response panel */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-1.5 border-t border-gray-50 bg-gray-50/50 space-y-3.5 animate-fade-in text-xs">
                    <div className="space-y-1.5">
                      <span className="font-bold text-[#1E2A5A] flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                        <Sparkles size={14} className="text-yellow-500" />
                        Suggested Response
                      </span>
                      <p className="text-gray-600 bg-white p-4 rounded-xl border border-gray-150 leading-relaxed max-h-60 overflow-y-auto">
                        {q.suggestedAnswer || "No suggested response is preloaded for this question. Work out a response on your own!"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
    </DashboardShell>
  );
}
