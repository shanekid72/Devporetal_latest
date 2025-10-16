import { useCallback } from 'react';
import { apiCache, generateCacheKey, getCacheTTL } from '../utils/cacheManager';

/**
 * Custom hook for API caching integration
 * 
 * Provides easy-to-use caching functions for API calls
 */

export interface UseAPICacheReturn {
  getCachedData: <T>(method: string, endpoint: string, queryParams?: Record<string, string>) => T | null;
  setCachedData: <T>(method: string, endpoint: string, data: T, queryParams?: Record<string, string>, customTTL?: number) => void;
  invalidateCache: (pattern?: string) => void;
  hasCachedData: (method: string, endpoint: string, queryParams?: Record<string, string>) => boolean;
  getCacheStats: () => { hits: number; misses: number; size: number; hitRate: number };
}

/**
 * Hook for managing API response caching
 * 
 * @returns Cache management functions
 * 
 * @example
 * const { getCachedData, setCachedData, invalidateCache } = useAPICache();
 * 
 * // Try to get from cache first
 * const cached = getCachedData('GET', '/raas/masters/v1/banks', { country: 'PK' });
 * if (cached) {
 *   setData(cached);
 * } else {
 *   // Fetch from API
 *   const response = await fetchBanks();
 *   setCachedData('GET', '/raas/masters/v1/banks', response.data, { country: 'PK' });
 * }
 */
export function useAPICache(): UseAPICacheReturn {
  
  /**
   * Get cached data for an API call
   */
  const getCachedData = useCallback(<T>(
    method: string,
    endpoint: string,
    queryParams?: Record<string, string>
  ): T | null => {
    const key = generateCacheKey(method, endpoint, queryParams);
    return apiCache.get<T>(key);
  }, []);
  
  /**
   * Cache data for an API call
   */
  const setCachedData = useCallback(<T>(
    method: string,
    endpoint: string,
    data: T,
    queryParams?: Record<string, string>,
    customTTL?: number
  ): void => {
    const key = generateCacheKey(method, endpoint, queryParams);
    const ttl = customTTL || getCacheTTL(endpoint);
    apiCache.set(key, data, ttl);
  }, []);
  
  /**
   * Invalidate cache entries by pattern
   */
  const invalidateCache = useCallback((pattern?: string): void => {
    apiCache.invalidate(pattern);
  }, []);
  
  /**
   * Check if cached data exists and is valid
   */
  const hasCachedData = useCallback((
    method: string,
    endpoint: string,
    queryParams?: Record<string, string>
  ): boolean => {
    const key = generateCacheKey(method, endpoint, queryParams);
    return apiCache.has(key);
  }, []);
  
  /**
   * Get cache statistics
   */
  const getCacheStats = useCallback(() => {
    return apiCache.getStats();
  }, []);
  
  return {
    getCachedData,
    setCachedData,
    invalidateCache,
    hasCachedData,
    getCacheStats
  };
}
