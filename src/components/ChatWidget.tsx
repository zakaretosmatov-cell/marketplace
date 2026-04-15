'use client';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function ChatWidget() {
  const { user, role } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{sender: 'user'|'agent', text: string}[]>([
    { sender: 'agent', text: 'Hello! How can we help you today?' }
  ]);
  const [input, setInput] = useState('');
  
  // Ref for auto-scrolling
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const [isLoading, setIsLoading] = useState(false);

  // Only show to actual shoppers, not admin/seller
  if (!user || role !== 'client') return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { sender: 'user' as const, text: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      });
      const data = await res.json();
      
      setMessages(prev => [...prev, { 
        sender: 'agent', 
        text: data.text || 'Kechirasiz, muammo yuz berdi.' 
      }]);
    } catch {
      setMessages(prev => [...prev, { 
        sender: 'agent', 
        text: "Aloqa uzildi. Iltimos qayta urinib ko'ring." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: 'var(--accent-color)',
          color: 'white',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem',
          zIndex: 999,
          border: 'none',
          cursor: 'pointer'
        }}
      >
        💬
      </button>

      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '5rem',
          right: '2rem',
          width: '350px',
          height: '450px',
          backgroundColor: 'var(--bg-primary)',
          borderRadius: '1rem',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1000,
          overflow: 'hidden'
        }}>
          {/* Chat Header */}
          <div style={{ 
            padding: '1rem', 
            backgroundColor: 'var(--accent-color)', 
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h3 style={{ margin: 0, fontSize: '1.125rem' }}>Support Chat</h3>
            <button 
              onClick={() => setIsOpen(false)}
              style={{ color: 'white', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}
            >
              ×
            </button>
          </div>

          {/* Chat Body */}
          <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ 
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                backgroundColor: msg.sender === 'user' ? 'var(--accent-color)' : 'var(--bg-tertiary)',
                color: msg.sender === 'user' ? 'white' : 'var(--text-primary)',
                padding: '0.75rem 1rem',
                borderRadius: '1rem',
                borderBottomRightRadius: msg.sender === 'user' ? '0' : '1rem',
                borderBottomLeftRadius: msg.sender === 'agent' ? '0' : '1rem',
                maxWidth: '80%',
                fontSize: '0.875rem',
                whiteSpace: 'pre-wrap'
              }}>
                {msg.text}
              </div>
            ))}
            {isLoading && (
              <div style={{
                alignSelf: 'flex-start',
                backgroundColor: 'var(--bg-tertiary)',
                color: 'var(--text-secondary)',
                padding: '0.75rem 1rem',
                borderRadius: '1rem',
                borderBottomLeftRadius: '0',
                fontSize: '0.875rem'
              }}>
                Typing...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSend} style={{ padding: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '0.5rem' }}>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              style={{ flex: 1, padding: '0.5rem 1rem', borderRadius: '2rem', border: '1px solid var(--border-color)', outline: 'none' }}
            />
            <button type="submit" style={{ 
              backgroundColor: 'var(--accent-color)', 
              color: 'white', 
              border: 'none', 
              borderRadius: '50%', 
              width: '40px', 
              height: '40px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              ➤
            </button>
          </form>
        </div>
      )}
    </>
  );
}
