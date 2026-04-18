'use client';
import { useState, useRef } from 'react';
import { Link2, X, ImageIcon, CheckCircle, AlertCircle, Upload } from 'lucide-react';

interface Props {
  value: string;
  onChange: (url: string) => void;
}

export default function ImageUpload({ value, onChange }: Props) {
  const [inputUrl, setInputUrl] = useState(value || '');
  const [status, setStatus] = useState<'idle' | 'loading' | 'valid' | 'error'>('idle');
  const [tab, setTab] = useState<'url' | 'upload'>('url');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUrlChange = (url: string) => {
    setInputUrl(url);
    onChange(url);

    if (!url.trim()) { setStatus('idle'); return; }

    try {
      new URL(url);
      setStatus('loading');
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => setStatus('valid');
      img.onerror = () => {
        // Try without crossOrigin — some CDNs block it
        const img2 = new Image();
        img2.onload = () => setStatus('valid');
        img2.onerror = () => setStatus('error');
        img2.src = url + (url.includes('?') ? '&' : '?') + '_t=' + Date.now();
      };
      img.src = url;
    } catch {
      setStatus('error');
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setInputUrl(dataUrl);
      onChange(dataUrl);
      setStatus('valid');
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setInputUrl('');
    onChange('');
    setStatus('idle');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0', border: '1px solid var(--border-color)', borderRadius: '0.5rem', overflow: 'hidden', background: 'var(--bg-secondary)' }}>
        {[
          { id: 'url', label: 'Image URL', icon: <Link2 size={14} /> },
          { id: 'upload', label: 'Upload File', icon: <Upload size={14} /> },
        ].map(t => (
          <button key={t.id} type="button" onClick={() => setTab(t.id as 'url' | 'upload')}
            style={{ flex: 1, padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 500, border: 'none', cursor: 'pointer', background: tab === t.id ? 'var(--bg-primary)' : 'transparent', color: tab === t.id ? 'var(--text-primary)' : 'var(--text-tertiary)', borderBottom: tab === t.id ? '2px solid var(--accent-color)' : '2px solid transparent', transition: 'all 0.15s' }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* URL tab */}
      {tab === 'url' && (
        <div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.65rem 0.875rem', borderRadius: '0.5rem',
            border: `1.5px solid ${status === 'valid' ? 'var(--success)' : status === 'error' ? 'var(--error)' : 'var(--border-color)'}`,
            background: 'var(--bg-primary)', transition: 'border-color 0.15s',
          }}>
            <Link2 size={15} color="var(--text-tertiary)" style={{ flexShrink: 0 }} />
            <input
              type="text"
              value={inputUrl.startsWith('data:') ? '' : inputUrl}
              onChange={e => handleUrlChange(e.target.value)}
              placeholder="https://example.com/image.jpg"
              style={{ flex: 1, background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: '0.875rem', outline: 'none' }}
            />
            {status === 'loading' && (
              <div style={{ width: '15px', height: '15px', border: '2px solid var(--border-color)', borderTopColor: 'var(--accent-color)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', flexShrink: 0 }} />
            )}
            {status === 'valid' && <CheckCircle size={15} color="var(--success)" style={{ flexShrink: 0 }} />}
            {status === 'error' && <AlertCircle size={15} color="var(--error)" style={{ flexShrink: 0 }} />}
            {inputUrl && (
              <button type="button" onClick={clearImage} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', display: 'flex', padding: 0, flexShrink: 0 }}>
                <X size={13} />
              </button>
            )}
          </div>
          {status === 'error' && (
            <p style={{ fontSize: '0.7rem', color: 'var(--error)', marginTop: '0.25rem' }}>
              Could not load image. Try a direct image URL ending in .jpg, .png, .webp
            </p>
          )}
          <p style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', marginTop: '0.25rem' }}>
            Tip: Right-click any image on the web → "Copy image address"
          </p>
        </div>
      )}

      {/* Upload tab */}
      {tab === 'upload' && (
        <div
          onClick={() => fileRef.current?.click()}
          onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
          onDragOver={e => e.preventDefault()}
          style={{ height: '100px', borderRadius: '0.5rem', border: '2px dashed var(--border-color)', background: 'var(--bg-secondary)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', cursor: 'pointer', transition: 'border-color 0.15s' }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent-color)')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border-color)')}
        >
          <Upload size={22} color="var(--text-tertiary)" />
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Click or drag image here</p>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>PNG, JPG, WEBP</p>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
        </div>
      )}

      {/* Preview */}
      {value && status !== 'error' && (
        <div style={{ position: 'relative', width: '100%', height: '180px', borderRadius: '0.5rem', overflow: 'hidden', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={() => setStatus('error')} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 50%)' }} />
          <button type="button" onClick={clearImage}
            style={{ position: 'absolute', top: '8px', right: '8px', width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(0,0,0,0.6)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}>
            <X size={13} />
          </button>
          <div style={{ position: 'absolute', bottom: '8px', left: '8px', display: 'flex', alignItems: 'center', gap: '0.3rem', background: 'rgba(0,0,0,0.5)', borderRadius: '0.25rem', padding: '0.2rem 0.5rem' }}>
            <CheckCircle size={12} color="#4ade80" />
            <span style={{ fontSize: '0.7rem', color: 'white' }}>Image ready</span>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!value && (
        <div style={{ height: '100px', borderRadius: '0.5rem', border: '1px dashed var(--border-color)', background: 'var(--bg-secondary)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}>
          <ImageIcon size={24} color="var(--text-tertiary)" />
          <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>No image selected</p>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
