'use client';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { Search, ShoppingCart, User, Heart, Compass, LogOut, ClipboardList } from 'lucide-react';

export default function Header() {
  const { user, role, logout, isLoading } = useAuth();
  const { cartItems } = useCart();
  
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header style={{ 
      height: 'var(--header-height)', 
      backgroundColor: 'var(--glass-bg)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      borderBottom: '1px solid var(--glass-border)',
      display: 'flex',
      alignItems: 'center'
    }}>
      <div className="container" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'auto 1fr auto', 
        alignItems: 'center', 
        gap: '2rem',
        width: '100%'
      }}>
        {/* Logo */}
        <Link href="/" style={{ 
          fontSize: '1.5rem', 
          fontWeight: 800, 
          color: 'var(--text-primary)', 
          letterSpacing: '-0.05em',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <div style={{ width: '32px', height: '32px', backgroundColor: 'var(--accent-color)', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            <Compass size={20} />
          </div>
          <span>NextGen</span>
        </Link>
        
        {/* Search Bar - Centered */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          backgroundColor: 'var(--bg-secondary)', 
          borderRadius: 'var(--radius-pill)', 
          padding: '0.4rem 1.2rem',
          maxWidth: '500px',
          margin: '0 auto',
          width: '100%',
          border: '1px solid var(--border-color)',
          transition: 'all 0.3s'
        }}>
          <Search size={18} color="var(--text-tertiary)" />
          <input 
            type="text" 
            placeholder="Search futuristic tech..." 
            style={{ 
              background: 'none', 
              border: 'none', 
              paddingLeft: '0.75rem', 
              width: '100%', 
              color: 'var(--text-primary)',
              fontSize: '0.9rem'
            }} 
          />
        </div>
        
        {/* Navigation Actions */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <nav style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginRight: '0.5rem' }}>
            <Link href="/orders" className="pill-button" style={{ color: "var(--text-secondary)" }}>Orders</Link>
            <Link href="/catalog" className="pill-button" style={{ 
              backgroundColor: 'var(--accent-soft)', 
              color: 'var(--accent-color)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              Explore
            </Link>
            
            {role === 'admin' && (
              <Link href="/admin" className="pill-button" style={{ color: 'var(--success)' }}>Admin</Link>
            )}
            
            {role === 'seller' && (
              <Link href="/seller" className="pill-button" style={{ color: 'var(--warning)' }}>Seller</Link>
            )}
          </nav>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link href="/wishlist" style={{ padding: '0.6rem', borderRadius: '50%', backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)', display: 'flex' }}>
              <Heart size={20} />
            </Link>
            
            <Link href="/cart" style={{ 
              padding: '0.6rem', 
              borderRadius: '50%', 
              backgroundColor: 'var(--bg-tertiary)', 
              color: 'var(--text-secondary)', 
              display: 'flex',
              position: 'relative'
            }}>
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-5px',
                  right: '-5px',
                  backgroundColor: 'var(--error)',
                  color: 'white',
                  fontSize: '0.65rem',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  border: '2px solid var(--bg-primary)'
                }}>
                  {totalItems}
                </span>
              )}
            </Link>
          </div>

          {isLoading ? (
            <div style={{ width: '40px', height: '40px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '50%', animation: 'pulse 1.5s infinite' }}></div>
          ) : user ? (
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <Link href="/profile" style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem', 
                padding: '0.35rem 1rem 0.35rem 0.35rem', 
                backgroundColor: 'var(--bg-tertiary)', 
                borderRadius: 'var(--radius-pill)',
                border: '1px solid var(--border-color)'
              }}>
                <div style={{ 
                  width: '32px', 
                  height: '32px', 
                  borderRadius: '50%', 
                  backgroundColor: 'var(--accent-color)', 
                  color: 'white', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: '0.8rem', 
                  fontWeight: 800 
                }}>
                  {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user.displayName || 'Account'}</span>
              </Link>
              <button 
                onClick={logout} 
                style={{ 
                  padding: '0.6rem', 
                  borderRadius: '50%', 
                  backgroundColor: 'var(--bg-tertiary)', 
                  color: 'var(--error)', 
                  display: 'flex' 
                }}
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link href="/login" className="btn-primary" style={{ padding: '0.6rem 1.4rem' }}>
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

