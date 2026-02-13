export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-gray-300 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex flex-col md:flex-row items-center md:justify-between gap-4 text-center md:text-left">

          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 sm:p-2.5 rounded-xl shadow-lg shadow-blue-500/30">
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 text-white"
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

            <div>
              <span className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white block transition-colors duration-300">
                Smart Notes
              </span>
              <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mt-0.5 transition-colors duration-300">
                Smarter notes, better ideas
              </p>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-gray-500 dark:text-gray-500 text-xs sm:text-sm">
            © 2026 SmartNotes. All rights reserved.
          </div>

        </div>
      </div>
    </footer>
  );
};