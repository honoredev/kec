import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/admin/login', { replace: true });
    }
  }, [navigate]);
  
  // Only render children if authenticated
  if (!isAuthenticated()) {
    return null;
  }
  
  return <>{children}</>;
}
