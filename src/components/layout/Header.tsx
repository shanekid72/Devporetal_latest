import { Moon, Sun, Menu, Search, X, ChevronDown, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Theme } from '../../types';
import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import clsx from 'clsx';

interface HeaderProps {
  theme: Theme;
  onThemeToggle: () => void;
  onMenuClick: () => void;
  showHamburger?: boolean;
}

// const countries: Country[] = [
//   { code: 'UAE', name: 'United Arab Emirates', flag: '🇦🇪', apiVersion: 'v2.0-UAE' },
//   { code: 'KSA', name: 'Saudi Arabia', flag: '🇸🇦', apiVersion: 'v2.0-KSA' },
//   { code: 'USA', name: 'United States', flag: '🇺🇸', apiVersion: 'v1.0-USA' },
// ];

const Header = ({ theme, onThemeToggle, onMenuClick, showHamburger = true }: HeaderProps) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [integrationHover, setIntegrationHover] = useState(false);
  const [useCaseHover, setUseCaseHover] = useState(false);
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const integrationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const useCaseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  const integrationItems = [
    { label: 'White-labelled', path: '/integration/white-labelled' },
    { label: 'LFI', path: '/integration/lfi' },
    { label: 'WPS', path: '/integration/wps' },
    { label: 'Bill Payments', path: '/integration/bill-payments' },
    { label: 'EWA', path: '/integration/ewa' },
  ];

  const useCaseItems: Array<{ label: string; path: string }> = [
    // Keep empty for future use
  ];

  const directLinks = [
    { label: 'Support', path: '/support' },
    { label: 'Documentation', path: '/documentation' },
    { label: 'Digit9.com', path: '/digit9' },
  ];
  
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

  // Handle integration dropdown hover with delay
  const handleIntegrationMouseEnter = () => {
    if (integrationTimeoutRef.current) {
      clearTimeout(integrationTimeoutRef.current);
    }
    setIntegrationHover(true);
  };

  const handleIntegrationMouseLeave = () => {
    integrationTimeoutRef.current = setTimeout(() => {
      setIntegrationHover(false);
    }, 250); // 250ms delay
  };

  // Handle use case dropdown hover with delay
  const handleUseCaseMouseEnter = () => {
    if (useCaseTimeoutRef.current) {
      clearTimeout(useCaseTimeoutRef.current);
    }
    setUseCaseHover(true);
  };

  const handleUseCaseMouseLeave = () => {
    useCaseTimeoutRef.current = setTimeout(() => {
      setUseCaseHover(false);
    }, 250); // 250ms delay
  };

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (integrationTimeoutRef.current) {
        clearTimeout(integrationTimeoutRef.current);
      }
      if (useCaseTimeoutRef.current) {
        clearTimeout(useCaseTimeoutRef.current);
      }
    };
  }, []);

  return (
    <header className="sticky top-0 z-30 w-full bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 px-6 py-3 glass-surface backdrop-blur-sm shadow-modern">
      <div className="flex items-center justify-between gap-4">
        {/* Left side: Hamburger, Logo, Home */}
        <div className="flex items-center space-x-3">
          {/* Mobile menu button - only show if showHamburger is true */}
          {showHamburger && (
            <motion.button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 interactive-glow"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Menu className="h-6 w-6" />
            </motion.button>
          )}

          {/* Logo */}
          <div className="flex items-center">
            <img 
              src="/d9wplogo.png" 
              alt="D9 Logo" 
              className="h-16 w-auto"
            />
          </div>

          {/* Home Button - show on PortalOverviewPage */}
          {location.pathname === '/portal-overview' && (
            <Link
              to="/"
              className="flex items-center space-x-2 px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 interactive-glow font-display group"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Home className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </motion.div>
              <span className="text-sm font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                Home
              </span>
            </Link>
          )}
        </div>

        {/* Middle: Navigation items - show on all pages except home */}
        {location.pathname !== '/' && (
          <div className="hidden lg:flex items-center space-x-1 flex-1 justify-center max-w-3xl">
            {/* Integration Model Dropdown */}
            <div 
              className="relative"
              onMouseEnter={handleIntegrationMouseEnter}
              onMouseLeave={handleIntegrationMouseLeave}
            >
              <button
                className={clsx(
                  'inline-flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200',
                  isActive('/integration')
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800',
                  'interactive-glow'
                )}
              >
                <span>Integration Model</span>
                <motion.div
                  animate={{ rotate: integrationHover ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="h-4 w-4" />
                </motion.div>
              </button>

              <AnimatePresence>
                {integrationHover && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.1 }}
                    className="absolute left-0 mt-2 w-48 origin-top-left rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                    onMouseEnter={handleIntegrationMouseEnter}
                    onMouseLeave={handleIntegrationMouseLeave}
                  >
                    <div className="py-1">
                      {integrationItems.map((item) => (
                        <button
                          key={item.path}
                          onClick={() => navigate(item.path)}
                          className="block w-full text-left px-4 py-2 text-sm transition-colors text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100"
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Use Case Dropdown */}
            <div 
              className="relative"
              onMouseEnter={handleUseCaseMouseEnter}
              onMouseLeave={handleUseCaseMouseLeave}
            >
              <button
                className={clsx(
                  'inline-flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200',
                  isActive('/use-case')
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800',
                  'interactive-glow'
                )}
              >
                <span>Use Case</span>
                <motion.div
                  animate={{ rotate: useCaseHover ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="h-4 w-4" />
                </motion.div>
              </button>

              <AnimatePresence>
                {useCaseHover && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.1 }}
                    className="absolute left-0 mt-2 w-48 origin-top-left rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                    onMouseEnter={handleUseCaseMouseEnter}
                    onMouseLeave={handleUseCaseMouseLeave}
                  >
                    <div className="py-1">
                      {useCaseItems.map((item) => (
                        <button
                          key={item.path}
                          onClick={() => navigate(item.path)}
                          className="block w-full text-left px-4 py-2 text-sm transition-colors text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100"
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Direct Links */}
            {directLinks.map((link) => {
              // Special handling for Digit9.com - external link
              if (link.label === 'Digit9.com') {
                return (
                  <motion.a
                    key={link.path}
                    href="https://www.digitnine.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={clsx(
                      'px-3 py-2 text-sm font-medium rounded-md transition-all duration-200',
                      'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800',
                      'interactive-glow'
                    )}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {link.label}
                  </motion.a>
                );
              }
              
              // Regular internal links
              return (
                <motion.button
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  className={clsx(
                    'px-3 py-2 text-sm font-medium rounded-md transition-all duration-200',
                    isActive(link.path)
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800',
                    'interactive-glow'
                  )}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {link.label}
                </motion.button>
              );
            })}
          </div>
        )}

        {/* Right side: Search and Theme */}
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
