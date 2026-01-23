import React, { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/forgot-password/request-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      alert(data.message);
      setIsSubmitted(true);
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = (): void => {
    setIsSubmitted(false);
    setEmail('');
    globalThis.history.back();
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') handleSubmit();
  };

  // ✅ Submitted state
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4 sm:px-6 py-12 sm:py-16">
        <div className="w-full max-w-md bg-slate-800/80 backdrop-blur-xl rounded-3xl p-8 sm:p-10 shadow-2xl shadow-blue-500/20">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-6">
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Check your email
            </h1>

            <p className="text-slate-400 mb-8 leading-relaxed text-sm sm:text-base">
              We've sent a password reset link to<br />
              <span className="text-white font-medium">{email}</span>
            </p>

            <button
              onClick={handleBackToLogin}
              className="w-full bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 sm:py-4 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-500/30 mb-4"
            >
              Back to Sign in
            </button>

            <p className="text-slate-400 text-sm mt-4">
              Didn't receive the email?{' '}
              <button
                onClick={handleSubmit}
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                Resend
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Default form state
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 sm:px-6 py-12 sm:py-16">
      <div className="w-full max-w-md bg-slate-800/80 backdrop-blur-xl rounded-3xl p-8 sm:p-10 shadow-2xl shadow-blue-500/20">
        {/* Back Button */}
        <button
          onClick={handleBackToLogin}
          className="flex items-center text-slate-400 hover:text-white transition-colors mb-6 group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium text-sm sm:text-base">Back</span>
        </button>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Forgot password?</h1>
          <p className="text-slate-400 leading-relaxed text-sm sm:text-base">
            No worries, we'll send you reset instructions
          </p>
        </div>

        {/* Form */}
        <div>
          <label htmlFor="email" className="block text-slate-300 font-medium mb-2 text-sm sm:text-base">
            Email
          </label>
          <div className="relative mb-6">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full bg-slate-900/50 border border-slate-700 text-white placeholder-slate-400 rounded-2xl py-3 sm:py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={isLoading || !email}
            className="w-full bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-semibold py-3 sm:py-4 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-500/30 disabled:shadow-none mb-4"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </span>
            ) : (
              'Send Reset Link'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
