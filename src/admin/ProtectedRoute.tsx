import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { hasValidToken, isAuthenticated } from '../utils/auth';

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
      
      // Verify with backend
      const valid = await isAuthenticated();
      if (!valid) {
        navigate('/admin/login', { replace: true });
      } else {
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
