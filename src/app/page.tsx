import Link from 'next/link';

export default function Home() {
  return (
    <div className="container">
      <section style={{ textAlign: 'center', padding: '4rem 0', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', fontWeight: 700, letterSpacing: '-0.025em' }}>
          Discover the Future of Shopping
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
          Experience a premium shopping environment curated just for you. Explore our extensive collection of high-quality products.
        </p>
        <Link href="/catalog" className="btn-primary" style={{ display: 'inline-block', fontSize: '1.125rem' }}>
          Shop Collection
        </Link>
      </section>

      <section>
        <h2 style={{ fontSize: '2rem', marginBottom: '2rem', fontWeight: 600 }}>Featured Products</h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: '2rem' 
        }}>
          {/* Mock featured products - will be dynamic later */}
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card" style={{ padding: '1rem' }}>
              <div style={{ 
                backgroundColor: 'var(--bg-tertiary)', 
                height: '200px', 
                borderRadius: '0.5rem',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-tertiary)'
              }}>
                Product Image
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Premium Item {i}</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>High quality product description goes here.</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600, fontSize: '1.25rem' }}>$99.00</span>
                <button className="btn-primary" style={{ padding: '0.5rem 1rem' }}>Add to Cart</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
