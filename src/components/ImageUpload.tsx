'use client';
import { useState, useRef } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface Props {
  value: string;
  onChange: (url: string) => void;
}

export default function ImageUpload({ value, onChange }: Props) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Only image files allowed');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Max file size is 5MB');
      return;
    }

    setError('');
    setUploading(true);
    setProgress(0);

    const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
    const task = uploadBytesResumable(storageRef, file);

    task.on(
      'state_changed',
      snap => setProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
      err => { setError(err.message); setUploading(false); },
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        onChange(url);
        setUploading(false);
        setProgress(0);
      }
    );
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {/* Preview */}
      {value && (
        <div style={{ position: 'relative', width: '100%', height: '160px', borderRadius: '0.5rem', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <button
            type="button"
            onClick={() => onChange('')}
            style={{ position: 'absolute', top: '8px', right: '8px', width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(0,0,0,0.6)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Upload area */}
      <div
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        onClick={() => !uploading && inputRef.current?.click()}
        style={{
          border: '2px dashed var(--border-color)',
          borderRadius: '0.5rem',
          padding: '1.25rem',
          textAlign: 'center',
          cursor: uploading ? 'not-allowed' : 'pointer',
          background: 'var(--bg-secondary)',
          transition: 'border-color 0.15s',
        }}
        onMouseEnter={e => { if (!uploading) (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent-color)'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-color)'; }}
      >
        {uploading ? (
          <div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              Uploading... {progress}%
            </div>
            <div style={{ height: '4px', background: 'var(--bg-tertiary)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${progress}%`, background: 'var(--accent-color)', transition: 'width 0.2s' }} />
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
            <Upload size={20} color="var(--text-tertiary)" />
            <p style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
              Click or drag image here
            </p>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>PNG, JPG, WEBP — max 5MB</p>
          </div>
        )}
      </div>

      {/* URL input fallback */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
        <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>or paste URL</span>
        <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
      </div>
      <input
        type="url"
        placeholder="https://..."
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{ padding: '0.6rem 0.75rem', borderRadius: '0.375rem', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: '0.8rem', width: '100%' }}
      />

      {error && <p style={{ fontSize: '0.75rem', color: 'var(--error)' }}>{error}</p>}

      <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
    </div>
  );
}
