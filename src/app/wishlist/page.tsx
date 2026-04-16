'use client';
import Link from 'next/link';
import { useWishlist } from '@/context/WishlistContext';
import ProductCard from '@/components/ProductCard';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function WishlistPage() {
  const { wishlistItems } = useWishlist();

  return (
    <ProtectedRoute>
      <div className="container" style={{ padding: '2rem 0' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '2rem' }}>Your Wishlist</h1>
      
      {wishlistItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem 2rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', background: 'var(--bg-card)' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>💝</div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Your wishlist is empty</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.875rem' }}>Save items you love by clicking the heart icon.</p>
          <Link href="/catalog" className="btn-primary" style={{ padding: '0.75rem 1.5rem' }}>Discover Products</Link>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '2rem' 
        }}>
          {wishlistItems.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
    </ProtectedRoute>
  );
}
