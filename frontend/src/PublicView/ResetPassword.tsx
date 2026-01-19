import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";

export function ResetPassword() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const validatePassword = (password: string): boolean => {
    return password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[!@#$%^&*(),.?":{}|<>]/.test(password);
  };

  const handleReset = async (): Promise<void> => {
    setError("");
    if (!newPassword || !confirmPassword) return setError("Please fill in all fields");
    if (newPassword !== confirmPassword) return setError("Passwords do not match");
    if (!validatePassword(newPassword)) return setError("Password does not meet requirements");

    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/forgot-password/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setIsSuccess(true);
        setTimeout(() => navigate("/login"), 2000);
      } else setError(data.message || "Failed to reset password");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleReset();
  };

  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: "", color: "", width: "0%" };
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
    if (score <= 2) return { strength: "Weak", color: "bg-red-500", width: "33%" };
    if (score <= 4) return { strength: "Medium", color: "bg-yellow-500", width: "66%" };
    return { strength: "Strong", color: "bg-green-500", width: "100%" };
  };

  const passwordStrength = getPasswordStrength(newPassword);

  // ✅ Success state
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4 sm:px-6 py-12 sm:py-16">
        <div className="w-full max-w-md bg-slate-800/80 backdrop-blur-xl rounded-3xl p-8 sm:p-10 shadow-2xl shadow-blue-500/20">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-6">
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Password Reset Successfully!
            </h1>
            <p className="text-slate-400 mb-8 text-sm sm:text-base leading-relaxed">
              Your password has been reset successfully.<br />
              Redirecting you to sign in...
            </p>
            <div className="flex justify-center">
              <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Reset form
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 sm:px-6 py-12 sm:py-16">
      <div className="w-full max-w-md bg-slate-800/80 backdrop-blur-xl rounded-3xl p-8 sm:p-10 shadow-2xl shadow-blue-500/20">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Reset your password</h1>
          <p className="text-slate-400 leading-relaxed text-sm sm:text-base">Enter your new password below</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/50 rounded-2xl p-4 flex items-start">
            <AlertCircle className="w-5 h-5 text-red-400 mr-3 shrink-0 mt-0.5" />
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* New Password */}
        <div className="mb-6">
          <label className="block text-slate-300 font-medium mb-2">New Password</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter new password"
              className="w-full bg-slate-900/50 border border-slate-700 text-white placeholder-slate-400 rounded-2xl py-3 sm:py-4 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {/* Password Strength */}
          {newPassword && (
            <div className="mt-3">
              <div className="flex justify-between items-center mb-2 text-sm sm:text-base">
                <span className="text-slate-400">Password strength:</span>
                <span className={`font-medium ${passwordStrength.strength === "Weak" ? "text-red-400" : passwordStrength.strength === "Medium" ? "text-yellow-400" : "text-green-400"}`}>
                  {passwordStrength.strength}
                </span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full ${passwordStrength.color} transition-all duration-300`}
                  style={{ width: passwordStrength.width }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div className="mb-6">
          <label className="block text-slate-300 font-medium mb-2">Confirm Password</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Confirm new password"
              className="w-full bg-slate-900/50 border border-slate-700 text-white placeholder-slate-400 rounded-2xl py-3 sm:py-4 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Password Requirements */}
        <div className="mb-6 bg-slate-700/30 rounded-2xl p-4 text-sm sm:text-base">
          <p className="text-slate-300 font-medium mb-2">Password must contain:</p>
          <ul className="space-y-1.5">
            {[
              { test: newPassword.length >= 8, label: "At least 8 characters" },
              { test: /[A-Z]/.test(newPassword), label: "One uppercase letter" },
              { test: /[a-z]/.test(newPassword), label: "One lowercase letter" },
              { test: /[0-9]/.test(newPassword), label: "One number" },
              { test: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword), label: "One special character" },
            ].map((req, idx) => (
              <li key={idx} className={`flex items-center ${req.test ? "text-green-400" : "text-slate-400"}`}>
                <span className="mr-2">{req.test ? "✓" : "○"}</span>
                {req.label}
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={handleReset}
          disabled={isLoading || !newPassword || !confirmPassword}
          className="w-full bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-semibold py-3 sm:py-4 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-500/30 disabled:shadow-none"
        >
          {isLoading ? "Resetting..." : "Reset Password"}
        </button>
      </div>
    </div>
  );
}
