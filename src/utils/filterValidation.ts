/**
 * Filter Validation Utility
 * 
 * Validates required query parameters for master API endpoints
 * to ensure data filtering and prevent large payload responses
 */

export interface FilterRequirement {
  endpoint: string;
  requiredParams: string[];
  optionalParams?: string[];
  description: string;
  examples?: Record<string, string>;
}

/**
 * Required filter configurations for each master API endpoint
 */
export const FILTER_REQUIREMENTS: FilterRequirement[] = [
  {
    endpoint: '/raas/masters/v1/codes',
    requiredParams: ['code_type'],
    description: 'Get Codes API requires code_type to filter specific code categories',
    examples: {
      code_type: 'NATIONALITY, ID_TYPE, RELATION, PROFESSION, PURPOSE, PAYMENT_MODE'
    }
  },
  {
    endpoint: '/raas/masters/v1/banks',
    requiredParams: ['receiving_country_code'],
    optionalParams: ['receiving_mode', 'correspondent'],
    description: 'Get Banks API requires receiving_country_code to filter banks by country',
    examples: {
      receiving_country_code: 'PK, AE, IN, BD',
      receiving_mode: 'BANK, CASHPICKUP, WALLET',
      correspondent: 'RR, WU'
    }
  },
  {
    endpoint: '/raas/masters/v1/branches/search',
    requiredParams: ['bank_id'],
    optionalParams: ['search_term', 'city'],
    description: 'Branch Search API requires bank_id to limit search scope',
    examples: {
      bank_id: '11232',
      search_term: 'main',
      city: 'karachi'
    }
  }
];

/**
 * Validation result
 */
export interface ValidationResult {
  isValid: boolean;
  missingParams: string[];
  errorMessage?: string;
  suggestions?: string[];
}

/**
 * Validate query parameters for an endpoint
 * @param endpoint API endpoint path
 * @param queryParams Query parameters object
 * @returns Validation result
 */
export function validateFilters(
  endpoint: string,
  queryParams?: Record<string, string>
): ValidationResult {
  // Find matching filter requirement
  const requirement = FILTER_REQUIREMENTS.find(req => 
    endpoint.includes(req.endpoint)
  );
  
  // If no requirements defined, validation passes
  if (!requirement) {
    return { isValid: true, missingParams: [] };
  }
  
  const params = queryParams || {};
  const missingParams: string[] = [];
  
  // Check required parameters
  requirement.requiredParams.forEach(param => {
    if (!params[param] || params[param].trim() === '') {
      missingParams.push(param);
    }
  });
  
  // If validation fails, build error message
  if (missingParams.length > 0) {
    const errorMessage = buildErrorMessage(requirement, missingParams);
    const suggestions = buildSuggestions(requirement, missingParams);
    
    return {
      isValid: false,
      missingParams,
      errorMessage,
      suggestions
    };
  }
  
  return { isValid: true, missingParams: [] };
}

/**
 * Build detailed error message
 */
function buildErrorMessage(
  requirement: FilterRequirement,
  missingParams: string[]
): string {
  const paramList = missingParams.map(p => `"${p}"`).join(', ');
  
  return `⚠️ Missing required filter(s): ${paramList}

${requirement.description}

To improve performance and reduce data size, please provide the following:
${missingParams.map(p => `  • ${p}: ${requirement.examples?.[p] || 'Required value'}`).join('\n')}

This will reduce the response payload by 70-90% and significantly improve load times.`;
}

/**
 * Build suggestions for missing parameters
 */
function buildSuggestions(
  requirement: FilterRequirement,
  missingParams: string[]
): string[] {
  const suggestions: string[] = [];
  
  missingParams.forEach(param => {
    if (requirement.examples?.[param]) {
      suggestions.push(`Set ${param} to one of: ${requirement.examples[param]}`);
    } else {
      suggestions.push(`Provide a value for ${param}`);
    }
  });
  
  return suggestions;
}

/**
 * Get filter requirement for an endpoint
 * @param endpoint API endpoint path
 * @returns Filter requirement or null
 */
export function getFilterRequirement(endpoint: string): FilterRequirement | null {
  return FILTER_REQUIREMENTS.find(req => endpoint.includes(req.endpoint)) || null;
}

/**
 * Check if endpoint requires filters
 * @param endpoint API endpoint path
 * @returns True if filters are required
 */
export function requiresFilters(endpoint: string): boolean {
  return FILTER_REQUIREMENTS.some(req => endpoint.includes(req.endpoint));
}

/**
 * Get all required parameter names for an endpoint
 * @param endpoint API endpoint path
 * @returns Array of required parameter names
 */
export function getRequiredParams(endpoint: string): string[] {
  const requirement = getFilterRequirement(endpoint);
  return requirement?.requiredParams || [];
}

/**
 * Get all optional parameter names for an endpoint
 * @param endpoint API endpoint path
 * @returns Array of optional parameter names
 */
export function getOptionalParams(endpoint: string): string[] {
  const requirement = getFilterRequirement(endpoint);
  return requirement?.optionalParams || [];
}

/**
 * Get example values for a parameter
 * @param endpoint API endpoint path
 * @param paramName Parameter name
 * @returns Example values or null
 */
export function getParamExamples(endpoint: string, paramName: string): string | null {
  const requirement = getFilterRequirement(endpoint);
  return requirement?.examples?.[paramName] || null;
}

/**
 * Validate and throw error if validation fails
 * @param endpoint API endpoint path
 * @param queryParams Query parameters object
 * @throws Error if validation fails
 */
export function validateFiltersOrThrow(
  endpoint: string,
  queryParams?: Record<string, string>
): void {
  const result = validateFilters(endpoint, queryParams);
  
  if (!result.isValid) {
    throw new Error(result.errorMessage);
  }
}

/**
 * Common code types for Get Codes API
 */
export const CODE_TYPES = [
  { value: 'NATIONALITY', label: 'Nationality Codes' },
  { value: 'ID_TYPE', label: 'ID Types' },
  { value: 'RELATION', label: 'Relationship Types' },
  { value: 'PROFESSION', label: 'Profession Codes' },
  { value: 'PURPOSE', label: 'Transaction Purpose' },
  { value: 'PAYMENT_MODE', label: 'Payment Modes' },
  { value: 'INSTRUMENT', label: 'Payment Instruments' },
  { value: 'RECEIVING_MODE', label: 'Receiving Modes' },
  { value: 'FEE_TYPE', label: 'Fee Types' },
  { value: 'ADDRESS_TYPE', label: 'Address Types' },
  { value: 'INCOME_RANGE', label: 'Income Ranges' },
  { value: 'CORRESPONDENT', label: 'Correspondents' },
  { value: 'CANCELLATION_REASON', label: 'Cancellation Reasons' },
  { value: 'ACCOUNT_TYPE', label: 'Account Types' }
];

/**
 * Common receiving modes
 */
export const RECEIVING_MODES = [
  { value: 'BANK', label: 'Bank Account' },
  { value: 'CASHPICKUP', label: 'Cash Pickup' },
  { value: 'WALLET', label: 'Mobile Wallet' }
];

/**
 * Common countries for testing
 */
export const COMMON_COUNTRIES = [
  { value: 'PK', label: 'Pakistan' },
  { value: 'AE', label: 'United Arab Emirates' },
  { value: 'IN', label: 'India' },
  { value: 'BD', label: 'Bangladesh' },
  { value: 'LK', label: 'Sri Lanka' },
  { value: 'PH', label: 'Philippines' },
  { value: 'NP', label: 'Nepal' }
];
