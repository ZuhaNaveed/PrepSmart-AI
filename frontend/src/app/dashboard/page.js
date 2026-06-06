"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Brain, Award, Code, Heart, ArrowRight, Play, CheckCircle2, Calendar, Target, TrendingUp, TrendingDown, Minus, BarChart3 } from "lucide-react";
import api from "@/lib/axios";
import DashboardShell from "@/components/DashboardShell";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [interviews, setInterviews] = useState([]);
  const [quizStats, setQuizStats] = useState({ totalCompleted: 0, perfectScores: 0, avgScore: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cachedUser = localStorage.getItem("user");
    if (cachedUser) {
      setUser(JSON.parse(cachedUser));
    }

    const fetchDashboardData = async () => {
      try {
        const [interviewRes, quizRes] = await Promise.allSettled([
          api.get("/interview/history"),
          api.get("/quiz/stats"),
        ]);
        
        if (interviewRes.status === "fulfilled") {
          setInterviews(interviewRes.value.data);
        }
        if (quizRes.status === "fulfilled") {
          setQuizStats(quizRes.value.data);
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const readinessScore = user?.readinessScore || 70;
  
  // Calculate statistics based on actual interviews
  const totalInterviews = interviews.length;
  const completedInterviews = interviews.filter(i => i.status === "completed");
  const avgScore = completedInterviews.length > 0 
    ? Math.round(completedInterviews.reduce((sum, i) => sum + (i.overallScore || 0), 0) / completedInterviews.length) 
    : 0;

  // Calculate readiness trend from recent vs older interviews
  const getTrend = () => {
    if (completedInterviews.length < 2) return { value: 0, label: "Start more interviews to see trends", direction: "neutral" };
    
    const sorted = [...completedInterviews].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const recentHalf = sorted.slice(0, Math.ceil(sorted.length / 2));
    const olderHalf = sorted.slice(Math.ceil(sorted.length / 2));
    
    const recentAvg = recentHalf.reduce((s, i) => s + (i.overallScore || 0), 0) / recentHalf.length;
    const olderAvg = olderHalf.reduce((s, i) => s + (i.overallScore || 0), 0) / olderHalf.length;
    
    const diff = Math.round((recentAvg - olderAvg) * 10) / 10;
    if (diff > 0) return { value: `+${diff}%`, label: "improvement over previous sessions", direction: "up" };
    if (diff < 0) return { value: `${diff}%`, label: "from previous sessions", direction: "down" };
    return { value: "0%", label: "steady performance", direction: "neutral" };
  };
  const trend = getTrend();

  // Dynamic milestones based on activity
  const getMilestones = () => {
    const milestones = [];
    
    if (totalInterviews === 0) {
      milestones.push({
        title: "Complete Your First Interview",
        desc: "Start a mock interview to begin tracking your progress",
        status: "today",
        color: "bg-[#6D5DF6]",
      });
    } else if (totalInterviews < 5) {
      milestones.push({
        title: `Complete ${5 - totalInterviews} More Interviews`,
        desc: `You've done ${totalInterviews} — reach 5 to unlock detailed analytics`,
        status: "in-progress",
        color: "bg-[#6D5DF6]",
      });
    } else {
      milestones.push({
        title: "Interview Milestone Reached! 🎉",
        desc: `${totalInterviews} interviews completed — keep challenging yourself!`,
        status: "done",
        color: "bg-green-500",
      });
    }

    if (quizStats.totalCompleted === 0) {
      milestones.push({
        title: "Take Your First Quiz",
        desc: "Test your knowledge across JavaScript, React, Node.js & more",
        status: "upcoming",
        color: "bg-[#8B7CF8]",
      });
    } else {
      milestones.push({
        title: `Quiz Progress: ${quizStats.totalCompleted} Completed`,
        desc: `Average score: ${quizStats.avgScore}% | Perfect: ${quizStats.perfectScores}`,
        status: quizStats.avgScore >= 80 ? "done" : "in-progress",
        color: "bg-[#8B7CF8]",
      });
    }

    if (avgScore > 0 && avgScore < 75) {
      milestones.push({
        title: "Raise Your Average to 75%",
        desc: `Currently at ${avgScore}% — review AI feedback and practice weaker areas`,
        status: "in-progress",
        color: "bg-yellow-500",
      });
    }

    return milestones;
  };
  const milestones = getMilestones();

  // Coding tasks solved (derived from completed interview count as proxy)
  const codingSolved = quizStats.totalCompleted; // Proxy - will be accurate when coding results are tracked

  // SVG parameters for readiness circle
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (readinessScore / 100) * circumference;

  // Score history for mini bar chart (last 5 interviews)
  const scoreHistory = completedInterviews
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    .slice(-5)
    .map(i => i.overallScore || 0);

  return (
    <DashboardShell>
      <div className="space-y-8 font-sans text-gray-800">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute w-40 h-40 bg-[#6D5DF6]/5 rounded-full -right-10 -bottom-10 blur-xl"></div>
        <div className="space-y-2 relative z-10">
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#1E2A5A]">
            Elevate Your <span className="text-[#6D5DF6]">Interview Performance</span>
          </h1>
          <p className="text-gray-400 text-sm max-w-xl">
            PrepSmart AI analyzes your communication, technical skills, and behavioral responses, comparing them with top-tier candidate benchmarks.
          </p>
        </div>
        <Link
          href="/mock-interview"
          className="flex items-center gap-2 bg-[#6D5DF6] hover:bg-[#5C4EE3] text-white px-6 py-3.5 rounded-xl font-bold shadow-lg shadow-[#6D5DF6]/20 transition shrink-0 hover:scale-[1.02]"
        >
          <Play size={18} fill="currentColor" />
          Start Mock Interview
        </Link>
      </div>

      {/* Grid: Readiness & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Circular Readiness Score */}
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6">
            Readiness Index
          </h3>
          
          <div className="relative h-40 w-40 flex items-center justify-center">
            {/* Background circle */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r={radius}
                className="stroke-gray-100"
                strokeWidth="12"
                fill="transparent"
              />
              {/* Active circle */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                className="stroke-[#6D5DF6] transition-all duration-1000 ease-out"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-4xl font-extrabold text-[#1E2A5A]">{readinessScore}%</span>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-0.5">Ready</p>
            </div>
          </div>

          <div className={`flex items-center gap-2 font-semibold text-sm mt-6 ${
            trend.direction === "up" ? "text-green-500" : trend.direction === "down" ? "text-red-400" : "text-gray-400"
          }`}>
            {trend.direction === "up" && <TrendingUp size={16} />}
            {trend.direction === "down" && <TrendingDown size={16} />}
            {trend.direction === "neutral" && <Minus size={16} />}
            {trend.value} {trend.label}
          </div>
          <p className="text-gray-400 text-xs mt-1.5">Based on your recent interview feedback metrics</p>
        </div>

        {/* Stats Grid */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5 hover:shadow-md hover:shadow-gray-100/50 transition">
            <div className="bg-[#6D5DF6]/10 text-[#6D5DF6] p-4 rounded-xl">
              <Brain size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Mock Interviews</p>
              <h4 className="text-3xl font-extrabold text-[#1E2A5A] mt-1">{totalInterviews}</h4>
              <p className="text-xs text-gray-400 mt-1">
                {totalInterviews < 10 ? `Goal: 10 sessions (${10 - totalInterviews} remaining)` : "✓ Goal reached!"}
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5 hover:shadow-md hover:shadow-gray-100/50 transition">
            <div className="bg-[#8B7CF8]/10 text-[#8B7CF8] p-4 rounded-xl">
              <Target size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Average Evaluation</p>
              <h4 className="text-3xl font-extrabold text-[#1E2A5A] mt-1">{avgScore}%</h4>
              <p className="text-xs text-gray-400 mt-1">
                {avgScore === 0 ? "Complete an interview to see score" : avgScore >= 75 ? "✓ Above passing threshold" : "Passing requirement: 75%"}
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5 hover:shadow-md hover:shadow-gray-100/50 transition">
            <div className="bg-green-50 text-green-600 p-4 rounded-xl">
              <Award size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Quizzes Completed</p>
              <h4 className="text-3xl font-extrabold text-[#1E2A5A] mt-1">{quizStats.totalCompleted}</h4>
              <p className="text-xs text-gray-400 mt-1">
                {quizStats.totalCompleted === 0 ? "Take a quiz to start tracking" : `Perfect scores: ${quizStats.perfectScores}`}
              </p>
            </div>
          </div>

          {/* Card 4 - Score History Mini Chart */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:shadow-gray-100/50 transition">
            <div className="flex items-center gap-5">
              <div className="bg-yellow-50 text-yellow-600 p-4 rounded-xl">
                <BarChart3 size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Score Trend</p>
                <h4 className="text-3xl font-extrabold text-[#1E2A5A] mt-1">
                  {completedInterviews.length > 0 ? `${completedInterviews.length}` : "0"}
                </h4>
                <p className="text-xs text-gray-400 mt-1">Completed sessions tracked</p>
              </div>
            </div>
            {/* Mini bar chart */}
            {scoreHistory.length > 0 && (
              <div className="flex items-end gap-1.5 mt-4 h-12">
                {scoreHistory.map((score, idx) => (
                  <div
                    key={idx}
                    className="flex-1 bg-[#6D5DF6]/20 rounded-t-md relative group cursor-pointer"
                    style={{ height: `${Math.max(score, 10)}%` }}
                  >
                    <div
                      className="absolute inset-x-0 bottom-0 bg-[#6D5DF6] rounded-t-md transition-all duration-300"
                      style={{ height: `${Math.max(score, 10)}%` }}
                    />
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#1E2A5A] text-white text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap font-bold">
                      {score}%
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Action Grid */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-[#1E2A5A]">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/mock-interview"
            className="bg-white p-5 rounded-2xl border border-gray-100 hover:border-[#6D5DF6] hover:shadow-lg hover:shadow-[#6D5DF6]/5 transition duration-300 text-left flex flex-col justify-between h-36 group"
          >
            <div className="bg-[#6D5DF6]/10 text-[#6D5DF6] p-3 rounded-xl w-fit">
              <Brain size={20} />
            </div>
            <div className="flex items-center justify-between mt-4">
              <span className="font-bold text-[#1E2A5A]">Mock Interview</span>
              <ArrowRight size={16} className="text-gray-400 group-hover:text-[#6D5DF6] group-hover:translate-x-1 transition" />
            </div>
          </Link>

          <Link
            href="/quizzes"
            className="bg-white p-5 rounded-2xl border border-gray-100 hover:border-[#6D5DF6] hover:shadow-lg hover:shadow-[#6D5DF6]/5 transition duration-300 text-left flex flex-col justify-between h-36 group"
          >
            <div className="bg-[#8B7CF8]/10 text-[#8B7CF8] p-3 rounded-xl w-fit">
              <Award size={20} />
            </div>
            <div className="flex items-center justify-between mt-4">
              <span className="font-bold text-[#1E2A5A]">Take Quiz</span>
              <ArrowRight size={16} className="text-gray-400 group-hover:text-[#6D5DF6] group-hover:translate-x-1 transition" />
            </div>
          </Link>

          <Link
            href="/coding-practice"
            className="bg-white p-5 rounded-2xl border border-gray-100 hover:border-[#6D5DF6] hover:shadow-lg hover:shadow-[#6D5DF6]/5 transition duration-300 text-left flex flex-col justify-between h-36 group"
          >
            <div className="bg-yellow-50 text-yellow-600 p-3 rounded-xl w-fit">
              <Code size={20} />
            </div>
            <div className="flex items-center justify-between mt-4">
              <span className="font-bold text-[#1E2A5A]">Practice Coding</span>
              <ArrowRight size={16} className="text-gray-400 group-hover:text-[#6D5DF6] group-hover:translate-x-1 transition" />
            </div>
          </Link>

          <Link
            href="/saved-questions"
            className="bg-white p-5 rounded-2xl border border-gray-100 hover:border-[#6D5DF6] hover:shadow-lg hover:shadow-[#6D5DF6]/5 transition duration-300 text-left flex flex-col justify-between h-36 group"
          >
            <div className="bg-red-50 text-red-500 p-3.5 rounded-xl w-fit">
              <Heart size={20} />
            </div>
            <div className="flex items-center justify-between mt-4">
              <span className="font-bold text-[#1E2A5A]">Saved Questions</span>
              <ArrowRight size={16} className="text-gray-400 group-hover:text-[#6D5DF6] group-hover:translate-x-1 transition" />
            </div>
          </Link>
        </div>
      </div>

      {/* Grid: Recent History & Milestones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-gray-50">
            <h3 className="text-lg font-bold text-[#1E2A5A]">Recent Performance History</h3>
            <span className="text-xs text-gray-400 font-bold uppercase">AI Logs</span>
          </div>

          <div className="space-y-4">
            {loading ? (
              <p className="text-gray-400 text-sm">Loading activity logs...</p>
            ) : interviews.length === 0 ? (
              <div className="py-6 text-center text-gray-400 space-y-1">
                <p className="text-sm">No interviews completed yet.</p>
                <Link href="/mock-interview" className="text-xs text-[#6D5DF6] font-bold hover:underline">
                  Take your first AI interview now
                </Link>
              </div>
            ) : (
              interviews.slice(0, 4).map((item) => (
                <div key={item._id} className="flex items-center justify-between p-3.5 hover:bg-gray-50 rounded-xl transition">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${
                      item.status === "completed" 
                        ? "bg-green-50 text-green-600" 
                        : "bg-yellow-50 text-yellow-600"
                    }`}>
                      <CheckCircle2 size={18} />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#1E2A5A] text-sm">{item.role} Mock</h4>
                      <p className="text-xs text-gray-400">
                        {item.category}{item.company && item.company !== "General" ? ` · ${item.company}` : ""}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      item.status === "completed"
                        ? "bg-[#6D5DF6]/10 text-[#6D5DF6]"
                        : "bg-yellow-50 text-yellow-600"
                    }`}>
                      {item.status === "completed" ? `Score: ${item.overallScore}%` : "In Progress"}
                    </span>
                    <p className="text-[10px] text-gray-400 mt-1">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Dynamic Milestones */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-gray-50">
            <h3 className="text-lg font-bold text-[#1E2A5A]">Interview Prep Planner</h3>
            <span className="text-xs text-gray-400 font-bold uppercase">Milestones</span>
          </div>

          <div className="space-y-4">
            {milestones.map((milestone, idx) => (
              <div key={idx} className={`flex items-start gap-4 p-3.5 rounded-xl border border-gray-100 ${
                idx === 0 ? "bg-gray-50" : "bg-white"
              }`}>
                <div className={`${milestone.color} text-white p-2.5 rounded-xl shrink-0 mt-0.5`}>
                  <Calendar size={18} />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-[#1E2A5A] text-sm">{milestone.title}</h4>
                  <p className="text-xs text-gray-400">{milestone.desc}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      milestone.status === "done" 
                        ? "bg-green-50 text-green-600" 
                        : milestone.status === "today" || milestone.status === "in-progress"
                        ? "bg-[#6D5DF6]/10 text-[#6D5DF6]"
                        : "bg-gray-100 text-gray-400"
                    }`}>
                      {milestone.status === "done" ? "✓ Complete" : 
                       milestone.status === "today" ? "Start Now" :
                       milestone.status === "in-progress" ? "In Progress" : "Upcoming"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </DashboardShell>
  );
}