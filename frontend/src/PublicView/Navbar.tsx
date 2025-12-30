import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-linear-to-b from-black/80 to-transparent backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo  */}
          <div className="flex items-center gap-3">
            <div className="bg-linear-to-br from-blue-500 to-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-500/30">
              <svg 
                className="w-6 h-6 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" 
                />
              </svg>
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">
              SmartNotes
            </span>
          </div>

          {/* Sign In Button */}
          <button
            onClick={() => navigate('/login')}
            className="bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-6 py-2.5 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/50"
          >
            Sign In
          </button>
        </div>
      </div>
    </nav>
  );
};
