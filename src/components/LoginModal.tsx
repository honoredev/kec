import { useState, useEffect } from 'react';
import { X, Lock, User, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const LoginModal = ({ isOpen, onClose, onSuccess }: LoginModalProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignup, setIsSignup] = useState(false);
  const [canSignup, setCanSignup] = useState(false);
  const navigate = useNavigate();

  // Check if signup is allowed
  useEffect(() => {
    const checkSignupAvailability = async () => {
      try {
        const response = await fetch('https://kec-backend-1.onrender.com/api/admin/check-signup');
        if (response.status === 404) {
          // Backend doesn't have new endpoints yet, allow signup
          setCanSignup(true);
          return;
        }
        const data = await response.json();
        setCanSignup(data.canSignup);
      } catch (err) {
        // Fallback: allow signup if endpoint doesn't exist
        setCanSignup(true);
      }
    };
    if (isOpen) checkSignupAvailability();
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (isSignup) {
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('https://kec-backend-1.onrender.com/api/admin/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, email, password }),
        });
        
        const data = await response.json();
        
        if (response.ok) {
          localStorage.setItem('adminToken', 'admin-authenticated');
          onClose();
          if (onSuccess) {
            onSuccess();
          } else {
            navigate('/dashboard');
          }
        } else {
          setError(data.message || 'Signup failed');
        }
      } catch (err) {
        setError('Network error. Please try again.');
      }
    } else {
      try {
        const response = await fetch('https://kec-backend-1.onrender.com/api/admin/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });
        
        const data = await response.json();
        
        if (response.ok) {
          localStorage.setItem('adminToken', 'admin-authenticated');
          onClose();
          if (onSuccess) {
            onSuccess();
          } else {
            navigate('/dashboard');
          }
        } else {
          setError(data.message || 'Invalid credentials. Access denied.');
        }
      } catch (err) {
        setError('Network error. Please try again.');
      }
    }
    
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Lock className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{isSignup ? 'Create Admin' : 'Admin Login'}</h2>
              <p className="text-sm text-gray-500">{isSignup ? 'Setup admin account' : 'Access admin dashboard'}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-start gap-3 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          {isSignup && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </label>
              <Input
                type="text"
                required
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-11"
              />
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <User className="w-4 h-4" />
              Email Address
            </label>
            <Input
              type="email"
              required
              placeholder="Enter admin email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Password
            </label>
            <Input
              type="password"
              required
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11"
            />
          </div>

          {isSignup && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Confirm Password
              </label>
              <Input
                type="password"
                required
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-11"
              />
            </div>
          )}
          
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {loading ? (isSignup ? 'Creating...' : 'Signing in...') : (isSignup ? 'Create Admin' : 'Sign In')}
            </Button>
          </div>
          
          {canSignup && (
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsSignup(!isSignup);
                  setError(null);
                  setEmail('');
                  setPassword('');
                  setConfirmPassword('');
                  setName('');
                }}
                className="text-sm text-green-600 hover:text-green-700 font-medium"
              >
                {isSignup ? 'Already have an account? Sign In' : 'No admin account? Create One'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default LoginModal;