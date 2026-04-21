import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SLIDES = [
  {
    title: 'Electronics Sale',
    sub: 'Up to 40% off on top brands. Shop the latest gadgets.',
    bg: 'linear-gradient(135deg, #0d0f10 0%, #1a1c1e 40%, #202326 100%)',
    cta: 'Shop Electronics',
    cat: 'electronics',
    emoji: '💻',
    accent: '#FF5722'
  },
  {
    title: 'Books Bonanza',
    sub: 'Expand your skills with curated titles from top authors.',
    bg: 'linear-gradient(135deg, #0a1e0a 0%, #1a3d1a 40%, #143d2d 100%)',
    cta: 'Browse Books',
    cat: 'books',
    emoji: '📚',
    accent: '#00897B'
  },
  {
    title: 'Sports & Fitness',
    sub: 'Gear up for peak performance with pro-grade equipment.',
    bg: 'linear-gradient(135deg, #1e0a1e 0%, #3d1a2d 40%, #2d1a3d 100%)',
    cta: 'Shop Sports',
    cat: 'sports',
    emoji: '🏃',
    accent: '#F59E0B'
  },
  {
    title: 'Premium Clothing',
    sub: 'Luxury fashion from world-class brands. Style delivered.',
    bg: 'linear-gradient(135deg, #0a0a1e 0%, #1a1a3d 40%, #0d0d2d 100%)',
    cta: 'Shop Clothing',
    cat: 'clothing',
    emoji: '👗',
    accent: '#8B5CF6'
  },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => goTo((current + 1) % SLIDES.length), 4500);
    return () => clearInterval(timer);
  }, [current]);

  const goTo = (idx) => {
    if (animating) return;
    setAnimating(true);
    setCurrent(idx);
    setTimeout(() => setAnimating(false), 600);
  };

  const prev = () => goTo((current - 1 + SLIDES.length) % SLIDES.length);
  const next = () => goTo((current + 1) % SLIDES.length);

  const slide = SLIDES[current];

  return (
    <div data-testid="hero-carousel" style={{ position: 'relative', overflow: 'hidden', background: slide.bg, transition: 'background 0.6s ease', minHeight: window.innerWidth < 768 ? 260 : 420 }}>
      {/* Slides */}
      {SLIDES.map((s, i) => (
        <div key={i} data-testid={`hero-slide-${i}`}
          style={{
            position: i === 0 ? 'relative' : 'absolute',
            top: 0, left: 0, right: 0,
            opacity: i === current ? 1 : 0,
            pointerEvents: i === current ? 'auto' : 'none',
            transition: 'opacity 0.6s ease',
            background: s.bg,
            minHeight: window.innerWidth < 768 ? 260 : 420,
            display: 'flex',
            alignItems: 'center',
          }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', padding: window.innerWidth < 768 ? '24px 16px' : '60px 20px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: window.innerWidth < 768 ? 12 : 40 }}>
            {/* Content */}
            <div style={{ flex: 1, maxWidth: 600 }}>
              <div style={{ display: 'inline-block', background: 'rgba(255,87,34,0.15)', border: '1px solid rgba(255,87,34,0.3)', borderRadius: 999, padding: '6px 16px', fontSize: 12, color: 'var(--fire)', marginBottom: 20, fontWeight: 600 }}>
                🔥 Limited Time Offer
              </div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 5vw, 58px)', color: '#fff', lineHeight: 1.1, marginBottom: 16 }}>
                {s.title}
              </h1>
              <p style={{ fontSize: window.innerWidth < 768 ? 13 : 18, color: 'rgba(255,255,255,0.7)', marginBottom: window.innerWidth < 768 ? 16 : 32, lineHeight: 1.7 }}>
                {s.sub}
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <button
                  data-testid={`hero-cta-${i}`}
                  onClick={() => navigate(`/products?category=${s.cat}`)}
                  style={{ padding: window.innerWidth < 768 ? '10px 20px' : '14px 32px', background: 'var(--fire)', color: '#fff', border: 'none', borderRadius: 999, fontSize: window.innerWidth < 768 ? 13 : 15, fontWeight: 700, cursor: 'pointer', transition: 'transform 0.2s' }}
                  onMouseEnter={e => e.target.style.transform = 'translateY(-2px)'}
                  onMouseLeave={e => e.target.style.transform = ''}>
                  {s.cta} →
                </button>
                <button
                  onClick={() => navigate('/products')}
                  style={{ padding: window.innerWidth < 768 ? '10px 16px' : '14px 28px', background: 'transparent', color: '#fff', border: '1.5px solid rgba(255,255,255,0.25)', borderRadius: 999, fontSize: window.innerWidth < 768 ? 13 : 15, fontWeight: 600, cursor: 'pointer' }}>
                  View All Deals
                </button>
              </div>
            </div>

            {/* Visual */}
            <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{
                width: window.innerWidth < 768 ? 100 : 200, height: window.innerWidth < 768 ? 100 : 200,
                borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
                background: `radial-gradient(circle, ${s.accent}33 0%, ${s.accent}11 60%, transparent 100%)`,
                border: `2px solid ${s.accent}44`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: window.innerWidth < 768 ? 48 : 80,
                animation: 'float 3s ease-in-out infinite',
                boxShadow: `0 0 60px ${s.accent}22`
              }}>
                {s.emoji}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Prev / Next buttons */}
      <button data-testid="hero-prev" onClick={prev}
        style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', width: 44, height: 44, borderRadius: '50%', fontSize: 20, cursor: 'pointer', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, transition: 'background 0.2s' }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}>
        ‹
      </button>
      <button data-testid="hero-next" onClick={next}
        style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', width: 44, height: 44, borderRadius: '50%', fontSize: 20, cursor: 'pointer', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, transition: 'background 0.2s' }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}>
        ›
      </button>

      {/* Dots */}
      <div style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8, zIndex: 10 }}>
        {SLIDES.map((_, i) => (
          <button key={i} data-testid={`hero-dot-${i}`} onClick={() => goTo(i)}
            style={{ width: i === current ? 24 : 8, height: 8, borderRadius: 4, background: i === current ? 'var(--fire)' : 'rgba(255,255,255,0.4)', border: 'none', cursor: 'pointer', transition: 'all 0.3s', padding: 0 }} />
        ))}
      </div>

      {/* Float animation */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
      `}</style>
    </div>
  );
}
