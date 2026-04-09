'use client';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

export default function Header() {
  const { user, role, logout } = useAuth();
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

          {user ? (
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Welcome, {user.email}</span>
              <button 
                onClick={logout} 
                style={{ 
                  padding: '0.5rem 1rem', 
                  border: '1px solid var(--border-color)', 
                  borderRadius: '0.5rem',
                  fontWeight: 500
                }}>
                Logout
              </button>
            </div>
          ) : (
            <Link href="/login" className="btn-primary" style={{ padding: '0.5rem 1rem' }}>
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
