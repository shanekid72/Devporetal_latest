import React from 'react';

interface D9AnimatedIconProps {
  size?: string; // e.g., '2.5rem', '3rem'
  className?: string;
}

const D9AnimatedIcon: React.FC<D9AnimatedIconProps> = ({ 
  size = '2.5rem', 
  className = '' 
}) => {
  // Detect reduced motion preference
  const prefersReducedMotion = 
    typeof window !== 'undefined' 
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
      : false;

  return (
    <div 
      className={`relative flex items-center justify-center rounded-full ${className}`}
      style={{ 
        width: size, 
        height: size,
        boxShadow: '-8px -8px 16px rgba(255,255,255,0.6), 8px 8px 16px rgba(94, 104, 121, 0.2), inset -2px -2px 4px rgba(255,255,255,0.3)'
      }}
      aria-hidden="true"
    >
      {/* Center circle with enhanced neomorphic styling */}
      <div 
        className="absolute bg-gray-100 dark:bg-gray-800 rounded-full z-10"
        style={{
          width: `calc(${size} * 0.35)`,
          height: `calc(${size} * 0.35)`,
          boxShadow: 'inset -6px -6px 12px rgba(255,255,255,0.6), inset 6px 6px 12px rgba(94,104,121,0.3)'
        }}
      />
      
      {/* Spinning gradient ring with enhanced depth */}
      <div 
        className={`rounded-full ${prefersReducedMotion ? '' : 'd9-spin'}`}
        style={{
          width: '85%',
          height: '85%',
          background: 'linear-gradient(135deg, rgb(89, 92, 252), rgb(147, 51, 234), rgb(226, 57, 241))',
          boxShadow: '0 0 20px rgba(147, 51, 234, 0.3)'
        }}
      />
    </div>
  );
};

export default D9AnimatedIcon;
