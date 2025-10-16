import React from 'react';
import { ArrowDown } from 'lucide-react';
import clsx from 'clsx';
import PlaceholdersAndVanishInputDemo from './PlaceholdersAndVanishInputDemo';

interface AskPageSectionProps {
  className?: string;
  showButtons?: boolean;
  notebookUrl?: string;
}

const AskPageSection: React.FC<AskPageSectionProps> = ({ className = '', showButtons = true, notebookUrl }) => {
  const isDark = document.documentElement.classList.contains('dark');

  return (
    <section 
      className={clsx(
        'w-full py-8 px-6',
        className
      )}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Input Component */}
        <PlaceholdersAndVanishInputDemo notebookUrl={notebookUrl} />

        {/* Action Buttons */}
        {showButtons && (
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              className={clsx(
                'inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all border',
                isDark 
                  ? 'border-slate-700 bg-slate-800 text-slate-200 hover:border-slate-600 hover:bg-slate-700' 
                  : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50'
              )}
            >
              Get Started
              <ArrowDown className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default AskPageSection;
