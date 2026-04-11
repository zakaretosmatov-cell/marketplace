'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Product } from '@/lib/types';
import { api } from '@/lib/api';
import ProductCard from '@/components/ProductCard';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await api.getProducts();
        setFeaturedProducts(data.slice(0, 4));
      } catch (error) {
        console.error("Home featured fetch failed:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="container">
      <section style={{ textAlign: 'center', padding: '4rem 0', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', fontWeight: 700, letterSpacing: '-0.025em' }}>
          Discover the Future of Tech
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
          Premium laptops, smartphones, and wearables. Curated by tech enthusiasts, for you.
        </p>
        <Link href="/catalog" className="btn-primary" style={{ display: 'inline-block', fontSize: '1.125rem' }}>
          Shop Tech Collection
        </Link>
      </section>

      <section>
        <h2 style={{ fontSize: '2rem', marginBottom: '2rem', fontWeight: 600 }}>Featured Tech</h2>
        {loading ? (
          <div>Loading featured tech...</div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
            gap: '2rem' 
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

