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
  { id: 'coupons', label: 'Coupons' },
];

export default function Navbar() {
  const { user, isLoggedIn, logoutUser } = useAuth();
  const { cartCount } = useCart();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();
  const [theme, setTheme] = useState(localStorage.getItem('scelta_theme') || 'light');
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSugg, setShowSugg] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const searchRef = useRef();
  const userRef = useRef();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search)}`);
      setShowSugg(false);
      setShowMobileSearch(false);
    }
  };

  const handleLogout = async () => {
    const confirmed = window.confirm('Are you sure you want to logout?');
    if (!confirmed) return;
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
      <style>{`
        .nav-search-desktop { display: ${isMobile ? 'none' : 'block'}; flex: 1; max-width: 560px; position: relative; }
        .nav-search-mobile { display: ${isMobile ? 'block' : 'none'}; }
        .mobile-search-overlay { display: ${showMobileSearch ? 'block' : 'none'}; }
        @media (max-width: 768px) {
          .cat-subnav { font-size: 11px !important; }
          .cat-subnav a { padding: 8px 10px !important; font-size: 11px !important; }
        }
      `}</style>

      {/* Main nav */}
      <nav style={{ background: 'var(--bg-nav)', padding: isMobile ? '0 12px' : '0 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', gap: isMobile ? 8 : 16, height: isMobile ? 56 : 64 }}>

          {/* Logo */}
          <Link to="/" data-testid="nav-logo"
            style={{ fontFamily: 'var(--font-display)', fontSize: isMobile ? 18 : 22, color: '#fff', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img src="/logo.png" alt="Scelta" style={{ height: isMobile ? 24 : 30, width: isMobile ? 24 : 30, objectFit: 'contain', marginRight: -4 }} />
              <span>celt<span style={{ color: 'var(--fire)' }}>a</span></span>
            </div>
          </Link>

          {/* Desktop Search */}
          <div ref={searchRef} className="nav-search-desktop">
            <form onSubmit={handleSearchSubmit}
              style={{ display: 'flex', alignItems: 'center', background: '#1a1c1e', border: '1px solid #2a2d30', borderRadius: 999, overflow: 'hidden' }}>
              <span style={{ padding: '0 10px 0 14px', fontSize: 14, color: '#6b7280' }}>🔍</span>
              <input data-testid="search-input" value={search}
                onChange={e => handleSearch(e.target.value)}
                placeholder="Search products, brands..."
                style={{ flex: 1, border: 'none', padding: '10px 0', fontSize: 13, color: '#e5e7eb', background: 'transparent', outline: 'none' }} />
              {search && (
                <button type="button" onClick={() => { setSearch(''); setSuggestions([]); }}
                  style={{ padding: '0 10px', background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: 16 }}>×</button>
              )}
              <button data-testid="search-btn" type="submit"
                style={{ padding: '8px 14px', background: 'var(--fire)', border: 'none', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', borderRadius: '0 999px 999px 0' }}>
                Search
              </button>
            </form>
            {showSugg && suggestions.length > 0 && (
              <div data-testid="search-suggestions"
                style={{ position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', boxShadow: 'var(--shadow-xl)', zIndex: 9999, overflow: 'hidden' }}>
                {suggestions.map(p => (
                  <div key={p._id} onClick={() => { navigate(`/products/${p._id}`); setShowSugg(false); setSearch(''); }}
                    style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', cursor: 'pointer', borderBottom: '1px solid var(--border)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--snow)'}
                    onMouseLeave={e => e.currentTarget.style.background = ''}>
                    <img src={p.image} alt={p.name} style={{ width: 36, height: 36, objectFit: 'contain', borderRadius: 6, background: 'var(--bg-card-2)', padding: 4 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{p.brand} · {p.category}</div>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fire)' }}>₹{p.price?.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Spacer on mobile */}
          {isMobile && <div style={{ flex: 1 }} />}

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 2 : 4, flexShrink: 0 }}>

            {/* Mobile search icon */}
            {isMobile && (
              <button onClick={() => setShowMobileSearch(s => !s)}
                style={{ background: 'transparent', border: 'none', color: '#9ca3af', padding: '8px', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                🔍
              </button>
            )}

            {/* Theme toggle */}
            <button data-testid="theme-toggle" onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
              style={{ background: 'transparent', border: 'none', color: '#9ca3af', padding: '8px', fontSize: isMobile ? 16 : 17, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              {theme === 'light' ? '🌙' : '☀️'}
            </button>

            {/* Wishlist — hide on mobile */}
            {!isMobile && (
              <Link to="/wishlist" data-testid="nav-wishlist"
                style={{ position: 'relative', padding: '8px', display: 'flex', alignItems: 'center', color: '#9ca3af', fontSize: 17 }}>
                {wishlist.length > 0 ? '❤️' : '🤍'}
                {wishlist.length > 0 && (
                  <span style={{ position: 'absolute', top: 2, right: 2, background: 'var(--fire)', color: '#fff', fontSize: 9, fontWeight: 700, borderRadius: 999, minWidth: 15, height: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 3px' }}>
                    {wishlist.length}
                  </span>
                )}
              </Link>
            )}

            {/* Cart */}
            <Link to="/cart" data-testid="nav-cart"
              style={{ position: 'relative', padding: '8px', display: 'flex', alignItems: 'center', color: '#9ca3af', fontSize: isMobile ? 16 : 17 }}>
              🛒
              {cartCount > 0 && (
                <span data-testid="cart-badge"
                  style={{ position: 'absolute', top: 2, right: 2, background: 'var(--fire)', color: '#fff', fontSize: 9, fontWeight: 700, borderRadius: 999, minWidth: 15, height: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 3px' }}>
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User */}
            {isLoggedIn ? (
              <div ref={userRef} style={{ position: 'relative' }}>
                <button data-testid="user-menu-btn" onClick={() => setShowUserMenu(v => !v)}
                  style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 4 : 8, background: '#1a1c1e', border: '1px solid #2a2d30', borderRadius: 999, padding: isMobile ? '4px 8px 4px 4px' : '5px 12px 5px 5px', cursor: 'pointer' }}>
                  <div style={{ width: isMobile ? 26 : 30, height: isMobile ? 26 : 30, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, background: 'linear-gradient(135deg, var(--fire), var(--fire-dark))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {user?.avatar
                      ? <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none'; }} />
                      : <span style={{ fontSize: 10, fontWeight: 700, color: '#fff' }}>{initials}</span>
                    }
                  </div>
                  {!isMobile && <span style={{ fontSize: 13, color: '#e5e7eb', fontWeight: 500, maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{firstName}</span>}
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
                        style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 16px', fontSize: 13.5, color: 'var(--text-1)', borderBottom: '1px solid var(--border)' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--snow)'}
                        onMouseLeave={e => e.currentTarget.style.background = ''}>
                        <span>{icon}</span>{label}
                      </Link>
                    ))}
                    <button data-testid="logout-btn" onClick={handleLogout}
                      style={{ width: '100%', padding: '11px 16px', fontSize: 13.5, color: 'var(--red)', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--red-pale)'}
                      onMouseLeave={e => e.currentTarget.style.background = ''}>
                      <span>🚪</span> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" data-testid="nav-login-btn"
                style={{ padding: isMobile ? '6px 12px' : '8px 18px', background: 'var(--fire)', color: '#fff', borderRadius: 999, fontSize: isMobile ? 12 : 13, fontWeight: 600, marginLeft: 4 }}>
                Login
              </Link>
            )}
          </div>
        </div>

        {/* Mobile search bar — expands below navbar */}
        {isMobile && showMobileSearch && (
          <div ref={searchRef} style={{ padding: '8px 12px 12px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <form onSubmit={handleSearchSubmit}
              style={{ display: 'flex', alignItems: 'center', background: '#1a1c1e', border: '1px solid #2a2d30', borderRadius: 999, overflow: 'hidden' }}>
              <span style={{ padding: '0 10px 0 14px', fontSize: 14, color: '#6b7280' }}>🔍</span>
              <input data-testid="search-input" value={search} autoFocus
                onChange={e => handleSearch(e.target.value)}
                placeholder="Search products, brands..."
                style={{ flex: 1, border: 'none', padding: '10px 0', fontSize: 14, color: '#e5e7eb', background: 'transparent', outline: 'none' }} />
              {search && (
                <button type="button" onClick={() => { setSearch(''); setSuggestions([]); }}
                  style={{ padding: '0 10px', background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: 16 }}>×</button>
              )}
              <button type="submit"
                style={{ padding: '8px 14px', background: 'var(--fire)', border: 'none', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', borderRadius: '0 999px 999px 0' }}>
                Go
              </button>
            </form>
            {showSugg && suggestions.length > 0 && (
              <div data-testid="search-suggestions"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', boxShadow: 'var(--shadow-xl)', zIndex: 9999, overflow: 'hidden', marginTop: 8 }}>
                {suggestions.map(p => (
                  <div key={p._id} onClick={() => { navigate(`/products/${p._id}`); setShowSugg(false); setSearch(''); setShowMobileSearch(false); }}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', cursor: 'pointer', borderBottom: '1px solid var(--border)' }}>
                    <img src={p.image} alt={p.name} style={{ width: 36, height: 36, objectFit: 'contain', borderRadius: 6, background: 'var(--bg-card-2)', padding: 4 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{p.brand}</div>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fire)' }}>₹{p.price?.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Category sub-nav */}
      <div className="cat-subnav" style={{ background: 'var(--bg-nav)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: isMobile ? '0 8px' : '0 24px', display: 'flex', overflowX: 'auto', scrollbarWidth: 'none' }}>
          {CATEGORIES.map(({ id, label }) => {
            const isActive = location.pathname === '/products' && activeCategory === id ||
              (id === 'coupons' && location.pathname === '/coupons');
            return (
              <Link key={id}
                to={id === 'coupons' ? '/coupons' : id ? `/products?category=${id}` : '/products'}
                data-testid={`cat-${id || 'all'}`}
                style={{ padding: isMobile ? '8px 10px' : '10px 14px', fontSize: isMobile ? 11 : 12.5, whiteSpace: 'nowrap', display: 'block', color: isActive ? '#fff' : '#9ca3af', borderBottom: isActive ? '2px solid var(--fire)' : '2px solid transparent', fontWeight: isActive ? 600 : 400, flexShrink: 0 }}>
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
