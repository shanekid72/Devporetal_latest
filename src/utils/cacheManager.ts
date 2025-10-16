/**
 * Cache Manager - Manages API response caching with TTL and persistence
 * 
 * Features:
 * - Time-to-live (TTL) based expiration
 * - SessionStorage persistence
 * - Cache size limits
 * - Pattern-based invalidation
 * - Cache statistics
 */

interface CacheEntry<T> {
  data: T;
  key: string;
  timestamp: number;
  expiresAt: number;
}

interface CacheStats {
  hits: number;
  misses: number;
  size: number;
  hitRate: number;
}

/**
 * Singleton Cache Manager for API responses
 */
export class CacheManager {
  private static instance: CacheManager;
  private cache: Map<string, CacheEntry<any>>;
  private maxSize: number = 100;
  private hits: number = 0;
  private misses: number = 0;
  
  private constructor() {
    this.cache = new Map();
    this.loadFromStorage();
  }
  
  /**
   * Get the singleton instance
   */
  static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }
  
  /**
   * Get cached data by key
   * @param key Cache key
   * @returns Cached data or null if not found/expired
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.misses++;
      console.log(`📦 Cache MISS: ${key}`);
      return null;
    }
    
    // Check if expired
    if (Date.now() > entry.expiresAt) {
      console.log(`⏰ Cache EXPIRED: ${key}`);
      this.cache.delete(key);
      this.misses++;
      this.saveToStorage();
      return null;
    }
    
    this.hits++;
    console.log(`✅ Cache HIT: ${key} (age: ${Math.round((Date.now() - entry.timestamp) / 1000)}s)`);
    return entry.data as T;
  }
  
  /**
   * Set cache entry with TTL
   * @param key Cache key
   * @param data Data to cache
   * @param ttl Time to live in milliseconds (default: 30 minutes)
   */
  set<T>(key: string, data: T, ttl: number = 1800000): void {
    // Enforce max size by evicting oldest entries
    if (this.cache.size >= this.maxSize) {
      this.evictOldest();
    }
    
    const entry: CacheEntry<T> = {
      data,
      key,
      timestamp: Date.now(),
      expiresAt: Date.now() + ttl
    };
    
    this.cache.set(key, entry);
    this.saveToStorage();
    
    const ttlMinutes = Math.round(ttl / 60000);
    console.log(`💾 Cached: ${key} (TTL: ${ttlMinutes}min, Size: ${this.cache.size})`);
  }
  
  /**
   * Check if a key exists and is not expired
   * @param key Cache key
   * @returns True if valid cache exists
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      this.saveToStorage();
      return false;
    }
    
    return true;
  }
  
  /**
   * Invalidate cache entries by pattern
   * @param pattern Pattern to match (optional, clears all if not provided)
   */
  invalidate(pattern?: string): void {
    if (!pattern) {
      const size = this.cache.size;
      this.cache.clear();
      this.saveToStorage();
      console.log(`🗑️ Cache cleared (${size} entries removed)`);
      return;
    }
    
    const keysToDelete: string[] = [];
    this.cache.forEach((_, key) => {
      if (key.includes(pattern)) {
        keysToDelete.push(key);
      }
    });
    
    keysToDelete.forEach(key => this.cache.delete(key));
    this.saveToStorage();
    console.log(`🗑️ Invalidated ${keysToDelete.length} entries matching: ${pattern}`);
  }
  
  /**
   * Get cache statistics
   * @returns Cache statistics object
   */
  getStats(): CacheStats {
    const total = this.hits + this.misses;
    return {
      hits: this.hits,
      misses: this.misses,
      size: this.cache.size,
      hitRate: total > 0 ? (this.hits / total) * 100 : 0
    };
  }
  
  /**
   * Reset cache statistics
   */
  resetStats(): void {
    this.hits = 0;
    this.misses = 0;
    console.log('📊 Cache statistics reset');
  }
  
  /**
   * Get all cache keys
   * @returns Array of cache keys
   */
  getKeys(): string[] {
    return Array.from(this.cache.keys());
  }
  
  /**
   * Evict oldest cache entry
   */
  private evictOldest(): void {
    let oldestKey: string | null = null;
    let oldestTimestamp = Date.now();
    
    this.cache.forEach((entry, key) => {
      if (entry.timestamp < oldestTimestamp) {
        oldestTimestamp = entry.timestamp;
        oldestKey = key;
      }
    });
    
    if (oldestKey) {
      this.cache.delete(oldestKey);
      console.log(`🗑️ Evicted oldest entry: ${oldestKey}`);
    }
  }
  
  /**
   * Clean up expired entries
   */
  cleanExpired(): void {
    const now = Date.now();
    const expiredKeys: string[] = [];
    
    this.cache.forEach((entry, key) => {
      if (now > entry.expiresAt) {
        expiredKeys.push(key);
      }
    });
    
    expiredKeys.forEach(key => this.cache.delete(key));
    
    if (expiredKeys.length > 0) {
      this.saveToStorage();
      console.log(`🗑️ Cleaned ${expiredKeys.length} expired entries`);
    }
  }
  
  /**
   * Load cache from sessionStorage
   */
  private loadFromStorage(): void {
    try {
      const stored = sessionStorage.getItem('api_cache');
      if (!stored) return;
      
      const entries: CacheEntry<any>[] = JSON.parse(stored);
      const now = Date.now();
      let loadedCount = 0;
      
      entries.forEach(entry => {
        // Only load non-expired entries
        if (now < entry.expiresAt) {
          this.cache.set(entry.key, entry);
          loadedCount++;
        }
      });
      
      if (loadedCount > 0) {
        console.log(`📦 Loaded ${loadedCount} cache entries from sessionStorage`);
      }
    } catch (error) {
      console.error('Failed to load cache from sessionStorage:', error);
      sessionStorage.removeItem('api_cache');
    }
  }
  
  /**
   * Save cache to sessionStorage
   */
  private saveToStorage(): void {
    try {
      const entries = Array.from(this.cache.values());
      sessionStorage.setItem('api_cache', JSON.stringify(entries));
    } catch (error) {
      console.error('Failed to save cache to sessionStorage:', error);
      // If storage is full, clear old entries and retry
      this.cleanExpired();
      try {
        const entries = Array.from(this.cache.values());
        sessionStorage.setItem('api_cache', JSON.stringify(entries));
      } catch (retryError) {
        console.error('Failed to save cache after cleanup:', retryError);
      }
    }
  }
}

