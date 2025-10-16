import React from 'react';
import { Globe } from 'lucide-react';
import { COMMON_COUNTRIES } from '../../utils/filterValidation';

export interface CountryFilterProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  className?: string;
}

/**
 * Country Filter Component
 * 
 * Dropdown selector for country codes
 */
export const CountryFilter: React.FC<CountryFilterProps> = ({
  value,
  onChange,
  required = false,
  className = ''
}) => {
  return (
    <div className={`space-y-1 ${className}`}>
      <label className="flex items-center gap-1 text-xs font-medium text-gray-700 dark:text-gray-300">
        <Globe className="h-3 w-3" />
        Country Code
        {required && <span className="text-red-500">*</span>}
      </label>
      
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
        required={required}
      >
        <option value="">
          {required ? 'Select country (required)' : 'All countries'}
        </option>
        {COMMON_COUNTRIES.map(country => (
          <option key={country.value} value={country.value}>
            {country.label} ({country.value})
          </option>
        ))}
      </select>
      
      {required && !value && (
        <p className="text-xs text-red-600 dark:text-red-400">
          Country code is required to filter data
        </p>
      )}
    </div>
  );
};
