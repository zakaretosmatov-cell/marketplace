'use client';
import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', padding: '2rem', textAlign: 'center' }}>
      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⚠️</div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Something went wrong</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: '400px', fontSize: '0.875rem' }}>
        {error.message || 'An unexpected error occurred. Please try again.'}
      </p>
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button onClick={reset} style={{ padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-md)', background: 'var(--accent-color)', color: 'var(--bg-primary)', fontWeight: 700, fontSize: '0.875rem', border: 'none', cursor: 'pointer' }}>
          Try again
        </button>
        <a href="/" style={{ padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontWeight: 500, fontSize: '0.875rem' }}>
          Go Home
        </a>
      </div>
    </div>
  );
}
