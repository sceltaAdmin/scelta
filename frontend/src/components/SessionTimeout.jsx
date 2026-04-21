import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const WARNING_TIME  = 25 * 60 * 1000; // 25 mins
const LOGOUT_TIME   = 30 * 60 * 1000; // 30 mins
const COUNTDOWN_SEC = 60;

export default function SessionTimeout() {
  const { isLoggedIn, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown]     = useState(COUNTDOWN_SEC);
  const warningTimer  = useRef();
  const logoutTimer   = useRef();
  const countdownTimer = useRef();

  const resetTimers = useCallback(() => {
    clearTimeout(warningTimer.current);
    clearTimeout(logoutTimer.current);
    clearInterval(countdownTimer.current);
    setShowWarning(false);
    setCountdown(COUNTDOWN_SEC);

    if (!isLoggedIn) return;

    warningTimer.current = setTimeout(() => {
      setShowWarning(true);
      setCountdown(COUNTDOWN_SEC);
      countdownTimer.current = setInterval(() => {
        setCountdown(c => {
          if (c <= 1) { clearInterval(countdownTimer.current); return 0; }
          return c - 1;
        });
      }, 1000);
    }, WARNING_TIME);

    logoutTimer.current = setTimeout(() => {
      setShowWarning(false);
      logoutUser();
      toast.error('Session expired. Please login again.');
      navigate('/login');
    }, LOGOUT_TIME);
  }, [isLoggedIn, logoutUser, navigate]);

  useEffect(() => {
    if (!isLoggedIn) { clearTimeout(warningTimer.current); clearTimeout(logoutTimer.current); return; }
    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click'];
    events.forEach(e => window.addEventListener(e, resetTimers, { passive: true }));
    resetTimers();
    return () => {
      events.forEach(e => window.removeEventListener(e, resetTimers));
      clearTimeout(warningTimer.current);
      clearTimeout(logoutTimer.current);
      clearInterval(countdownTimer.current);
    };
  }, [isLoggedIn, resetTimers]);

  if (!isLoggedIn || !showWarning) return null;

  const handleStay = () => {
    resetTimers();
    toast.success('Session extended!');
  };

  const handleLogout = () => {
    setShowWarning(false);
    logoutUser();
    navigate('/login');
  };

  return (
    <div data-testid="session-timeout-overlay"
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 99998, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div data-testid="session-timeout-modal"
        style={{ background: 'var(--bg-card)', borderRadius: 'var(--r-xl)', border: '1px solid var(--border)', padding: 36, maxWidth: 400, width: '100%', textAlign: 'center', boxShadow: 'var(--shadow-xl)', animation: 'fadeIn 0.3s ease' }}>

        {/* Warning icon */}
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--amber-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, margin: '0 auto 20px' }}>
          ⏰
        </div>

        <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-1)', marginBottom: 8 }}>Session Expiring Soon</h2>
        <p style={{ color: 'var(--text-2)', fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>
          You have been inactive for a while. Your session will expire in:
        </p>

        {/* Countdown */}
        <div data-testid="session-countdown"
          style={{ fontSize: 48, fontWeight: 800, color: countdown <= 10 ? 'var(--red)' : 'var(--fire)', marginBottom: 8, fontVariantNumeric: 'tabular-nums' }}>
          {String(Math.floor(countdown / 60)).padStart(2, '0')}:{String(countdown % 60).padStart(2, '0')}
        </div>

        {/* Progress bar */}
        <div style={{ width: '100%', height: 4, background: 'var(--border)', borderRadius: 2, marginBottom: 28, overflow: 'hidden' }}>
          <div style={{ height: '100%', background: countdown <= 10 ? 'var(--red)' : 'var(--fire)', borderRadius: 2, width: `${(countdown / COUNTDOWN_SEC) * 100}%`, transition: 'width 1s linear, background 0.3s' }} />
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button data-testid="session-logout-btn" onClick={handleLogout}
            style={{ flex: 1, padding: '12px', background: 'transparent', border: '1.5px solid var(--border)', borderRadius: 'var(--r-full)', color: 'var(--text-2)', fontWeight: 600, cursor: 'pointer', fontSize: 14 }}>
            Logout
          </button>
          <button data-testid="session-stay-btn" onClick={handleStay}
            style={{ flex: 2, padding: '12px', background: 'var(--fire)', border: 'none', borderRadius: 'var(--r-full)', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>
            Stay Logged In
          </button>
        </div>
      </div>
      <style>{`@keyframes fadeIn { from { opacity:0; transform:scale(0.95) } to { opacity:1; transform:scale(1) } }`}</style>
    </div>
  );
}
