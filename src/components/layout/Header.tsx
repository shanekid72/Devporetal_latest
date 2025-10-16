import { Moon, Sun, Menu, Search, X, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Theme } from '../../types';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  theme: Theme;
  onThemeToggle: () => void;
  onMenuClick: () => void;
}

// const countries: Country[] = [
//   { code: 'UAE', name: 'United Arab Emirates', flag: '🇦🇪', apiVersion: 'v2.0-UAE' },
//   { code: 'KSA', name: 'Saudi Arabia', flag: '🇸🇦', apiVersion: 'v2.0-KSA' },
//   { code: 'USA', name: 'United States', flag: '🇺🇸', apiVersion: 'v1.0-USA' },
// ];

const Header = ({ theme, onThemeToggle, onMenuClick }: HeaderProps) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  
  const handleBack = () => {
    // Use browser history to go back to previous page
    // If no history exists, go to portal overview as fallback
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/portal-overview');
    }
  };
  
  // const selectedCountryData = countries.find(c => c.code === selectedCountry) || countries[0];
  
  // Mock search results - in a real app, this would query your API endpoints
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const mockResults = [
      { 
        type: 'endpoint', 
        title: 'Create Transaction',
        path: '/api-reference/remittance',
        description: 'POST /amr/ras/api/v1_0/ras/createtransaction' 
      },
      { 
        type: 'endpoint', 
        title: 'Get Exchange Rates',
        path: '/api-reference/masters',
        description: 'GET /raas/masters/v1/rates' 
      },
      { 
        type: 'guide', 
        title: 'Authentication Guide',
        path: '/authentication',
        description: 'How to authenticate with the Digit9 worldAPI' 
      },
    ].filter(item => 
      item.title.toLowerCase().includes(query) || 
      item.description.toLowerCase().includes(query)
    );
    
    setSearchResults(mockResults);
  }, [searchQuery]);
  
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchResults.length > 0) {
      navigate(searchResults[0].path);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };
  
  const closeSearch = () => {
    setSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 px-6 py-4 glass-surface backdrop-blur-sm shadow-modern">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <motion.button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 interactive-glow"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Menu className="h-6 w-6" />
          </motion.button>

          {/* Back button */}
          <motion.button
            onClick={handleBack}
            className="professional-btn-secondary inline-flex items-center gap-2 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-all duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Go back"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back</span>
          </motion.button>

          {/* Logo */}
          <div className="flex items-center">
            <img 
              src="/d9wplogo.png" 
              alt="D9 Logo" 
              className="h-20 w-auto"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Search button - Enhanced */}
          <motion.button
            onClick={() => setSearchOpen(true)}
            className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-800 transition-all duration-200 interactive-glow"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Search documentation"
          >
            <Search className="h-4 w-4" />
          </motion.button>
          
          {/* Theme toggle - Modern Enhanced */}
          <motion.button
            onClick={onThemeToggle}
            className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-800 transition-all duration-200 interactive-glow"
            whileHover={{ scale: 1.05, rotate: 180 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.3 }}
            aria-label={theme.mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: theme.mode === 'light' ? 0 : 180 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              {theme.mode === 'light' ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </motion.div>
          </motion.button>
        </div>
      </div>
      
      {/* Global search overlay - Enhanced */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div 
            className="fixed inset-0 z-50 bg-gray-900 bg-opacity-50 backdrop-blur-md flex items-start justify-center pt-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSearch}
          >
            <motion.div 
              className="w-full max-w-2xl glass-card bg-white dark:bg-gray-800 rounded-lg shadow-modern overflow-hidden"
              initial={{ y: -20, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -20, opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              onClick={e => e.stopPropagation()}
            >
              <form onSubmit={handleSearchSubmit} className="relative">
                <div className="flex items-center border-b border-gray-200 dark:border-gray-700">
                  <div className="pl-4">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for endpoints, guides, and more..."
                    className="w-full py-4 pl-3 pr-12 text-gray-900 dark:text-gray-100 bg-transparent focus:outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500 font-body"
                  />
                  <motion.button
                    type="button"
                    onClick={closeSearch}
                    className="absolute right-4 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors interactive-glow"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="h-5 w-5 text-gray-400" />
                  </motion.button>
                </div>
                
                {searchResults.length > 0 && (
                  <motion.div 
                    className="max-h-80 overflow-y-auto p-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider px-3 py-2 font-display">
                      Results
                    </div>
                    <ul>
                      {searchResults.map((result, index) => (
                        <motion.li 
                          key={index}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2, delay: index * 0.1 }}
                        >
                          <motion.a
                            href={result.path}
                            className="flex flex-col px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-all duration-200"
                            onClick={() => {
                              navigate(result.path);
                              closeSearch();
                            }}
                            whileHover={{ x: 4 }}
                          >
                            <span className="font-medium text-gray-900 dark:text-gray-100 font-display">{result.title}</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400 font-body">{result.description}</span>
                          </motion.a>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                )}
                
                {searchQuery.trim().length > 1 && searchResults.length === 0 && (
                  <motion.div 
                    className="p-6 text-center text-gray-500 dark:text-gray-400 font-body"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    No results found for "<span className="font-display text-gray-700 dark:text-gray-300">{searchQuery}</span>"
                  </motion.div>
                )}
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header; 
