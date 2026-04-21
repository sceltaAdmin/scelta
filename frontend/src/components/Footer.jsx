import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer data-testid="footer" style={{ background: 'var(--bg-footer)', color: '#9ca3af', marginTop: 80 }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 20px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40, marginBottom: 40 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: '#fff', marginBottom: 12 }}>
              Scelt<span style={{ color: 'var(--fire)' }}>a</span>
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.7 }}>Your Choice, Delivered. India's premium e-commerce destination.</p>
          </div>
          <div>
            <div style={{ color: '#fff', fontWeight: 600, marginBottom: 16 }}>Shop</div>
            {[['Electronics', '/products?category=electronics'], ['Books', '/products?category=books'], ['Clothing', '/products?category=clothing'], ['Sports', '/products?category=sports'], ['Size Guide', '/size-guide']].map(([l, h]) => (
              <Link key={l} to={h} style={{ display: 'block', fontSize: 13, marginBottom: 8, color: '#9ca3af' }}>{l}</Link>
            ))}
          </div>
          <div>
            <div style={{ color: '#fff', fontWeight: 600, marginBottom: 16 }}>Account</div>
            {[['My Profile', '/profile'], ['My Orders', '/orders'], ['Wishlist', '/wishlist'], ['Cart', '/cart'], ['Checkout', '/checkout']].map(([l, h]) => (
              <Link key={l} to={h} style={{ display: 'block', fontSize: 13, marginBottom: 8, color: '#9ca3af' }}>{l}</Link>
            ))}
          </div>
          <div>
            <div style={{ color: '#fff', fontWeight: 600, marginBottom: 16 }}>Testing Pages</div>
            {[['Help & FAQ', '/help'], ['Tab Interactions', '/tabs'], ['Nested Frames', '/frames'], ['Multi Select', '/multi-select'], ['Size Guide Table', '/size-guide']].map(([l, h]) => (
              <Link key={l} to={h} style={{ display: 'block', fontSize: 13, marginBottom: 8, color: '#9ca3af' }}>{l}</Link>
            ))}
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 24, textAlign: 'center', fontSize: 13 }}>
          2026 Scelta - Your Choice, Delivered.
        </div>
      </div>
    </footer>
  );
}
