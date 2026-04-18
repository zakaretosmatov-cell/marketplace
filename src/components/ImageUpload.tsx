'use client';
import { useState } from 'react';
import { Link, X, ImageIcon, CheckCircle, AlertCircle } from 'lucide-react';

interface Props {
  value: string;
  onChange: (url: string) => void;
}

export default function ImageUpload({ value, onChange }: Props) {
  const [inputUrl, setInputUrl] = useState(value || '');
  const [status, setStatus] = useState<'idle' | 'loading' | 'valid' | 'error'>('idle');

  const handleUrlChange = (url: string) => {
    setInputUrl(url);
    onChange(url);

    if (!url.trim()) {
      setStatus('idle');
      return;
    }

    // Basic URL validation
    try {
      new URL(url);
      setStatus('loading');
      // Test if image loads
      const img = new Image();
      img.onload = () => setStatus('valid');
      img.onerror = () => setStatus('error');
      img.src = url;
    } catch {
      setStatus('error');
    }
  };

  const clearImage = () => {
    setInputUrl('');
    onChange('');
    setStatus('idle');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>

      {/* URL Input */}
      <div style={{ position: 'relative' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.65rem 0.875rem',
          borderRadius: '0.5rem',
          border: `1px solid ${status === 'valid' ? 'var(--success)' : status === 'error' ? 'var(--error)' : 'var(--border-color)'}`,
          background: 'var(--bg-primary)',
          transition: 'border-color 0.15s',
        }}>
          <Link size={15} color="var(--text-tertiary)" style={{ flexShrink: 0 }} />
          <input
            type="url"
            value={inputUrl}
            onChange={e => handleUrlChange(e.target.value)}
            placeholder="https://example.com/image.jpg"
            style={{
              flex: 1, background: 'none', border: 'none',
              color: 'var(--text-primary)', fontSize: '0.875rem', outline: 'none',
            }}
          />
          {status === 'loading' && (
            <div style={{ width: '16px', height: '16px', border: '2px solid var(--border-color)', borderTopColor: 'var(--accent-color)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', flexShrink: 0 }} />
          )}
          {status === 'valid' && <CheckCircle size={16} color="var(--success)" style={{ flexShrink: 0 }} />}
          {status === 'error' && <AlertCircle size={16} color="var(--error)" style={{ flexShrink: 0 }} />}
          {inputUrl && (
            <button type="button" onClick={clearImage} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', display: 'flex', padding: 0, flexShrink: 0 }}>
              <X size={14} />
            </button>
          )}
        </div>
        {status === 'error' && (
          <p style={{ fontSize: '0.7rem', color: 'var(--error)', marginTop: '0.25rem' }}>
            Invalid URL or image could not be loaded
          </p>
        )}
      </div>

      {/* Preview */}
      {value && status !== 'error' && (
        <div style={{
          position: 'relative', width: '100%', height: '180px',
          borderRadius: '0.5rem', overflow: 'hidden',
          border: '1px solid var(--border-color)',
          background: 'var(--bg-secondary)',
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Preview"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={() => setStatus('error')}
          />
          <button
            type="button"
            onClick={clearImage}
            style={{
              position: 'absolute', top: '8px', right: '8px',
              width: '28px', height: '28px', borderRadius: '50%',
              background: 'rgba(0,0,0,0.6)', color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: 'none', cursor: 'pointer',
            }}
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Empty state */}
      {!value && (
        <div style={{
          height: '120px', borderRadius: '0.5rem',
          border: '2px dashed var(--border-color)',
          background: 'var(--bg-secondary)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: '0.4rem', color: 'var(--text-tertiary)',
        }}>
          <ImageIcon size={28} />
          <p style={{ fontSize: '0.8rem' }}>Paste an image URL above to preview</p>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
