import React, { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

 
  const handleSubmit = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/forgot-password/request-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      alert(data.message);
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  const handleBackToLogin = (): void => {
    // Navigate back to login
    setIsSubmitted(false);
    setEmail('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-linear-to-br from-slate-800 to-slate-900 rounded-3xl p-8 shadow-2xl">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-6">
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
            
            <h1 className="text-3xl font-bold text-white mb-3">
              Check your email
            </h1>
            
            <p className="text-slate-400 mb-8 leading-relaxed">
              We've sent a password reset link to<br />
              <span className="text-white font-medium">{email}</span>
            </p>
            
            <button
              onClick={handleBackToLogin}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-600/30"
            >
              Back to Sign in
            </button>
            
            <p className="text-slate-400 text-sm mt-6">
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

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-linear-to-br from-slate-800 to-slate-900 rounded-3xl p-8 shadow-2xl">
        <button
          onClick={handleBackToLogin}
          className="flex items-center text-slate-400 hover:text-white transition-colors mb-6 group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back</span>
        </button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-3">
            Forgot password?
          </h1>
          <p className="text-slate-400 leading-relaxed">
            No worries, we'll send you reset instructions
          </p>
        </div>

        <div>
          <div className="mb-6">
            <label htmlFor="email" className="block text-slate-300 font-medium mb-3">
              Email
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <Mail className="w-5 h-5" />
              </div>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full bg-slate-700/50 border border-slate-600 text-white placeholder-slate-400 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isLoading || !email}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-600/30 disabled:shadow-none mb-6"
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