// Secure authentication utilities
export const AUTH_CONFIG = {
  ADMIN_EMAIL: 'admin@kec.com',
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours
};

// Verify admin session
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('adminToken');
  const email = localStorage.getItem('adminEmail');
  
  if (!token || !email || email !== AUTH_CONFIG.ADMIN_EMAIL) {
    return false;
  }
  
  // Check if session is still valid (basic token format check)
  try {
    const decoded = atob(token);
    const parts = decoded.split(':');
    if (parts.length !== 3 || parts[0] !== AUTH_CONFIG.ADMIN_EMAIL) {
      return false;
    }
    
    const timestamp = parseInt(parts[1]);
    const now = Date.now();
    
    // Check if session has expired
    if (now - timestamp > AUTH_CONFIG.SESSION_TIMEOUT) {
      logout();
      return false;
    }
    
    return true;
  } catch {
    return false;
  }
};

// Logout function
export const logout = (): void => {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminEmail');
};

// Get admin email
export const getAdminEmail = (): string | null => {
  return localStorage.getItem('adminEmail');
};