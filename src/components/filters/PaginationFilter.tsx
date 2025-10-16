import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export interface PaginationFilterProps {
  currentPage: number;
  pageSize: number;
  totalItems?: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  className?: string;
}

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100, 200];

/**
 * Pagination Filter Component
 * 
 * Adds pagination controls to reduce data fetching
 */
export const PaginationFilter: React.FC<PaginationFilterProps> = ({
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  className = ''
}) => {
  const totalPages = totalItems ? Math.ceil(totalItems / pageSize) : 0;
  const hasNext = !totalItems || currentPage < totalPages;
  const hasPrev = currentPage > 1;
  
  return (
    <div className={`flex items-center justify-between gap-4 ${className}`}>
      {/* Page Size Selector */}
      <div className="flex items-center gap-2">
        <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
          Items per page:
        </label>
        <select
          value={pageSize}
          onChange={(e) => {
            onPageSizeChange(Number(e.target.value));
            onPageChange(1); // Reset to page 1 when changing page size
          }}
          className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {PAGE_SIZE_OPTIONS.map(size => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>
      
      {/* Pagination Controls */}
      <div className="flex items-center gap-2">
        {/* First Page */}
        <button
          onClick={() => onPageChange(1)}
          disabled={!hasPrev}
          className="p-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="First page"
          title="First page"
        >
          <ChevronsLeft className="h-4 w-4" />
        </button>
        
        {/* Previous Page */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPrev}
          className="p-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous page"
          title="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        
        {/* Current Page / Total Pages */}
        <span className="text-sm text-gray-700 dark:text-gray-300 min-w-[80px] text-center">
          Page {currentPage}
          {totalPages > 0 && ` of ${totalPages}`}
        </span>
        
        {/* Next Page */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNext}
          className="p-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Next page"
          title="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
        
        {/* Last Page */}
        {totalPages > 0 && (
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={!hasNext}
            className="p-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Last page"
            title="Last page"
          >
            <ChevronsRight className="h-4 w-4" />
          </button>
        )}
      </div>
      
      {/* Total Items Info */}
      {totalItems !== undefined && (
        <div className="text-xs text-gray-600 dark:text-gray-400">
          Total: {totalItems} items
        </div>
      )}
    </div>
  );
};
