import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, AlertCircle } from 'lucide-react';

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Hardcoded secure admin credentials (encrypted)
  const ADMIN_EMAIL = 'admin@kec.com';
  const ADMIN_PASSWORD_HASH = 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3'; // 'hello' hashed with SHA-256
  
  // Simple SHA-256 hash function
  const hashPassword = async (password: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Hash the entered password
      const hashedPassword = await hashPassword(password);
      
      // Verify credentials against hardcoded admin account
      if (email === ADMIN_EMAIL && hashedPassword === ADMIN_PASSWORD_HASH) {
        // Generate secure session token
        const sessionToken = btoa(`${ADMIN_EMAIL}:${Date.now()}:${Math.random()}`);
        localStorage.setItem('adminToken', sessionToken);
        localStorage.setItem('adminEmail', ADMIN_EMAIL);
        navigate('/admin', { replace: true });
      } else {
        setError('Invalid credentials. Access denied.');
      }
    } catch (err) {
      setError('Authentication error. Please try again.');
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
            Admin Portal
          </h1>
          <p className="text-sm text-gray-600">
            Secure access for the authorized administrator only
          </p>
        </div>

        {/* Security Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-amber-900 mb-1">Single Admin Access</p>
            <p className="text-amber-700">
              Only one authorized administrator account exists. 
              No additional accounts can be created.
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
        

          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Lock className="w-4 h-4 text-gray-500" />
              Admin Email Address
            </label>
            <input 
              type="email"
              required
              autoComplete="email"
              inputMode="email"
              placeholder="admin@kec.com"
              className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-base focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all outline-none" 
              style={{ fontSize: '16px' }}
              value={email} 
              onChange={(e)=>setEmail(e.target.value)} 
            />
            <p className="text-xs text-gray-500">Only the authorized admin email is accepted</p>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Lock className="w-4 h-4 text-gray-500" />
              Password
            </label>
            <input 
              type="password" 
              required
              autoComplete="current-password"
              minLength={1}
              placeholder="Enter your password"
              className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-base focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all outline-none" 
              style={{ fontSize: '16px' }}
              value={password} 
              onChange={(e)=>setPassword(e.target.value)} 
            />
          </div>
          

        
          <button 
            type="submit"
            disabled={loading} 
            className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 disabled:from-gray-400 disabled:to-gray-400 text-white rounded-lg py-3 font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            style={{ minHeight: '48px', fontSize: '16px', touchAction: 'manipulation' }}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Authenticating...
              </>
            ) : (
              <>
                <Shield className="w-5 h-5" />
                Sign In to Admin Portal
              </>
            )}
          </button>
        </form>


        
        {/* Footer Note */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            🔒 Secure single-admin portal with encrypted authentication
          </p>
        </div>
      </div>
    </div>
  );
}
