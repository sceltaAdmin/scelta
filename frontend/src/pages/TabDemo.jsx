import { useState } from 'react';
import { Link } from 'react-router-dom';

const TABS = [
  {
    id: 'electronics',
    label: 'Electronics',
    icon: '📱',
    content: 'Explore our premium electronics collection featuring Apple, Sony, Samsung and more. From MacBooks to noise-cancelling headphones.',
    color: '#3B82F6',
    link: '/products?category=electronics'
  },
  {
    id: 'books',
    label: 'Books',
    icon: '📚',
    content: 'Discover bestselling books on finance, self-help, history and more. Curated titles from top authors worldwide.',
    color: '#10B981',
    link: '/products?category=books'
  },
  {
    id: 'clothing',
    label: 'Clothing',
    icon: '👕',
    content: 'Premium fashion from Levi\'s, Nike, Uniqlo, Canada Goose and more. From casual wear to luxury cashmere.',
    color: '#8B5CF6',
    link: '/products?category=clothing'
  },
  {
    id: 'sports',
    label: 'Sports',
    icon: '⚽',
    content: 'Pro-grade sports equipment from Yonex, Adidas, Garmin and more. Gear up for peak performance.',
    color: '#F59E0B',
    link: '/products?category=sports'
  },
  {
    id: 'home',
    label: 'Home & Kitchen',
    icon: '🏠',
    content: 'Premium home appliances from Dyson, Nespresso, Le Creuset and Vitamix. Elevate your living space.',
    color: '#EF4444',
    link: '/products?category=home-kitchen'
  },
  {
    id: 'toys',
    label: 'Toys',
    icon: '🧸',
    content: 'Top-tier toys and games from LEGO, Nintendo, Razer and more. Fun for all ages.',
    color: '#EC4899',
    link: '/products?category=toys'
  },
];

const NESTED_TABS = [
  { id: 'featured', label: 'Featured', content: 'Our hand-picked featured products offer the best value and quality across all categories.' },
  { id: 'new', label: 'New Arrivals', content: 'Fresh additions to our catalogue — the latest products from top brands, added weekly.' },
  { id: 'deals', label: 'Best Deals', content: 'Maximum savings with our best discount offers. Use coupons SCELTA10 or SCELTA20 for extra off.' },
];

