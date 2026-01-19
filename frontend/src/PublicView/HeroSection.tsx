import { useNavigate } from "react-router-dom";

export const HeroSection: React.FC = () => {
  const nav = useNavigate();

  return (
    <section
      aria-label="Hero section"
      className="
        relative overflow-hidden
        flex items-center justify-center
        min-h-screen
        px-4 sm:px-6
        pt-24 sm:pt-28
        pb-24 sm:pb-32
      "
    >
      {/* Decorative Background Elements */}
      <div className="absolute top-1/4 left-4 sm:left-10 w-56 sm:w-72 h-56 sm:h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-4 sm:right-10 w-72 sm:w-96 h-72 sm:h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>

      <div className="max-w-5xl mx-auto text-center relative z-10">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6 sm:mb-8">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span className="text-blue-300 text-xs sm:text-sm font-medium">
            Beautifully simple note-taking
          </span>
        </div>

        {/* Main Heading */}
        <h1 className="font-bold mb-5 sm:mb-6">
          <span className="block text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-white mb-2">
            Where your
          </span>
          <span className="block text-4xl sm:text-6xl md:text-7xl lg:text-8xl bg-linear-to-r from-blue-400 via-blue-500 to-cyan-400 text-transparent bg-clip-text">
            ideas come alive
          </span>
        </h1>

        {/* Subheading */}
        <p className="text-gray-400 text-base sm:text-lg md:text-xl max-w-3xl mx-auto mb-8 sm:mb-12 leading-relaxed">
          A refined space for capturing thoughts, organizing projects, and
          turning scattered ideas into focused action.
        </p>

        {/* CTA Button */}
        <button
          onClick={() => nav("/login")}
          className="
            group inline-flex items-center gap-3
            bg-linear-to-r from-blue-500 to-blue-600
            hover:from-blue-600 hover:to-blue-700
            text-white font-semibold
            px-6 py-3 sm:px-8 sm:py-4
            rounded-full
            text-base sm:text-lg
            transition-all duration-300
            hover:scale-105
            hover:shadow-2xl hover:shadow-blue-500/50
          "
        >
          Start Writing
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </button>
      </div>
    </section>
  );
};
