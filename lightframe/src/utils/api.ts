// API utility for making requests with automatic base URL
import { getValidToken } from './auth';

const API_BASE_URL = import.meta.env.VITE_API_URL;

interface ApiRequestOptions extends RequestInit {
  headers?: Record<string, string>;
}

export const apiRequest = async (endpoint: string, options: ApiRequestOptions = {}) => {
  // Ensure endpoint starts with /
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  // Get valid auth token (this will auto-logout if expired)
  const token = getValidToken();
  
  // Prepare headers
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  // Add auth header if token exists
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  // Make the request
  const response = await fetch(`${API_BASE_URL}${cleanEndpoint}`, {
    ...options,
    headers,
  });
  
  return response;
};

// Convenience methods for common HTTP verbs
export const api = {
  get: (endpoint: string, options?: Omit<ApiRequestOptions, 'method'>) =>
    apiRequest(endpoint, { ...options, method: 'GET' }),
    
  post: (endpoint: string, data?: Record<string, unknown> | string, options?: Omit<ApiRequestOptions, 'method' | 'body'>) =>
    apiRequest(endpoint, {
      ...options,
      method: 'POST',
      body: data ? (typeof data === 'string' ? data : JSON.stringify(data)) : undefined,
    }),
    
  put: (endpoint: string, data?: Record<string, unknown> | string, options?: Omit<ApiRequestOptions, 'method' | 'body'>) =>
    apiRequest(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? (typeof data === 'string' ? data : JSON.stringify(data)) : undefined,
    }),
    
  delete: (endpoint: string, options?: Omit<ApiRequestOptions, 'method'>) =>
    apiRequest(endpoint, { ...options, method: 'DELETE' }),
};

export default api;
