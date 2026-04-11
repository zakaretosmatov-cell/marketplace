'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { LogIn, UserPlus } from 'lucide-react';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'client' | 'seller'>('client');
  const [loading, setLoading] = useState(false);
  
  const { loginWithEmail, registerWithEmail, loginWithGoogle } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please enter both email and password', 'error');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await loginWithEmail(email, password);
        showToast('Successfully logged in!', 'success');
      } else {
        await registerWithEmail(email, password, role);
        showToast('Account created successfully!', 'success');
      }
      router.push('/');
    } catch (error: any) {
      console.error(error);
      showToast(error.message || 'Authentication failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      // For Google login we default to 'client' on initial signup.
      await loginWithGoogle('client');
      showToast('Successfully logged in with Google!', 'success');
      router.push('/');
    } catch (error: any) {
      console.error(error);
      showToast(error.message || 'Google Auth failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', padding: '4rem 1rem' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
        
        {/* Toggle Login / Register */}
        <div style={{ display: 'flex', marginBottom: '2rem', borderRadius: '0.5rem', backgroundColor: 'var(--bg-secondary)', padding: '0.25rem' }}>
          <button 
            type="button"
            onClick={() => setIsLogin(true)}
            style={{ 
              flex: 1, padding: '0.75rem', border: 'none', borderRadius: '0.375rem',
              backgroundColor: isLogin ? 'var(--bg-primary)' : 'transparent',
              color: isLogin ? 'var(--text-primary)' : 'var(--text-secondary)',
              boxShadow: isLogin ? 'var(--shadow-sm)' : 'none',
              cursor: 'pointer', fontWeight: 500, transition: 'all 0.2s'
            }}
          >
            Sign In
          </button>
          <button 
            type="button"
            onClick={() => setIsLogin(false)}
            style={{ 
              flex: 1, padding: '0.75rem', border: 'none', borderRadius: '0.375rem',
              backgroundColor: !isLogin ? 'var(--bg-primary)' : 'transparent',
              color: !isLogin ? 'var(--text-primary)' : 'var(--text-secondary)',
              boxShadow: !isLogin ? 'var(--shadow-sm)' : 'none',
              cursor: 'pointer', fontWeight: 500, transition: 'all 0.2s'
            }}
          >
            Sign Up
          </button>
        </div>

        <h1 style={{ textAlign: 'center', fontSize: '1.5rem', marginBottom: '2rem', fontWeight: 600 }}>
          {isLogin ? 'Welcome Back' : 'Create an Account'}
        </h1>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
              placeholder="••••••••"
              minLength={6}
            />
          </div>
          
          {!isLogin && (
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>I want to be a:</label>
              <select 
                value={role} 
                onChange={(e) => setRole(e.target.value as any)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
              >
                <option value="client">Client (Shopper)</option>
                <option value="seller">Seller (Vendor)</option>
              </select>
            </div>
          )}
          
          <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', padding: '0.875rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            {loading ? 'Processing...' : isLogin ? <><LogIn size={18} /> Sign In</> : <><UserPlus size={18} /> Sign Up</>}
          </button>
        </form>

        <div style={{ margin: '1.5rem 0', display: 'flex', alignItems: 'center', textAlign: 'center', color: 'var(--text-tertiary)' }}>
          <div style={{ flex: 1, borderTop: '1px solid var(--border-color)' }}></div>
          <span style={{ padding: '0 1rem', fontSize: '0.875rem' }}>Or continue with</span>
          <div style={{ flex: 1, borderTop: '1px solid var(--border-color)' }}></div>
        </div>

        <button 
          type="button"
          onClick={handleGoogleLogin} 
          disabled={loading}
          style={{ 
            width: '100%', padding: '0.875rem', borderRadius: '0.5rem', 
            border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)', 
            color: 'var(--text-primary)', cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem',
            fontWeight: 500, transition: 'background-color 0.2s'
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Google
        </button>

      </div>
    </div>
  );
}
