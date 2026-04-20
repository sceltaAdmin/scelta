import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProfile, updateProfile } from '../services/api';
import toast from 'react-hot-toast';

const validate = (form) => {
  const errors = {};
  if (!form.name.trim()) errors.name = 'Name is required';
  else if (!/^[a-zA-Z\s]{2,50}$/.test(form.name.trim())) errors.name = 'Name must be 2-50 letters only';
  if (form.phone && !/^[6-9]\d{9}$/.test(form.phone)) errors.phone = 'Enter valid 10-digit Indian mobile number';
  if (form.address.street && form.address.street.length < 5) errors.street = 'Street address must be at least 5 characters';
  if (form.address.city && !/^[a-zA-Z\s]{2,50}$/.test(form.address.city)) errors.city = 'City must contain letters only';
  if (form.address.state && !/^[a-zA-Z\s]{2,50}$/.test(form.address.state)) errors.state = 'State must contain letters only';
  if (form.address.pincode && !/^[1-9][0-9]{5}$/.test(form.address.pincode)) errors.pincode = 'Enter valid 6-digit pincode';
  return errors;
};

const InputField = ({ label, testid, type = 'text', value, onChange, error, placeholder, maxLength }) => (
  <div style={{ marginBottom: 20 }}>
    <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: 6 }}>{label}</label>
    <input data-testid={testid} type={type} value={value} onChange={onChange} placeholder={placeholder} maxLength={maxLength}
      style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--r-md)', border: `1.5px solid ${error ? 'var(--red)' : 'var(--border)'}`, background: error ? 'var(--red-pale)' : 'var(--bg-card)', color: 'var(--text-1)', fontSize: 14, outline: 'none' }}
      onFocus={e => { if (!error) e.target.style.borderColor = 'var(--fire)'; }}
      onBlur={e => { if (!error) e.target.style.borderColor = 'var(--border)'; }} />
    {error && <div style={{ fontSize: 12, color: 'var(--red)', marginTop: 4 }}>⚠ {error}</div>}
  </div>
);

