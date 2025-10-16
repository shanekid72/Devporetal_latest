/**
 * Performance Monitor Utility
 * 
 * Tracks API call performance and warns about slow responses
 */

export interface PerformanceMetrics {
  endpoint: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  payloadSize?: number;
  status: 'pending' | 'success' | 'error' | 'timeout';
}

class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetrics> = new Map();
  private readonly WARNING_THRESHOLD_MS = 3000; // 3 seconds
  private readonly TIMEOUT_THRESHOLD_MS = 10000; // 10 seconds
  
  /**
   * Start tracking an API call
   */
  startTracking(requestId: string, endpoint: string): void {
    this.metrics.set(requestId, {
      endpoint,
      startTime: Date.now(),
      status: 'pending'
    });
    
    console.log(`⏱️ Performance: Started tracking ${endpoint}`);
  }
  
  /**
   * End tracking with success
   */
  endTracking(requestId: string, payloadSize?: number): void {
    const metric = this.metrics.get(requestId);
    if (!metric) {
      console.warn(`⚠️ Performance: No tracking found for ${requestId}`);
      return;
    }
    
    const endTime = Date.now();
    const duration = endTime - metric.startTime;
    
    metric.endTime = endTime;
    metric.duration = duration;
    metric.payloadSize = payloadSize;
    metric.status = 'success';
    
    // Log performance metrics
    this.logMetrics(metric);
    
    // Cleanup after 1 minute
    setTimeout(() => this.metrics.delete(requestId), 60000);
  }
  
  /**
   * Mark as error
   */
  markError(requestId: string): void {
    const metric = this.metrics.get(requestId);
    if (metric) {
      metric.status = 'error';
      metric.endTime = Date.now();
      metric.duration = metric.endTime - metric.startTime;
    }
  }
  
  /**
   * Mark as timeout
   */
  markTimeout(requestId: string): void {
    const metric = this.metrics.get(requestId);
    if (metric) {
      metric.status = 'timeout';
      metric.endTime = Date.now();
      metric.duration = metric.endTime - metric.startTime;
      
      console.error(`⏱️ Performance: TIMEOUT for ${metric.endpoint} after ${metric.duration}ms`);
    }
  }
  
  /**
   * Log metrics with appropriate warnings
   */
  private logMetrics(metric: PerformanceMetrics): void {
    const { endpoint, duration, payloadSize } = metric;
    
    if (!duration) return;
    
    const sizeStr = payloadSize ? ` | ${this.formatBytes(payloadSize)}` : '';
    const baseMsg = `⏱️ Performance: ${endpoint} completed in ${duration}ms${sizeStr}`;
    
    if (duration >= this.TIMEOUT_THRESHOLD_MS) {
      console.error(`🚨 ${baseMsg} - VERY SLOW! Consider adding filters.`);
    } else if (duration >= this.WARNING_THRESHOLD_MS) {
      console.warn(`⚠️ ${baseMsg} - Slow response. Filters recommended.`);
    } else {
      console.log(`✅ ${baseMsg} - Good performance!`);
    }
    
    // Warn about large payloads
    if (payloadSize && payloadSize > 100 * 1024) { // > 100KB
      console.warn(`📦 Large payload detected (${this.formatBytes(payloadSize)}). Consider adding filters to reduce data.`);
    }
  }
  
  /**
   * Format bytes to human-readable string
   */
  private formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)}MB`;
  }
  
  /**
   * Get all metrics
   */
  getAllMetrics(): PerformanceMetrics[] {
    return Array.from(this.metrics.values());
  }
  
  /**
   * Clear all metrics
   */
  clear(): void {
    this.metrics.clear();
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();
