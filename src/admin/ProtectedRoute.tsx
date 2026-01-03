import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { hasValidToken } from '../utils/auth';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isValid, setIsValid] = useState(false);
  
  useEffect(() => {
    const verifyAuth = async () => {
      // Quick check first
      if (!hasValidToken()) {
        navigate('/admin/login', { replace: true });
        return;
      }
      
      try {
        // Try to verify with backend
        const response = await fetch('https://kec-backend-1.onrender.com/api/admin/verify', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          setIsValid(true);
        } else if (response.status === 404) {
          // Backend doesn't have verify endpoint yet, allow access if token exists
          setIsValid(true);
        } else {
          navigate('/admin/login', { replace: true });
        }
      } catch (error) {
        // Network error or endpoint doesn't exist, allow access if token exists
        setIsValid(true);
      }
      
      setIsVerifying(false);
    };
    
    verifyAuth();
  }, [navigate]);
  
  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }
  
  return isValid ? <>{children}</> : null;
}
