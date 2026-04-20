import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getProducts, getCategories } from '../services/api';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [featured, setFeatured]     = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([getProducts({ featured: true, limit: 8 }), getCategories()])
      .then(([pRes, cRes]) => { setFeatured(pRes.data.products); setCategories(cRes.data.categories); })
      .finally(() => setLoading(false));
  }, []);

  return (
    <main data-testid="home-page">
      <section data-testid="hero-section" style={{ background: 'linear-gradient(135deg, #0d0f10 0%, #1a1c1e 50%, #0d0f10 100%)', padding: '80px 20px', textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{ display: 'inline-block', background: 'var(--fire-glow)', border: '1px solid rgba(255,87,34,0.3)', borderRadius: 'var(--r-full)', padding: '6px 16px', fontSize: 13, color: 'var(--fire)', marginBottom: 24 }}>
            🚀 Free delivery on orders above ₹499
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 6vw, 64px)', color: '#fff', lineHeight: 1.1, marginBottom: 20 }}>
            Your Choice,<br /><span style={{ color: 'var(--fire)' }}>Delivered.</span>
          </h1>
          <p style={{ fontSize: 18, color: '#9ca3af', marginBottom: 36, lineHeight: 1.7 }}>
            Discover thousands of products across Electronics, Books, Clothing, and more.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button data-testid="hero-shop-btn" onClick={() => navigate('/products')}
              style={{ padding: '14px 32px', background: 'var(--fire)', color: '#fff', border: 'none', borderRadius: 'var(--r-full)', fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>
              Shop Now
            </button>
            <button onClick={() => navigate('/products?featured=true')}
              style={{ padding: '14px 32px', background: 'transparent', color: '#fff', border: '1.5px solid rgba(255,255,255,0.2)', borderRadius: 'var(--r-full)', fontSize: 16, cursor: 'pointer' }}>
              View Deals
            </button>
          </div>
        </div>
      </section>

      <section data-testid="categories-section" style={{ padding: '60px 20px' }}>
        <div className="container">
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: 'var(--text-1)', marginBottom: 32, textAlign: 'center' }}>Shop by Category</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16 }}>
            {categories.map(cat => (
              <Link key={cat.id} to={`/products?category=${cat.id}`} data-testid={`category-card-${cat.id}`}
                style={{ background: 'var(--bg-card)', borderRadius: 'var(--r-lg)', border: '1px solid var(--border)', padding: '24px 16px', textAlign: 'center', transition: 'all 0.2s', display: 'block' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--fire)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = ''; }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>{cat.icon}</div>
                <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-1)', marginBottom: 4 }}>{cat.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{cat.productCount} products</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section data-testid="featured-section" style={{ padding: '0 20px 60px' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: 'var(--text-1)' }}>Featured Products</h2>
            <Link to="/products?featured=true" style={{ fontSize: 14, color: 'var(--fire)', fontWeight: 600 }}>View all →</Link>
          </div>
          {loading ? <div className="page-loader"><div className="spinner" /></div> : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 }}>
              {featured.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      <section style={{ background: 'linear-gradient(135deg, var(--fire) 0%, var(--fire-dark) 100%)', padding: '60px 20px', textAlign: 'center', margin: '0 20px 60px', borderRadius: 'var(--r-xl)' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 36, color: '#fff', marginBottom: 12 }}>Use code SCELTA10</h2>
        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 18, marginBottom: 28 }}>Get 10% off on your first order above ₹500</p>
        <button data-testid="banner-shop-btn" onClick={() => navigate('/products')}
          style={{ padding: '14px 32px', background: '#fff', color: 'var(--fire)', border: 'none', borderRadius: 'var(--r-full)', fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>
          Shop Now
        </button>
      </section>
    </main>
  );
}
