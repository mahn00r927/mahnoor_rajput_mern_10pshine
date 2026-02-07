import React from 'react';

export const FeaturesSection: React.FC = () => {
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
      title: 'Distraction-free',
      description: 'A clean canvas for your thoughts. No clutter, just clarity.',
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
      description: 'Your notes belongs only to you.',
    },
  ];

  return (
    <section className="flex items-center justify-center px-4 sm:px-6 py-16 sm:py-20">
      <div className="max-w-6xl mx-auto">

        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6">
            Designed for focus
          </h2>
          <p className="text-gray-400 text-base sm:text-lg md:text-xl max-w-2xl mx-auto">
            Every feature crafted to help you think clearly and work efficiently.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
          {features.map((feature, index) => (
            <div key={index} className="group text-center">

              {/* Icon */}
              <div className="inline-flex items-center justify-center mb-5 sm:mb-6">
                <div className="bg-linear-to-br from-blue-500/20 to-blue-600/20 p-4 sm:p-6 rounded-3xl border border-blue-500/20 transition-all duration-300 group-hover:border-blue-500/40 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-blue-500/20">
                  {feature.icon}
                </div>
              </div>

              {/* Title */}
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-sm mx-auto">
                {feature.description}
              </p>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
