import { useState, useRef, useEffect } from 'react';

const SYSTEM_PROMPT = `You are Scelta AI, a friendly and knowledgeable shopping assistant for Scelta — India's premium e-commerce platform (tagline: "Your Choice, Delivered").

You help customers with:
- Product recommendations across Electronics, Books, Clothing, Home & Kitchen, Sports, and Toys
- Finding the best deals and comparing products
- Order and delivery queries
- Coupon codes: SCELTA10 (10% off orders above ₹500), SCELTA20 (20% off orders above ₹1000), FLAT100 (₹100 off above ₹999), FLAT200 (₹200 off above ₹1999), NEWUSER (15% off for new users)
- General shopping advice

Keep responses concise, friendly and helpful. Use emojis occasionally. Always stay in character as Scelta AI. If asked about specific product availability, suggest browsing the relevant category on the site.`;

export default function ChatBot() {
  const [open, setOpen]       = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I\'m Scelta AI 👋 How can I help you shop today?' }
  ]);
  const [input, setInput]     = useState('');
  const [loading, setLoading] = useState(false);
  const [unread, setUnread]   = useState(0);
  const bottomRef = useRef();
  const inputRef  = useRef();

  useEffect(() => {
    if (open) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const history = [...messages, userMsg]
        .filter(m => m.role !== 'system')
        .map(m => ({ role: m.role, content: m.content }));

      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: history,
        }),
      });

      const data = await res.json();
      const reply = data.content?.[0]?.text || 'Sorry, I could not process that. Please try again!';
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
      if (!open) setUnread(n => n + 1);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Oops! Something went wrong. Please try again 😅' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const quickReplies = ['Best deals today?', 'Coupon codes?', 'Track my order', 'Electronics under ₹5000'];

  return (
    <>
      {/* Chat Window */}
      {open && (
        <div data-testid="chatbot-window"
          style={{
            position: 'fixed', bottom: 90, right: 20, zIndex: 9999,
            width: 360, height: 520,
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 20,
            boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
            display: 'flex', flexDirection: 'column',
            overflow: 'hidden',
            animation: 'chatSlideUp 0.3s ease',
          }}>

          {/* Header */}
          <div style={{ background: 'linear-gradient(135deg, var(--fire), var(--fire-dark))', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🤖</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>Scelta AI</div>
              <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 6, height: 6, background: '#4ade80', borderRadius: '50%', display: 'inline-block' }} />
                Online · Your shopping assistant
              </div>
            </div>
            <button onClick={() => setOpen(false)}
              style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', width: 28, height: 28, borderRadius: '50%', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              ×
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', gap: 8, alignItems: 'flex-end' }}>
                {msg.role === 'assistant' && (
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, var(--fire), var(--fire-dark))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>🤖</div>
                )}
                <div style={{
                  maxWidth: '75%',
                  padding: '10px 14px',
                  borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  background: msg.role === 'user' ? 'linear-gradient(135deg, var(--fire), var(--fire-dark))' : 'var(--bg-card-2)',
                  color: msg.role === 'user' ? '#fff' : 'var(--text-1)',
                  fontSize: 13.5,
                  lineHeight: 1.5,
                  border: msg.role === 'assistant' ? '1px solid var(--border)' : 'none',
                  whiteSpace: 'pre-wrap',
                }}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, var(--fire), var(--fire-dark))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🤖</div>
                <div style={{ padding: '12px 16px', background: 'var(--bg-card-2)', border: '1px solid var(--border)', borderRadius: '18px 18px 18px 4px', display: 'flex', gap: 4, alignItems: 'center' }}>
                  {[0,1,2].map(i => (
                    <span key={i} style={{ width: 6, height: 6, background: 'var(--fire)', borderRadius: '50%', display: 'inline-block', animation: `bounce 1s ${i * 0.2}s infinite` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick replies */}
          {messages.length <= 2 && (
            <div style={{ padding: '0 16px 8px', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {quickReplies.map(q => (
                <button key={q} onClick={() => { setInput(q); setTimeout(sendMessage, 0); }}
                  style={{ padding: '5px 10px', background: 'var(--fire-pale)', border: '1px solid var(--fire-glow)', borderRadius: 999, fontSize: 11.5, color: 'var(--fire)', cursor: 'pointer', fontWeight: 600 }}>
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)', display: 'flex', gap: 8, alignItems: 'flex-end' }}>
            <textarea
              ref={inputRef}
              data-testid="chatbot-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask me anything..."
              rows={1}
              style={{
                flex: 1, padding: '10px 14px',
                borderRadius: 12, border: '1.5px solid var(--border)',
                background: 'var(--bg-card-2)', color: 'var(--text-1)',
                fontSize: 13.5, resize: 'none', outline: 'none',
                fontFamily: 'inherit', lineHeight: 1.4,
                maxHeight: 80, overflowY: 'auto',
              }}
            />
            <button
              data-testid="chatbot-send"
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              style={{
                width: 40, height: 40,
                background: input.trim() ? 'var(--fire)' : 'var(--border)',
                border: 'none', borderRadius: 12,
                color: '#fff', fontSize: 16, cursor: input.trim() ? 'pointer' : 'default',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.2s', flexShrink: 0,
              }}>
              ➤
            </button>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        data-testid="chatbot-toggle"
        onClick={() => setOpen(o => !o)}
        style={{
          position: 'fixed', bottom: 20, right: 20, zIndex: 9999,
          width: 56, height: 56, borderRadius: '50%',
          background: open ? 'var(--bg-card)' : 'linear-gradient(135deg, var(--fire), var(--fire-dark))',
          border: open ? '2px solid var(--border)' : 'none',
          color: open ? 'var(--text-1)' : '#fff',
          fontSize: 24, cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(255,87,34,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.3s',
          animation: !open ? 'pulse 2s infinite' : 'none',
        }}>
        {open ? '×' : '🤖'}
        {!open && unread > 0 && (
          <span style={{ position: 'absolute', top: -4, right: -4, background: '#ef4444', color: '#fff', fontSize: 10, fontWeight: 700, width: 18, height: 18, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{unread}</span>
        )}
      </button>

      <style>{`
        @keyframes chatSlideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
        @keyframes pulse {
          0%, 100% { box-shadow: 0 4px 20px rgba(255,87,34,0.4); }
          50% { box-shadow: 0 4px 32px rgba(255,87,34,0.7); }
        }
      `}</style>
    </>
  );
}
