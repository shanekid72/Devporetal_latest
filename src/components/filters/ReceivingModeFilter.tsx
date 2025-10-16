import React from 'react';
import { Wallet } from 'lucide-react';
import { RECEIVING_MODES } from '../../utils/filterValidation';

export interface ReceivingModeFilterProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  className?: string;
}

/**
 * Receiving Mode Filter Component
 * 
 * Dropdown selector for receiving modes (BANK, CASHPICKUP, WALLET)
 */
export const ReceivingModeFilter: React.FC<ReceivingModeFilterProps> = ({
  value,
  onChange,
  required = false,
  className = ''
}) => {
  return (
    <div className={`space-y-1 ${className}`}>
      <label className="flex items-center gap-1 text-xs font-medium text-gray-700 dark:text-gray-300">
        <Wallet className="h-3 w-3" />
        Receiving Mode
        {required && <span className="text-red-500">*</span>}
      </label>
      
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
        required={required}
      >
        <option value="">
          {required ? 'Select mode (required)' : 'All modes'}
        </option>
        {RECEIVING_MODES.map(mode => (
          <option key={mode.value} value={mode.value}>
            {mode.label}
          </option>
        ))}
      </select>
      
      {required && !value && (
        <p className="text-xs text-red-600 dark:text-red-400">
          Receiving mode is required
        </p>
      )}
    </div>
  );
};
