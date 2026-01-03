// Secure authentication utilities
export const AUTH_CONFIG = {
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours
};

// Verify JWT token with backend
export const isAuthenticated = async (): Promise<boolean> => {
  const token = localStorage.getItem('adminToken');
  
  if (!token) {
    return false;
  }
  
  try {
    const response = await fetch('https://kec-backend-1.onrender.com/api/admin/verify', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (response.ok) {
      return true;
    } else {
      logout();
      return false;
    }
  } catch (error) {
    logout();
    return false;
  }
};

// Simple sync check for immediate validation
export const hasValidToken = (): boolean => {
  const token = localStorage.getItem('adminToken');
  return !!token;
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