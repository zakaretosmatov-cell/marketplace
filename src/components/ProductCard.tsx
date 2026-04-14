'use client';
import Link from 'next/link';
import { Product } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { ShoppingCart, Heart, Star } from 'lucide-react';

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const isLiked = isInWishlist(product.id);

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border-color)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      transition: 'box-shadow 0.2s, transform 0.2s',
      position: 'relative',
    }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-lg)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'none'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
    >
      {/* Wishlist */}
      <button onClick={() => isLiked ? removeFromWishlist(product.id) : addToWishlist(product)}
        style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 10, width: '34px', height: '34px', borderRadius: '50%', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isLiked ? 'var(--error)' : 'var(--text-tertiary)', boxShadow: 'var(--shadow-sm)', transition: 'all 0.15s' }}
      >
        <Heart size={15} fill={isLiked ? 'var(--error)' : 'none'} />
      </button>

      {/* Stock badge */}
      {product.stock > 0 && product.stock < 5 && (
        <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 10, background: '#fef3c7', color: '#92400e', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)', fontSize: '0.7rem', fontWeight: 700 }}>
          Only {product.stock} left
        </div>
      )}
      {product.stock === 0 && (
        <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 10, background: '#fee2e2', color: '#991b1b', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)', fontSize: '0.7rem', fontWeight: 700 }}>
          Out of stock
        </div>
      )}

      {/* Image */}
      <Link href={`/catalog/${product.id}`}>
        <div style={{ height: '220px', background: 'var(--bg-secondary)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={product.image} alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
            onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.06)')}
            onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}
          />
        </div>
      </Link>

      {/* Info */}
      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{product.brand}</span>
          {product.rating > 0 && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              <Star size={11} fill="#f59e0b" color="#f59e0b" />
              {product.rating.toFixed(1)}
            </span>
          )}
        </div>

        <Link href={`/catalog/${product.id}`}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {product.name}
          </h3>
        </Link>

        {/* Colors */}
        {product.colors && product.colors.length > 0 && (
          <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
            {product.colors.slice(0, 5).map((c, i) => (
              <div key={i} title={c} style={{ width: '14px', height: '14px', borderRadius: '50%', background: c, border: '1.5px solid var(--border-color)' }} />
            ))}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
          <span style={{ fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.02em' }}>
            ${product.price.toLocaleString()}
          </span>
          <button
            onClick={() => addToCart(product, 1)}
            disabled={product.stock === 0}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.45rem 0.875rem', borderRadius: 'var(--radius-md)', background: product.stock === 0 ? 'var(--bg-tertiary)' : 'var(--accent-color)', color: product.stock === 0 ? 'var(--text-tertiary)' : 'var(--bg-primary)', fontSize: '0.8rem', fontWeight: 600, cursor: product.stock === 0 ? 'not-allowed' : 'pointer', transition: 'opacity 0.15s', border: 'none' }}
          >
            <ShoppingCart size={14} />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
