'use client';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useEffect, useState } from 'react';
import { mockApi } from '@/lib/mockApi';
import { Product } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';

export default function SellerPanel() {
  const { role } = useAuth();
  const [myProducts, setMyProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (role === 'seller' || role === 'admin') {
      // Simulate getting products for current seller
      mockApi.getProducts().then(data => {
        // Just mocking that half of the products belong to the seller
        setMyProducts(data.slice(0, 2));
      });
    }
  }, [role]);

  return (
    <ProtectedRoute allowedRoles={['seller', 'admin']}>
      <div className="container" style={{ padding: '2rem 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700 }}>Seller Dashboard</h1>
        <button className="btn-primary">Add New Product</button>
      </div>
      
      <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>My Inventory</h2>
        {myProducts.length === 0 ? (
          <p>No products added yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {myProducts.map(p => (
              <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.image} alt={p.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '0.25rem' }} />
                  <div>
                    <p style={{ fontWeight: 600 }}>{p.name}</p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Stock: {p.stock}</p>
                  </div>
                </div>
                <div>
                  <button style={{ marginRight: '1rem', color: 'var(--accent-color)' }}>Edit</button>
                  <button style={{ color: 'var(--error)' }}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card" style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Recent Orders</h2>
        <p style={{ color: 'var(--text-secondary)' }}>You have 3 orders pending shipment.</p>
        <button className="btn-primary" style={{ marginTop: '1rem', backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}>View Orders</button>
      </div>
    </ProtectedRoute>
  );
}
