'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'client' | 'seller' | 'admin'>('client');
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, role);
    router.push('/');
  };

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
        <h1 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '2rem' }}>Welcome Back</h1>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}
              placeholder="user@example.com"
            />
          </div>
          
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Login As (Mock RBAC)</label>
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value as any)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
            >
              <option value="client">Client (Shopper)</option>
              <option value="seller">Seller (Vendor)</option>
              <option value="admin">Administrator</option>
            </select>
          </div>
          
          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1rem' }}>
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
