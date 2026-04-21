import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getProducts, getCategories } from '../services/api';
import ProductCard from '../components/ProductCard';
import HeroCarousel from '../components/HeroCarousel';

const shimmerStyle = `@keyframes shimmer { 0% { transform: translateX(-100%) } 100% { transform: translateX(100%) } }`;

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
    <main data-testid="home-page"><style>{shimmerStyle}</style>

      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Feature strip */}
      <div style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          {[
            { icon: '🚀', label: 'Free Delivery', sub: 'On orders above ₹499' },
            { icon: '↩️', label: 'Easy Returns', sub: '30-day hassle-free returns' },
            { icon: '🔒', label: 'Secure Payments', sub: 'SSL encrypted checkout' },
            { icon: '🎧', label: '24/7 Support', sub: 'Always here to help' },
          ].map((f, i, arr) => (
            <div key={f.label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', borderRight: i < arr.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <span style={{ fontSize: 28 }}>{f.icon}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-1)' }}>{f.label}</div>
                <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{f.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <section data-testid="categories-section" style={{ padding: '60px 20px' }}>
        <div className="container">
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: 'var(--text-1)', marginBottom: 32, textAlign: 'center' }}>Shop by Category</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16 }}>
            {categories.map(cat => (
              <Link key={cat.id} to={`/products?category=${cat.id}`} data-testid={`category-card-${cat.id}`}
                style={{ background: 'var(--bg-card)', borderRadius: 'var(--r-lg)', border: '1px solid var(--border)', padding: '24px 16px', textAlign: 'center', transition: 'all 0.2s', display: 'block' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--fire)'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>{cat.icon}</div>
                <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-1)', marginBottom: 4 }}>{cat.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{cat.productCount} products</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section data-testid="featured-section" style={{ padding: '0 20px 60px' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: 'var(--text-1)' }}>Featured Products</h2>
            <Link to="/products?featured=true" style={{ fontSize: 14, color: 'var(--fire)', fontWeight: 600 }}>View all →</Link>
          </div>
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 480 ? '1fr 1fr' : 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 }}>
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} style={{ background: 'var(--bg-card)', borderRadius: 'var(--r-lg)', border: '1px solid var(--border)', overflow: 'hidden' }}>
                  <div style={{ aspectRatio: '1', background: 'var(--bg-card-2)', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)', animation: 'shimmer 1.5s infinite' }} />
                  </div>
                  <div style={{ padding: 16 }}>
                    {[90, 70, 50].map((w, j) => (
                      <div key={j} style={{ height: 10, width: w + '%', background: 'var(--bg-card-2)', borderRadius: 4, marginBottom: 10, overflow: 'hidden', position: 'relative' }}>
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)', animation: 'shimmer 1.5s infinite' }} />
                      </div>
                    ))}
                    <div style={{ height: 34, background: 'var(--bg-card-2)', borderRadius: 999, overflow: 'hidden', position: 'relative' }}>
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)', animation: 'shimmer 1.5s infinite' }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 }}>
              {featured.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* Promo Banner */}
      <section style={{ padding: '0 20px 60px' }}>
        <div className="container">
          <div style={{ background: 'linear-gradient(135deg, var(--fire) 0%, var(--fire-dark) 100%)', padding: '60px 40px', textAlign: 'center', borderRadius: 'var(--r-xl)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-40%', left: '-10%', width: 300, height: 300, background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)', borderRadius: '50%' }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', marginBottom: 8 }}>EXCLUSIVE OFFER</div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 4vw, 40px)', color: '#fff', marginBottom: 12 }}>Use code SCELTA10</h2>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 18, marginBottom: 28 }}>Get 10% off on your first order above ₹500</p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <button data-testid="banner-shop-btn" onClick={() => navigate('/products')}
                  style={{ padding: '14px 32px', background: '#fff', color: 'var(--fire)', border: 'none', borderRadius: 999, fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>
                  Shop Now
                </button>
                <div style={{ padding: '14px 20px', background: 'rgba(255,255,255,0.15)', color: '#fff', borderRadius: 999, fontSize: 14, fontWeight: 700, fontFamily: 'monospace', border: '1.5px dashed rgba(255,255,255,0.5)' }}>
                  SCELTA10
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
