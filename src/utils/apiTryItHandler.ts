import { APIEndpoint } from '../types';

/**
 * Handler for "Try It Now" button - uses proxy server pattern like APIReferencePage
 * This utility function can be reused across all API pages
 */
export const createApiTryItHandler = () => {
  return async (
    endpoint: APIEndpoint,
    requestBody: string,
    headers: Record<string, string>,
    queryParams?: Record<string, string>,
    pathParams?: Record<string, string>
  ): Promise<string> => {
    try {
      // Use the proxy server at /api (proxied by Vite to localhost:3001)
      const baseUrl = '/api';
      
      // Construct the full URL
      let url = `${baseUrl}${endpoint.path}`;
      
      // Replace path parameters if provided
      if (pathParams && Object.keys(pathParams).length > 0) {
        Object.entries(pathParams).forEach(([key, value]) => {
          const placeholder = `{${key}}`;
          if (url.includes(placeholder)) {
            url = url.replace(placeholder, value || '');
          }
        });
      }
      
      // Add query parameters if provided
      if (queryParams && Object.keys(queryParams).length > 0) {
        const urlParams = new URLSearchParams();
        Object.entries(queryParams).forEach(([key, value]) => {
          if (value && value.trim() !== '') {
            urlParams.append(key, value);
          }
        });
        if (urlParams.toString()) {
          url += `?${urlParams.toString()}`;
        }
      }
      
      console.log(`🚀 Making API call to: ${url}`);
      console.log('📝 Request body:', requestBody);
      console.log('📋 Headers:', headers);
      
      // Make the API call
      const response = await fetch(url, {
        method: endpoint.method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: endpoint.method !== 'GET' ? requestBody : undefined,
      });
      
      // Get response text
      const responseText = await response.text();
      
      // Try to parse as JSON for better formatting
      try {
        const responseJson = JSON.parse(responseText);
        return JSON.stringify(responseJson, null, 2);
      } catch {
        return responseText || `Status: ${response.status} ${response.statusText}`;
      }
    } catch (error) {
      console.error('❌ API Error:', error);
      return JSON.stringify({
        error: 'API Request Failed',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        details: 'Please check your network connection and ensure the proxy server is running'
      }, null, 2);
    }
  };
};

