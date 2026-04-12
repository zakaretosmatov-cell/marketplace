'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Product } from '@/lib/types';
import { api } from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import { ArrowRight, Sparkles, Zap, ShieldCheck, Headphones } from 'lucide-react';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await api.getProducts();
        setFeaturedProducts(data.slice(0, 6)); // Get more for the new layout
      } catch (error) {
        console.error("Home featured fetch failed:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const heroProduct = featuredProducts[0];
  const secondaryProducts = featuredProducts.slice(1, 3);
  const restProducts = featuredProducts.slice(3);

  return (
    <div className="container" style={{ paddingBottom: '5rem' }}>
      {/* Grid Hero Section */}
      <section style={{ 
        display: 'grid', 
        gridTemplateColumns: '2fr 1fr', 
        gridTemplateRows: 'auto auto',
        gap: '1.5rem', 
        padding: '2rem 0',
        marginTop: '1rem'
      }}>
        
        {/* Main Hero Card */}
        <div className="card glass-card" style={{ 
          gridRow: 'span 2', 
          padding: '3rem', 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative',
          minHeight: '500px',
          background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-secondary) 100%)',
          border: 'none',
          boxShadow: 'var(--shadow-lg)'
        }}>
          <div style={{ position: 'relative', zIndex: 2, maxWidth: '60%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--accent-color)', fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              <div style={{ width: '20px', height: '20px', backgroundColor: 'var(--accent-soft)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles size={12} />
              </div>
              Future of Sound
            </div>
            <h1 style={{ fontSize: '4.5rem', fontWeight: 900, lineHeight: 1.1, marginBottom: '1.5rem', letterSpacing: '-0.04em' }}>
              Sequoia Inspira <span style={{ color: 'var(--accent-color)' }}>Musico.</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '2.5rem', lineHeight: 1.6 }}>
              Experience sound like never before with Sequoia's ground-breaking audio technology. Pure, immersive, and uncompromising.
            </p>
            <Link href="/catalog" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
              View Collection <ArrowRight size={20} />
            </Link>
          </div>
          
          {/* Decorative Image Overlays */}
          <div style={{ 
            position: 'absolute', 
            right: '-5%', 
            top: '50%', 
            transform: 'translateY(-50%)',
            width: '60%',
            height: '80%',
            zIndex: 1,
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
             {/* eslint-disable-next-line @next/next/no-img-element */}
             <img 
               src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80" 
               alt="Hero Product" 
               style={{ width: '100%', height: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 20px 50px rgba(0,0,0,0.15))' }} 
             />
          </div>
        </div>

        {/* Popular Feature Card */}
        <div className="card" style={{ 
          padding: '2rem', 
          background: 'var(--bg-secondary)', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'space-between',
          border: '1px solid var(--border-color)'
        }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Popular Colors</h3>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
              {['#4361ee', '#f72585', '#4cc9f0', '#7209b7'].map(color => (
                <div key={color} style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: color, border: '3px solid white', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}></div>
              ))}
            </div>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '1rem' }}>Match your tech with your personality.</p>
        </div>

        {/* New Arrival Card */}
        <div className="card glass-card" style={{ 
          padding: '1.5rem', 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '1rem',
          alignItems: 'center',
          background: 'linear-gradient(to right, var(--accent-color), var(--accent-hover))',
          color: 'white',
          border: 'none'
        }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', opacity: 0.8 }}>New Gen</span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>X-Bud</h3>
            <Link href="/catalog" style={{ display: 'inline-flex', marginTop: '1rem', padding: '0.5rem', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)' }}>
              <ArrowRight size={20} color="white" />
            </Link>
          </div>
          <div style={{ position: 'relative', width: '100%', height: '100px' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="https://images.unsplash.com/photo-1544244015-0cd4b3ffad20?w=400&q=80" 
              alt="Buds" 
              style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
            />
          </div>
        </div>

      </section>

      {/* Feature Icons Section */}
      <section style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        padding: '3rem 0', 
        borderBottom: '1px solid var(--border-color)',
        marginBottom: '4rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '1rem', backgroundColor: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-color)' }}>
            <Zap size={24} />
          </div>
          <div>
            <h4 style={{ fontWeight: 700, fontSize: '1rem' }}>Ultra Fast</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Same day shipping</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '1rem', backgroundColor: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-color)' }}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <h4 style={{ fontWeight: 700, fontSize: '1rem' }}>Secure Web</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Encrypted payments</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '1rem', backgroundColor: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-color)' }}>
            <Headphones size={24} />
          </div>
          <div>
            <h4 style={{ fontWeight: 700, fontSize: '1rem' }}>Pro Support</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>24/7 tech assistance</p>
          </div>
        </div>
      </section>

      {/* Grid of Products */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
          <div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.03em' }}>Curated Tech</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Selected gadgets for the modern world</p>
          </div>
          <Link href="/catalog" style={{ fontWeight: 600, color: 'var(--accent-color)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            View Full Catalog <ArrowRight size={18} />
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem 0' }}>
            <div style={{ width: '40px', height: '40px', border: '3px solid var(--bg-tertiary)', borderTopColor: 'var(--accent-color)', borderRadius: '50%', margin: '0 auto', animation: 'spin 1s linear infinite' }}></div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
            gap: '2.5rem' 
          }}>
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