/**
 * Singleton instance export
 */
export const apiCache = CacheManager.getInstance();

/**
 * Generate cache key from request parameters
 * @param method HTTP method
 * @param endpoint API endpoint
 * @param queryParams Query parameters
 * @returns Cache key string
 */
export function generateCacheKey(
  method: string,
  endpoint: string,
  queryParams?: Record<string, string>
): string {
  const params = queryParams 
    ? Object.keys(queryParams)
        .sort()
        .map(key => `${key}=${queryParams[key]}`)
        .join('&')
    : '';
  
  return `${method}:${endpoint}${params ? '?' + params : ''}`;
}

/**
 * Get TTL for specific endpoint
 * @param endpoint API endpoint
 * @returns TTL in milliseconds
 */
export function getCacheTTL(endpoint: string): number {
  // Get Codes API - 1 hour (static master data)
  if (endpoint.includes('/raas/masters/v1/codes')) {
    return 3600000;
  }
  
  // Service Corridor - 1 hour (static configuration)
  if (endpoint.includes('/raas/masters/v1/service-corridor')) {
    return 3600000;
  }
  
  // Banks - 30 minutes (semi-static data)
  if (endpoint.includes('/raas/masters/v1/banks')) {
    return 1800000;
  }
  
  // Branches - 30 minutes (semi-static data)
  if (endpoint.includes('/raas/masters/v1/branches')) {
    return 1800000;
  }
  
  // Rates - 15 minutes (frequently updated)
  if (endpoint.includes('/raas/masters/v1/rates')) {
    return 900000;
  }
  
  // Account validation - 5 minutes (real-time data)
  if (endpoint.includes('/raas/masters/v1/account/validate')) {
    return 300000;
  }
  
  // Default - 30 minutes
  return 1800000;
}

// Auto cleanup expired entries every 5 minutes
if (typeof window !== 'undefined') {
  setInterval(() => {
    apiCache.cleanExpired();
  }, 300000);
}
