import React from 'react';
import { useNavigate } from 'react-router-dom';
export const CTASection: React.FC = () => {
  const nav=useNavigate();
  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-20">
      <div className="max-w-4xl mx-auto">
        {/* CTA Card */}
        <div className="bg-linear-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-xl rounded-3xl border border-blue-500/10 p-12 md:p-16 text-center shadow-2xl shadow-blue-500/5">
          {/* Icon */}
          <div className="inline-flex items-center justify-center mb-8">
            <svg 
              className="w-16 h-16 text-blue-500" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M13 10V3L4 14h7v7l9-11h-7z" 
              />
            </svg>
          </div>

          {/* Heading */}
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to start?
          </h2>

          {/* Description */}
          <p className="text-gray-400 text-lg md:text-xl mb-4 max-w-2xl mx-auto">
            Join thousands who've found their perfect writing space.
          </p>
          <p className="text-gray-400 text-lg md:text-xl mb-10">
            Free to start, no credit card required.
          </p>

          {/* CTA Button */}
          <button className="bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-10 py-4 rounded-full text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/50"
          onClick={()=>{nav('/signup')}}>
            Create Free Account
          </button>
        </div>
      </div>
    </section>
  );
};