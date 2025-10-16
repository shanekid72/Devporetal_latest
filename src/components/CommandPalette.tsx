import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowRight, Hash, Book, Code, Settings, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Command {
  id: string;
  title: string;
  description?: string;
  icon: React.ReactNode;
  action: () => void;
  category: 'navigation' | 'documentation' | 'api' | 'external';
  keywords: string[];
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Define all available commands
  const commands: Command[] = [
    // Navigation
    {
      id: 'nav-home',
      title: 'Introduction',
      description: 'Go to the introduction page',
      icon: <Book className="h-4 w-4" />,
      action: () => { navigate('/introduction'); onClose(); },
      category: 'navigation',
      keywords: ['home', 'intro', 'start', 'beginning']
    },
    {
      id: 'nav-auth',
      title: 'Authentication',
      description: 'Learn about API authentication',
      icon: <Settings className="h-4 w-4" />,
      action: () => { navigate('/authentication'); onClose(); },
      category: 'navigation',
      keywords: ['auth', 'login', 'token', 'security']
    },
    {
      id: 'nav-api-auth',
      title: 'API Reference - Auth',
      description: 'Authentication endpoints',
      icon: <Code className="h-4 w-4" />,
      action: () => { navigate('/api-reference/auth'); onClose(); },
      category: 'api',
      keywords: ['api', 'auth', 'endpoints', 'reference']
    },
    {
      id: 'nav-api-masters',
      title: 'API Reference - Masters',
      description: 'Master data endpoints',
      icon: <Code className="h-4 w-4" />,
      action: () => { navigate('/api-reference/masters'); onClose(); },
      category: 'api',
      keywords: ['api', 'masters', 'data', 'rates']
    },
    {
      id: 'nav-api-remittance',
      title: 'API Reference - Remittance',
      description: 'Money transfer endpoints',
      icon: <Code className="h-4 w-4" />,
      action: () => { navigate('/api-reference/remittance'); onClose(); },
      category: 'api',
      keywords: ['api', 'remittance', 'transfer', 'money']
    },
    {
      id: 'nav-api-customer',
      title: 'API Reference - Customer',
      description: 'Customer management endpoints',
      icon: <Code className="h-4 w-4" />,
      action: () => { navigate('/api-reference/customer'); onClose(); },
      category: 'api',
      keywords: ['api', 'customer', 'user', 'management']
    },
    {
      id: 'nav-swagger',
      title: 'API Specification',
      description: 'Interactive Swagger documentation',
      icon: <ExternalLink className="h-4 w-4" />,
      action: () => { navigate('/api-reference-swagger'); onClose(); },
      category: 'documentation',
      keywords: ['swagger', 'spec', 'interactive', 'docs']
    },
    {
      id: 'nav-sandbox',
      title: 'Sandbox Testing',
      description: 'Test API endpoints',
      icon: <Hash className="h-4 w-4" />,
      action: () => { navigate('/sandbox-testing'); onClose(); },
      category: 'api',
      keywords: ['sandbox', 'test', 'try', 'playground']
    }
  ];

  // Filter commands based on query
  const filteredCommands = commands.filter(command => {
    const searchStr = query.toLowerCase();
    return (
      command.title.toLowerCase().includes(searchStr) ||
      command.description?.toLowerCase().includes(searchStr) ||
      command.keywords.some(keyword => keyword.toLowerCase().includes(searchStr))
    );
  });

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredCommands[selectedIndex]) {
            filteredCommands[selectedIndex].action();
          }
          break;
        case 'Escape':
          onClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredCommands, onClose]);

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const getCategoryColor = (category: Command['category']) => {
    switch (category) {
      case 'navigation': return 'text-blue-400';
      case 'api': return 'text-green-400';
      case 'documentation': return 'text-purple-400';
      case 'external': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getCategoryBg = (category: Command['category']) => {
    switch (category) {
      case 'navigation': return 'bg-blue-500/10';
      case 'api': return 'bg-green-500/10';
      case 'documentation': return 'bg-purple-500/10';
      case 'external': return 'bg-yellow-500/10';
      default: return 'bg-gray-500/10';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/60 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-2xl mx-4 glass-card bg-white dark:bg-gray-900 rounded-lg shadow-modern overflow-hidden"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={e => e.stopPropagation()}
          >
            {/* Search Input */}
            <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <Search className="h-5 w-5 text-gray-400 mr-3" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search for commands, pages, or actions..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none font-body"
              />
              <div className="flex items-center space-x-1 text-xs text-gray-400 font-mono-modern">
                <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">↑</kbd>
                <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">↓</kbd>
                <span>navigate</span>
                <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">↵</kbd>
                <span>select</span>
              </div>
            </div>

            {/* Commands List */}
            <div className="max-h-96 overflow-y-auto">
              {filteredCommands.length > 0 ? (
                <div className="p-2">
                  {filteredCommands.map((command, index) => (
                    <motion.div
                      key={command.id}
                      className={`flex items-center p-3 rounded-md transition-all duration-200 cursor-pointer ${
                        index === selectedIndex
                          ? 'bg-blue-50 dark:bg-blue-950/50 border-l-4 border-blue-500'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                      }`}
                      onClick={() => command.action()}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <motion.div
                        className={`flex items-center justify-center w-8 h-8 rounded-md mr-3 ${getCategoryBg(command.category)}`}
                        whileHover={{ scale: 1.1 }}
                      >
                        <div className={getCategoryColor(command.category)}>
                          {command.icon}
                        </div>
                      </motion.div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 font-display">
                          {command.title}
                        </p>
                        {command.description && (
                          <p className="text-xs text-gray-600 dark:text-gray-400 truncate font-body">
                            {command.description}
                          </p>
                        )}
                      </div>

                      {index === selectedIndex && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="ml-2"
                        >
                          <ArrowRight className="h-4 w-4 text-blue-500" />
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  className="p-8 text-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <p className="text-gray-500 dark:text-gray-400 font-body">
                    No commands found for "<span className="font-display font-medium">{query}</span>"
                  </p>
                </motion.div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 font-body">
                <span>Type to search • Use arrow keys to navigate</span>
                <div className="flex items-center space-x-1">
                  <span>Press</span>
                  <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-xs font-mono-modern">ESC</kbd>
                  <span>to close</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
