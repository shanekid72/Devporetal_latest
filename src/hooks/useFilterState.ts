import { useState, useCallback, useEffect } from 'react';

/**
 * Filter state management hook
 * 
 * Manages filter state with localStorage persistence and change callbacks
 */

export interface FilterState {
  filters: Record<string, string>;
  setFilter: (key: string, value: string) => void;
  removeFilter: (key: string) => void;
  clearFilters: () => void;
  hasFilters: boolean;
  getFilterCount: () => number;
}

interface UseFilterStateOptions {
  initialFilters?: Record<string, string>;
  persistKey?: string; // Key for localStorage persistence
  onChange?: (filters: Record<string, string>) => void;
}

/**
 * Custom hook for managing filter state
 * 
 * @param options Configuration options
 * @returns Filter state and management functions
 * 
 * @example
 * const { filters, setFilter, clearFilters } = useFilterState({
 *   initialFilters: { country: 'PK' },
 *   persistKey: 'bank-filters',
 *   onChange: (filters) => console.log('Filters changed:', filters)
 * });
 */
export function useFilterState(options: UseFilterStateOptions = {}): FilterState {
  const { initialFilters = {}, persistKey, onChange } = options;
  
  // Load initial filters from localStorage if persistKey provided
  const getInitialState = (): Record<string, string> => {
    if (persistKey) {
      try {
        const stored = localStorage.getItem(persistKey);
        if (stored) {
          const parsed = JSON.parse(stored);
          console.log(`📦 Loaded filters from localStorage: ${persistKey}`, parsed);
          return { ...initialFilters, ...parsed };
        }
      } catch (error) {
        console.error('Failed to load filters from localStorage:', error);
      }
    }
    return initialFilters;
  };
  
  const [filters, setFilters] = useState<Record<string, string>>(getInitialState);
  
  // Persist to localStorage when filters change
  useEffect(() => {
    if (persistKey && Object.keys(filters).length > 0) {
      try {
        localStorage.setItem(persistKey, JSON.stringify(filters));
        console.log(`💾 Saved filters to localStorage: ${persistKey}`);
      } catch (error) {
        console.error('Failed to save filters to localStorage:', error);
      }
    }
  }, [filters, persistKey]);
  
  // Call onChange callback when filters change
  useEffect(() => {
    if (onChange) {
      onChange(filters);
    }
  }, [filters, onChange]);
  
  /**
   * Set a single filter value
   */
  const setFilter = useCallback((key: string, value: string) => {
    setFilters(prev => {
      // Remove filter if value is empty
      if (!value || value.trim() === '') {
        const { [key]: _, ...rest } = prev;
        return rest;
      }
      
      // Update filter
      return { ...prev, [key]: value };
    });
  }, []);
  
  /**
   * Remove a filter
   */
  const removeFilter = useCallback((key: string) => {
    setFilters(prev => {
      const { [key]: _, ...rest } = prev;
      return rest;
    });
  }, []);
  
  /**
   * Clear all filters
   */
  const clearFilters = useCallback(() => {
    setFilters({});
    
    // Clear from localStorage if persist key provided
    if (persistKey) {
      try {
        localStorage.removeItem(persistKey);
        console.log(`🗑️ Cleared filters from localStorage: ${persistKey}`);
      } catch (error) {
        console.error('Failed to clear filters from localStorage:', error);
      }
    }
  }, [persistKey]);
  
  /**
   * Check if any filters are set
   */
  const hasFilters = Object.keys(filters).length > 0;
  
  /**
   * Get count of active filters
   */
  const getFilterCount = useCallback(() => {
    return Object.keys(filters).length;
  }, [filters]);
  
  return {
    filters,
    setFilter,
    removeFilter,
    clearFilters,
    hasFilters,
    getFilterCount
  };
}
