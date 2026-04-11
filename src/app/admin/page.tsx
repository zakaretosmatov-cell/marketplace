import ProtectedRoute from '@/components/ProtectedRoute';
import { useState } from 'react';
import { api } from '@/lib/api';
import { useToast } from '@/context/ToastContext';

export default function AdminDashboard() {
  const { showToast } = useToast();
  const [isSeeding, setIsSeeding] = useState(false);
  const [stats, setStats] = useState({ users: 156, orders: 1240, revenue: 54230.50 });

  const handleSeed = async () => {
    setIsSeeding(true);
    try {
      await api.seedInitialData();
      showToast('Database seeded successfully!', 'success');
    } catch (error) {
      console.error(error);
      showToast('Failed to seed database.', 'error');
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['admin']}>
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
          <li><button className="btn-primary" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}>Financial Reports</button></li>
          <li style={{ marginTop: '2rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--error)', marginBottom: '0.5rem' }}>Danger Zone</h3>
            <button 
              className="btn-primary" 
              onClick={handleSeed}
              disabled={isSeeding}
              style={{ backgroundColor: 'var(--error)', color: 'white' }}
            >
              {isSeeding ? 'Seeding...' : 'Seed Initial Products'}
            </button>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
              Only use this to populate an empty database with sample products.
            </p>
          </li>
        </ul>
      </div>
      </div>
    </ProtectedRoute>
  );
}
