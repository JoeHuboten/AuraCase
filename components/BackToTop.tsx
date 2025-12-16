'use client';

import { useState, useEffect } from 'react';
import { FiArrowUp } from 'react-icons/fi';

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const toggleVisibility = () => {
      const scrolled = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrolled / maxScroll) * 100;
      
      setScrollProgress(progress);
      setIsVisible(scrolled > 300);
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`
        fixed bottom-6 left-6 z-50 group
        w-12 h-12 rounded-2xl
        bg-primary-light/80 backdrop-blur-xl border border-white/10
        flex items-center justify-center
        transition-all duration-500 ease-out
        hover:bg-accent/20 hover:border-accent/30 hover:scale-110
        hover:shadow-lg hover:shadow-accent/20
        ${isVisible 
          ? 'translate-y-0 opacity-100 pointer-events-auto' 
          : 'translate-y-16 opacity-0 pointer-events-none'
        }
      `}
      aria-label="Back to top"
    >
      {/* Progress ring */}
      <svg
        className="absolute inset-0 w-full h-full -rotate-90"
        viewBox="0 0 48 48"
      >
        <circle
          cx="24"
          cy="24"
          r="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-white/10"
        />
        <circle
          cx="24"
          cy="24"
          r="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="text-accent transition-all duration-300"
          strokeDasharray={`${scrollProgress * 1.256} 125.6`}
        />
      </svg>
      
      <FiArrowUp 
        className="w-5 h-5 text-white group-hover:text-accent transition-all duration-300 group-hover:-translate-y-0.5" 
      />
    </button>
  );
};

export default BackToTop;
