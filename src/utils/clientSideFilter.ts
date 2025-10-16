/**
 * Client-Side Data Filtering Utility
 * 
 * Since the backend doesn't support filtering for some endpoints,
 * we fetch the full dataset (cached aggressively) and filter on the client side
 */

export interface CodeData {
  code: string;
  name: string;
  [key: string]: any;
}

export interface ApiResponse {
  status: string;
  status_code: number;
  data: {
    [key: string]: CodeData[];
  };
}

/**
 * Map of code_type values to their corresponding keys in the API response
 */
const CODE_TYPE_MAPPING: Record<string, string> = {
  'NATIONALITY': 'relationships',
  'RELATION': 'relationships', // Same as nationality
  'ID_TYPE': 'id_types',
  'PROFESSION': 'occupations',
  'OCCUPATION': 'occupations',
  'PURPOSE': 'purpose_of_remittance',
  'PAYMENT_MODE': 'payment_modes',
  'SOURCE_OF_FUNDS': 'source_of_funds',
  'COUNTRY': 'countries',
  'CURRENCY': 'currencies',
  'BANK': 'banks',
  'BRANCH': 'branches',
  'CITY': 'cities',
  'STATE': 'states'
};

/**
 * Filter the full codes response based on code_type
 */
export function filterCodesByType(fullResponse: string, codeType: string): string {
  try {
    const data: ApiResponse = JSON.parse(fullResponse);
    
    // If no code_type specified, return full response
    if (!codeType || codeType.trim() === '') {
      return fullResponse;
    }
    
    // Get the key for this code type
    const dataKey = CODE_TYPE_MAPPING[codeType.toUpperCase()];
    
    if (!dataKey) {
      console.warn(`⚠️ Unknown code_type: ${codeType}. Returning full response.`);
      return fullResponse;
    }
    
    // Check if this key exists in the data
    if (!data.data || !data.data[dataKey]) {
      console.warn(`⚠️ No data found for key: ${dataKey}. Returning full response.`);
      return fullResponse;
    }
    
    // Create filtered response with only the requested code type
    const filteredResponse: ApiResponse = {
      status: data.status,
      status_code: data.status_code,
      data: {
        [dataKey]: data.data[dataKey]
      }
    };
    
    const filteredJson = JSON.stringify(filteredResponse, null, 2);
    
    console.log(`✂️ Filtered codes response:`);
    console.log(`   - Original size: ${fullResponse.length} bytes (~${Math.round(fullResponse.length / 1024)}KB)`);
    console.log(`   - Filtered size: ${filteredJson.length} bytes (~${Math.round(filteredJson.length / 1024)}KB)`);
    console.log(`   - Reduction: ${Math.round((1 - filteredJson.length / fullResponse.length) * 100)}%`);
    console.log(`   - Code type: ${codeType} → ${dataKey}`);
    console.log(`   - Items returned: ${data.data[dataKey].length}`);
    
    return filteredJson;
  } catch (error) {
    console.error('❌ Error filtering codes:', error);
    return fullResponse;
  }
}

/**
 * Get available code types from a full codes response
 */
export function getAvailableCodeTypes(fullResponse: string): string[] {
  try {
    const data: ApiResponse = JSON.parse(fullResponse);
    
    if (!data.data) {
      return [];
    }
    
    // Return the keys present in the response
    return Object.keys(data.data);
  } catch (error) {
    console.error('❌ Error parsing codes response:', error);
    return [];
  }
}

/**
 * Get statistics about the codes response
 */
export function getCodeStats(fullResponse: string): Record<string, number> {
  try {
    const data: ApiResponse = JSON.parse(fullResponse);
    
    if (!data.data) {
      return {};
    }
    
    const stats: Record<string, number> = {};
    
    for (const [key, values] of Object.entries(data.data)) {
      if (Array.isArray(values)) {
        stats[key] = values.length;
      }
    }
    
    return stats;
  } catch (error) {
    console.error('❌ Error getting code stats:', error);
    return {};
  }
}
