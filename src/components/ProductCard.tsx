'use client';
import Link from 'next/link';
import { Product } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { ShoppingCart, Heart, Star, Eye, Zap, GitCompare } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useCompare } from '@/context/CompareContext';

function FlashCountdown({ endsAt }: { endsAt: string }) {
  const [timeLeft, setTimeLeft] = useState('');
  useEffect(() => {
    const update = () => {
      const diff = new Date(endsAt).getTime() - Date.now();
      if (diff <= 0) { setTimeLeft('Ended'); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`);
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, [endsAt]);
  return <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{timeLeft}</span>;
}

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();
  const isLiked = isInWishlist(product.id);
  const inCompare = isInCompare(product.id);

  const isFlashActive = product.flashSaleEndsAt && new Date(product.flashSaleEndsAt) > new Date();
  const displayPrice = isFlashActive && product.flashSalePrice ? product.flashSalePrice : product.price;
  const discount = product.discountPercent || (product.originalPrice && product.originalPrice > product.price
    ? Math.round((1 - product.price / product.originalPrice) * 100) : 0);

  const CONDITION_LABELS: Record<string, { label: string; color: string; bg: string }> = {
    new:         { label: 'New',         color: '#14532d', bg: '#bbf7d0' },
    used:        { label: 'Used',        color: '#92400e', bg: '#fef3c7' },
    refurbished: { label: 'Refurbished', color: '#1e40af', bg: '#dbeafe' },
  };

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
      {/* Badges */}
      <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
        {isFlashActive && (
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)', background: '#dc2626', color: 'white', fontSize: '0.65rem', fontWeight: 800 }}>
            <Zap size={10} /> FLASH
          </span>
        )}
        {discount > 0 && !isFlashActive && (
          <span style={{ padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)', background: '#dc2626', color: 'white', fontSize: '0.7rem', fontWeight: 800 }}>
            -{discount}%
          </span>
        )}
        {product.condition && product.condition !== 'new' && CONDITION_LABELS[product.condition] && (
          <span style={{ padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)', background: CONDITION_LABELS[product.condition].bg, color: CONDITION_LABELS[product.condition].color, fontSize: '0.65rem', fontWeight: 700 }}>
            {CONDITION_LABELS[product.condition].label}
          </span>
        )}
        {product.stock > 0 && product.stock < 5 && (
          <span style={{ padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)', background: '#fef3c7', color: '#92400e', fontSize: '0.65rem', fontWeight: 700 }}>
            Only {product.stock} left
          </span>
        )}
        {product.stock === 0 && (
          <span style={{ padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)', background: '#fee2e2', color: '#991b1b', fontSize: '0.65rem', fontWeight: 700 }}>
            Out of stock
          </span>
        )}
      </div>

      {/* Wishlist + Compare */}
      <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
        <button onClick={() => isLiked ? removeFromWishlist(product.id) : addToWishlist(product)}
          style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isLiked ? 'var(--error)' : 'var(--text-tertiary)', boxShadow: 'var(--shadow-sm)', cursor: 'pointer' }}>
          <Heart size={14} fill={isLiked ? 'var(--error)' : 'none'} />
        </button>
        <button onClick={() => inCompare ? removeFromCompare(product.id) : addToCompare(product)}
          title={inCompare ? 'Remove from compare' : 'Add to compare'}
          style={{ width: '32px', height: '32px', borderRadius: '50%', background: inCompare ? 'var(--accent-color)' : 'var(--bg-primary)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: inCompare ? 'var(--bg-primary)' : 'var(--text-tertiary)', boxShadow: 'var(--shadow-sm)', cursor: 'pointer' }}>
          <GitCompare size={13} />
        </button>
      </div>

      {/* Image */}
      <Link href={`/catalog/${product.id}`}>
        <div style={{ height: '200px', background: 'var(--bg-secondary)', overflow: 'hidden' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={product.image} alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
            onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.06)')}
            onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}
          />
        </div>
      </Link>

      {/* Flash sale timer */}
      {isFlashActive && product.flashSaleEndsAt && (
        <div style={{ padding: '0.4rem 0.75rem', background: '#fef2f2', borderBottom: '1px solid #fecaca', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontSize: '0.75rem', color: '#dc2626' }}>
          <Zap size={12} /> Ends in <FlashCountdown endsAt={product.flashSaleEndsAt} />
        </div>
      )}

      {/* Info */}
      <div style={{ padding: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{product.brand}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {product.rating > 0 && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                <Star size={10} fill="#f59e0b" color="#f59e0b" />{product.rating.toFixed(1)}
              </span>
            )}
            {(product.views || 0) > 0 && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
                <Eye size={10} />{product.views}
              </span>
            )}
          </div>
        </div>

        <Link href={`/catalog/${product.id}`}>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {product.name}
          </h3>
        </Link>

        {product.colors && product.colors.length > 0 && (
          <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
            {product.colors.slice(0, 5).map((c, i) => (
              <div key={i} title={c} style={{ width: '12px', height: '12px', borderRadius: '50%', background: c, border: '1.5px solid var(--border-color)' }} />
            ))}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '0.625rem', borderTop: '1px solid var(--border-color)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
              <span style={{ fontWeight: 800, fontSize: '1rem', letterSpacing: '-0.02em', color: isFlashActive ? '#dc2626' : 'var(--text-primary)' }}>
                ${displayPrice.toLocaleString()}
              </span>
              {(product.originalPrice && product.originalPrice > displayPrice) && (
                <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textDecoration: 'line-through' }}>
                  ${product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={() => addToCart({ ...product, price: displayPrice }, 1)}
            disabled={product.stock === 0}
            style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.4rem 0.75rem', borderRadius: 'var(--radius-md)', background: product.stock === 0 ? 'var(--bg-tertiary)' : 'var(--accent-color)', color: product.stock === 0 ? 'var(--text-tertiary)' : 'var(--bg-primary)', fontSize: '0.75rem', fontWeight: 600, cursor: product.stock === 0 ? 'not-allowed' : 'pointer', border: 'none' }}
          >
            <ShoppingCart size={13} /> Add
          </button>
        </div>
      </div>
    </div>
  );
}
