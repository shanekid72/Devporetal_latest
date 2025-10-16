import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import D9AnimatedIcon from './D9AnimatedIcon';

interface D9AskWidgetProps {
  url: string;
  className?: string;
}

const D9AskWidget: React.FC<D9AskWidgetProps> = ({ 
  url, 
  className = '' 
}) => {
  const widgetRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [showHelperText, setShowHelperText] = useState(false);

  useEffect(() => {
    // Detect reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion || !buttonRef.current || !widgetRef.current) {
      return;
    }

    const button = buttonRef.current;
    const widget = widgetRef.current;

    // Create GSAP context for cleanup
    const ctx = gsap.context(() => {
      // Entrance animation - slide in from right with delay
      gsap.from(widget, {
        opacity: 0,
        x: 100,
        duration: 0.8,
        ease: 'back.out(1.2)',
        delay: 1.0,
      });

      // Continuous floating animation
      gsap.to(widget, {
        y: -8,
        duration: 2.5,
        ease: 'power2.inOut',
        yoyo: true,
        repeat: -1,
        delay: 1.5,
      });

      // Gentle rotation animation
      gsap.to(widget, {
        rotation: 2,
        duration: 4,
        ease: 'power2.inOut',
        yoyo: true,
        repeat: -1,
        delay: 2.0,
      });

      // Breathing pulse animation (every 3 seconds)
      const breathingPulse = () => {
        gsap.to(button, {
          scale: 1.05,
          duration: 0.6,
          ease: 'power2.inOut',
          yoyo: true,
          repeat: 1,
          onComplete: () => {
            // Schedule next pulse
            setTimeout(breathingPulse, 3000);
          }
        });
      };

      // Start breathing pulse after entrance
      setTimeout(breathingPulse, 2000);

      // Periodic helper text display
      const showHelper = () => {
        setShowHelperText(true);
        setTimeout(() => setShowHelperText(false), 3000);
        // Schedule next helper text
        setTimeout(showHelper, 15000); // Every 15 seconds
      };
      setTimeout(showHelper, 5000); // First helper text after 5 seconds

      // Enhanced hover animations
      const handleMouseEnter = () => {
        gsap.to(button, {
          scale: 1.1,
          duration: 0.3,
          ease: 'power2.out',
        });
        gsap.to(widget, {
          y: -12,
          duration: 0.3,
          ease: 'power2.out',
        });
        // Add glow effect
        gsap.to(button, {
          boxShadow: '0 0 30px rgba(147, 51, 234, 0.4), 0 0 60px rgba(147, 51, 234, 0.2)',
          duration: 0.3,
        });
      };

      const handleMouseLeave = () => {
        gsap.to(button, {
          scale: 1,
          duration: 0.3,
          ease: 'power2.out',
        });
        gsap.to(widget, {
          y: -8,
          duration: 0.3,
          ease: 'power2.out',
        });
        // Remove glow effect
        gsap.to(button, {
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          duration: 0.3,
        });
      };

      // Click animation
      const handleMouseDown = () => {
        gsap.to(button, {
          scale: 0.95,
          duration: 0.1,
          ease: 'power2.out',
        });
      };

      const handleMouseUp = () => {
        gsap.to(button, {
          scale: 1.1,
          duration: 0.1,
          ease: 'power2.out',
        });
      };

      // Add event listeners
      button.addEventListener('mouseenter', handleMouseEnter);
      button.addEventListener('mouseleave', handleMouseLeave);
      button.addEventListener('mousedown', handleMouseDown);
      button.addEventListener('mouseup', handleMouseUp);

      // Cleanup event listeners
      return () => {
        button.removeEventListener('mouseenter', handleMouseEnter);
        button.removeEventListener('mouseleave', handleMouseLeave);
        button.removeEventListener('mousedown', handleMouseDown);
        button.removeEventListener('mouseup', handleMouseUp);
      };
    }, widgetRef);

    return () => ctx.revert();
  }, []);

  const handleClick = () => {
    // Open URL in new tab with security
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const widgetContent = (
    <motion.div
      ref={widgetRef}
      className={`fixed right-6 top-1/2 -translate-y-1/2 z-[9999] ${className}`}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      style={{ position: 'fixed' }}
    >
      {/* Helper Text Badge */}
      {showHelperText && (
        <motion.div
          initial={{ opacity: 0, x: 20, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 20, scale: 0.8 }}
          className="absolute -left-48 top-1/2 -translate-y-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg whitespace-nowrap"
        >
          <div className="flex items-center gap-2">
            <span>💬</span>
            <span>AI Docs Assistant</span>
          </div>
          {/* Arrow pointing to button */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 w-0 h-0 border-l-4 border-l-purple-600 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
        </motion.div>
      )}

      <button
        ref={buttonRef}
        onClick={handleClick}
        className="
          flex flex-col items-center justify-center gap-3
          p-6
          rounded-3xl
          shadow-2xl
          backdrop-blur-sm
          bg-white dark:bg-gray-800
          hover:bg-gray-50 dark:hover:bg-gray-700
          transition-all duration-300
          focus:outline-none focus:ring-4 focus:ring-purple-500/50 focus:ring-offset-2
          group
          relative
          overflow-hidden
        "
        style={{
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        }}
        aria-label="D9Hub - AI Documentation Assistant"
        title="Ask D9Hub anything about our API documentation"
      >
        {/* Animated Icon - Much Larger */}
        <D9AnimatedIcon size="5rem" className="flex-shrink-0" />
        
        {/* Text Below Icon */}
        <span className="text-sm font-bold text-gray-800 dark:text-white tracking-wide">
          D9Hub
        </span>

        {/* Subtle gradient overlay for depth */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
      </button>
    </motion.div>
  );

  // Render directly to body using portal to avoid transform issues
  return typeof document !== 'undefined' 
    ? createPortal(widgetContent, document.body)
    : null;
};

export default D9AskWidget;
