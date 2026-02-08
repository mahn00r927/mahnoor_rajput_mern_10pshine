import React, { useState } from 'react';
import "../App.css"
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
export const CTASection: React.FC = () => {
  const nav = useNavigate();
  const [showRegisteredModal, setShowRegisteredModal] = useState(false);

  const handleGetStarted = () => {
    const token = localStorage.getItem('token');
    if (token) {
      setShowRegisteredModal(true);
      return;
    }
    nav('/signup');
  };

  return (
    <section className="flex items-center justify-center px-4 sm:px-6 py-20 sm:py-24">
      <div className="max-w-3xl mx-auto w-full text-center">

        {/* CTA Card - Reference Style (Clean White with Soft Shadow) */}
        <div className="
          relative 
          bg-white dark:bg-gray-900/60
          backdrop-blur-xl
          rounded-[2.5rem] sm:rounded-[3rem]
          border border-gray-100 dark:border-white/10
          shadow-[0_25px_50px_-12px_rgba(0,0,0,0.1)] dark:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]
          p-10 sm:p-14 md:p-16
          transition-all duration-300
        ">

          {/* Optional Subtle Blue Glow inside card (Very faint) */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-blue-100 blur-[60px] opacity-60 dark:hidden pointer-events-none"></div>

          {/* Heading */}
          <h3 className="relative z-10 text-2xl sm:text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight transition-colors duration-300 line-height-2">
            Ready to Start?
          </h3>

          {/* Description */}
          <p className="relative z-10 text-lg sm:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-10 sm:mb-12 transition-colors duration-300 leading-relaxed">
            Join thousands of happy users who have transformed how they capture and organize ideas.
          </p>

          {/* CTA Button */}
          <button
            onClick={handleGetStarted}
            className="
              relative z-10
              bg-gradient-to-r from-blue-600 to-blue-500
              hover:from-blue-700 hover:to-blue-600
              text-white font-semibold
              px-8 py-4 sm:px-10 sm:py-5
              rounded-full
              text-base sm:text-lg
              shadow-xl shadow-blue-500/30
              hover:shadow-2xl hover:shadow-blue-500/50
              hover:-translate-y-1
              transition-all duration-300
              cursor-pointer
            "
          >
            Get Started 
          </button>

        </div>
      </div>

      {showRegisteredModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-2xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-slate-700/50 flex items-center justify-between bg-blue-500/10">
              <h3 className="text-lg font-semibold text-blue-400">Already Registered</h3>
              <button
                onClick={() => setShowRegisteredModal(false)}
                className="text-slate-400 hover:text-white transition-colors"
                aria-label="Close dialog"
              >
                <X size={20} />
              </button>
            </div>
            <div className="px-6 py-4">
              <p className="text-slate-300 text-sm leading-relaxed">
                You are already registered. Go to your dashboard to continue.
              </p>
            </div>
            <div className="px-6 py-4 border-t border-slate-700/50 flex justify-end gap-3">
              <button
                onClick={() => setShowRegisteredModal(false)}
                className="px-4 py-2 rounded-lg font-medium bg-slate-700/50 text-slate-200 hover:bg-slate-700 transition"
              >
                Close
              </button>
              <button
                onClick={() => nav('/dashboard')}
                className="px-4 py-2 rounded-lg font-medium bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};