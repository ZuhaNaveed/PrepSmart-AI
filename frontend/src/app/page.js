"use client";

import Link from "next/link";
import { GraduationCap, ArrowRight, CheckCircle2, ShieldCheck, Sparkles, Brain, Code, Award } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F8F9FC] relative overflow-hidden font-sans text-gray-800">
      {/* Background patterns */}
      <div className="absolute w-[600px] h-[600px] bg-[#8B7CF8]/10 rounded-full blur-3xl -left-80 -top-80"></div>
      <div className="absolute w-[600px] h-[600px] bg-[#6D5DF6]/10 rounded-full blur-3xl -right-80 -bottom-80"></div>

      {/* Top Navbar */}
      <nav className="relative max-w-7xl mx-auto px-6 py-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="bg-[#6D5DF6] text-white p-2.5 rounded-xl shadow-md shadow-[#6D5DF6]/30">
            <GraduationCap size={24} />
          </div>
          <span className="text-xl font-bold text-[#1E2A5A] tracking-tight">
            Prep<span className="text-[#6D5DF6]">Smart</span> AI
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-gray-600 hover:text-[#6D5DF6] font-semibold transition"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="bg-[#6D5DF6] hover:bg-[#5C4EE3] text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg shadow-[#6D5DF6]/20 transition"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative max-w-5xl mx-auto px-6 pt-16 pb-20 text-center z-10 flex flex-col items-center">
        <div className="inline-flex items-center gap-2 bg-[#6D5DF6]/10 text-[#6D5DF6] px-4 py-2 rounded-full font-semibold text-sm mb-6 border border-[#6D5DF6]/20">
          <Sparkles size={16} />
          Empowered by Gemini 1.5 Flash AI
        </div>

        <h1 className="text-5xl md:text-6xl font-extrabold text-[#1E2A5A] tracking-tight leading-tight max-w-4xl">
          Ace Your Next Interview with <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6D5DF6] to-[#8B7CF8]">
            AI-Powered Personalized Prep
          </span>
        </h1>

        <p className="text-lg text-gray-500 max-w-2xl mt-6 leading-relaxed">
          Interactive AI mock interviews, tailored coding challenges, and dynamic quizzes. Elevate your confidence and track your career readiness score.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-10">
          <Link
            href="/register"
            className="flex items-center gap-2 bg-[#6D5DF6] hover:bg-[#5C4EE3] text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl shadow-[#6D5DF6]/20 hover:scale-[1.02] transition"
          >
            Start Preparing Now
            <ArrowRight size={20} />
          </Link>
          <Link
            href="/login"
            className="flex items-center justify-center border border-gray-300 hover:bg-white text-gray-700 px-8 py-4 rounded-xl font-bold text-lg hover:scale-[1.02] transition"
          >
            Log In
          </Link>
        </div>
      </header>

      {/* Features Grid */}
      <section className="relative max-w-7xl mx-auto px-6 pb-32 z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1E2A5A]">
            Comprehensive Interview Prep Suite
          </h2>
          <p className="text-gray-500 mt-3">
            Everything you need to master your next tech or behavioral loop
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-white p-8 rounded-2xl shadow-xl shadow-gray-100 hover:shadow-2xl hover:shadow-gray-100 border border-gray-100 flex flex-col items-start hover:-translate-y-1 transition duration-300">
            <div className="bg-[#6D5DF6]/10 text-[#6D5DF6] p-4 rounded-xl mb-6">
              <Brain size={28} />
            </div>
            <h3 className="text-xl font-bold text-[#1E2A5A] mb-3">AI Mock Interviews</h3>
            <p className="text-gray-500 leading-relaxed">
              Step through simulated technical, HR, and behavioral interviews. Receive detailed Gemini AI assessments on strengths, weaknesses, and a corrected model answer.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-8 rounded-2xl shadow-xl shadow-gray-100 hover:shadow-2xl hover:shadow-gray-100 border border-gray-100 flex flex-col items-start hover:-translate-y-1 transition duration-300">
            <div className="bg-[#8B7CF8]/10 text-[#8B7CF8] p-4 rounded-xl mb-6">
              <Code size={28} />
            </div>
            <h3 className="text-xl font-bold text-[#1E2A5A] mb-3">Coding Sandbox</h3>
            <p className="text-gray-500 leading-relaxed">
              Sharpen your problem-solving skills with a built-in sandbox editor. Run standard test cases and refine your programmatic answers.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-8 rounded-2xl shadow-xl shadow-gray-100 hover:shadow-2xl hover:shadow-gray-100 border border-gray-100 flex flex-col items-start hover:-translate-y-1 transition duration-300">
            <div className="bg-green-50 text-green-600 p-4 rounded-xl mb-6">
              <Award size={28} />
            </div>
            <h3 className="text-xl font-bold text-[#1E2A5A] mb-3">Readiness Index</h3>
            <p className="text-gray-500 leading-relaxed">
              Monitor your growth with a live readiness score that aggregates mock evaluations, quizzes, and completed programming tasks.
            </p>
          </div>
        </div>
      </section>

      {/* Trust Banner */}
      <section className="bg-white py-16 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center">
            <ShieldCheck className="text-[#6D5DF6] mb-3" size={32} />
            <h4 className="font-bold text-[#1E2A5A]">100% Private</h4>
            <p className="text-sm text-gray-400 mt-1">Your data and evaluations remain fully confidential</p>
          </div>
          <div className="flex flex-col items-center">
            <CheckCircle2 className="text-[#6D5DF6] mb-3" size={32} />
            <h4 className="font-bold text-[#1E2A5A]">STAR Framework</h4>
            <p className="text-sm text-gray-400 mt-1">Feedback formatted specifically around standard corporate methodologies</p>
          </div>
          <div className="flex flex-col items-center">
            <Sparkles className="text-[#6D5DF6] mb-3" size={32} />
            <h4 className="font-bold text-[#1E2A5A]">Gemini 1.5 Evaluator</h4>
            <p className="text-sm text-gray-400 mt-1">Leverages state-of-the-art LLMs for precise, contextual feedback</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#F8F9FC] py-12 text-center text-gray-400 text-sm border-t border-gray-100">
        <p>&copy; {new Date().getFullYear()} PrepSmart AI. Crafted for engineering and creative excellence.</p>
      </footer>
    </div>
  );
}