export default function Profile() {
  const { isLoggedIn, loginUser, user: authUser } = useAuth();
  const [form, setForm]       = useState({ name: '', phone: '', address: { street: '', city: '', state: '', pincode: '' } });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar]   = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [uploadMsg, setUploadMsg] = useState('');
  const fileRef = useRef();

  useEffect(() => {
    if (isLoggedIn) {
      getProfile().then(res => {
        const u = res.data.user;
        setForm({ name: u.name || '', phone: u.phone || '', address: u.address || { street: '', city: '', state: '', pincode: '' } });
        if (u.avatar) setAvatarPreview(u.avatar);
      });
    }
  }, [isLoggedIn]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) { toast.error('Only JPG, PNG or WebP images allowed'); return; }
    if (file.size > 2 * 1024 * 1024) { toast.error('Image must be under 2MB'); return; }
    setAvatar(file);
    setAvatarPreview(URL.createObjectURL(file));
    setUploadMsg(`✅ ${file.name} (${(file.size / 1024).toFixed(1)} KB) ready to upload`);
  };

  const handleChange = (field, value) => {
    setForm(f => ({ ...f, [field]: value }));
    if (errors[field]) setErrors(e => ({ ...e, [field]: '' }));
  };

  const handleAddressChange = (field, value) => {
    setForm(f => ({ ...f, address: { ...f.address, [field]: value } }));
    if (errors[field]) setErrors(e => ({ ...e, [field]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); toast.error('Please fix the errors before saving'); return; }
    setLoading(true);
    try {
      const res = await updateProfile({ ...form, avatar: avatarPreview });
      loginUser(localStorage.getItem('scelta_token'), res.data.user);
      toast.success('Profile updated successfully!');
    } catch { toast.error('Failed to update profile'); }
    finally { setLoading(false); }
  };

  if (!isLoggedIn) return (
    <div data-testid="profile-page" style={{ textAlign: 'center', padding: '80px 20px' }}>
      <h2 style={{ marginBottom: 16, color: 'var(--text-1)' }}>Please login to view profile</h2>
      <Link to="/login" style={{ padding: '12px 28px', background: 'var(--fire)', color: '#fff', borderRadius: 'var(--r-full)', fontWeight: 600 }}>Login</Link>
    </div>
  );

  const initials = authUser?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';

  return (
    <main data-testid="profile-page" style={{ maxWidth: 640, margin: '0 auto', padding: '32px 20px' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: 'var(--text-1)', marginBottom: 32 }}>My Profile</h1>
      <form data-testid="profile-form" onSubmit={handleSubmit}
        style={{ background: 'var(--bg-card)', borderRadius: 'var(--r-xl)', border: '1px solid var(--border)', padding: 32 }}>

        {/* Avatar upload */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 32, paddingBottom: 28, borderBottom: '1px solid var(--border)' }}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            {avatarPreview ? (
              <img src={avatarPreview} alt="Avatar" style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--fire)' }} />
            ) : (
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, var(--fire), var(--fire-dark))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 700, color: '#fff' }}>{initials}</div>
            )}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--text-1)', marginBottom: 4 }}>{authUser?.name}</div>
            <div style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 12 }}>{authUser?.email}</div>

            {/* File upload */}
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp"
              data-testid="avatar-upload" onChange={handleFileChange}
              style={{ display: 'none' }} />
            <button type="button" onClick={() => fileRef.current.click()}
              data-testid="avatar-upload-btn"
              style={{ padding: '8px 16px', background: 'transparent', border: '1.5px solid var(--border)', borderRadius: 'var(--r-full)', fontSize: 13, color: 'var(--text-1)', cursor: 'pointer', fontWeight: 600 }}>
              📷 Upload Photo
            </button>
            {uploadMsg && <div style={{ fontSize: 12, color: 'var(--green)', marginTop: 6 }}>{uploadMsg}</div>}
            <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>JPG, PNG or WebP · Max 2MB</div>
          </div>
        </div>

        <InputField label="Full Name" testid="register-name" value={form.name}
          onChange={e => handleChange('name', e.target.value.replace(/[^a-zA-Z\s]/g, ''))}
          error={errors.name} placeholder="John Doe" maxLength={50} />

        <InputField label="Phone Number" testid="profile-phone" type="tel" value={form.phone}
          onChange={e => handleChange('phone', e.target.value.replace(/[^0-9]/g, '').slice(0, 10))}
          error={errors.phone} placeholder="9876543210" maxLength={10} />

        <InputField label="Street Address" testid="profile-street" value={form.address.street}
          onChange={e => handleAddressChange('street', e.target.value)}
          error={errors.street} placeholder="123 Main Street, Area" maxLength={100} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <InputField label="City" testid="profile-city" value={form.address.city}
            onChange={e => handleAddressChange('city', e.target.value.replace(/[^a-zA-Z\s]/g, ''))}
            error={errors.city} placeholder="Bengaluru" maxLength={50} />
          <InputField label="State" testid="profile-state" value={form.address.state}
            onChange={e => handleAddressChange('state', e.target.value.replace(/[^a-zA-Z\s]/g, ''))}
            error={errors.state} placeholder="Karnataka" maxLength={50} />
        </div>

        <InputField label="Pincode" testid="profile-pincode" value={form.address.pincode}
          onChange={e => handleAddressChange('pincode', e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
          error={errors.pincode} placeholder="560001" maxLength={6} />

        <button data-testid="save-profile-btn" type="submit" disabled={loading}
          style={{ width: '100%', padding: 13, background: loading ? 'var(--border)' : 'var(--fire)', color: '#fff', border: 'none', borderRadius: 'var(--r-full)', fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer' }}>
          {loading ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </main>
  );
}
