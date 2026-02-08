import React, { useEffect, useRef, useState } from 'react';
import "../App.css"
export const FeaturesSection: React.FC = () => {
  const revealRef = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);
  const features = [
    {
      icon: (
        <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
          />
        </svg>
      ),
      title: 'Rich Note Editor',
      description: 'Write beautiful notes with our powerful intuitive editor. Format text, add code snippets, and more.',
      // Custom Colors for this feature
      gradient: 'from-blue-500 to-blue-600',
      shadow: 'shadow-blue-500/20',
      hoverShadow: 'shadow-blue-500/30'
    },
    {
      icon: (
        <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7h16M4 12h16M4 17h16" />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 7v10M12 7v10M17 7v10"
            opacity="0.4"
          />
        </svg>
      ),
      title: 'Organized',
      description: 'Folders that work together seamlessly.',
      // Custom Colors for this feature (Purple)
      gradient: 'from-violet-300 to-purple-600',
      shadow: 'shadow-violet-500/20',
      hoverShadow: 'shadow-violet-500/30'
    },
    {
      icon: (
        <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      ),
      title: 'Private',
      description: 'Your notes are belong only to you.',
      // Custom Colors for this feature (Teal/Green)
      gradient: 'from-teal-500 to-emerald-600',
      shadow: 'shadow-emerald-500/20',
      hoverShadow: 'shadow-emerald-500/30'
    },
  ];

  useEffect(() => {
    if (!revealRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(revealRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="flex items-center justify-center px-4 sm:px-6 py-16 sm:py-24 relative z-10">
      <div
        ref={revealRef}
        className={`max-w-6xl mx-auto w-full reveal reveal-delay-sm ${inView ? "in-view" : ""}`}
      >

        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-20 reveal-item reveal-delay-sm">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight transition-colors duration-300">
            Everything you need
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-light transition-colors duration-300">
            Powerful features to organize your life, wrapped in a simple interface.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 reveal-item reveal-delay-md">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="group relative 
                bg-white/60 dark:bg-white/5
                border border-gray-100 dark:border-white/10
                rounded-3xl p-8 sm:p-10
                shadow-lg shadow-gray-200/50 dark:shadow-none
                hover:shadow-xl hover:-translate-y-2
                transition-all duration-500
                text-center"
            >
              {/* Icon Container - Colors applied dynamically here */}
              <div className="inline-flex items-center justify-center mb-6">
                <div className={`
                  bg-gradient-to-br ${feature.gradient}
                  p-4 rounded-2xl
                  shadow-lg ${feature.shadow}
                  group-hover:scale-110 group-hover:${feature.hoverShadow}
                  transition-all duration-300
                `}>
                  {feature.icon}
                </div>
              </div>

              {/* Content */}
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed transition-colors duration-300">
                {feature.description}
              </p>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
};