import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

function OTPInput({ length = 6, value, onChange }) {
  const inputRefs = useRef([]);
  const digits = value.split('');

  const handleChange = (index, val) => {
    if (!/^\d*$/.test(val)) return;
    const newDigits = [...digits];
    newDigits[index] = val.slice(-1);
    onChange(newDigits.join(''));
    if (val && index < length - 1) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowLeft' && index > 0) inputRefs.current[index - 1]?.focus();
    if (e.key === 'ArrowRight' && index < length - 1) inputRefs.current[index + 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    onChange(pasted.padEnd(length, '').slice(0, length));
    if (pasted.length >= length) inputRefs.current[length - 1]?.focus();
    else inputRefs.current[pasted.length]?.focus();
  };

  return (
    <div data-testid="otp-input-group" style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={el => inputRefs.current[i] = el}
          data-testid={`otp-digit-${i}`}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digits[i] || ''}
          onChange={e => handleChange(i, e.target.value)}
          onKeyDown={e => handleKeyDown(i, e)}
          onPaste={handlePaste}
          style={{
            width: 48, height: 56,
            textAlign: 'center',
            fontSize: 22, fontWeight: 700,
            borderRadius: 'var(--r-md)',
            border: `2px solid ${digits[i] ? 'var(--fire)' : 'var(--border)'}`,
            background: digits[i] ? 'var(--fire-pale)' : 'var(--bg-card)',
            color: 'var(--text-1)',
            outline: 'none',
            transition: 'all 0.15s',
          }}
          onFocus={e => e.target.style.borderColor = 'var(--fire)'}
          onBlur={e => e.target.style.borderColor = digits[i] ? 'var(--fire)' : 'var(--border)'}
        />
      ))}
    </div>
  );
}

export default function Register() {
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const [step, setStep]       = useState(1);
  const [form, setForm]       = useState({ name: '', email: '', password: '' });
  const [otp, setOtp]         = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    if (resendTimer > 0) {
      const t = setTimeout(() => setResendTimer(r => r - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [resendTimer]);

  const sendOtp = () => {
    const generated = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(generated);
    setResendTimer(30);
    toast.success(`OTP sent! (Demo OTP: ${generated})`, { duration: 8000 });
  };

  const handleStep1 = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) { toast.error('Please fill all fields'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    sendOtp();
    setStep(2);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) { toast.error('Please enter the 6-digit OTP'); return; }
    if (otp !== generatedOtp) { toast.error('Invalid OTP. Please try again.'); setOtp(''); return; }
    setLoading(true);
    try {
      const res = await register(form);
      loginUser(res.data.token, res.data.user);
      toast.success(`Welcome to Scelta, ${res.data.user.name}!`);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
      setStep(1);
    } finally { setLoading(false); }
  };

  return (
    <main data-testid="register-page" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--r-xl)', border: '1px solid var(--border)', padding: 40, width: '100%', maxWidth: 440, boxShadow: 'var(--shadow-lg)' }}>

        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--text-1)', marginBottom: 8 }}>
            Scelt<span style={{ color: 'var(--fire)' }}>a</span>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-1)', marginBottom: 4 }}>
            {step === 1 ? 'Create account' : 'Verify your email'}
          </h1>
          <p style={{ color: 'var(--text-3)', fontSize: 14 }}>
            {step === 1 ? 'Join Scelta today' : `OTP sent to ${form.email}`}
          </p>
        </div>

        {/* Step indicators */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 28 }}>
          {[1, 2].map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: step >= s ? 'var(--fire)' : 'var(--border)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                {step > s ? '✓' : s}
              </div>
              <div style={{ fontSize: 11, color: step === s ? 'var(--fire)' : 'var(--text-3)', marginLeft: 6, fontWeight: step === s ? 600 : 400 }}>
                {s === 1 ? 'Details' : 'Verify OTP'}
              </div>
              {i === 0 && <div style={{ flex: 1, height: 2, background: step > 1 ? 'var(--fire)' : 'var(--border)', margin: '0 8px' }} />}
            </div>
          ))}
        </div>

        {/* Step 1 — Details */}
        {step === 1 && (
          <form data-testid="register-form" onSubmit={handleStep1}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: 6 }}>Full Name</label>
              <input data-testid="register-name" type="text" required value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="John Doe"
                style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--r-md)', border: '1.5px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-1)', fontSize: 14, outline: 'none' }}
                onFocus={e => e.target.style.borderColor = 'var(--fire)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: 6 }}>Email</label>
              <input data-testid="register-email" type="email" required value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="you@example.com"
                style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--r-md)', border: '1.5px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-1)', fontSize: 14, outline: 'none' }}
                onFocus={e => e.target.style.borderColor = 'var(--fire)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'} />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: 6 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input data-testid="register-password" type={showPass ? 'text' : 'password'} required minLength={6}
                  value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="Min 6 characters"
                  style={{ width: '100%', padding: '12px 44px 12px 16px', borderRadius: 'var(--r-md)', border: '1.5px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-1)', fontSize: 14, outline: 'none' }}
                  onFocus={e => e.target.style.borderColor = 'var(--fire)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'} />
                <button type="button" onClick={() => setShowPass(s => !s)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: 'var(--text-3)' }}>
                  {showPass ? '🙈' : '👁'}
                </button>
              </div>
            </div>
            <button data-testid="register-submit-btn" type="submit"
              style={{ width: '100%', padding: 13, background: 'var(--fire)', color: '#fff', border: 'none', borderRadius: 'var(--r-full)', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
              Send OTP →
            </button>
          </form>
        )}

        {/* Step 2 — OTP */}
        {step === 2 && (
          <form data-testid="otp-form" onSubmit={handleVerifyOtp}>
            <div style={{ marginBottom: 28 }}>
              <OTPInput length={6} value={otp} onChange={setOtp} />
            </div>

            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              {resendTimer > 0 ? (
                <span style={{ fontSize: 13, color: 'var(--text-3)' }}>Resend OTP in {resendTimer}s</span>
              ) : (
                <button type="button" data-testid="resend-otp-btn" onClick={() => { sendOtp(); setOtp(''); }}
                  style={{ fontSize: 13, color: 'var(--fire)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                  Resend OTP
                </button>
              )}
            </div>

            <button data-testid="verify-otp-btn" type="submit" disabled={loading || otp.length !== 6}
              style={{ width: '100%', padding: 13, background: otp.length === 6 ? 'var(--fire)' : 'var(--border)', color: '#fff', border: 'none', borderRadius: 'var(--r-full)', fontSize: 15, fontWeight: 700, cursor: otp.length === 6 ? 'pointer' : 'not-allowed' }}>
              {loading ? 'Creating Account...' : 'Verify & Create Account'}
            </button>

            <button type="button" onClick={() => { setStep(1); setOtp(''); }}
              style={{ width: '100%', marginTop: 10, padding: 10, background: 'transparent', border: 'none', color: 'var(--text-3)', fontSize: 13, cursor: 'pointer' }}>
              ← Back to details
            </button>
          </form>
        )}

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: 'var(--text-3)' }}>
          Already have an account? <Link to="/login" data-testid="go-to-login" style={{ color: 'var(--fire)', fontWeight: 600 }}>Sign In</Link>
        </p>
      </div>
    </main>
  );
}
