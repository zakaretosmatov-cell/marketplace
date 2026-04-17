'use client';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { Product } from '@/lib/types';
import { Send, X, Minimize2, Sparkles } from 'lucide-react';

type Message = { sender: 'user' | 'agent'; text: string; time: string };

export default function ChatWidget() {
  const { user, role } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'agent', text: "Salom! Men ZAZUDO CHAT — TechNova'ning AI yordamchisiman 🤖\n\nQanday mahsulot qidiryapsiz? Yordam beraman!", time: now() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function now() {
    return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen && products.length === 0) {
      api.getProducts().then(setProducts).catch(() => {});
    }
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 100);
  }, [isOpen, products.length]);

  if (!user || role !== 'client') return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { sender: 'user', text: input.trim(), time: now() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          products: products.map(p => ({ name: p.name, price: p.price, category: p.category, brand: p.brand, stock: p.stock }))
        })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { sender: 'agent', text: data.text || "Kechirasiz, muammo yuz berdi.", time: now() }]);
    } catch {
      setMessages(prev => [...prev, { sender: 'agent', text: "Aloqa uzildi. Qayta urinib ko'ring.", time: now() }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      {!isOpen && (
        <button onClick={() => { setIsOpen(true); setIsMinimized(false); }}
          style={{
            position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 999,
            width: '56px', height: '56px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            border: 'none', cursor: 'pointer', boxShadow: '0 4px 20px rgba(99,102,241,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.1)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 24px rgba(99,102,241,0.5)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(99,102,241,0.4)'; }}
        >
          <Sparkles size={22} color="white" />
        </button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div style={{
          position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 1000,
          width: '360px',
          height: isMinimized ? 'auto' : '520px',
          borderRadius: '1.25rem',
          background: 'var(--bg-primary)',
          border: '1px solid var(--border-color)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
          transition: 'height 0.3s ease',
        }}>

          {/* Header */}
          <div style={{
            padding: '1rem 1.25rem',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            flexShrink: 0,
          }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Sparkles size={18} color="white" />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ color: 'white', fontWeight: 700, fontSize: '0.9rem', lineHeight: 1 }}>ZAZUDO CHAT</p>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.7rem', marginTop: '0.2rem' }}>
                {isLoading ? 'Yozmoqda...' : 'Online'}
              </p>
            </div>
            <button onClick={() => setIsMinimized(v => !v)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.8)', padding: '0.25rem', display: 'flex' }}>
              <Minimize2 size={16} />
            </button>
            <button onClick={() => setIsOpen(false)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.8)', padding: '0.25rem', display: 'flex' }}>
              <X size={18} />
            </button>
          </div>

          {!isMinimized && (
            <>
              {/* Messages */}
              <div style={{
                flex: 1, overflowY: 'auto', padding: '1rem',
                display: 'flex', flexDirection: 'column', gap: '0.875rem',
                background: 'var(--bg-secondary)',
              }}>
                {messages.map((msg, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row',
                    alignItems: 'flex-end', gap: '0.5rem',
                  }}>
                    {msg.sender === 'agent' && (
                      <div style={{
                        width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Sparkles size={13} color="white" />
                      </div>
                    )}
                    <div style={{ maxWidth: '75%' }}>
                      <div style={{
                        padding: '0.625rem 0.875rem',
                        borderRadius: msg.sender === 'user' ? '1rem 1rem 0.25rem 1rem' : '1rem 1rem 1rem 0.25rem',
                        background: msg.sender === 'user'
                          ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                          : 'var(--bg-primary)',
                        color: msg.sender === 'user' ? 'white' : 'var(--text-primary)',
                        fontSize: '0.85rem', lineHeight: 1.5,
                        whiteSpace: 'pre-wrap',
                        border: msg.sender === 'agent' ? '1px solid var(--border-color)' : 'none',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                      }}>
                        {msg.text}
                      </div>
                      <p style={{
                        fontSize: '0.65rem', color: 'var(--text-tertiary)',
                        marginTop: '0.2rem',
                        textAlign: msg.sender === 'user' ? 'right' : 'left',
                      }}>{msg.time}</p>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Sparkles size={13} color="white" />
                    </div>
                    <div style={{ padding: '0.625rem 0.875rem', borderRadius: '1rem 1rem 1rem 0.25rem', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
                      {[0, 1, 2].map(i => (
                        <div key={i} style={{
                          width: '6px', height: '6px', borderRadius: '50%',
                          background: '#8b5cf6',
                          animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                        }} />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form onSubmit={handleSend} style={{
                padding: '0.875rem 1rem',
                borderTop: '1px solid var(--border-color)',
                display: 'flex', gap: '0.5rem', alignItems: 'center',
                background: 'var(--bg-primary)',
                flexShrink: 0,
              }}>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Xabar yozing..."
                  style={{
                    flex: 1, padding: '0.6rem 0.875rem',
                    borderRadius: '2rem',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    fontSize: '0.875rem', outline: 'none',
                  }}
                />
                <button type="submit" disabled={!input.trim() || isLoading}
                  style={{
                    width: '38px', height: '38px', borderRadius: '50%', flexShrink: 0,
                    background: input.trim() && !isLoading ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'var(--bg-tertiary)',
                    border: 'none', cursor: input.trim() && !isLoading ? 'pointer' : 'not-allowed',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.15s',
                  }}>
                  <Send size={16} color={input.trim() && !isLoading ? 'white' : 'var(--text-tertiary)'} />
                </button>
              </form>
            </>
          )}
        </div>
      )}

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
      `}</style>
    </>
  );
}
