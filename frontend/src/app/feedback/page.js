"use client";

import Link from "next/link";
import { ArrowLeft, MessageSquare } from "lucide-react";

export default function FeedbackPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FC] flex flex-col items-center justify-center p-6 text-center font-sans">
      <div className="bg-[#6D5DF6]/10 text-[#6D5DF6] p-4.5 rounded-2xl mb-4">
        <MessageSquare size={32} />
      </div>
      <h1 className="text-2xl font-extrabold text-[#1E2A5A]">Mock Interview Feedback</h1>
      <p className="text-gray-400 text-sm max-w-sm mt-2 mb-6">
        Detailed AI mock interview feedback is displayed directly inside your interview session breakdown or under your dashboard performance history logs.
      </p>
      <Link
        href="/dashboard"
        className="flex items-center gap-2 bg-[#6D5DF6] hover:bg-[#5C4EE3] text-white px-6 py-3 rounded-xl font-bold shadow-md shadow-[#6D5DF6]/20 transition"
      >
        <ArrowLeft size={16} />
        Go to Dashboard
      </Link>
    </div>
  );
}
