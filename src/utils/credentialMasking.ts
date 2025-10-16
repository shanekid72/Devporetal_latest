/**
 * Credential Masking Utility
 * 
 * Provides functions to mask sensitive credential fields in JSON objects
 * for display purposes while maintaining the original values for API calls.
 */

export interface MaskConfig {
  fullMask: string[];      // Fields to fully mask with asterisks
  partialMask: {           // Fields to partially mask (show first N chars)
    [key: string]: number; // key: field name, value: number of chars to show
  };
}

/**
 * Default masking configuration for common credential fields
 */
export const DEFAULT_MASK_CONFIG: MaskConfig = {
  fullMask: ['password', 'client_secret', 'secret', 'api_key', 'token', 'access_token'],
  partialMask: {
    'username': 3,
    'client_id': 4,
    'user': 3,
    'email': 3
  }
};

/**
 * Mask a single sensitive value
 * @param value - The value to mask
 * @param charsToShow - Number of characters to show at the start (0 = full mask)
 * @param maskChar - Character to use for masking (default: '*')
 * @param maskLength - Length of the mask (default: 8)
 * @returns Masked value
 */
export function maskSensitiveValue(
  value: string,
  charsToShow: number = 0,
  maskChar: string = '*',
  maskLength: number = 8
): string {
  if (!value || value.length === 0) {
    return value;
  }

  const mask = maskChar.repeat(maskLength);

  if (charsToShow === 0) {
    // Full mask
    return mask;
  }

  // Partial mask - show first N characters
  const visiblePart = value.substring(0, Math.min(charsToShow, value.length));
  return `${visiblePart}${mask}`;
}

/**
 * Mask sensitive fields in a JSON string
 * @param json - JSON string to mask
 * @param config - Masking configuration (defaults to DEFAULT_MASK_CONFIG)
 * @returns Masked JSON string, or original if parsing fails
 */
export function maskJsonCredentials(json: string, config: MaskConfig = DEFAULT_MASK_CONFIG): string {
  if (!json || json.trim().length === 0) {
    return json;
  }

  try {
    const parsed = JSON.parse(json);
    const masked = maskObjectCredentials(parsed, config);
    return JSON.stringify(masked, null, 2);
  } catch (error) {
    // If JSON parsing fails, return original
    console.warn('Failed to parse JSON for masking:', error);
    return json;
  }
}

/**
 * Recursively mask credentials in an object
 * @param obj - Object to mask
 * @param config - Masking configuration
 * @returns Masked object (new object, original not modified)
 */
function maskObjectCredentials(obj: any, config: MaskConfig): any {
  if (obj === null || obj === undefined) {
    return obj;
  }

  // Handle arrays
  if (Array.isArray(obj)) {
    return obj.map(item => maskObjectCredentials(item, config));
  }

  // Handle non-object types
  if (typeof obj !== 'object') {
    return obj;
  }

  // Handle objects
  const masked: any = {};

  for (const [key, value] of Object.entries(obj)) {
    const lowerKey = key.toLowerCase();

    // Check if field should be fully masked
    if (config.fullMask.some(field => lowerKey.includes(field.toLowerCase()))) {
      masked[key] = typeof value === 'string' ? maskSensitiveValue(value, 0) : value;
      continue;
    }

    // Check if field should be partially masked
    const partialMaskEntry = Object.entries(config.partialMask).find(
      ([field]) => lowerKey.includes(field.toLowerCase())
    );

    if (partialMaskEntry) {
      const [, charsToShow] = partialMaskEntry;
      masked[key] = typeof value === 'string' ? maskSensitiveValue(value, charsToShow) : value;
      continue;
    }

    // Recursively mask nested objects
    if (typeof value === 'object') {
      masked[key] = maskObjectCredentials(value, config);
    } else {
      masked[key] = value;
    }
  }

  return masked;
}

/**
 * Check if a JSON string contains any sensitive fields
 * @param json - JSON string to check
 * @param config - Masking configuration
 * @returns true if sensitive fields are present
 */
export function hasSensitiveFields(json: string, config: MaskConfig = DEFAULT_MASK_CONFIG): boolean {
  if (!json || json.trim().length === 0) {
    return false;
  }

  try {
    const parsed = JSON.parse(json);
    return checkObjectForSensitiveFields(parsed, config);
  } catch (error) {
    return false;
  }
}

/**
 * Recursively check if an object contains sensitive fields
 */
function checkObjectForSensitiveFields(obj: any, config: MaskConfig): boolean {
  if (obj === null || obj === undefined || typeof obj !== 'object') {
    return false;
  }

  if (Array.isArray(obj)) {
    return obj.some(item => checkObjectForSensitiveFields(item, config));
  }

  for (const key of Object.keys(obj)) {
    const lowerKey = key.toLowerCase();

    // Check for full mask fields
    if (config.fullMask.some(field => lowerKey.includes(field.toLowerCase()))) {
      return true;
    }

    // Check for partial mask fields
    if (Object.keys(config.partialMask).some(field => lowerKey.includes(field.toLowerCase()))) {
      return true;
    }

    // Check nested objects
    if (typeof obj[key] === 'object' && checkObjectForSensitiveFields(obj[key], config)) {
      return true;
    }
  }

  return false;
}

