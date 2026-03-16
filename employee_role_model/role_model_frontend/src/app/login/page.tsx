"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { UserCircle2, Mail, Lock, Building, ArrowRight, Loader2, KeyRound } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    emp_name: "",
    emp_email: "",
    emp_password: "",
    emp_department: "",
    is_admin: "employee", // Default role
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isLogin) {

        const response = await api.post("/login/employee", {
          emp_email: formData.emp_email,
          emp_password: formData.emp_password,
        });

        if (response.data.success) {
          login(response.data.data, response.data.token);
        }
      } else {

        const response = await api.post("/create/employee", formData);
        
        if (response.data.status) {

          setIsLogin(true);
          setError("Registration successful! Please log in.");
        }
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || err.message || "An error occurred during authentication."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-black text-white font-sans selection:bg-zinc-800">
      <div className="w-full max-w-md">
        <div className="glass-panel rounded-3xl p-8 sm:p-10 transition-all duration-500 relative z-10">
          
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-100 mb-4 shadow-sm">
              <KeyRound size={32} />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-zinc-500 text-sm">
              {isLogin
                ? "Sign in to access your unified dashboard"
                : "Register to get started with the platform"}
            </p>
          </div>

          {error && (
            <div className={`mb-6 p-4 rounded-xl text-sm border ${
                error.includes("successful") 
                ? "bg-zinc-900 border-emerald-900/50 text-emerald-400" 
                : "bg-zinc-900 border-red-900/50 text-red-400"
              } backdrop-blur-sm transition-all animate-in fade-in slide-in-from-top-2`}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider pl-1">
                    Full Name
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-600 group-focus-within:text-white transition-colors">
                      <UserCircle2 size={18} />
                    </div>
                    <input
                      type="text"
                      name="emp_name"
                      required
                      value={formData.emp_name}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-800 bg-[#0a0a0a] focus:bg-black focus:ring-1 focus:ring-zinc-600 focus:border-zinc-700 outline-none transition-all placeholder:text-zinc-600 text-white"
                      placeholder="John Doe"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider pl-1">
                    Department
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-600 group-focus-within:text-white transition-colors">
                      <Building size={18} />
                    </div>
                    <input
                      type="text"
                      name="emp_department"
                      required
                      value={formData.emp_department}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-800 bg-[#0a0a0a] focus:bg-black focus:ring-1 focus:ring-zinc-600 focus:border-zinc-700 outline-none transition-all placeholder:text-zinc-600 text-white"
                      placeholder="Engineering"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider pl-1">
                    Role
                  </label>
                  <select
                    name="is_admin"
                    value={formData.is_admin}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-zinc-800 bg-[#0a0a0a] focus:bg-black focus:ring-1 focus:ring-zinc-600 focus:border-zinc-700 outline-none transition-all appearance-none cursor-pointer text-white"
                  >
                    <option value="employee">Employee</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </>
            )}

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider pl-1">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-600 group-focus-within:text-white transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  name="emp_email"
                  required
                  value={formData.emp_email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-800 bg-[#0a0a0a] focus:bg-black focus:ring-1 focus:ring-zinc-600 focus:border-zinc-700 outline-none transition-all placeholder:text-zinc-600 text-white"
                  placeholder="you@company.com"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center pl-1">
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  Password
                </label>
                {isLogin && (
                  <a href="#" className="text-xs text-zinc-400 hover:text-white transition-colors">
                    Forgot password?
                  </a>
                )}
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-600 group-focus-within:text-white transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  name="emp_password"
                  required
                  value={formData.emp_password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-800 bg-[#0a0a0a] focus:bg-black focus:ring-1 focus:ring-zinc-600 focus:border-zinc-700 outline-none transition-all placeholder:text-zinc-600 text-white"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-white hover:bg-zinc-200 text-black rounded-xl font-medium transition-colors flex items-center justify-center gap-2 group relative overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin text-zinc-500" />
              ) : (
                <>
                  <span className="relative z-10">{isLogin ? "Sign In" : "Create Account"}</span>
                  <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-zinc-500">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError("");
                }}
                className="font-medium text-white hover:underline transition-all"
              >
                {isLogin ? "Register now" : "Sign in here"}
              </button>
            </p>
          </div>
          
        </div>
      </div>
    </div>
  );
}
