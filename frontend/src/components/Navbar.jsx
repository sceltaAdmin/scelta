import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { logout, getProducts } from '../services/api';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, isLoggedIn, logoutUser } = useAuth();
  const { cartCount } = useCart();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();
  const [theme, setTheme] = useState(localStorage.getItem('scelta_theme') || 'light');
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSugg, setShowSugg] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const searchRef = useRef();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('scelta_theme', theme);
  }, [theme]);

  useEffect(() => {
    const handler = (e) => { if (!searchRef.current?.contains(e.target)) setShowSugg(false); };
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
  };

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';

  return (
    <header data-testid="navbar">
      <nav style={{ background: 'var(--bg-nav)', padding: '0 20px', position: 'sticky', top: 0, zIndex: 1000 }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 16, height: 64 }}>
          <Link to="/" data-testid="nav-logo" style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: '#fff', flexShrink: 0 }}>
            Scelt<span style={{ color: 'var(--fire)' }}>a</span>
          </Link>
          <div ref={searchRef} style={{ flex: 1, maxWidth: 600, position: 'relative' }}>
            <form onSubmit={handleSearchSubmit} style={{ display: 'flex', borderRadius: 'var(--r-full)', overflow: 'hidden', background: '#fff' }}>
              <input data-testid="search-input" value={search} onChange={e => handleSearch(e.target.value)}
                placeholder="Search products, brands..."
                style={{ flex: 1, border: 'none', padding: '10px 16px', fontSize: 14, outline: 'none' }} />
              <button data-testid="search-btn" type="submit" style={{ padding: '10px 20px', background: 'var(--fire)', border: 'none', color: '#fff', fontSize: 15 }}>🔍</button>
            </form>
            {showSugg && suggestions.length > 0 && (
              <div data-testid="search-suggestions" style={{ position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', boxShadow: 'var(--shadow-xl)', zIndex: 9999 }}>
                {suggestions.map(p => (
                  <div key={p._id} onClick={() => { navigate(`/products/${p._id}`); setShowSugg(false); setSearch(''); }}
                    style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', cursor: 'pointer', borderBottom: '1px solid var(--border)' }}>
                    <img src={p.image} alt={p.name} style={{ width: 40, height: 40, objectFit: 'contain', borderRadius: 6 }} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-1)' }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{p.category}</div>
                    </div>
                    <div style={{ marginLeft: 'auto', fontSize: 12, fontWeight: 700, color: 'var(--fire)' }}>₹{p.price.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
            <button data-testid="theme-toggle" onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
              style={{ background: 'transparent', border: 'none', color: '#d1d5db', padding: '8px 10px', borderRadius: 'var(--r-md)', fontSize: 18 }}>
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <Link to="/wishlist" data-testid="nav-wishlist" style={{ position: 'relative', padding: '8px 10px', display: 'flex', alignItems: 'center', color: '#d1d5db', fontSize: 20 }}>
              🤍
              {wishlist.length > 0 && <span style={{ position: 'absolute', top: 2, right: 2, background: 'var(--fire)', color: '#fff', fontSize: 10, fontWeight: 700, borderRadius: 'var(--r-full)', minWidth: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 3px' }}>{wishlist.length}</span>}
            </Link>
            <Link to="/cart" data-testid="nav-cart" style={{ position: 'relative', padding: '8px 10px', display: 'flex', alignItems: 'center', color: '#d1d5db', fontSize: 20 }}>
              🛒
              {cartCount > 0 && <span data-testid="cart-badge" style={{ position: 'absolute', top: 2, right: 2, background: 'var(--fire)', color: '#fff', fontSize: 10, fontWeight: 700, borderRadius: 'var(--r-full)', minWidth: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 3px' }}>{cartCount}</span>}
            </Link>
            {isLoggedIn ? (
              <div style={{ position: 'relative' }}>
                <button data-testid="user-menu-btn" onClick={() => setShowUserMenu(v => !v)}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'transparent', border: 'none', cursor: 'pointer', padding: '6px 10px', borderRadius: 'var(--r-md)' }}>
                  <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,var(--fire),var(--fire-dark))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff' }}>{initials}</div>
                </button>
                {showUserMenu && (
                  <div data-testid="user-dropdown" style={{ position: 'absolute', right: 0, top: 'calc(100% + 8px)', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', boxShadow: 'var(--shadow-lg)', minWidth: 180, zIndex: 9999 }}>
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
                      <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-1)' }}>{user.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{user.email}</div>
                    </div>
                    {[['👤 My Profile', '/profile'], ['📦 My Orders', '/orders'], ['🤍 Wishlist', '/wishlist']].map(([label, path]) => (
                      <Link key={path} to={path} onClick={() => setShowUserMenu(false)}
                        style={{ display: 'block', padding: '10px 16px', fontSize: 14, color: 'var(--text-1)', borderBottom: '1px solid var(--border)' }}>
                        {label}
                      </Link>
                    ))}
                    <button data-testid="logout-btn" onClick={handleLogout}
                      style={{ width: '100%', padding: '10px 16px', fontSize: 14, color: 'var(--red)', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}>
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" data-testid="nav-login-btn"
                style={{ padding: '8px 16px', background: 'var(--fire)', color: '#fff', borderRadius: 'var(--r-full)', fontSize: 13, fontWeight: 600 }}>
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>
      <div style={{ background: 'var(--bg-nav)', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '0 20px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', gap: 4, overflowX: 'auto' }}>
          {[['All', ''], ['Electronics', 'electronics'], ['Books', 'books'], ['Clothing', 'clothing'], ['Home & Kitchen', 'home-kitchen'], ['Sports', 'sports'], ['Toys', 'toys']].map(([label, cat]) => (
            <Link key={cat} to={cat ? `/products?category=${cat}` : '/products'} data-testid={`cat-${cat || 'all'}`}
              style={{ padding: '10px 14px', fontSize: 13, color: '#9ca3af', whiteSpace: 'nowrap', display: 'block' }}>
              {label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
