'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Product, Review } from '@/lib/types';
import { mockApi } from '@/lib/mockApi';
import { useCart } from '@/context/CartContext';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!params || !params.id) return;
      const productId = Array.isArray(params.id) ? params.id[0] : params.id;
      
      try {
        const p = await mockApi.getProductById(productId);
        if (p) {
          setProduct(p);
          const r = await mockApi.getReviewsByProductId(productId);
          setReviews(r);
          
          // Mock AI Recommendation System: Fetch all, filter by category minus current
          const allProducts = await mockApi.getProducts();
          const related = allProducts.filter(item => item.category === p.category && item.id !== p.id);
          // If not enough in category, just fill with random
          if (related.length < 3) {
             const others = allProducts.filter(item => item.id !== p.id && item.category !== p.category);
             related.push(...others.slice(0, 3 - related.length));
          }
          setRecommendations(related.slice(0, 3));
        } else {
          router.push('/catalog');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [params, router]);

  if (loading) return <div style={{ textAlign: 'center', padding: '4rem' }}>Loading...</div>;
  if (!product) return null;

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <button onClick={() => router.back()} style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
        ← Back to Catalog
      </button>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem' }}>
        <div style={{ backgroundColor: '#f1f5f9', borderRadius: '1rem', overflow: 'hidden', height: 'fit-content' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={product.image} alt={product.name} style={{ width: '100%', height: 'auto', display: 'block' }} />
        </div>
        
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>{product.name}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-color)' }}>${product.price.toFixed(2)}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--warning)', fontWeight: 600 }}>
              ★ {product.rating} <span style={{ color: 'var(--text-tertiary)', fontWeight: 400 }}>({product.reviewsCount} reviews)</span>
            </span>
          </div>
          
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem', lineHeight: 1.6, marginBottom: '2rem' }}>
            {product.description}
          </p>
          
          <div style={{ padding: '1.5rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '0.5rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ fontWeight: 600 }}>Availability:</span>
              <span style={{ color: product.stock > 0 ? 'var(--success)' : 'var(--error)', fontWeight: 600 }}>
                {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
              </span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-color)', borderRadius: '0.5rem', overflow: 'hidden' }}>
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ padding: '0.75rem 1rem', backgroundColor: 'var(--bg-tertiary)' }}>-</button>
                <div style={{ width: '3rem', textAlign: 'center', fontWeight: 500 }}>{quantity}</div>
                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} style={{ padding: '0.75rem 1rem', backgroundColor: 'var(--bg-tertiary)' }} disabled={product.stock === 0}>+</button>
              </div>
              <button 
                className="btn-primary" 
                style={{ flex: 1, padding: '0.75rem' }} 
                onClick={() => { addToCart(product, quantity); router.push('/cart'); }}
                disabled={product.stock === 0}
              >
                Add to Cart
              </button>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Customer Reviews</h3>
            
            {/* Write a Review Section */}
            <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: '0.5rem' }}>
              <h4 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Write a Review</h4>
              <textarea 
                placeholder="Share your thoughts about this product..."
                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', marginBottom: '0.5rem' }}
                rows={3}
              />
              <button 
                className="btn-primary" 
                onClick={() => alert("Review submitted! (Pending moderation)")}
              >
                Submit Review
              </button>
            </div>

            {reviews.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)' }}>No reviews yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {reviews.map(review => (
                  <div key={review.id} style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontWeight: 600 }}>{review.userName}</span>
                      <span style={{ color: 'var(--warning)' }}>{'★'.repeat(review.rating)}</span>
                    </div>
                    <p style={{ color: 'var(--text-secondary)' }}>"{review.comment}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recommendations Section */}
      {recommendations.length > 0 && (
        <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid var(--border-color)' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '2rem' }}>You Might Also Like</h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
            gap: '2rem' 
          }}>
            {recommendations.map(rec => (
              <div key={rec.id} className="card" style={{ padding: '1rem', cursor: 'pointer' }} onClick={() => router.push(`/catalog/${rec.id}`)}>
                <div style={{ height: '150px', backgroundColor: '#f1f5f9', marginBottom: '1rem', overflow: 'hidden', borderRadius: '0.5rem' }}>
                   {/* eslint-disable-next-line @next/next/no-img-element */}
                   <img src={rec.image} alt={rec.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <h4 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>{rec.name}</h4>
                <p style={{ color: 'var(--accent-color)', fontWeight: 700 }}>${rec.price.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
