import React, { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showNotice, setShowNotice] = useState<boolean>(false);
  const [noticeMessage, setNoticeMessage] = useState<string>('');

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/forgot-password/request-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      setNoticeMessage(data.message || 'Reset email sent successfully.');
      setShowNotice(true);
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
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4 sm:px-6 py-12 sm:py-16 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 -right-32 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-32 h-80 w-80 rounded-full bg-fuchsia-500/10 blur-3xl" />
        </div>
        <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl rounded-3xl p-8 sm:p-10 shadow-2xl border border-slate-800/80 relative">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500/15 rounded-2xl mb-6 border border-emerald-400/30">
              <CheckCircle className="w-8 h-8 text-emerald-400" />
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
              className="w-full bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold py-3 sm:py-4 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-cyan-500/30 mb-4 cursor-pointer"
            >
              Back to Sign in
            </button>

            <p className="text-slate-400 text-sm mt-4">
              Didn't receive the email?{' '}
              <button
                onClick={handleSubmit}
                className="text-cyan-300 hover:text-cyan-200 font-medium transition-colors cursor-pointer"
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4 sm:px-6 py-12 sm:py-16 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -right-32 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-32 h-80 w-80 rounded-full bg-fuchsia-500/10 blur-3xl" />
      </div>
      <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl rounded-3xl p-8 sm:p-10 shadow-2xl border border-slate-800/80 relative">
        {/* Back Button */}
        <button
          onClick={handleBackToLogin}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-slate-300 hover:text-white hover:border-slate-700 transition-colors mb-6 group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium text-sm">Back</span>
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
              className="w-full bg-slate-950/60 border border-slate-800 text-white placeholder-slate-500 rounded-2xl py-3 sm:py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all duration-300"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={isLoading || !email}
            className="w-full bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-semibold py-3 sm:py-4 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-cyan-500/30 disabled:shadow-none mb-4 cursor-pointer"
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

      {showNotice && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md rounded-2xl border border-slate-800/80 bg-slate-900/90 shadow-2xl">
            <div className="px-6 py-4 border-b border-slate-800/70">
              <h3 className="text-lg font-semibold text-white">Email Sent</h3>
            </div>
            <div className="px-6 py-4">
              <p className="text-sm text-slate-300">{noticeMessage}</p>
            </div>
            <div className="px-6 py-4 border-t border-slate-800/70 flex justify-end">
              <button
                onClick={() => {
                  setShowNotice(false);
                  setIsSubmitted(true);
                }}
                className="px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-200 hover:bg-cyan-500/30 transition cursor-pointer"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
