'use client';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, totalAmount } = useCart();

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '2rem' }}>Your Cart</h1>
      
      {cartItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem 2rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', background: 'var(--bg-card)' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛒</div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Your cart is empty</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.875rem' }}>Looks like you haven't added anything yet.</p>
          <Link href="/catalog" className="btn-primary" style={{ padding: '0.75rem 1.5rem' }}>Browse Catalog</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(300px, 1fr)', gap: '2rem', alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {cartItems.map((item) => (
              <div key={item.id} className="card" style={{ display: 'flex', padding: '1rem', gap: '1.5rem', alignItems: 'center' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.image} alt={item.name} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '0.5rem' }} />
                
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.25rem' }}>{item.name}</h3>
                  <p style={{ color: 'var(--text-secondary)' }}>${item.price.toFixed(2)}</p>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{ padding: '0.25rem 0.75rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: '0.25rem' }}>-</button>
                  <span style={{ width: '2rem', textAlign: 'center', fontWeight: 500 }}>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ padding: '0.25rem 0.75rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: '0.25rem' }}>+</button>
                </div>
                
                <div style={{ fontWeight: 700, fontSize: '1.125rem', width: '80px', textAlign: 'right' }}>
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
                
                <button onClick={() => removeFromCart(item.id)} style={{ color: 'var(--error)', padding: '0.5rem' }}>
                  Remove
                </button>
              </div>
            ))}
          </div>
          
          <div className="card" style={{ padding: '2rem', position: 'sticky', top: 'calc(var(--header-height) + 2rem)' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>Order Summary</h2>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
              <span>Subtotal</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', fontWeight: 700, fontSize: '1.25rem' }}>
              <span>Total</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
            
            <Link href="/checkout" className="btn-primary" style={{ display: 'block', width: '100%', textAlign: 'center', marginTop: '2rem', padding: '1rem' }}>
              Proceed to Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
