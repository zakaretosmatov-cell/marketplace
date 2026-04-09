'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const { user, role, isLoading } = useAuth();
  const router = useRouter();
  
  const [stats, setStats] = useState({ users: 156, orders: 1240, revenue: 54230.50 });

  useEffect(() => {
    if (!isLoading && role !== 'admin') {
      router.push('/');
    }
  }, [role, isLoading, router]);

  if (isLoading || role !== 'admin') return <div style={{ padding: '4rem', textAlign: 'center' }}>Loading...</div>;

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '2rem' }}>Administration Control Panel</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
        <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <h3 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Total Users</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 700 }}>{stats.users}</p>
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
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>System Management Options</h2>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem', listStyle: 'none' }}>
          <li><button className="btn-primary" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}>Manage Users & Blocking</button></li>
          <li><button className="btn-primary" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}>Content Moderation</button></li>
          <li><button className="btn-primary" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}>Financial Reports</button></li>
        </ul>
      </div>
    </div>
  );
}
