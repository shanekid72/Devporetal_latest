import React from 'react';
import { Search } from 'lucide-react';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';

export interface SearchFilterProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  debounceMs?: number;
  className?: string;
}

/**
 * Search Filter Component
 * 
 * Text input with debouncing for search/filter fields
 */
export const SearchFilter: React.FC<SearchFilterProps> = ({
  label,
  value,
  onChange,
  placeholder = 'Search...',
  required = false,
  debounceMs = 300,
  className = ''
}) => {
  const [localValue, setLocalValue] = React.useState(value);
  const debouncedValue = useDebouncedValue(localValue, debounceMs);
  
  // Update parent when debounced value changes
  React.useEffect(() => {
    if (debouncedValue !== value) {
      onChange(debouncedValue);
    }
  }, [debouncedValue, onChange, value]);
  
  // Sync local value when prop changes externally
  React.useEffect(() => {
    setLocalValue(value);
  }, [value]);
  
  return (
    <div className={`space-y-1 ${className}`}>
      <label className="flex items-center gap-1 text-xs font-medium text-gray-700 dark:text-gray-300">
        <Search className="h-3 w-3" />
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      
      <input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
        required={required}
      />
      
      {required && !value && (
        <p className="text-xs text-red-600 dark:text-red-400">
          {label} is required
        </p>
      )}
    </div>
  );
};
