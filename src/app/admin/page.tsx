'use client';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useToast } from '@/context/ToastContext';

export default function AdminDashboard() {
  const { showToast } = useToast();
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0 });

  useEffect(() => {
    Promise.all([api.getProducts(), api.getAllOrders()]).then(([products, orders]) => {
      const revenue = orders
        .filter(o => o.status !== 'cancelled')
        .reduce((s, o) => s + o.totalAmount, 0);
      setStats({ products: products.length, orders: orders.length, revenue });
    });
  }, []);

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="container" style={{ padding: '2rem 0' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '2rem' }}>Administration Control Panel</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
        <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <h3 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Total Products</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 700 }}>{stats.products}</p>
        </div>
        <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <h3 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Total Orders</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 700 }}>{stats.orders}</p>
        </div>
        <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <h3 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Gross Revenue</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--success)' }}>${stats.revenue.toLocaleString()}</p>
        </div>
      </div>

      <div className="card" style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>System Management</h2>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem', listStyle: 'none' }}>
          <li><a href="/orders" className="btn-primary" style={{ display: 'inline-block', backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}>View All Orders</a></li>
          <li><a href="/catalog" className="btn-primary" style={{ display: 'inline-block', backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}>View Catalog</a></li>
        </ul>
      </div>
      </div>
    </ProtectedRoute>
  );
}
