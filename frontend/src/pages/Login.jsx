import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm]       = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(form);
      loginUser(res.data.token, res.data.user);
      toast.success(`Welcome back, ${res.data.user.name}!`);
      navigate('/');
    } catch (err) { toast.error(err.response?.data?.message || 'Login failed'); }
    finally { setLoading(false); }
  };

  return (
    <main data-testid="login-page" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--r-xl)', border: '1px solid var(--border)', padding: 40, width: '100%', maxWidth: 440, boxShadow: 'var(--shadow-lg)' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--text-1)', marginBottom: 8 }}>Scelt<span style={{ color: 'var(--fire)' }}>a</span></div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-1)', marginBottom: 4 }}>Welcome back</h1>
          <p style={{ color: 'var(--text-3)', fontSize: 14 }}>Sign in to your account</p>
        </div>
        <form data-testid="login-form" onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: 6 }}>Email</label>
            <input data-testid="login-email" type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="you@example.com"
              style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--r-md)', border: '1.5px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-1)', fontSize: 14 }} />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: 6 }}>Password</label>
            <input data-testid="login-password" type="password" required value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="••••••••"
              style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--r-md)', border: '1.5px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-1)', fontSize: 14 }} />
          </div>
          <button data-testid="login-submit-btn" type="submit" disabled={loading}
            style={{ width: '100%', padding: 13, background: 'var(--fire)', color: '#fff', border: 'none', borderRadius: 'var(--r-full)', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: 'var(--text-3)' }}>
          No account? <Link to="/register" data-testid="go-to-register" style={{ color: 'var(--fire)', fontWeight: 600 }}>Register</Link>
        </p>
      </div>
    </main>
  );
}
