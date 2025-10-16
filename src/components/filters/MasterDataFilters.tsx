import React from 'react';
import { Filter, X } from 'lucide-react';
import { getFilterRequirement, getRequiredParams, getOptionalParams } from '../../utils/filterValidation';
import { CountryFilter } from './CountryFilter';
import { ReceivingModeFilter } from './ReceivingModeFilter';
import { CodeTypeFilter } from './CodeTypeFilter';
import { SearchFilter } from './SearchFilter';

export interface MasterDataFiltersProps {
  endpoint: string;
  filters: Record<string, string>;
  onFilterChange: (filters: Record<string, string>) => void;
  onClearFilters?: () => void;
  className?: string;
}

/**
 * Master Data Filters Component
 * 
 * Displays appropriate filter controls based on the API endpoint
 * Automatically detects required and optional filters
 */
export const MasterDataFilters: React.FC<MasterDataFiltersProps> = ({
  endpoint,
  filters,
  onFilterChange,
  onClearFilters,
  className = ''
}) => {
  const requirement = getFilterRequirement(endpoint);
  const requiredParams = getRequiredParams(endpoint);
  const optionalParams = getOptionalParams(endpoint);
  
  // If no filter requirements, don't show anything
  if (!requirement) {
    return null;
  }
  
  const handleFilterChange = (key: string, value: string) => {
    console.log(`🟢 MasterDataFilters: handleFilterChange called - key: ${key}, value: ${value}`);
    const newFilters = { ...filters };
    
    if (value && value.trim() !== '') {
      newFilters[key] = value;
      console.log(`🟢 MasterDataFilters: Added filter ${key}=${value}`);
    } else {
      delete newFilters[key];
      console.log(`🟢 MasterDataFilters: Removed filter ${key}`);
    }
    
    console.log('🟢 MasterDataFilters: Calling onFilterChange with:', newFilters);
    onFilterChange(newFilters);
  };
  
  const handleClearAll = () => {
    onFilterChange({});
    if (onClearFilters) {
      onClearFilters();
    }
  };
  
  const hasActiveFilters = Object.keys(filters).length > 0;
  
  return (
    <div className={`bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-lg border border-blue-200 dark:border-gray-700 p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
            Filter Data
          </h4>
          {hasActiveFilters && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              {Object.keys(filters).length} active
            </span>
          )}
        </div>
        
        {hasActiveFilters && (
          <button
            onClick={handleClearAll}
            className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
            aria-label="Clear all filters"
          >
            <X className="h-3 w-3" />
            Clear All
          </button>
        )}
      </div>
      
      {/* Description */}
      <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">
        {requirement.description}
      </p>
      
      {/* Filter Controls */}
      <div className="space-y-3">
        {/* Code Type Filter (for Get Codes API) */}
        {requiredParams.includes('code_type') && (
          <CodeTypeFilter
            value={filters.code_type || ''}
            onChange={(value) => handleFilterChange('code_type', value)}
            required={true}
          />
        )}
        
        {/* Country Filter (for Banks, Branches APIs) */}
        {(requiredParams.includes('receiving_country_code') || optionalParams?.includes('receiving_country_code')) && (
          <CountryFilter
            value={filters.receiving_country_code || ''}
            onChange={(value) => handleFilterChange('receiving_country_code', value)}
            required={requiredParams.includes('receiving_country_code')}
          />
        )}
        
        {/* Receiving Mode Filter (for Banks API) */}
        {optionalParams?.includes('receiving_mode') && (
          <ReceivingModeFilter
            value={filters.receiving_mode || ''}
            onChange={(value) => handleFilterChange('receiving_mode', value)}
            required={false}
          />
        )}
        
        {/* Bank ID (for Branch Search) */}
        {requiredParams.includes('bank_id') && (
          <SearchFilter
            label="Bank ID"
            value={filters.bank_id || ''}
            onChange={(value) => handleFilterChange('bank_id', value)}
            placeholder="Enter bank ID (e.g., 11232)"
            required={true}
          />
        )}
        
        {/* Search Term (for Branch Search) */}
        {optionalParams?.includes('search_term') && (
          <SearchFilter
            label="Search Term"
            value={filters.search_term || ''}
            onChange={(value) => handleFilterChange('search_term', value)}
            placeholder="Search branches..."
            required={false}
          />
        )}
        
        {/* City (for Branch Search) */}
        {optionalParams?.includes('city') && (
          <SearchFilter
            label="City"
            value={filters.city || ''}
            onChange={(value) => handleFilterChange('city', value)}
            placeholder="Enter city name"
            required={false}
          />
        )}
        
        {/* Correspondent (for Banks API) */}
        {optionalParams?.includes('correspondent') && (
          <SearchFilter
            label="Correspondent"
            value={filters.correspondent || ''}
            onChange={(value) => handleFilterChange('correspondent', value)}
            placeholder="e.g., RR, WU"
            required={false}
          />
        )}
      </div>
      
      {/* Active Filters Pills */}
      {hasActiveFilters && (
        <div className="mt-4 pt-3 border-t border-blue-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Active Filters:</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(filters).map(([key, value]: [string, string]) => (
              <span
                key={key}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600"
              >
                <span className="text-gray-500 dark:text-gray-500">{key}:</span>
                <span className="font-semibold">{value}</span>
                <button
                  onClick={() => handleFilterChange(key, '')}
                  className="ml-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  aria-label={`Remove ${key} filter`}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
      
      {/* Performance Tip */}
      {!hasActiveFilters && requiredParams.length > 0 && (
        <div className="mt-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded text-xs text-yellow-800 dark:text-yellow-200">
          💡 <strong>Performance Tip:</strong> Adding filters will reduce data size by 70-90% and improve load times significantly.
        </div>
      )}
    </div>
  );
};
