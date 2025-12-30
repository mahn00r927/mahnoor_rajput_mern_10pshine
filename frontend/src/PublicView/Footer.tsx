export const Footer: React.FC = () => {
  return (
    <footer className=" border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3">
            <div className="bg-linear-to-br from-blue-500 to-blue-600 p-2.5 rounded-xl shadow-lg shadow-blue-500/30">
              <svg
                className="w-5 h-5 text-white"
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
              <span className="text-xl font-bold text-white block">
                SmartNotes
              </span>
              <p className="text-white mt-1">Smarter notes, better ideas</p>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-gray-400 text-sm">
            © 2025 SmartNotes. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
