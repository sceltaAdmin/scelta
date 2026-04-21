import { useState } from 'react';

const FRAMES = [
  {
    id: 'map',
    label: 'Store Locator Map',
    title: 'Store Locator Map',
    src: 'https://www.openstreetmap.org/export/embed.html?bbox=77.5946,12.9716,77.6046,12.9816&layer=mapnik&marker=12.9716,77.5946',
    tip: 'switchTo().frame("map-frame")',
  },
  {
    id: 'wiki',
    label: 'About E-Commerce',
    title: 'E-Commerce Wikipedia',
    src: 'https://en.m.wikipedia.org/wiki/E-commerce',
    tip: 'switchTo().frame("wiki-frame")',
  },
  {
    id: 'api',
    label: 'API Health Check',
    title: 'Scelta API Docs',
    src: 'https://scelta-backend.onrender.com/health',
    tip: 'switchTo().frame("api-frame")',
  },
];

export default function FrameDemo() {
  const [activeFrame, setActiveFrame] = useState('map');
  const [loaded, setLoaded] = useState({});

  const frame = FRAMES.find(f => f.id === activeFrame);

  return (
    <main data-testid="frame-demo-page" style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, color: 'var(--text-1)', marginBottom: 8 }}>Nested Frames</h1>
      <p style={{ color: 'var(--text-3)', marginBottom: 40 }}>iframe interactions for Selenium frame switching practice</p>

      {/* Frame selector */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {FRAMES.map(f => (
          <button key={f.id}
            data-testid={'frame-btn-' + f.id}
            onClick={() => { setActiveFrame(f.id); setLoaded(l => ({ ...l, [f.id]: false })); }}
            style={{ padding: '9px 20px', borderRadius: 'var(--r-full)', border: '1.5px solid', borderColor: activeFrame === f.id ? 'var(--fire)' : 'var(--border)', background: activeFrame === f.id ? 'var(--fire)' : 'var(--bg-card)', color: activeFrame === f.id ? '#fff' : 'var(--text-1)', fontWeight: 600, fontSize: 14, cursor: 'pointer', transition: 'all 0.2s' }}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Outer frame container */}
      <div data-testid="outer-frame-container"
        style={{ background: 'var(--bg-card)', borderRadius: 'var(--r-lg)', border: '1px solid var(--border)', overflow: 'hidden' }}>

        {/* Browser chrome bar */}
        <div style={{ padding: '12px 20px', background: 'var(--bg-card-2)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ display: 'flex', gap: 6 }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#EF4444' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#F59E0B' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#10B981' }} />
          </div>
          <div style={{ flex: 1, background: 'var(--bg-card)', borderRadius: 6, padding: '4px 12px', fontSize: 12, color: 'var(--text-3)', marginLeft: 8 }}>
            {frame?.src}
          </div>
        </div>

        {/* Outer frame body */}
        <div data-testid="outer-frame" style={{ padding: 20 }}>
          <div style={{ marginBottom: 16, fontSize: 14, color: 'var(--text-2)' }}>
            <strong style={{ color: 'var(--text-1)' }}>Outer Frame</strong> — This container represents the outer frame context.
          </div>

          {/* Inner nested frame with dashed border */}
          <div data-testid="inner-frame-wrapper"
            style={{ border: '2px dashed var(--fire)', borderRadius: 'var(--r-md)', padding: 12, background: 'var(--fire-pale)', position: 'relative' }}>
            <div style={{ fontSize: 12, color: 'var(--fire)', fontWeight: 700, marginBottom: 10 }}>
              Nested Inner Frame — data-testid="{activeFrame}-frame"
            </div>

            {/* Loading indicator */}
            {!loaded[activeFrame] && (
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1, pointerEvents: 'none', marginTop: 20 }}>
                <div className="spinner" />
              </div>
            )}

            <iframe
              key={activeFrame}
              data-testid={activeFrame + '-frame'}
              id="inner-frame"
              name="inner-frame"
              title={frame?.title}
              src={frame?.src}
              onLoad={() => setLoaded(l => ({ ...l, [activeFrame]: true }))}
              style={{ width: '100%', height: 400, border: 'none', borderRadius: 'var(--r-sm)', display: 'block', background: '#fff' }}
              loading="lazy"
              sandbox="allow-scripts allow-same-origin allow-popups"
            />
          </div>

          {/* Selenium tip */}
          <div style={{ marginTop: 16, padding: 14, background: 'var(--bg-card-2)', borderRadius: 'var(--r-md)', fontSize: 13, color: 'var(--text-2)' }}>
            <strong style={{ color: 'var(--text-1)' }}>Selenium tip:</strong>{' '}
            Switch into frame:{' '}
            <code style={{ background: 'var(--bg-card)', padding: '2px 8px', borderRadius: 4, fontSize: 12, color: 'var(--fire)' }}>
              driver.switchTo().frame("{activeFrame}-frame")
            </code>
            {' '}· Switch back:{' '}
            <code style={{ background: 'var(--bg-card)', padding: '2px 8px', borderRadius: 4, fontSize: 12, color: 'var(--fire)' }}>
              driver.switchTo().defaultContent()
            </code>
          </div>
        </div>
      </div>

      {/* Multiple nested frames demo */}
      <div style={{ marginTop: 40 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-1)', marginBottom: 16 }}>Multiple Nested Frames</h2>
        <div data-testid="multi-frame-container"
          style={{ background: 'var(--bg-card)', borderRadius: 'var(--r-lg)', border: '1px solid var(--border)', padding: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {FRAMES.slice(0, 2).map(f => (
              <div key={f.id} style={{ border: '2px dashed var(--border)', borderRadius: 'var(--r-md)', padding: 10 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-3)', marginBottom: 8 }}>
                  data-testid="{f.id}-frame-small"
                </div>
                <iframe
                  data-testid={f.id + '-frame-small'}
                  title={f.title}
                  src={f.src}
                  style={{ width: '100%', height: 200, border: 'none', borderRadius: 4, background: '#fff' }}
                  loading="lazy"
                  sandbox="allow-scripts allow-same-origin allow-popups"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
