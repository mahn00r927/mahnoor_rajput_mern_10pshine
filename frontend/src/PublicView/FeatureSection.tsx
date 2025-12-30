import React from 'react';
export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: (
        <svg 
          className="w-7 h-7 text-white" 
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
      ),
      title: 'Distraction-free',
      description: 'A clean canvas for your thoughts. No clutter, just clarity.',
    },
    {
      icon: (
        <svg 
          className="w-7 h-7 text-white" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4 7h16M4 12h16M4 17h16" 
          />
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
      description: 'Folders and tags that work together seamlessly.',
    },
    {
      icon: (
        <svg 
          className="w-7 h-7 text-white" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
          />
        </svg>
      ),
      title: 'Private',
      description: 'Your notes are encrypted and belong only to you.',
    },
  ];

  return (
    <section className="min-h-screen  flex items-center justify-center px-6 py-20">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Designed for focus
          </h2>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
            Every feature crafted to help you think clearly and work efficiently.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group text-center"
            >
              {/* Icon Container */}
              <div className="inline-flex items-center justify-center mb-6">
                <div className="bg-linear-to-br from-blue-500/20 to-blue-600/20 p-6 rounded-3xl border border-blue-500/20 group-hover:border-blue-500/40 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-blue-500/20">
                  {feature.icon}
                </div>
              </div>

              {/* Feature Title */}
              <h3 className="text-2xl font-bold text-white mb-4">
                {feature.title}
              </h3>

              {/* Feature Description */}
              <p className="text-gray-400 text-base leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
