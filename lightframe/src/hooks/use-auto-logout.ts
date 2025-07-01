import { useEffect } from 'react';
import { checkTokenAndLogout } from '../utils/auth';

/**
 * Hook to automatically check for token expiration and logout if needed
 * This runs periodically to ensure users are logged out when tokens expire
 */
export const useAutoLogout = (intervalMinutes: number = 5) => {
  useEffect(() => {
    // Check token immediately
    checkTokenAndLogout();

    // Set up periodic checking
    const intervalMs = intervalMinutes * 60 * 1000;
    const interval = setInterval(() => {
      checkTokenAndLogout();
    }, intervalMs);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [intervalMinutes]);
};
