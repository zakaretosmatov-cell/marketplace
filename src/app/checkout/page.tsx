'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { mockApi } from '@/lib/mockApi';

export default function CheckoutPage() {
  const { cartItems, totalAmount, clearCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [address, setAddress] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  if (cartItems.length === 0) {
    if (typeof window !== 'undefined') router.push('/cart');
    return null;
  }

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === 'SAVE20') {
      setDiscount(totalAmount * 0.2);
      showToast('Promo code applied successfully! 20% off.', 'success');
    } else {
      setDiscount(0);
      showToast('Invalid promo code.', 'error');
    }
  };

  const finalAmount = totalAmount - discount;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Simulate API call for creating an order
      await mockApi.createOrder({
        userId: user?.uid || 'guest',
        items: cartItems.map(item => ({
          productId: item.id,
          productName: item.name,
          price: item.price,
          quantity: item.quantity,
          sellerId: item.sellerId
        })),
        totalAmount: finalAmount,
        shippingAddress: address,
      });

      clearCart();
      showToast('Order placed successfully!', 'success');
      router.push('/');
    } catch (error) {
      console.error(error);
      showToast('Failed to place order.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '800px', padding: '2rem 0' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '2rem' }}>Checkout</h1>
      
      <form onSubmit={handleCheckout} className="card" style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Shipping Information</h2>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Full Address</label>
          <textarea 
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={3}
            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}
            placeholder="123 Main St, City, Country"
          />
        </div>

        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', marginTop: '2rem' }}>Promo Code</h2>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <input 
            type="text" 
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            style={{ flex: 1, padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}
            placeholder="Enter SAVE20"
          />
          <button type="button" onClick={handleApplyPromo} className="btn-primary">Apply</button>
        </div>

        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', marginTop: '1rem' }}>Payment</h2>
        <div style={{ padding: '1.5rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: '0.5rem', marginBottom: '2rem' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Using Mock Payment Gateway</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
            <span>Subtotal:</span>
            <span>${totalAmount.toFixed(2)}</span>
          </div>
          {discount > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--success)', marginBottom: '0.5rem' }}>
              <span>Discount ({promoCode}):</span>
              <span>-${discount.toFixed(2)}</span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.25rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem' }}>
            <span>Total to pay:</span>
            <span>${finalAmount.toFixed(2)}</span>
          </div>
        </div>

        <button 
          type="submit" 
          className="btn-primary" 
          disabled={isProcessing}
          style={{ width: '100%', padding: '1rem', fontSize: '1.125rem' }}
        >
          {isProcessing ? 'Processing...' : 'Pay & Place Order'}
        </button>
      </form>
    </div>
  );
}
