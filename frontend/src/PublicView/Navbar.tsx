import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const Navbar: React.FC<{ toggleTheme: () => void }> = ({ toggleTheme }) => {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    // Default to LIGHT if no theme is set
    setIsDark(theme === "dark");
  }, []);

  const handleToggle = () => {
    toggleTheme();
    setIsDark(!isDark);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/95 dark:bg-black/80 transition-colors duration-300 border-b border-gray-200 dark:border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between py-3 sm:py-4">

          {/* Logo */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2.5 sm:p-3 rounded-2xl shadow-lg shadow-blue-500/30">
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 text-white"
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

            <span className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight whitespace-nowrap transition-colors duration-300">
              Smart Notes
            </span>
          </div>

          {/* Right side: Theme Toggle + Sign In */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={handleToggle}
              className="rounded-full p-2 sm:p-2.5
                bg-gray-100 
                hover:bg-gray-200
                dark:bg-white/10 
                dark:hover:bg-white/20
                hover:scale-110 transition-all duration-300
                text-xl sm:text-2xl"
              aria-label="Toggle theme"
            >
              {isDark ? '☀️' : '🌙'}
            </button>

            {/* Sign In Button */}
            <button
              onClick={() => navigate('/login')}
              className="bg-gradient-to-r from-blue-500 to-blue-600 
                hover:from-blue-600 hover:to-blue-700 
                text-white font-semibold 
                px-4 py-2 sm:px-6 sm:py-2.5 
                rounded-full 
                transition-all duration-300 
                hover:scale-105 hover:shadow-lg hover:shadow-blue-500/50
                text-sm sm:text-base"
            >
              Sign In
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
};