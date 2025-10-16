/**
 * Production-safe logger utility
 * 
 * In development: Shows all logs with enhanced formatting
 * In production: Completely silent, no logs exposed
 */

const isDevelopment = import.meta.env.MODE === 'development';
const isProduction = import.meta.env.MODE === 'production';

// Color codes for better development experience
const colors = {
  debug: '\x1b[36m',    // Cyan
  info: '\x1b[34m',     // Blue
  warn: '\x1b[33m',     // Yellow
  error: '\x1b[31m',    // Red
  success: '\x1b[32m',  // Green
  reset: '\x1b[0m'
};

/**
 * Logger class with environment-aware logging
 */
class Logger {
  /**
   * Log debug information (only in development)
   */
  debug(...args: any[]): void {
    if (isDevelopment) {
      console.log(`${colors.debug}[DEBUG]${colors.reset}`, ...args);
    }
  }

  /**
   * Log informational messages (only in development)
   */
  info(...args: any[]): void {
    if (isDevelopment) {
      console.info(`${colors.info}[INFO]${colors.reset}`, ...args);
    }
  }

  /**
   * Log warnings (only in development)
   */
  warn(...args: any[]): void {
    if (isDevelopment) {
      console.warn(`${colors.warn}[WARN]${colors.reset}`, ...args);
    }
  }

  /**
   * Log errors (only in development)
   * In production, errors are silently swallowed to prevent exposure
   */
  error(...args: any[]): void {
    if (isDevelopment) {
      console.error(`${colors.error}[ERROR]${colors.reset}`, ...args);
    }
  }

  /**
   * Log success messages (only in development)
   */
  success(...args: any[]): void {
    if (isDevelopment) {
      console.log(`${colors.success}[SUCCESS]${colors.reset}`, ...args);
    }
  }

  /**
   * Log API-related information (only in development)
   */
  api(...args: any[]): void {
    if (isDevelopment) {
      console.log(`${colors.info}[API]${colors.reset}`, ...args);
    }
  }

  /**
   * Group logs together (only in development)
   */
  group(label: string): void {
    if (isDevelopment) {
      console.group(label);
    }
  }

  /**
   * End log group (only in development)
   */
  groupEnd(): void {
    if (isDevelopment) {
      console.groupEnd();
    }
  }

  /**
   * Log data in table format (only in development)
   */
  table(data: any): void {
    if (isDevelopment && console.table) {
      console.table(data);
    }
  }

  /**
   * Start performance timing (only in development)
   */
  time(label: string): void {
    if (isDevelopment) {
      console.time(label);
    }
  }

  /**
   * End performance timing (only in development)
   */
  timeEnd(label: string): void {
    if (isDevelopment) {
      console.timeEnd(label);
    }
  }
}

// Export singleton instance
export const logger = new Logger();

/**
 * Disable all console methods in production
 * This acts as a safety net to catch any console.log that wasn't replaced
 */
export const disableConsoleInProduction = (): void => {
  if (isProduction) {
    // Store original methods in case we need them for critical errors
    const noop = (): void => {};

    // Override all console methods
    console.log = noop;
    console.info = noop;
    console.warn = noop;
    console.error = noop;
    console.debug = noop;
    console.trace = noop;
    console.dir = noop;
    console.dirxml = noop;
    console.group = noop;
    console.groupCollapsed = noop;
    console.groupEnd = noop;
    console.time = noop;
    console.timeEnd = noop;
    console.timeLog = noop;
    console.table = noop;
    console.clear = noop;
    console.count = noop;
    console.countReset = noop;
    console.assert = noop;
    console.profile = noop;
    console.profileEnd = noop;
    console.timeStamp = noop;

    // Log one final message before disabling (useful for debugging)
    if (isDevelopment) {
      logger.info('🔒 Console logging has been disabled for production');
    }
  }
};

// Export utility functions
export const isDev = isDevelopment;
export const isProd = isProduction;

export default logger;

