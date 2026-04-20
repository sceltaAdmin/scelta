import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { logout, getProducts } from '../services/api';
import toast from 'react-hot-toast';

const CATEGORIES = [
  { id: '', label: 'All' },
  { id: 'electronics', label: 'Electronics' },
  { id: 'books', label: 'Books' },
  { id: 'clothing', label: 'Clothing' },
  { id: 'home-kitchen', label: 'Home & Kitchen' },
  { id: 'sports', label: 'Sports' },
  { id: 'toys', label: 'Toys' },
];

export default function Navbar() {
  const { user, isLoggedIn, logoutUser } = useAuth();
  const { cartCount } = useCart();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();
  const [theme, setTheme]           = useState(localStorage.getItem('scelta_theme') || 'light');
  const [search, setSearch]         = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSugg, setShowSugg]     = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const searchRef = useRef();
  const userRef   = useRef();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('scelta_theme', theme);
  }, [theme]);

  useEffect(() => {
    const handler = (e) => {
      if (!searchRef.current?.contains(e.target)) setShowSugg(false);
      if (!userRef.current?.contains(e.target)) setShowUserMenu(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = async (val) => {
    setSearch(val);
    if (val.length < 2) { setSuggestions([]); setShowSugg(false); return; }
    try {
      const res = await getProducts({ search: val, limit: 5 });
      setSuggestions(res.data.products);
      setShowSugg(true);
    } catch {}
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) { navigate(`/products?search=${encodeURIComponent(search)}`); setShowSugg(false); }
  };

  const handleLogout = async () => {
    try { await logout(); } catch {}
    logoutUser();
    toast.success('Logged out successfully');
    navigate('/');
    setShowUserMenu(false);
  };

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';
  const firstName = user?.name?.split(' ')[0] || '';

  const activeCategory = new URLSearchParams(location.search).get('category') || '';

  return (
    <header data-testid="navbar" style={{ position: 'sticky', top: 0, zIndex: 1000 }}>
      {/* Main nav */}
      <nav style={{ background: 'var(--bg-nav)', padding: '0 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 16, height: 64 }}>

          {/* Logo */}
          <Link to="/" data-testid="nav-logo"
            style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: '#fff', flexShrink: 0, letterSpacing: '-0.3px' }}>
            <img src="/logo.svg" alt="Scelta" style={{ height: 36 }} />
          </Link>

          {/* Search */}
          <div ref={searchRef} style={{ flex: 1, maxWidth: 560, position: 'relative' }}>
            <form onSubmit={handleSearchSubmit}
              style={{ display: 'flex', alignItems: 'center', background: '#1a1c1e', border: '1px solid #2a2d30', borderRadius: 999, overflow: 'hidden', transition: 'border-color 0.2s' }}
              onFocus={e => e.currentTarget.style.borderColor = 'var(--fire)'}
              onBlur={e => e.currentTarget.style.borderColor = '#2a2d30'}>
              <span style={{ padding: '0 12px 0 16px', fontSize: 15, color: '#6b7280', flexShrink: 0 }}>🔍</span>
              <input
                data-testid="search-input"
                value={search}
                onChange={e => handleSearch(e.target.value)}
                placeholder="Search products, brands..."
                style={{ flex: 1, border: 'none', padding: '10px 0', fontSize: 13.5, color: '#e5e7eb', background: 'transparent', outline: 'none' }}
              />
              {search && (
                <button type="button" onClick={() => { setSearch(''); setSuggestions([]); }}
                  style={{ padding: '0 14px', background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: 16 }}>×</button>
              )}
              <button data-testid="search-btn" type="submit"
                style={{ padding: '8px 16px', background: 'var(--fire)', border: 'none', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', borderRadius: '0 999px 999px 0', height: '100%', flexShrink: 0 }}>
                Search
              </button>
            </form>

            {/* Suggestions */}
            {showSugg && suggestions.length > 0 && (
              <div data-testid="search-suggestions"
                style={{ position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', boxShadow: 'var(--shadow-xl)', zIndex: 9999, overflow: 'hidden' }}>
                {suggestions.map(p => (
                  <div key={p._id}
                    onClick={() => { navigate(`/products/${p._id}`); setShowSugg(false); setSearch(''); }}
                    style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', cursor: 'pointer', borderBottom: '1px solid var(--border)', transition: 'background 0.1s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--snow)'}
                    onMouseLeave={e => e.currentTarget.style.background = ''}>
                    <img src={p.image} alt={p.name} style={{ width: 38, height: 38, objectFit: 'contain', borderRadius: 6, background: 'var(--bg-card-2)', padding: 4 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-3)', textTransform: 'capitalize' }}>{p.brand} · {p.category}</div>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fire)', flexShrink: 0 }}>₹{p.price.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 'auto', flexShrink: 0 }}>

            {/* Theme toggle */}
            <button data-testid="theme-toggle" onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
              title={theme === 'light' ? 'Switch to dark' : 'Switch to light'}
              style={{ background: 'transparent', border: 'none', color: '#9ca3af', padding: '8px', borderRadius: 8, fontSize: 17, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#fff'}
              onMouseLeave={e => e.currentTarget.style.color = '#9ca3af'}>
              {theme === 'light' ? '🌙' : '☀️'}
            </button>

            {/* Wishlist */}
            <Link to="/wishlist" data-testid="nav-wishlist" title="Wishlist"
              style={{ position: 'relative', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: 17, borderRadius: 8, transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#fff'}
              onMouseLeave={e => e.currentTarget.style.color = '#9ca3af'}>
              {wishlist.length > 0 ? '❤️' : '🤍'}
              {wishlist.length > 0 && (
                <span style={{ position: 'absolute', top: 2, right: 2, background: 'var(--fire)', color: '#fff', fontSize: 9, fontWeight: 700, borderRadius: 999, minWidth: 15, height: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 3px', border: '1.5px solid var(--bg-nav)' }}>
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link to="/cart" data-testid="nav-cart" title="Cart"
              style={{ position: 'relative', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: 17, borderRadius: 8, transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#fff'}
              onMouseLeave={e => e.currentTarget.style.color = '#9ca3af'}>
              🛒
              {cartCount > 0 && (
                <span data-testid="cart-badge"
                  style={{ position: 'absolute', top: 2, right: 2, background: 'var(--fire)', color: '#fff', fontSize: 9, fontWeight: 700, borderRadius: 999, minWidth: 15, height: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 3px', border: '1.5px solid var(--bg-nav)' }}>
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User */}
            {isLoggedIn ? (
              <div ref={userRef} style={{ position: 'relative' }}>
                <button data-testid="user-menu-btn" onClick={() => setShowUserMenu(v => !v)}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#1a1c1e', border: '1px solid #2a2d30', borderRadius: 999, padding: '5px 12px 5px 5px', cursor: 'pointer', transition: 'border-color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--fire)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = '#2a2d30'}>
                  <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg, var(--fire), var(--fire-dark))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff', flexShrink: 0 }}>{initials}</div>
                  <span style={{ fontSize: 13, color: '#e5e7eb', fontWeight: 500, maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{firstName}</span>
                  <span style={{ fontSize: 10, color: '#6b7280' }}>▾</span>
                </button>

                {showUserMenu && (
                  <div data-testid="user-dropdown"
                    style={{ position: 'absolute', right: 0, top: 'calc(100% + 10px)', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', boxShadow: 'var(--shadow-xl)', minWidth: 200, zIndex: 9999, overflow: 'hidden' }}>
                    <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', background: 'var(--bg-card-2)' }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-1)' }}>{user.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>{user.email}</div>
                    </div>
                    {[['👤', 'My Profile', '/profile'], ['📦', 'My Orders', '/orders'], ['🤍', 'Wishlist', '/wishlist'], ['🛒', 'Cart', '/cart']].map(([icon, label, path]) => (
                      <Link key={path} to={path} onClick={() => setShowUserMenu(false)}
                        style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 16px', fontSize: 13.5, color: 'var(--text-1)', borderBottom: '1px solid var(--border)', transition: 'background 0.1s' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--snow)'}
                        onMouseLeave={e => e.currentTarget.style.background = ''}>
                        <span style={{ fontSize: 15 }}>{icon}</span>{label}
                      </Link>
                    ))}
                    <button data-testid="logout-btn" onClick={handleLogout}
                      style={{ width: '100%', padding: '11px 16px', fontSize: 13.5, color: 'var(--red)', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, transition: 'background 0.1s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--red-pale)'}
                      onMouseLeave={e => e.currentTarget.style.background = ''}>
                      <span style={{ fontSize: 15 }}>🚪</span> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" data-testid="nav-login-btn"
                style={{ padding: '8px 18px', background: 'var(--fire)', color: '#fff', borderRadius: 999, fontSize: 13, fontWeight: 600, marginLeft: 4, transition: 'background 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--fire-dark)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--fire)'}>
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Category sub-nav */}
      <div style={{ background: 'var(--bg-nav)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'flex', overflowX: 'auto', scrollbarWidth: 'none' }}>
          {CATEGORIES.map(({ id, label }) => {
            const isActive = location.pathname === '/products' && activeCategory === id;
            return (
              <Link key={id}
                to={id ? `/products?category=${id}` : '/products'}
                data-testid={`cat-${id || 'all'}`}
                style={{
                  padding: '10px 14px', fontSize: 12.5, whiteSpace: 'nowrap', display: 'block',
                  color: isActive ? '#fff' : '#9ca3af',
                  borderBottom: isActive ? '2px solid var(--fire)' : '2px solid transparent',
                  fontWeight: isActive ? 600 : 400,
                  transition: 'all 0.15s',
                  flexShrink: 0,
                }}
                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.color = '#e5e7eb'; } }}
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.color = '#9ca3af'; } }}>
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
