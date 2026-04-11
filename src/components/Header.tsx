'use client';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

export default function Header() {
  const { user, role, logout, isLoading } = useAuth();
  const { cartItems } = useCart();
  
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header style={{ 
      height: 'var(--header-height)', 
      borderBottom: '1px solid var(--border-color)',
      backgroundColor: 'var(--glass-bg)',
      backdropFilter: 'blur(10px)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
        <Link href="/" style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-color)' }}>
          NextGenStore
        </Link>
        
        <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link href="/catalog" style={{ fontWeight: 500 }}>Catalog</Link>
          
          {role === 'admin' && (
            <Link href="/admin" style={{ fontWeight: 500, color: 'var(--success)' }}>Admin</Link>
          )}
          
          {role === 'seller' && (
            <Link href="/seller" style={{ fontWeight: 500, color: 'var(--warning)' }}>Seller Panel</Link>
          )}
          
          <Link href="/wishlist" style={{ fontWeight: 500 }}>
            Wishlist
          </Link>
          
          <Link href="/cart" style={{ fontWeight: 500, position: 'relative' }}>
            Cart
            {totalItems > 0 && (
              <span style={{
                position: 'absolute',
                top: '-8px',
                right: '-12px',
                backgroundColor: 'var(--accent-color)',
                color: 'white',
                fontSize: '0.75rem',
                padding: '2px 6px',
                borderRadius: '10px',
                fontWeight: 700
              }}>
                {totalItems}
              </span>
            )}
          </Link>

          {isLoading ? (
            <div style={{ width: '120px', height: '38px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '0.5rem', animation: 'pulse 1.5s infinite' }}></div>
          ) : user ? (
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.25rem 0.75rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: '2rem' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'var(--accent-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700 }}>
                  {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
                </div>
                <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)' }}>
                  {user.displayName || user.email?.split('@')[0]}
                  {role && <span style={{ marginLeft: '0.5rem', fontSize: '0.7rem', padding: '0.1rem 0.4rem', backgroundColor: 'var(--glass-bg)', border: '1px solid var(--border-color)', borderRadius: '1rem', color: 'var(--text-secondary)' }}>{role}</span>}
                </span>
              </div>
              <button 
                onClick={logout} 
                style={{ 
                  padding: '0.4rem 0.8rem', 
                  border: '1px solid var(--border-color)', 
                  borderRadius: '0.5rem',
                  fontWeight: 500,
                  fontSize: '0.875rem',
                  backgroundColor: 'transparent',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                Logout
              </button>
            </div>
          ) : (
            <Link href="/login" className="btn-primary" style={{ padding: '0.5rem 1.5rem', borderRadius: '2rem' }}>
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
