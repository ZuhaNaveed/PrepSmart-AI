"use client";

import { useEffect, useState } from "react";
import { User, Mail, Sparkles, Loader2, Save, BadgeCheck, Code, BookOpen } from "lucide-react";
import api from "@/lib/axios";
import DashboardShell from "@/components/DashboardShell";

export default function ProfilePage() {
  const [form, setForm] = useState({
    name: "",
    skills: "",
    targetRole: "",
  });

  const [email, setEmail] = useState("");
  const [readinessScore, setReadinessScore] = useState(70);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      const res = await api.get("/auth/profile");
      setForm({
        name: res.data.name || "",
        skills: res.data.skills ? res.data.skills.join(", ") : "",
        targetRole: res.data.targetRole || "",
      });
      setEmail(res.data.email || "");
      setReadinessScore(res.data.readinessScore || 70);
    } catch (err) {
      setErrorMsg("Failed to load user profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    // Convert comma-separated string to clean array of strings
    const skillsArray = form.skills
      ? form.skills.split(",").map((s) => s.trim()).filter((s) => s.length > 0)
      : [];

    try {
      const res = await api.put("/auth/profile", {
        name: form.name,
        targetRole: form.targetRole,
        skills: skillsArray,
      });

      // Update cached details in localStorage
      const cached = localStorage.getItem("user");
      if (cached) {
        const parsed = JSON.parse(cached);
        const updated = {
          ...parsed,
          name: res.data.name,
          targetRole: res.data.targetRole,
          skills: res.data.skills,
          readinessScore: res.data.readinessScore,
        };
        localStorage.setItem("user", JSON.stringify(updated));
      }

      setSuccessMsg("Profile details saved successfully!");
      
      // Update local values
      setForm({
        name: res.data.name || "",
        skills: res.data.skills ? res.data.skills.join(", ") : "",
        targetRole: res.data.targetRole || "",
      });
      setReadinessScore(res.data.readinessScore || 70);

      // Force header update by retriggering layout triggers if needed, or simply reload in 1s
      setTimeout(() => {
        setSuccessMsg("");
      }, 3000);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to update profile details.");
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="animate-spin text-[#6D5DF6]" size={36} />
      </div>
    );
  }

  return (
    <DashboardShell>
      <div className="max-w-4xl mx-auto space-y-8 font-sans text-gray-800">
      {/* Profile Header Summary */}
      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute w-40 h-40 bg-[#6D5DF6]/5 rounded-full -left-10 -bottom-10 blur-xl"></div>
        
        <div className="flex flex-col md:flex-row items-center gap-5 relative z-10">
          <div className="h-20 w-20 bg-gradient-to-tr from-[#6D5DF6] to-[#8B7CF8] text-white font-extrabold rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-[#6D5DF6]/20">
            {form.name ? form.name.split(" ").map(n => n[0]).join("").slice(0, 2) : "C"}
          </div>
          <div className="space-y-1.5 text-center md:text-left">
            <h1 className="text-2xl font-extrabold text-[#1E2A5A]">{form.name || "Candidate Profile"}</h1>
            <p className="text-gray-400 text-sm flex items-center gap-1.5 justify-center md:justify-start">
              <Mail size={14} />
              {email}
            </p>
            <div className="flex flex-wrap gap-2 pt-1 justify-center md:justify-start">
              <span className="bg-[#6D5DF6]/10 text-[#6D5DF6] border border-[#6D5DF6]/10 px-3 py-0.5 rounded-full text-xs font-semibold">
                {form.targetRole || "No Target Role Set"}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-[#F8F9FC] p-6 rounded-2xl border border-gray-100 text-center min-w-[140px]">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Readiness Score</p>
          <div className="flex items-center gap-1.5 justify-center mt-1">
            <BadgeCheck className="text-[#6D5DF6]" size={20} />
            <span className="font-extrabold text-[#1E2A5A] text-2xl">{readinessScore}%</span>
          </div>
          <p className="text-[10px] text-gray-400 mt-1">Mock loops & quizzes</p>
        </div>
      </div>

      {/* Main Forms and Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left: Skills tags */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-5">
            <h3 className="font-bold text-[#1E2A5A] text-sm flex items-center gap-2 border-b border-gray-50 pb-3">
              <Code size={18} className="text-[#6D5DF6]" />
              Core Competencies
            </h3>
            
            <div className="flex flex-wrap gap-2">
              {form.skills ? (
                form.skills.split(",").map((skill, idx) => {
                  const cleaned = skill.trim();
                  if (!cleaned) return null;
                  return (
                    <span
                      key={idx}
                      className="bg-gray-50 hover:bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1.5 rounded-xl border border-gray-100 transition"
                    >
                      {cleaned}
                    </span>
                  );
                })
              ) : (
                <p className="text-xs text-gray-400">Add your skills in the form to render tech tags.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right: Update Form */}
        <div className="md:col-span-2 space-y-6">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
            <h3 className="font-bold text-[#1E2A5A] text-sm flex items-center gap-2 border-b border-gray-50 pb-3">
              <BookOpen size={18} className="text-[#6D5DF6]" />
              Edit Profile Details
            </h3>

            {successMsg && (
              <div className="bg-green-50 text-green-600 p-3.5 rounded-xl border border-green-100 text-xs font-semibold">
                {successMsg}
              </div>
            )}
            {errorMsg && (
              <div className="bg-red-50 text-red-500 p-3.5 rounded-xl border border-red-100 text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Full Name</label>
                <div className="flex items-center border border-gray-200 focus-within:border-[#6D5DF6] rounded-xl px-3.5 py-3.5 transition">
                  <User className="text-[#6D5DF6] mr-3" size={18} />
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full outline-none text-gray-700 bg-transparent text-xs"
                    required
                    disabled={saveLoading}
                  />
                </div>
              </div>

              {/* Target Role */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Target Role</label>
                <div className="flex items-center border border-gray-200 focus-within:border-[#6D5DF6] rounded-xl px-3.5 py-3.5 transition">
                  <Sparkles className="text-[#6D5DF6] mr-3" size={18} />
                  <select
                    name="targetRole"
                    value={form.targetRole}
                    onChange={handleChange}
                    className="w-full outline-none text-gray-700 bg-transparent text-xs cursor-pointer"
                    disabled={saveLoading}
                  >
                    <option value="">Select Role</option>
                    <option value="Frontend Developer">Frontend Developer</option>
                    <option value="Backend Developer">Backend Developer</option>
                    <option value="Full Stack Developer">Full Stack Developer</option>
                    <option value="UI/UX Designer">UI/UX Designer</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Skills Array */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Skills (Comma-separated)</label>
              <textarea
                name="skills"
                value={form.skills}
                onChange={handleChange}
                placeholder="React, CSS, Node.js, Mongoose, Databases..."
                rows={3}
                className="w-full border border-gray-200 focus:border-[#6D5DF6] rounded-xl p-4 outline-none text-gray-700 text-xs transition"
                disabled={saveLoading}
              />
              <p className="text-[10px] text-gray-400 leading-relaxed">
                Provide skills separated by a comma (e.g. React, Next.js, Node.js) to display tags dynamically in your profile.
              </p>
            </div>

            <button
              type="submit"
              disabled={saveLoading}
              className="bg-[#6D5DF6] hover:bg-[#5C4EE3] text-white px-8 py-3.5 rounded-xl font-bold transition flex items-center justify-center gap-2 hover:scale-[1.01] shadow-lg shadow-[#6D5DF6]/10"
            >
              {saveLoading ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  Saving Details...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Save Changes
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
    </DashboardShell>
  );
}
