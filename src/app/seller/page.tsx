'use client';
import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { api } from '@/lib/api';
import { Product } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';

export default function SellerPanel() {
  const { user, role } = useAuth();
  const [myProducts, setMyProducts] = useState<Product[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    category: 'Laptops',
    brand: '',
    image: '',
  });

  const fetchProducts = () => {
    if ((role === 'seller' || role === 'admin') && user) {
      api.getProductsBySeller(user.uid).then(data => {
        setMyProducts(data);
      });
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [role, user]);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    try {
      await api.addProduct({
        ...newProduct,
        sellerId: user.uid,
      } as Product);
      setIsAdding(false);
      setNewProduct({
        name: '',
        description: '',
        price: 0,
        stock: 0,
        category: 'Laptops',
        brand: '',
        image: '',
      });
      fetchProducts();
    } catch (error) {
      console.error("Error adding product", error);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['seller', 'admin']}>
      <div className="container" style={{ padding: '2rem 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700 }}>Seller Dashboard</h1>
        <button 
          className="btn-primary" 
          onClick={() => setIsAdding(!isAdding)}
          style={{ backgroundColor: isAdding ? 'var(--bg-tertiary)' : 'var(--accent-color)', color: isAdding ? 'var(--text-primary)' : 'white' }}
        >
          {isAdding ? 'Cancel' : 'Add New Product'}
        </button>
      </div>

      {isAdding && (
        <div className="card" style={{ padding: '2.5rem', marginBottom: '2rem', border: '2px solid var(--accent-color)' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>List New Product</h2>
          <form onSubmit={handleAddProduct} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Product Name</label>
              <input 
                type="text" 
                placeholder="e.g. iPhone 15 Pro"
                value={newProduct.name}
                onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                required 
                style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Brand</label>
              <input 
                type="text" 
                placeholder="e.g. Apple"
                value={newProduct.brand}
                onChange={(e) => setNewProduct({...newProduct, brand: e.target.value})}
                required 
                style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: 'span 2' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Description</label>
              <textarea 
                placeholder="Describe your product highlights..."
                value={newProduct.description}
                onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                required 
                style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', minHeight: '100px', resize: 'vertical' }}
              ></textarea>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Category</label>
              <select 
                value={newProduct.category}
                onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
              >
                <option value="Laptops">Laptops</option>
                <option value="Smartphones">Smartphones</option>
                <option value="Tablets">Tablets</option>
                <option value="Wearables">Wearables</option>
                <option value="Audio">Audio</option>
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Image URL</label>
              <input 
                type="url" 
                placeholder="https://images.unsplash.com/..."
                value={newProduct.image}
                onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                required 
                style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Price ($)</label>
              <input 
                type="number" 
                step="0.01"
                placeholder="0.00"
                value={newProduct.price}
                onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value)})}
                required 
                style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Initial Stock</label>
              <input 
                type="number" 
                placeholder="0"
                value={newProduct.stock}
                onChange={(e) => setNewProduct({...newProduct, stock: parseInt(e.target.value)})}
                required 
                style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
              />
            </div>
            <div style={{ gridColumn: 'span 2', display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button type="submit" className="btn-primary" style={{ flex: 1 }}>Publish Product</button>
              <button type="button" className="btn-primary" onClick={() => setIsAdding(false)} style={{ flex: 1, backgroundColor: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border-color)' }}>Cancel</button>
            </div>
          </form>
        </div>
      )}
      
      <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>My Inventory</h2>
        {myProducts.length === 0 ? (
          <p>No products added yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {myProducts.map((p: Product) => (
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
      </div>
    </ProtectedRoute>
  );
}
