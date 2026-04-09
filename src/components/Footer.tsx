export default function Footer() {
  return (
    <footer style={{ 
      borderTop: '1px solid var(--border-color)', 
      padding: '2rem 0',
      backgroundColor: 'var(--bg-secondary)',
      marginTop: 'auto'
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem' }}>
        <div>
          <h4 style={{ fontWeight: 600, marginBottom: '1rem' }}>NextGenStore</h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', maxWidth: '300px' }}>
            The ultimate e-commerce platform built with Next.js and modern technologies.
          </p>
        </div>
        <div>
          <h4 style={{ fontWeight: 600, marginBottom: '1rem' }}>Links</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            <li><a href="/catalog">Catalog</a></li>
            <li><a href="/about">About Us</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4 style={{ fontWeight: 600, marginBottom: '1rem' }}>Legal</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            <li><a href="/privacy">Privacy Policy</a></li>
            <li><a href="/terms">Terms of Service</a></li>
          </ul>
        </div>
      </div>
      <div style={{ textAlign: 'center', marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--border-color)', color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>
        &copy; {new Date().getFullYear()} NextGenStore. All rights reserved.
      </div>
    </footer>
  );
}
