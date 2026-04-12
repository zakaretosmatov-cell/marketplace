import Link from 'next/link';
import { Product } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { ShoppingCart, Heart } from 'lucide-react';

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const isLiked = isInWishlist(product.id);

  const handleWishlistToggle = () => {
    if (isLiked) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <div className="card" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      overflow: 'hidden', 
      position: 'relative',
      background: 'var(--bg-card)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
    }}>
      {/* Favorite Button */}
      <button 
        onClick={handleWishlistToggle}
        style={{ 
          position: 'absolute', top: '15px', right: '15px', zIndex: 10,
          backgroundColor: 'var(--glass-bg)', 
          backdropFilter: 'blur(8px)',
          borderRadius: '50%', width: '40px', height: '40px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '1px solid var(--glass-border)',
          boxShadow: 'var(--shadow-sm)', 
          color: isLiked ? 'var(--error)' : 'var(--text-secondary)',
          transition: 'all 0.2s'
        }}
      >
        <Heart size={20} fill={isLiked ? 'var(--error)' : 'none'} />
      </button>

      {/* Image Section */}
      <div style={{ padding: '0.75rem' }}>
        <div style={{ 
          height: '240px', 
          backgroundColor: 'var(--bg-secondary)', 
          position: 'relative', 
          overflow: 'hidden',
          borderRadius: 'var(--radius-md)'
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={product.image} 
            alt={product.name} 
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} 
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          />
          {product.stock === 0 ? (
            <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '0.9rem', textTransform: 'uppercase' }}>
              Currently Unavailable
            </div>
          ) : product.stock < 5 && (
            <div style={{ position: 'absolute', top: '10px', left: '10px', backgroundColor: 'var(--warning)', color: 'white', padding: '4px 10px', borderRadius: 'var(--radius-pill)', fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase' }}>
              Limited Stock
            </div>
          )}
        </div>
      </div>
      
      {/* Content Section */}
      <div style={{ padding: '1.5rem', paddingTop: '0.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <p style={{ color: 'var(--accent-color)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
          {product.category}
        </p>
        
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem', lineHeight: 1.3 }}>
          <Link href={`/catalog/${product.id}`}>{product.name}</Link>
        </h3>
        
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {product.description}
        </p>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '1.4rem', letterSpacing: '-0.02em' }}>
            ${product.price.toLocaleString()}
          </span>
          <button 
            className="btn-primary pill-button" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              opacity: product.stock === 0 ? 0.5 : 1, 
              cursor: product.stock === 0 ? 'not-allowed' : 'pointer' 
            }}
            onClick={() => addToCart(product, 1)}
            disabled={product.stock === 0}
          >
            <ShoppingCart size={18} />
            <span>Buy Now</span>
          </button>
        </div>
      </div>
    </div>
  );
}
