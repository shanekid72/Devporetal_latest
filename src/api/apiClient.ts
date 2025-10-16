import axios from "axios";
import { apiCache, generateCacheKey, getCacheTTL } from "../utils/cacheManager";
import { validateFiltersOrThrow } from "../utils/filterValidation";

// Use proxy server to avoid CORS issues
// In Docker/production, this will use the nginx proxy at /api
// In development, this uses the local proxy server at localhost:3001
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

/**
 * API call options
 */
export interface ApiCallOptions {
  skipCache?: boolean;     // Skip cache and force fresh fetch
  skipValidation?: boolean; // Skip filter validation
  customTTL?: number;       // Custom cache TTL in milliseconds
}

/**
 * Makes API calls to the backend with caching and filter validation
 * @param method HTTP method (GET, POST, PUT, DELETE)
 * @param endpoint API endpoint path
 * @param data Request body for POST/PUT requests
 * @param headers Request headers
 * @param queryParams Query parameters for GET requests
 * @param options Additional options for caching and validation
 * @returns Promise with the API response (includes fromCache flag for GET requests)
 */
export const makeApiCall = async (
  method: string,
  endpoint: string,
  data?: any,
  headers: Record<string, string> = {},
  queryParams?: Record<string, string>,
  options: ApiCallOptions = {}
) => {
  try {
    // Skip validation for authentication and non-master API endpoints
    const isAuthEndpoint = endpoint.includes('/auth/');
    const shouldValidate = !options.skipValidation && method === "GET" && !isAuthEndpoint;
    
    // Validate required filters for master APIs (unless explicitly skipped)
    if (shouldValidate) {
      try {
        validateFiltersOrThrow(endpoint, queryParams);
      } catch (validationError) {
        console.warn('⚠️ Filter validation failed:', validationError);
        // Only throw for actual master API endpoints that require filters
        if (endpoint.includes('/raas/masters/')) {
          throw validationError;
        }
      }
    }
    
    // Generate cache key for GET requests
    const cacheKey = generateCacheKey(method, endpoint, queryParams);
    
    // Check cache for GET requests (unless skipCache is true or auth endpoint)
    const shouldCache = method === "GET" && !options.skipCache && !isAuthEndpoint;
    
    if (shouldCache) {
      const cached = apiCache.get(cacheKey);
      if (cached) {
        console.log(`✅ Returning cached response for: ${endpoint}`);
        return { 
          data: cached, 
          fromCache: true,
          status: 200,
          statusText: 'OK (Cached)',
          headers: {},
          config: {}
        };
      }
    }
    
    // Prepare the URL - use direct API URL
    let url = `${BASE_URL}${endpoint}`;
    
    // Add query parameters for GET requests
    if (method === "GET" && queryParams) {
      const queryString = Object.entries(queryParams)
        .filter(([_, value]) => value !== undefined && value !== '')
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join("&");
      url = `${url}?${queryString}`;
    }

    console.log(`🌐 Making ${method} request to ${url}`);
    console.log("📋 Headers:", headers);
    console.log("🔍 Query Params:", queryParams);
    
    // Make the API call based on the HTTP method
    let response;
    switch (method) {
      case "GET":
        response = await axios.get(url, { headers });
        break;
        
      case "POST":
        console.log("📤 POST body:", data);
        response = await axios.post(url, data, { headers });
        break;
        
      case "PUT":
        console.log("📤 PUT body:", data);
        response = await axios.put(url, data, { headers });
        break;
        
      case "DELETE":
        response = await axios.delete(url, { headers });
        break;
        
      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }
    
    // Cache successful GET responses (excluding auth endpoints)
    if (shouldCache && response.data) {
      const ttl = options.customTTL || getCacheTTL(endpoint);
      apiCache.set(cacheKey, response.data, ttl);
      console.log(`💾 Cached response for: ${endpoint} (TTL: ${Math.round(ttl / 60000)}min)`);
    }
    
    // Return response with fromCache flag for GET requests, original response for others
    if (method === "GET") {
      return { ...response, fromCache: false };
    }
    return response;
  } catch (error) {
    console.error("❌ API call error:", error);
    throw error;
  }
};

/**
 * Handles authentication API call specifically
 * @param credentials Authentication credentials
 * @returns Promise with the authentication response
 */
export const authenticate = async (credentials: Record<string, string>) => {
  try {
    const url = `${BASE_URL}/auth/realms/cdp/protocol/openid-connect/token`;
    const headers = { "Content-Type": "application/x-www-form-urlencoded" };
    
    // Convert credentials to form data
    const formData = new URLSearchParams();
    for (const [key, value] of Object.entries(credentials)) {
      formData.append(key, value);
    }
    
    console.log("Authentication request to:", url);
    console.log("Form data:", Object.fromEntries(formData));
    
    return await axios.post(url, formData, { headers });
  } catch (error) {
    console.error("Authentication error:", error);
    throw error;
  }
};
