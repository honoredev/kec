import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, AlertCircle, UserPlus } from 'lucide-react';

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignup, setIsSignup] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
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
        const response = await fetch('https://gazelle-back.onrender.com/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, email, password }),
        });
        
        const data = await response.json();
        
        if (response.ok) {
          // Registration successful, switch to login
          setIsSignup(false);
          setError(null);
          setName('');
          setPassword('');
          setConfirmPassword('');
          setEmail('');
          alert('Account created successfully! You can now login with your credentials.');
        } else {
          setError(data.message || 'Registration failed');
        }
      } catch (err) {
        setError('Network error. Please try again.');
      }
    } else {
      // Login logic - authenticate with backend
      try {
        const response = await fetch('https://gazelle-back.onrender.com/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });
        
        const data = await response.json();
        
        if (response.ok) {
          // Login successful
          localStorage.setItem('adminToken', data.token);
          navigate('/admin', { replace: true });
        } else {
          setError(data.message || 'Invalid credentials');
        }
      } catch (err) {
        setError('Network error. Please try again.');
      }
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-green-50 via-white to-green-50">
      <div className="w-full max-w-md">
        {/* Header with Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-600 to-green-500 rounded-full shadow-lg mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isSignup ? 'Create Admin Account' : 'Admin Portal'}
          </h1>
          <p className="text-sm text-gray-600">
            {isSignup ? 'Register as a new administrator' : 'Restricted access for authorized administrators only'}
          </p>
        </div>

        {/* Security Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-amber-900 mb-1">Authorized Access Only</p>
            <p className="text-amber-700">
              Only pre-approved admin email addresses can access this portal. 
              Contact system administrator if you need access.
            </p>
          </div>
        </div>

        {/* Login/Signup Form */}
        <form onSubmit={onSubmit} className="bg-white rounded-xl shadow-xl p-8 space-y-5 border border-gray-100">
          {error && (
            <div className="flex items-start gap-3 text-sm text-red-600 bg-red-50 p-4 rounded-lg border border-red-200">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold mb-1">Login Failed</p>
                <p>{error}</p>
              </div>
            </div>
          )}
        
          {isSignup && (
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-gray-500" />
                Full Name
              </label>
              <input 
                type="text"
                required
                placeholder="Enter your full name"
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-base focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all outline-none" 
                style={{ fontSize: '16px' }}
                value={name} 
                onChange={(e)=>setName(e.target.value)} 
              />
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Lock className="w-4 h-4 text-gray-500" />
              {isSignup ? 'Email Address' : 'Admin Email Address'}
            </label>
            <input 
              type="email"
              required
              autoComplete="email"
              inputMode="email"
              placeholder={isSignup ? 'your@email.com' : 'admin@impara.com'}
              className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-base focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all outline-none" 
              style={{ fontSize: '16px' }}
              value={email} 
              onChange={(e)=>setEmail(e.target.value)} 
            />
            {!isSignup && <p className="text-xs text-gray-500">Must be a pre-authorized admin email</p>}
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Lock className="w-4 h-4 text-gray-500" />
              Password
            </label>
            <input 
              type="password" 
              required
              autoComplete={isSignup ? 'new-password' : 'current-password'}
              minLength={6}
              placeholder={isSignup ? 'Create a password' : 'Enter your password'}
              className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-base focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all outline-none" 
              style={{ fontSize: '16px' }}
              value={password} 
              onChange={(e)=>setPassword(e.target.value)} 
            />
          </div>
          
          {isSignup && (
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Lock className="w-4 h-4 text-gray-500" />
                Confirm Password
              </label>
              <input 
                type="password" 
                required
                autoComplete="new-password"
                minLength={6}
                placeholder="Confirm your password"
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-base focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all outline-none" 
                style={{ fontSize: '16px' }}
                value={confirmPassword} 
                onChange={(e)=>setConfirmPassword(e.target.value)} 
              />
            </div>
          )}
        
          <button 
            type="submit"
            disabled={loading} 
            className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 disabled:from-gray-400 disabled:to-gray-400 text-white rounded-lg py-3 font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            style={{ minHeight: '48px', fontSize: '16px', touchAction: 'manipulation' }}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                {isSignup ? <UserPlus className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
                {isSignup ? 'Create Admin Account' : 'Sign In to Admin Portal'}
              </>
            )}
          </button>
        </form>

        {/* Toggle between Login/Signup */}
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => {
              setIsSignup(!isSignup);
              setError(null);
              setName('');
              setConfirmPassword('');
            }}
            className="text-green-600 hover:text-green-700 font-semibold text-sm transition-colors"
          >
            {isSignup ? 'Already have an account? Sign In' : 'Need an account? Create One'}
          </button>
        </div>
        
        {/* Footer Note */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            🔒 This is a secure admin portal. All activities are monitored and logged.
          </p>
        </div>
      </div>
    </div>
  );
}
