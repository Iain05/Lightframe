// Simple JWT token utility for client-side expiration checking

/**
 * Checks if a JWT token is expired
 */
export const isTokenExpired = (token: string): boolean => {
  try {
    // JWT tokens have 3 parts separated by dots: header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) return true;

    // Decode the payload (second part)
    const payload = JSON.parse(atob(parts[1]));
    
    // Check if token has expiration time
    if (!payload.exp) return true;

    // Compare with current time (exp is in seconds, Date.now() is in milliseconds)
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch (error) {
    // If we can't decode the token, consider it expired
    console.warn('Failed to decode JWT token:', error);
    return true;
  }
};

/**
 * Checks if the current stored token is valid, logs out if expired
 */
export const checkTokenAndLogout = (): boolean => {
  const token = localStorage.getItem('authToken');
  
  if (!token) {
    return false; // No token, user not logged in
  }

  if (isTokenExpired(token)) {
    // Token is expired, remove it and redirect to login
    localStorage.removeItem('authToken');
    window.location.href = '/login';
    return false;
  }

  return true; // Token is valid
};

/**
 * Gets the current auth token if it's valid, null if expired or missing
 */
export const getValidToken = (): string | null => {
  const token = localStorage.getItem('authToken');
  
  if (!token) return null;
  
  if (isTokenExpired(token)) {
    localStorage.removeItem('authToken');
    return null;
  }
  
  return token;
};
