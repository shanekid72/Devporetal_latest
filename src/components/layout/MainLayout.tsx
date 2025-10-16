import { ReactNode, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Header from './Header';
import Sidebar from './Sidebar';
import ScrollToTop from '../ScrollToTop';
import CommandPalette from '../CommandPalette';
import D9AskWidget from '../D9AskWidget';
import { Theme } from '../../types';

interface MainLayoutProps {
  children: ReactNode;
  theme: Theme;
  onThemeToggle: () => void;
  hideNavigation?: boolean;
}

const MainLayout = ({ 
  children, 
  theme, 
  onThemeToggle,
  hideNavigation = false,
}: MainLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Handle closing sidebar when clicking outside on mobile
  useEffect(() => {
    if (hideNavigation) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarOpen &&
        mainRef.current &&
        !mainRef.current.contains(event.target as Node)
      ) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sidebarOpen, hideNavigation]);

  // Handle Command Palette keyboard shortcut (CMD+K / Ctrl+K)
  useEffect(() => {
    if (hideNavigation) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        setCommandPaletteOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [hideNavigation]);
  
  // Initialize smooth scrolling for the main content area
  useEffect(() => {
    if (hideNavigation) return;

    const main = mainRef.current;
    if (!main) return;
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;
    
    // Initialize ScrollTrigger for this container
    const ctx = gsap.context(() => {
      ScrollTrigger.refresh();
      
      // Apply a subtle parallax effect to sections when scrolling
      const sections = main.querySelectorAll('section');
      sections.forEach((section) => {
        gsap.to(section, {
          y: 10, // Reduced parallax effect for more subtle movement
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5
          }
        });
      });
      
      // Fix for Swagger UI scrolling issues
      const fixSwaggerScrolling = () => {
        const swaggerContainers = document.querySelectorAll('.swagger-ui .opblock-body, .swagger-ui .responses-wrapper, .swagger-ui .model-box');
        swaggerContainers.forEach((container) => {
          if (container instanceof HTMLElement) {
            container.style.maxHeight = 'none';
            container.style.overflowY = 'visible';
          }
        });
      };
      
      // Run the fix initially and on resize
      fixSwaggerScrolling();
      window.addEventListener('resize', fixSwaggerScrolling);
      
      return () => {
        window.removeEventListener('resize', fixSwaggerScrolling);
      };
    }, main);
    
    return () => ctx.revert();
  }, [hideNavigation]);

  if (hideNavigation) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950">
        {children}
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white dark:bg-gray-950 relative">

      {/* Sidebar backdrop overlay (mobile) */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="fixed inset-0 z-20 lg:hidden bg-gray-900/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        className={`fixed z-30 inset-y-0 left-0 w-64 transform transition-transform duration-300 ease-in-out 
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          lg:translate-x-0 lg:static lg:inset-0 
          bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 overflow-y-auto`}
        initial={false}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </motion.div>

      {/* Main content */}
      <div ref={mainRef} className="flex-1 flex flex-col relative z-10 overflow-hidden">
        <Header
          theme={theme}
          onThemeToggle={onThemeToggle}
          onMenuClick={() => setSidebarOpen(true)}
        />
        
        <main className="flex-1 overflow-y-auto scroll-smooth relative" data-scroll>
          {/* Content Background Enhancement */}
          <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50/50 to-white dark:from-gray-950 dark:via-gray-900/50 dark:to-gray-950 pointer-events-none"></div>
          
          <motion.div
            ref={contentRef}
            className="min-h-full relative z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <motion.div
              className="min-h-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              {children}
            </motion.div>
            
            {/* Footer - Modern Enhanced */}
            <motion.footer 
              className="mt-16 py-8 px-6 border-t border-gray-200 dark:border-gray-800 glass-surface backdrop-blur-sm relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="max-w-5xl mx-auto">
                <motion.div 
                  className="flex flex-col md:flex-row justify-between items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.6 }}
                >
                  <div className="text-center md:text-left mb-4 md:mb-0">
                    <motion.p 
                      className="text-sm text-gray-600 dark:text-gray-400 font-body"
                      whileHover={{ scale: 1.02 }}
                    >
                      &copy; {new Date().getFullYear()} <span className="text-gradient font-display font-medium">Digit9 worldAPI</span>. All rights reserved.
                    </motion.p>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <motion.a 
                      href="#" 
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 font-body interactive-glow"
                      whileHover={{ scale: 1.05, x: 2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Support
                    </motion.a>
                    <motion.a 
                      href="#" 
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 font-body interactive-glow"
                      whileHover={{ scale: 1.05, x: 2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Docs
                    </motion.a>
                    <motion.a 
                      href="#" 
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 font-body interactive-glow"
                      whileHover={{ scale: 1.05, x: 2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      API Reference
                    </motion.a>
                  </div>
                </motion.div>
              </div>
            </motion.footer>
          </motion.div>
        </main>
      </div>

      {/* Scroll to Top Button */}
      <ScrollToTop />

      {/* D9 Ask Widget */}
      <D9AskWidget url="https://notebooklm.google.com/notebook/d8afa9b5-2d9e-497a-b659-a6ea4367f6d7?authuser=5" />

      {/* Command Palette */}
      <CommandPalette 
        isOpen={commandPaletteOpen} 
        onClose={() => setCommandPaletteOpen(false)} 
      />
    </div>
  );
};

export default MainLayout; 




