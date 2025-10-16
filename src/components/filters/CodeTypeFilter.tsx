import React from 'react';
import { Code } from 'lucide-react';
import { CODE_TYPES } from '../../utils/filterValidation';

export interface CodeTypeFilterProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  className?: string;
}

/**
 * Code Type Filter Component
 * 
 * Dropdown selector for code types (for Get Codes API)
 */
export const CodeTypeFilter: React.FC<CodeTypeFilterProps> = ({
  value,
  onChange,
  required = false,
  className = ''
}) => {
  return (
    <div className={`space-y-1 ${className}`}>
      <label className="flex items-center gap-1 text-xs font-medium text-gray-700 dark:text-gray-300">
        <Code className="h-3 w-3" />
        Code Type
        {required && <span className="text-red-500">*</span>}
      </label>
      
      <select
        value={value}
        onChange={(e) => {
          console.log('🔵 CodeTypeFilter: Value changed to:', e.target.value);
          onChange(e.target.value);
        }}
        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
        required={required}
      >
        <option value="">
          {required ? 'Select code type (required)' : 'All code types'}
        </option>
        {CODE_TYPES.map(codeType => (
          <option key={codeType.value} value={codeType.value}>
            {codeType.label}
          </option>
        ))}
      </select>
      
      {required && !value && (
        <p className="text-xs text-red-600 dark:text-red-400">
          Code type is required to filter data (prevents 222KB response)
        </p>
      )}
      
      {!required && !value && (
        <p className="text-xs text-yellow-600 dark:text-yellow-400">
          ⚠️ Warning: Without filter, response will be ~222KB and may timeout
        </p>
      )}
    </div>
  );
};
