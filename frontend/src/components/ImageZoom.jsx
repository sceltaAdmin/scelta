import { useState, useRef } from 'react';

export default function ImageZoom({ src, alt }) {
  const [zoomed, setZoomed] = useState(false);
  const [pos, setPos]       = useState({ x: 50, y: 50 });
  const containerRef        = useRef();

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPos({ x, y });
  };

  return (
    <div
      data-testid="image-zoom-container"
      ref={containerRef}
      onMouseEnter={() => setZoomed(true)}
      onMouseLeave={() => setZoomed(false)}
      onMouseMove={handleMouseMove}
      style={{ position: 'relative', overflow: 'hidden', cursor: zoomed ? 'crosshair' : 'zoom-in', borderRadius: 'var(--r-xl)', background: 'var(--bg-card-2)', minHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

      <img
        data-testid="zoomable-image"
        src={src}
        alt={alt}
        style={{
          maxHeight: 360,
          maxWidth: '100%',
          objectFit: 'contain',
          padding: 24,
          transition: 'transform 0.1s ease',
          transform: zoomed ? 'scale(2.2)' : 'scale(1)',
          transformOrigin: `${pos.x}% ${pos.y}%`,
          pointerEvents: 'none',
        }}
      />

      {/* Zoom hint */}
      {!zoomed && (
        <div style={{ position: 'absolute', bottom: 12, right: 12, background: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: 11, padding: '4px 10px', borderRadius: 999, pointerEvents: 'none' }}>
          🔍 Hover to zoom
        </div>
      )}

      {/* Crosshair indicator */}
      {zoomed && (
        <div data-testid="zoom-crosshair"
          style={{ position: 'absolute', top: `${pos.y}%`, left: `${pos.x}%`, transform: 'translate(-50%, -50%)', width: 40, height: 40, border: '1.5px solid rgba(255,255,255,0.6)', borderRadius: '50%', pointerEvents: 'none' }} />
      )}
    </div>
  );
}
