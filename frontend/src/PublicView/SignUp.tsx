import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, ArrowLeft, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const nav = useNavigate();

  // Frontend password validation
  const isStrongPassword = (pwd: string) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    return regex.test(pwd);
  };

  const handleSignup = async () => {
    if (!name || !email || !password) {
      return alert("All fields are required");
    }

    if (!isStrongPassword(password)) {
      return alert(
        "Password must be at least 8 characters long, include uppercase, lowercase, number, and special character"
      );
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      console.log("SIGNUP RESPONSE", data);

      if (response.ok) {
        alert("Account created successfully!");
        nav("/login");
      } else {
        alert(data.message || "Signup failed");
      }
    } catch (err) {
      console.error("Error signing up:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  const handleGoBack = () => window.history.back();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSignup();
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-12 sm:py-16 mt-0">
      {/* Back Button */}
      <button
        onClick={handleGoBack}
        className="fixed top-4 sm:top-6 left-4 sm:left-6 flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-xs sm:text-sm font-medium">Back</span>
      </button>

      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-14 sm:w-16 h-14 sm:h-16 bg-linear-to-br from-blue-500 to-blue-600 rounded-2xl mb-3 sm:mb-4 shadow-lg shadow-blue-500/50">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 sm:w-8 h-6 sm:h-8"
            >
              <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">Smart Notes</h1>
          <p className="text-blue-300 text-xs sm:text-sm">Your intelligent note-taking companion</p>
        </div>

        {/* Signup Form */}
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700/50 p-6 sm:p-8 md:p-10">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Create your account</h2>
          <p className="text-slate-400 text-sm mb-6">Start capturing your ideas today</p>

          <div className="space-y-4 sm:space-y-5">

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full pl-10 pr-3 py-2.5 sm:py-3 bg-slate-900/50 border border-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-500"
                  placeholder="John Doe"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full pl-10 pr-3 py-2.5 sm:py-3 bg-slate-900/50 border border-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-500"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full pl-10 pr-10 py-2.5 sm:py-3 bg-slate-900/50 border border-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-500"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className="text-slate-500 text-xs mt-1 sm:mt-2">
                Must be at least 8 characters and include uppercase, lowercase, number, and special character
              </p>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSignup}
              className="w-full bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold py-2.5 sm:py-3 rounded-lg transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02] active:scale-[0.98]"
            >
              Create Account
            </button>
          </div>

          {/* Sign In Link */}
          <div className="mt-4 sm:mt-6 text-center">
            <p className="text-slate-400 text-xs sm:text-sm">
              Already have an account?{" "}
              <button
                type="button"
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                onClick={() => nav("/login")}
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>

  );
}
