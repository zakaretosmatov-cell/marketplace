'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Mail, Send, Github, Twitter, Instagram, Zap } from 'lucide-react';

const LINKS = {
  Shop: [
    { label: 'Catalog', href: '/catalog' },
    { label: 'Deals', href: '/catalog?sort=price-asc' },
    { label: 'New Arrivals', href: '/catalog?sort=newest' },
    { label: 'Top Rated', href: '/catalog?sort=rating' },
  ],
  Account: [
    { label: 'My Orders', href: '/orders' },
    { label: 'Wishlist', href: '/wishlist' },
    { label: 'Returns', href: '/returns' },
    { label: 'Profile', href: '/profile' },
  ],
  Sell: [
    { label: 'Become a Seller', href: '/seller/apply' },
    { label: 'Seller Dashboard', href: '/seller' },
    { label: 'Advertising', href: '/seller/ads' },
    { label: 'Analytics', href: '/seller/analytics' },
  ],
  Support: [
    { label: 'Help Center', href: '#' },
    { label: 'Contact Us', href: '#' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
  ],
};

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) { setSubscribed(true); setEmail(''); }
  };

  return (
    <footer style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', marginTop: 'auto' }}>

      {/* Newsletter banner */}
      <div style={{ background: 'var(--accent-color)', padding: '2.5rem 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
          <div>
            <h3 style={{ color: 'white', fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.25rem' }}>
              Stay in the loop
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.875rem' }}>
              Get the latest deals, new arrivals and tech news.
            </p>
          </div>
          {subscribed ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white', fontWeight: 600 }}>
              ✓ You're subscribed!
            </div>
          ) : (
            <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: 'var(--radius-md)', padding: '0.5rem 0.875rem', minWidth: '260px' }}>
                <Mail size={15} color="rgba(255,255,255,0.7)" />
                <input
                  type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  style={{ background: 'none', border: 'none', color: 'white', fontSize: '0.875rem', width: '100%' }}
                />
              </div>
              <button type="submit" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', background: 'white', color: 'var(--accent-color)', fontWeight: 700, fontSize: '0.875rem', border: 'none', cursor: 'pointer', flexShrink: 0 }}>
                <Send size={14} /> Subscribe
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Main footer */}
      <div className="container" style={{ padding: '3rem 1.5rem 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr repeat(4, 1fr)', gap: '2rem', marginBottom: '3rem' }}>

          {/* Brand */}
          <div>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="TechNova" style={{ height: '32px', width: 'auto' }} onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem' }}>TechNova</span>
            </Link>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: 1.7, marginBottom: '1.5rem', maxWidth: '220px' }}>
              Premium tech marketplace. Verified sellers, best prices, fast delivery.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {[
                { icon: <Twitter size={15} />, href: '#' },
                { icon: <Instagram size={15} />, href: '#' },
                { icon: <Github size={15} />, href: '#' },
              ].map((s, i) => (
                <a key={i} href={s.href} style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-md)', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', transition: 'all var(--transition-fast)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--accent-soft)'; (e.currentTarget as HTMLElement).style.color = 'var(--accent-color)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent-color)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-tertiary)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-color)'; }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 style={{ fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-tertiary)', marginBottom: '1rem' }}>{title}</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {links.map(link => (
                  <li key={link.label}>
                    <Link href={link.href} style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', transition: 'color var(--transition-fast)' }}
                      onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{ paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
            © {new Date().getFullYear()} TechNova. All rights reserved.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
            <Zap size={13} color="var(--accent-color)" />
            Built with Next.js & Firebase
          </div>
        </div>
      </div>
    </footer>
  );
}
