import Link from 'next/link';
import { Product } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

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
    <div className="card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
      <button 
        onClick={handleWishlistToggle}
        style={{ 
          position: 'absolute', top: '10px', left: '10px', zIndex: 10,
          backgroundColor: 'white', borderRadius: '50%', width: '32px', height: '32px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: 'var(--shadow-sm)', color: isLiked ? 'var(--error)' : 'var(--text-tertiary)'
        }}
      >
        {isLiked ? '♥' : '♡'}
      </button>

      <div style={{ height: '200px', backgroundColor: '#f1f5f9', position: 'relative', overflow: 'hidden' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={product.image} 
          alt={product.name} 
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }} 
        />
        {product.stock === 0 && (
          <div style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: 'var(--error)', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>
            Out of Stock
          </div>
        )}
      </div>
      
      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            <Link href={`/catalog/${product.id}`}>{product.name}</Link>
          </h3>
          <span style={{ fontWeight: 700, color: 'var(--accent-color)', fontSize: '1.125rem', marginLeft: '1rem' }}>
            ${product.price.toFixed(2)}
          </span>
        </div>
        
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {product.description}
        </p>
        
        <div style={{ marginTop: 'auto', display: 'flex', gap: '1rem' }}>
          <button 
            className="btn-primary" 
            style={{ flex: 1, opacity: product.stock === 0 ? 0.5 : 1, cursor: product.stock === 0 ? 'not-allowed' : 'pointer' }}
            onClick={() => addToCart(product, 1)}
            disabled={product.stock === 0}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
