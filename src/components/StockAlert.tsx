'use client';
import { useState } from 'react';
import { Bell, BellOff, Check } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

export default function StockAlert({ productId, productName }: { productId: string; productName: string }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [subscribed, setSubscribed] = useState(() => {
    if (typeof window === 'undefined') return false;
    const alerts = JSON.parse(localStorage.getItem('stock_alerts') || '[]');
    return alerts.includes(productId);
  });

  const toggle = () => {
    if (!user) { showToast('Please sign in to get stock alerts', 'error'); return; }
    const alerts: string[] = JSON.parse(localStorage.getItem('stock_alerts') || '[]');
    if (subscribed) {
      const updated = alerts.filter(id => id !== productId);
      localStorage.setItem('stock_alerts', JSON.stringify(updated));
      setSubscribed(false);
      showToast('Stock alert removed', 'success');
    } else {
      alerts.push(productId);
      localStorage.setItem('stock_alerts', JSON.stringify(alerts));
      setSubscribed(true);
      showToast(`We'll notify you when "${productName}" is back in stock!`, 'success');
    }
  };

  return (
    <button onClick={toggle} style={{
      display: 'flex', alignItems: 'center', gap: '0.5rem',
      padding: '0.65rem 1.25rem', borderRadius: 'var(--radius-md)',
      border: `1px solid ${subscribed ? 'var(--success)' : 'var(--border-color)'}`,
      background: subscribed ? 'rgba(22,163,74,0.08)' : 'var(--bg-secondary)',
      color: subscribed ? 'var(--success)' : 'var(--text-secondary)',
      fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s'
    }}>
      {subscribed ? <><Check size={15} /> Notified</> : <><Bell size={15} /> Notify me</>}
    </button>
  );
}
