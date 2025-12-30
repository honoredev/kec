import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdsList() {
  const navigate = useNavigate();
  
  useEffect(() => {
    navigate('/dashboard');
  }, [navigate]);

  return <div>Redirecting to Dashboard...</div>;
}