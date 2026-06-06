"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Lock, Eye, EyeOff, GraduationCap, Loader2, Sparkles } from "lucide-react";
import api from "@/lib/axios";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      await api.post("/auth/register", form);
      setSuccessMsg("Account created! Redirecting to login...");

      setTimeout(() => {
        router.push("/login");
      }, 1200);
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] relative overflow-hidden flex items-center justify-center font-sans">
      {/* Background Shapes */}
      <div className="absolute w-80 h-80 bg-[#8B7CF8]/10 rounded-full -left-20 bottom-10 blur-2xl"></div>
      <div className="absolute w-96 h-96 bg-[#6D5DF6]/10 rounded-full -right-20 -top-20 blur-2xl"></div>

      {/* Logo */}
      <div className="absolute top-8 left-10 flex items-center gap-3">
        <div className="bg-[#6D5DF6] text-white p-2 rounded-xl">
          <GraduationCap size={24} />
        </div>
        <h1 className="text-xl font-bold text-[#1E2A5A]">
          Prep<span className="text-[#6D5DF6]">Smart</span> AI
        </h1>
      </div>

      {/* Register Card */}
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl shadow-gray-100/50 border border-gray-100 z-10 mx-4">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-[#6D5DF6]/10 text-[#6D5DF6] p-4 rounded-full mb-3">
            <Sparkles size={28} />
          </div>
          <h2 className="text-3xl font-extrabold text-[#1E2A5A] text-center">
            Create <span className="text-[#6D5DF6]">Account</span>
          </h2>
          <p className="text-center text-gray-400 mt-1.5 text-sm">
            Join PrepSmart AI and start your preparation journey
          </p>
        </div>

        {/* Message banners */}
        {errorMsg && (
          <div className="bg-red-50 text-red-500 p-3.5 rounded-xl border border-red-100 text-sm mb-4">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="bg-green-50 text-green-600 p-3.5 rounded-xl border border-green-100 text-sm mb-4">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
              Full Name
            </label>
            <div className="flex items-center border border-gray-200 focus-within:border-[#6D5DF6] rounded-xl px-3.5 py-3 transition">
              <User className="text-[#6D5DF6] mr-3" size={20} />
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                onChange={handleChange}
                className="w-full outline-none text-gray-700 bg-transparent text-sm"
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
              Email Address
            </label>
            <div className="flex items-center border border-gray-200 focus-within:border-[#6D5DF6] rounded-xl px-3.5 py-3 transition">
              <Mail className="text-[#6D5DF6] mr-3" size={20} />
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                onChange={handleChange}
                className="w-full outline-none text-gray-700 bg-transparent text-sm"
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
              Password
            </label>
            <div className="flex items-center border border-gray-200 focus-within:border-[#6D5DF6] rounded-xl px-3.5 py-3 transition">
              <Lock className="text-[#6D5DF6] mr-3" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                onChange={handleChange}
                className="w-full outline-none text-gray-700 bg-transparent text-sm"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#6D5DF6] hover:bg-[#5C4EE3] text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-[#6D5DF6]/20 transition flex items-center justify-center gap-2 hover:scale-[1.01]"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Creating Account...
              </>
            ) : (
              "Register"
            )}
          </button>
        </form>

        <p className="text-center text-gray-400 text-sm mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-[#6D5DF6] font-bold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}