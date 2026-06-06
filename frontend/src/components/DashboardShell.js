"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  GraduationCap,
  LayoutDashboard,
  Brain,
  Award,
  Code,
  Heart,
  User,
  ShieldAlert,
  LogOut,
  Bell,
  ChevronRight,
  Menu,
  X,
  Loader2,
} from "lucide-react";

export default function DashboardShell({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const cachedUser = localStorage.getItem("user");

    if (!token) {
      router.push("/login");
    } else {
      if (cachedUser) {
        setUser(JSON.parse(cachedUser));
      }
      setLoading(false);
    }
  }, [router, pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FC] flex flex-col items-center justify-center gap-3">
        <Loader2 className="animate-spin text-[#6D5DF6]" size={40} />
        <p className="text-gray-400 font-medium text-sm">Verifying session...</p>
      </div>
    );
  }

  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "AI Mock Interview", href: "/mock-interview", icon: Brain },
    { name: "Take Quiz", href: "/quizzes", icon: Award },
    { name: "Practice Coding", href: "/coding-practice", icon: Code },
    { name: "Saved Questions", href: "/saved-questions", icon: Heart },
    { name: "My Profile", href: "/profile", icon: User },
  ];

  if (user && user.role === "admin") {
    menuItems.push({ name: "Admin Panel", href: "/admin", icon: ShieldAlert });
  }

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-gray-800 flex font-sans">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-100 p-6 shrink-0 relative z-25">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-[#6D5DF6] text-white p-2.5 rounded-xl shadow-md shadow-[#6D5DF6]/30">
            <GraduationCap size={22} />
          </div>
          <span className="text-lg font-bold text-[#1E2A5A] tracking-tight">
            Prep<span className="text-[#6D5DF6]">Smart</span> AI
          </span>
        </div>

        <nav className="flex-1 space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-sm transition ${
                  active
                    ? "bg-[#6D5DF6]/10 text-[#6D5DF6]"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} />
                  {item.name}
                </div>
                {active && <ChevronRight size={14} />}
              </Link>
            );
          })}
        </nav>

        <div className="pt-6 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl font-semibold text-sm transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Mobile */}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-64 bg-white p-6 border-r border-gray-100 z-40 transition-transform duration-300 md:hidden flex flex-col ${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-[#6D5DF6] text-white p-2 rounded-xl">
              <GraduationCap size={22} />
            </div>
            <span className="text-lg font-bold text-[#1E2A5A]">PrepSmart AI</span>
          </div>
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="text-gray-500 p-1 hover:bg-gray-100 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileSidebarOpen(false)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-sm transition ${
                  active
                    ? "bg-[#6D5DF6]/10 text-[#6D5DF6]"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} />
                  {item.name}
                </div>
                {active && <ChevronRight size={14} />}
              </Link>
            );
          })}
        </nav>

        <div className="pt-6 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl font-semibold text-sm transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Header/Navbar */}
        <header className="bg-white border-b border-gray-100 h-16 shrink-0 flex items-center justify-between px-6 md:px-8 relative z-20">
          {/* Left: Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="p-2 hover:bg-gray-50 rounded-xl text-gray-500 md:hidden"
            >
              <Menu size={20} />
            </button>
            <h2 className="text-lg font-bold text-[#1E2A5A] md:block hidden">
              Welcome back, <span className="text-[#6D5DF6]">{user?.name || "Candidate"}</span>!
            </h2>
          </div>

          {/* Right: Notifications & User Avatar */}
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition relative">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <div className="h-8 w-px bg-gray-100"></div>

            <div className="flex items-center gap-3">
              <div className="text-right md:block hidden">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  {user?.role === "admin" ? "Administrator" : "Candidate"}
                </p>
                <p className="text-sm font-bold text-[#1E2A5A]">{user?.name}</p>
              </div>
              <div className="h-10 w-10 bg-[#6D5DF6] text-white font-bold rounded-xl flex items-center justify-center shadow-md shadow-[#6D5DF6]/20">
                {user?.name ? user.name.split(" ").map(n => n[0]).join("").slice(0, 2) : "C"}
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Inner Page */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}
