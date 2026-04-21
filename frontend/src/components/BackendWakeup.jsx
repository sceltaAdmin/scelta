import { useState, useEffect } from 'react';
import API from '../services/api';

export default function BackendWakeup({ children }) {
  const [status, setStatus] = useState('checking');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let timer;

    const check = async () => {
      try {
        await API.get('/health');
        if (!cancelled) setStatus('ready');
      } catch {
        if (!cancelled) {
          setAttempt(a => a + 1);
          timer = setTimeout(check, 3000);
        }
      }
    };

    check();
    return () => { cancelled = true; clearTimeout(timer); };
  }, []);

  if (status === 'ready') return children;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-page)', gap: 20, padding: 20 }}>

      {/* Logo */}
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, color: 'var(--text-1)' }}>
        Scelt<span style={{ color: 'var(--fire)' }}>a</span>
      </div>

      {/* Animated spinner */}
      <div style={{ position: 'relative', width: 56, height: 56 }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '3px solid var(--border)' }} />
        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '3px solid transparent', borderTopColor: 'var(--fire)', animation: 'spin 0.8s linear infinite' }} />
      </div>

      {/* Status message */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-1)', marginBottom: 6 }}>
          {attempt < 3 ? 'Starting up...' : attempt < 8 ? 'Waking up server...' : 'Almost ready...'}
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-3)' }}>
          {attempt < 3
            ? 'Connecting to Scelta servers'
            : 'Server was sleeping — this takes up to 30 seconds on free tier'}
        </div>
      </div>

      {/* Progress dots */}
      <div style={{ display: 'flex', gap: 6 }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--fire)', animation: `bounce 1s ${i * 0.2}s infinite` }} />
        ))}
      </div>

      {attempt >= 5 && (
        <div style={{ fontSize: 12, color: 'var(--text-3)', maxWidth: 300, textAlign: 'center', padding: '10px 16px', background: 'var(--bg-card)', borderRadius: 'var(--r-md)', border: '1px solid var(--border)' }}>
          Free tier servers sleep after inactivity. Thank you for your patience!
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes bounce { 0%, 60%, 100% { transform: translateY(0); } 30% { transform: translateY(-8px); } }
      `}</style>
    </div>
  );
}
