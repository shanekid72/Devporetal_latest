import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface AskAIProps {
  className?: string;
}

const AskAI: React.FC<AskAIProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Generate contextual prompt based on current page
  const generatePrompt = (): string => {
    const currentUrl = window.location.href;
    const pageTitle = document.title || 'API Documentation';
    
    return `Can you please help me understand this API documentation page?
Page URL: ${currentUrl}
Page Title: ${pageTitle}`;
  };
  
  // Open ChatGPT with context
  const openChatGPT = () => {
    const prompt = generatePrompt();
    const encodedPrompt = encodeURIComponent(prompt);
    const url = `https://chatgpt.com/?prompt=${encodedPrompt}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };
  
  // Open Claude with context
  const openClaude = () => {
    const prompt = generatePrompt();
    const encodedPrompt = encodeURIComponent(prompt);
    const url = `https://claude.ai/chat?prompt=${encodedPrompt}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };
  
  // Open Copilot with context
  const openCopilot = () => {
    const prompt = generatePrompt();
    const encodedPrompt = encodeURIComponent(prompt);
    const url = `https://copilot.microsoft.com/?prompt=${encodedPrompt}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  // Copy the current page content as markdown
  const copyAsMarkdown = () => {
    try {
      // Get the main content section which contains the documentation
      const mainContent = document.querySelector('main')?.innerText || document.body.innerText;
      
      // Copy to clipboard
      navigator.clipboard.writeText(mainContent)
        .then(() => {
          alert('Content copied to clipboard');
          console.log('Content copied as markdown');
        })
        .catch(err => {
          console.error('Failed to copy content:', err);
          // Fallback method for clipboard
          const textArea = document.createElement('textarea');
          textArea.value = mainContent;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
          alert('Content copied to clipboard');
        });
    } catch (error) {
      console.error('Error copying content:', error);
    }
    setIsOpen(false);
  };

  // View the current page content as markdown
  const viewAsMarkdown = () => {
    try {
      // Get the main content section which contains the documentation
      const mainContent = document.querySelector('main')?.innerText || document.body.innerText;
      
      // Create a new window with the content
      const newWindow = window.open('', '_blank');
      if (newWindow) {
        newWindow.document.write(`
          <html>
            <head>
              <title>Markdown View</title>
              <style>
                body { font-family: monospace; white-space: pre-wrap; padding: 20px; }
              </style>
            </head>
            <body>${mainContent.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</body>
          </html>
        `);
        newWindow.document.close();
      } else {
        alert('Please allow popups for this site to view content as markdown');
      }
    } catch (error) {
      console.error('Error viewing as markdown:', error);
    }
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={`relative inline-block ${className}`}>
      {/* Dropdown Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center px-4 py-2 text-sm font-medium bg-gray-800 dark:bg-gray-700 text-white dark:text-gray-200 border border-gray-700 dark:border-gray-600 rounded-md hover:bg-gray-700 dark:hover:bg-gray-600 focus:outline-none transition-colors duration-200"
        type="button"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <span>Ask AI</span>
        <ChevronDown className={`w-4 h-4 ml-2 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 z-50 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg overflow-hidden w-56">
          {/* ChatGPT Option */}
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); openChatGPT(); }}
            className="block px-4 py-3 text-sm text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-center">
              <div className="mr-3 flex-shrink-0">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="12" fill="#10A37F" />
                  <path d="M18 10.5C18 11.8807 16.8807 13 15.5 13C14.1193 13 13 11.8807 13 10.5C13 9.11929 14.1193 8 15.5 8C16.8807 8 18 9.11929 18 10.5Z" fill="white" />
                  <path d="M11 10.5C11 11.8807 9.88071 13 8.5 13C7.11929 13 6 11.8807 6 10.5C6 9.11929 7.11929 8 8.5 8C9.88071 8 11 9.11929 11 10.5Z" fill="white" />
                  <path d="M14.5 17C14.5 18.3807 13.3807 19.5 12 19.5C10.6193 19.5 9.5 18.3807 9.5 17C9.5 15.6193 10.6193 14.5 12 14.5C13.3807 14.5 14.5 15.6193 14.5 17Z" fill="white" />
                </svg>
              </div>
              <span>ChatGPT</span>
            </div>
          </a>

          {/* Claude Option */}
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); openClaude(); }}
            className="block px-4 py-3 text-sm text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-center">
              <div className="mr-3 flex-shrink-0">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="24" height="24" rx="4" fill="#7F52FF" />
                  <path d="M12 5L19 17.5H5L12 5Z" fill="white" />
                </svg>
              </div>
              <span>Claude</span>
            </div>
          </a>

          {/* Copilot Option */}
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); openCopilot(); }}
            className="block px-4 py-3 text-sm text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-center">
              <div className="mr-3 flex-shrink-0">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="24" height="24" rx="4" fill="#1B1B1F" />
                  <path d="M18.5 12.5C18.5 15.5376 15.8136 18 12.5 18C9.18643 18 6.5 15.5376 6.5 12.5C6.5 9.46243 9.18643 7 12.5 7C15.8136 7 18.5 9.46243 18.5 12.5Z" fill="#47FFB4" />
                </svg>
              </div>
              <span>Copilot</span>
            </div>
          </a>

          {/* Copy Markdown Option */}
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); copyAsMarkdown(); }}
            className="block px-4 py-3 text-sm text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-center">
              <div className="mr-3 flex-shrink-0">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="24" height="24" rx="4" fill="#F0F0F0" />
                  <path d="M6 8H18V17H6V8Z" fill="#BBBBBB" />
                  <path d="M7 5H17V7H7V5Z" fill="#BBBBBB" />
                  <path d="M9 10H15V15H9V10Z" fill="white" />
                </svg>
              </div>
              <span>Copy Markdown</span>
            </div>
          </a>

          {/* View as Markdown Option */}
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); viewAsMarkdown(); }}
            className="block px-4 py-3 text-sm text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
          >
            <div className="flex items-center">
              <div className="mr-3 flex-shrink-0">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="24" height="24" rx="4" fill="#6E3934" />
                  <circle cx="12" cy="12" r="6" fill="#F5DEB3" />
                  <circle cx="12" cy="12" r="2" fill="#6E3934" />
                </svg>
              </div>
              <span>View as Markdown</span>
            </div>
          </a>
        </div>
      )}
    </div>
  );
};

export default AskAI;