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
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
  };

  const handleReset = async (): Promise<void> => {
    setError("");

    if (!newPassword || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!validatePassword(newPassword)) {
      setError("Password does not meet requirements");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/forgot-password/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        setIsSuccess(true); // Set success state immediately
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setError(data.message || "Failed to reset password");
        setIsLoading(false);
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  // Changed from onKeyPress to onKeyDown for consistency
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      handleReset();
    }
  };

  const getPasswordStrength = (password: string): { strength: string; color: string; width: string } => {
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

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-linear-to-br from-slate-800 to-slate-900 rounded-3xl p-8 shadow-2xl">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-6">
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>

            <h1 className="text-3xl font-bold text-white mb-3">
              Password Reset Successfully!
            </h1>

            <p className="text-slate-400 mb-8 leading-relaxed">
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

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-linear-to-br from-slate-800 to-slate-900 rounded-3xl p-8 shadow-2xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-3">
            Reset your password
          </h1>
          <p className="text-slate-400 leading-relaxed">
            Enter your new password below
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/50 rounded-2xl p-4 flex items-start">
            <AlertCircle className="w-5 h-5 text-red-400 mr-3 shrink-0 mt-0.5" />
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <div>
          <div className="mb-6">
            <label htmlFor="newPassword" className="block text-slate-300 font-medium mb-3">
              New Password
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <Lock className="w-5 h-5" />
              </div>
              <input
                id="newPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-slate-700/50 border border-slate-600 text-white placeholder-slate-400 rounded-2xl py-4 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {newPassword && (
              <div className="mt-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-slate-400">Password strength:</span>
                  <span className={`text-sm font-medium ${passwordStrength.strength === "Weak" ? "text-red-400" :
                      passwordStrength.strength === "Medium" ? "text-yellow-400" :
                        "text-green-400"
                    }`}>
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

          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-slate-300 font-medium mb-3">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <Lock className="w-5 h-5" />
              </div>
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-slate-700/50 border border-slate-600 text-white placeholder-slate-400 rounded-2xl py-4 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
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

          <div className="mb-6 bg-slate-700/30 rounded-2xl p-4">
            <p className="text-slate-300 text-sm font-medium mb-2">Password must contain:</p>
            <ul className="space-y-1.5">
              <li className={`text-sm flex items-center ${newPassword.length >= 8 ? "text-green-400" : "text-slate-400"}`}>
                <span className="mr-2">{newPassword.length >= 8 ? "✓" : "○"}</span>
                At least 8 characters
              </li>
              <li className={`text-sm flex items-center ${/[A-Z]/.test(newPassword) ? "text-green-400" : "text-slate-400"}`}>
                <span className="mr-2">{/[A-Z]/.test(newPassword) ? "✓" : "○"}</span>
                One uppercase letter
              </li>
              <li className={`text-sm flex items-center ${/[a-z]/.test(newPassword) ? "text-green-400" : "text-slate-400"}`}>
                <span className="mr-2">{/[a-z]/.test(newPassword) ? "✓" : "○"}</span>
                One lowercase letter
              </li>
              <li className={`text-sm flex items-center ${/[0-9]/.test(newPassword) ? "text-green-400" : "text-slate-400"}`}>
                <span className="mr-2">{/[0-9]/.test(newPassword) ? "✓" : "○"}</span>
                One number
              </li>
              <li className={`text-sm flex items-center ${/[!@#$%^&*(),.?":{}|<>]/.test(newPassword) ? "text-green-400" : "text-slate-400"}`}>
                <span className="mr-2">{/[!@#$%^&*(),.?":{}|<>]/.test(newPassword) ? "✓" : "○"}</span>
                One special character
              </li>
            </ul>
          </div>

          <button
            onClick={handleReset}
            disabled={isLoading || !newPassword || !confirmPassword}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-600/30 disabled:shadow-none mb-6"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Resetting...
              </span>
            ) : (
              'Reset Password'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}