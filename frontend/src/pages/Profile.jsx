import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProfile, updateProfile } from '../services/api';
import toast from 'react-hot-toast';

export default function Profile() {
  const { isLoggedIn, loginUser } = useAuth();
  const [form, setForm]     = useState({ name: '', phone: '', address: { street: '', city: '', state: '', pincode: '' } });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      getProfile().then(res => {
        const u = res.data.user;
        setForm({ name: u.name || '', phone: u.phone || '', address: u.address || { street: '', city: '', state: '', pincode: '' } });
      });
    }
  }, [isLoggedIn]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await updateProfile(form);
      loginUser(localStorage.getItem('scelta_token'), res.data.user);
      toast.success('Profile updated!');
    } catch { toast.error('Failed to update profile'); }
    finally { setLoading(false); }
  };

  if (!isLoggedIn) return (
    <div data-testid="profile-page" style={{ textAlign: 'center', padding: '80px 20px' }}>
      <h2 style={{ marginBottom: 16, color: 'var(--text-1)' }}>Please login to view profile</h2>
      <Link to="/login" style={{ padding: '12px 28px', background: 'var(--fire)', color: '#fff', borderRadius: 'var(--r-full)', fontWeight: 600 }}>Login</Link>
    </div>
  );

  return (
    <main data-testid="profile-page" style={{ maxWidth: 600, margin: '0 auto', padding: '32px 20px' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: 'var(--text-1)', marginBottom: 32 }}>My Profile</h1>
      <form data-testid="profile-form" onSubmit={handleSubmit} style={{ background: 'var(--bg-card)', borderRadius: 'var(--r-xl)', border: '1px solid var(--border)', padding: 32 }}>
        {[['Full Name', 'name', 'text', 'register-name'], ['Phone', 'phone', 'tel', 'profile-phone']].map(([label, field, type, testid]) => (
          <div key={field} style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: 6 }}>{label}</label>
            <input data-testid={testid} type={type} value={form[field] || ''} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
              style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--r-md)', border: '1.5px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-1)', fontSize: 14 }} />
          </div>
        ))}
        {[['Street Address', 'street', 'profile-street'], ['City', 'city', 'profile-city'], ['State', 'state', 'profile-state'], ['Pincode', 'pincode', 'profile-pincode']].map(([label, field, testid]) => (
          <div key={field} style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: 6 }}>{label}</label>
            <input data-testid={testid} value={form.address?.[field] || ''} onChange={e => setForm(f => ({ ...f, address: { ...f.address, [field]: e.target.value } }))}
              style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--r-md)', border: '1.5px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-1)', fontSize: 14 }} />
          </div>
        ))}
        <button data-testid="save-profile-btn" type="submit" disabled={loading}
          style={{ width: '100%', padding: 13, background: 'var(--fire)', color: '#fff', border: 'none', borderRadius: 'var(--r-full)', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
          {loading ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </main>
  );
}