export default function TabDemo() {
  const [activeTab, setActiveTab] = useState('electronics');
  const [activeNestedTab, setActiveNestedTab] = useState('featured');
  const [activeVerticalTab, setActiveVerticalTab] = useState('electronics');

  const active = TABS.find(t => t.id === activeTab);

  return (
    <main data-testid="tab-demo-page" style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, color: 'var(--text-1)', marginBottom: 8 }}>Tab Interactions</h1>
      <p style={{ color: 'var(--text-3)', marginBottom: 48 }}>Multiple tab patterns for automation testing practice</p>

      {/* Section 1 — Horizontal tabs */}
      <section style={{ marginBottom: 60 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-1)', marginBottom: 20 }}>1. Horizontal Tabs</h2>
        <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--r-lg)', border: '1px solid var(--border)', overflow: 'hidden' }}>
          <div data-testid="horizontal-tabs" style={{ display: 'flex', borderBottom: '1px solid var(--border)', overflowX: 'auto' }}>
            {TABS.map(tab => (
              <button key={tab.id}
                data-testid={'tab-' + tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{ padding: '14px 20px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: activeTab === tab.id ? 700 : 400, color: activeTab === tab.id ? tab.color : 'var(--text-3)', borderBottom: '2px solid', borderBottomColor: activeTab === tab.id ? tab.color : 'transparent', whiteSpace: 'nowrap', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>{tab.icon}</span>{tab.label}
              </button>
            ))}
          </div>
          <div data-testid={'tab-content-' + activeTab} style={{ padding: 28 }}>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-1)', marginBottom: 12 }}>{active?.icon} {active?.label}</h3>
            <p style={{ color: 'var(--text-2)', lineHeight: 1.7, marginBottom: 20 }}>{active?.content}</p>
            <Link to={active?.link || '/products'}
              data-testid={'tab-shop-link-' + activeTab}
              target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-block', padding: '10px 24px', background: active?.color, color: '#fff', borderRadius: 'var(--r-full)', fontSize: 14, fontWeight: 600 }}>
              Shop {active?.label} in New Tab
            </Link>
          </div>
        </div>
      </section>

      {/* Section 2 — Nested tabs */}
      <section style={{ marginBottom: 60 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-1)', marginBottom: 20 }}>2. Nested Tabs</h2>
        <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--r-lg)', border: '1px solid var(--border)', overflow: 'hidden' }}>
          <div data-testid="outer-tabs" style={{ display: 'flex', borderBottom: '1px solid var(--border)', background: 'var(--bg-card-2)' }}>
            {TABS.slice(0, 3).map(tab => (
              <button key={tab.id}
                data-testid={'outer-tab-' + tab.id}
                onClick={() => setActiveVerticalTab(tab.id)}
                style={{ padding: '12px 20px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: activeVerticalTab === tab.id ? 700 : 400, color: activeVerticalTab === tab.id ? 'var(--fire)' : 'var(--text-3)', borderBottom: '2px solid', borderBottomColor: activeVerticalTab === tab.id ? 'var(--fire)' : 'transparent' }}>
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
          <div style={{ padding: 24 }}>
            {/* Inner nested tabs */}
            <div data-testid="inner-tabs" style={{ display: 'flex', gap: 4, marginBottom: 16, background: 'var(--bg-card-2)', borderRadius: 'var(--r-md)', padding: 4 }}>
              {NESTED_TABS.map(t => (
                <button key={t.id}
                  data-testid={'inner-tab-' + t.id}
                  onClick={() => setActiveNestedTab(t.id)}
                  style={{ flex: 1, padding: '8px 12px', borderRadius: 'var(--r-sm)', background: activeNestedTab === t.id ? 'var(--bg-card)' : 'transparent', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: activeNestedTab === t.id ? 600 : 400, color: activeNestedTab === t.id ? 'var(--text-1)' : 'var(--text-3)', boxShadow: activeNestedTab === t.id ? 'var(--shadow-xs)' : 'none', transition: 'all 0.2s' }}>
                  {t.label}
                </button>
              ))}
            </div>
            <div data-testid={'inner-tab-content-' + activeNestedTab} style={{ padding: 16, background: 'var(--bg-card-2)', borderRadius: 'var(--r-md)', fontSize: 14, color: 'var(--text-2)', lineHeight: 1.7 }}>
              <strong style={{ color: 'var(--text-1)' }}>{TABS.find(t => t.id === activeVerticalTab)?.label} - {NESTED_TABS.find(t => t.id === activeNestedTab)?.label}:</strong>
              <br />{NESTED_TABS.find(t => t.id === activeNestedTab)?.content}
            </div>
          </div>
        </div>
      </section>

      {/* Section 3 — Vertical tabs */}
      <section style={{ marginBottom: 60 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-1)', marginBottom: 20 }}>3. Vertical Tabs</h2>
        <div data-testid="vertical-tabs" style={{ display: 'grid', gridTemplateColumns: '180px 1fr', background: 'var(--bg-card)', borderRadius: 'var(--r-lg)', border: '1px solid var(--border)', overflow: 'hidden' }}>
          <div style={{ borderRight: '1px solid var(--border)', background: 'var(--bg-card-2)' }}>
            {TABS.map(tab => (
              <button key={tab.id}
                data-testid={'vertical-tab-' + tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{ width: '100%', padding: '14px 16px', background: activeTab === tab.id ? 'var(--bg-card)' : 'none', border: 'none', borderLeft: '3px solid', borderLeftColor: activeTab === tab.id ? 'var(--fire)' : 'transparent', cursor: 'pointer', fontSize: 13, fontWeight: activeTab === tab.id ? 600 : 400, color: activeTab === tab.id ? 'var(--text-1)' : 'var(--text-3)', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 8 }}>
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
          <div data-testid={'vertical-tab-content-' + activeTab} style={{ padding: 28 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-1)', marginBottom: 12 }}>{active?.icon} {active?.label}</h3>
            <p style={{ color: 'var(--text-2)', lineHeight: 1.7 }}>{active?.content}</p>
          </div>
        </div>
      </section>

      {/* Section 4 — Open in new browser tab */}
      <section>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-1)', marginBottom: 20 }}>4. Open in New Browser Tab</h2>
        <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--r-lg)', border: '1px solid var(--border)', padding: 28 }}>
          <p style={{ color: 'var(--text-2)', marginBottom: 20, lineHeight: 1.7 }}>These links open in a new browser tab — useful for Selenium window handle switching tests.</p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {[
              { label: 'Products Page', url: '/products', testid: 'new-tab-products' },
              { label: 'Help & FAQ', url: '/help', testid: 'new-tab-help' },
              { label: 'Size Guide', url: '/size-guide', testid: 'new-tab-size-guide' },
              { label: 'Scelta Backend API', url: 'https://scelta-backend.onrender.com/health', testid: 'new-tab-api' },
            ].map(item => (
              <a key={item.testid}
                href={item.url}
                data-testid={item.testid}
                target="_blank"
                rel="noopener noreferrer"
                style={{ padding: '10px 20px', background: 'var(--fire)', color: '#fff', borderRadius: 'var(--r-full)', fontSize: 14, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                {item.label} ↗
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
