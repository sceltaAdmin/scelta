import { useState } from 'react';

export default function FrameDemo() {
  const [activeFrame, setActiveFrame] = useState('map');

  return (
    <main data-testid="frame-demo-page" style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, color: 'var(--text-1)', marginBottom: 8 }}>Nested Frames</h1>
      <p style={{ color: 'var(--text-3)', marginBottom: 40 }}>iframe interactions for Selenium frame switching practice</p>

      {/* Frame selector */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {[
          { id: 'map', label: 'Store Locator Map' },
          { id: 'video', label: 'Product Video' },
          { id: 'docs', label: 'API Documentation' },
        ].map(f => (
          <button key={f.id}
            data-testid={'frame-btn-' + f.id}
            onClick={() => setActiveFrame(f.id)}
            style={{ padding: '9px 20px', borderRadius: 'var(--r-full)', border: '1.5px solid', borderColor: activeFrame === f.id ? 'var(--fire)' : 'var(--border)', background: activeFrame === f.id ? 'var(--fire)' : 'var(--bg-card)', color: activeFrame === f.id ? '#fff' : 'var(--text-1)', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Outer frame container */}
      <div data-testid="outer-frame-container"
        style={{ background: 'var(--bg-card)', borderRadius: 'var(--r-lg)', border: '1px solid var(--border)', overflow: 'hidden' }}>

        {/* Outer frame header */}
        <div style={{ padding: '12px 20px', background: 'var(--bg-card-2)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ display: 'flex', gap: 6 }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#EF4444' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#F59E0B' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#10B981' }} />
          </div>
          <span style={{ fontSize: 13, color: 'var(--text-3)', marginLeft: 8 }}>
            {activeFrame === 'map' ? 'Scelta Store Locator' : activeFrame === 'video' ? 'Product Showcase Video' : 'Scelta API Docs'}
          </span>
        </div>

        {/* Outer frame body with nested inner frame */}
        <div data-testid="outer-frame" style={{ padding: 20 }}>
          <div style={{ marginBottom: 16, fontSize: 14, color: 'var(--text-2)' }}>
            <strong style={{ color: 'var(--text-1)' }}>Outer Frame</strong> — This container represents the outer frame context.
          </div>

          {/* Inner nested frame */}
          <div data-testid="inner-frame-wrapper"
            style={{ border: '2px dashed var(--fire)', borderRadius: 'var(--r-md)', padding: 12, background: 'var(--fire-pale)' }}>
            <div style={{ fontSize: 12, color: 'var(--fire)', fontWeight: 600, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
              Nested Inner Frame (data-testid="inner-frame")
            </div>

            {activeFrame === 'map' && (
              <iframe
                data-testid="inner-frame"
                title="Store Locator Map"
                src="https://www.openstreetmap.org/export/embed.html?bbox=77.5,12.9,77.7,13.1&layer=mapnik"
                style={{ width: '100%', height: 350, border: 'none', borderRadius: 'var(--r-sm)' }}
                loading="lazy"
              />
            )}

            {activeFrame === 'video' && (
              <iframe
                data-testid="inner-frame"
                title="Product Video"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                style={{ width: '100%', height: 350, border: 'none', borderRadius: 'var(--r-sm)' }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
              />
            )}

            {activeFrame === 'docs' && (
              <iframe
                data-testid="inner-frame"
                title="API Documentation"
                src="https://scelta-backend.onrender.com/health"
                style={{ width: '100%', height: 350, border: 'none', borderRadius: 'var(--r-sm)', background: '#1a1c1e' }}
                loading="lazy"
              />
            )}
          </div>

          <div style={{ marginTop: 16, padding: 14, background: 'var(--bg-card-2)', borderRadius: 'var(--r-md)', fontSize: 13, color: 'var(--text-2)' }}>
            <strong style={{ color: 'var(--text-1)' }}>Selenium tip:</strong> Use <code style={{ background: 'var(--bg-card)', padding: '2px 6px', borderRadius: 4, fontSize: 12 }}>driver.switchTo().frame("inner-frame")</code> to switch into this iframe, and <code style={{ background: 'var(--bg-card)', padding: '2px 6px', borderRadius: 4, fontSize: 12 }}>driver.switchTo().defaultContent()</code> to switch back.
          </div>
        </div>
      </div>
    </main>
  );
}
