import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DndContext,
  closestCenter,
  DragOverlay,
  useDroppable,
  useDraggable,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';

const PRODUCTS = [
  { id: '1', name: 'Sony WH-1000XM5', category: 'Electronics', price: 24999, rating: 4.8, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200' },
  { id: '2', name: 'Apple iPad Air M2', category: 'Electronics', price: 69999, rating: 4.9, image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=200' },
  { id: '3', name: 'Atomic Habits', category: 'Books', price: 449, rating: 4.9, image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200' },
  { id: '4', name: "Levi's 511 Jeans", category: 'Clothing', price: 2499, rating: 4.5, image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=200' },
  { id: '5', name: 'Instant Pot Duo', category: 'Home', price: 7999, rating: 4.7, image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200' },
  { id: '6', name: 'Yonex Racket', category: 'Sports', price: 8999, rating: 4.7, image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=200' },
  { id: '7', name: 'LEGO Bugatti', category: 'Toys', price: 6999, rating: 4.9, image: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=200' },
  { id: '8', name: 'Bose QC Ultra', category: 'Electronics', price: 34900, rating: 4.8, image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=200' },
];

function DraggableProduct({ product, isDragging }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: product.id });
  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    opacity: isDragging ? 0.4 : 1,
    cursor: 'grab',
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}
      data-testid={`draggable-product-${product.id}`}>
      <ProductCard product={product} />
    </div>
  );
}

function ProductCard({ product, compact }) {
  return (
    <div style={{ background: 'var(--bg-card)', border: '1.5px solid var(--border)', borderRadius: 'var(--r-md)', padding: compact ? 8 : 12, display: 'flex', gap: 10, alignItems: 'center', userSelect: 'none' }}>
      <img src={product.image} alt={product.name} style={{ width: compact ? 36 : 48, height: compact ? 36 : 48, objectFit: 'contain', borderRadius: 6, background: 'var(--bg-card-2)', padding: 4, flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: compact ? 12 : 13, fontWeight: 600, color: 'var(--text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.name}</div>
        <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{product.category}</div>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fire)' }}>₹{product.price.toLocaleString()}</div>
      </div>
      <div style={{ fontSize: 11, background: 'var(--teal)', color: '#fff', padding: '2px 6px', borderRadius: 4, flexShrink: 0 }}>⭐ {product.rating}</div>
    </div>
  );
}

function DroppableZone({ id, label, icon, color, items, onRemove }) {
  const { isOver, setNodeRef } = useDroppable({ id });

  return (
    <div ref={setNodeRef} data-testid={`drop-zone-${id}`}
      style={{ background: isOver ? `${color}22` : 'var(--bg-card)', border: `2px dashed ${isOver ? color : 'var(--border)'}`, borderRadius: 'var(--r-lg)', padding: 16, minHeight: 200, transition: 'all 0.2s', flex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <span style={{ fontSize: 20 }}>{icon}</span>
        <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-1)' }}>{label}</span>
        <span style={{ marginLeft: 'auto', background: color + '33', color, fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 999 }}>{items.length}</span>
      </div>

      {isOver && items.length === 0 && (
        <div style={{ textAlign: 'center', padding: '20px 0', color, fontSize: 13, fontWeight: 600 }}>
          Drop here!
        </div>
      )}

      {items.length === 0 && !isOver && (
        <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-3)', fontSize: 13 }}>
          Drag products here
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {items.map(product => (
          <div key={product.id} data-testid={`dropped-item-${id}-${product.id}`}
            style={{ position: 'relative' }}>
            <ProductCard product={product} compact />
            <button onClick={() => onRemove(id, product.id)}
              style={{ position: 'absolute', top: 4, right: 4, background: 'var(--red-pale)', border: 'none', borderRadius: '50%', width: 20, height: 20, cursor: 'pointer', color: 'var(--red)', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}>
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DragDrop() {
  const [available, setAvailable] = useState(PRODUCTS);
  const [zones, setZones] = useState({ wishlist: [], compare: [], cart: [] });
  const [activeId, setActiveId] = useState(null);
  const [dragCount, setDragCount] = useState(0);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const activeProduct = PRODUCTS.find(p => p.id === activeId);

  const ZONE_CONFIG = [
    { id: 'wishlist', label: 'Wishlist', icon: '❤️', color: '#EF4444' },
    { id: 'compare', label: 'Compare', icon: '⚖️', color: '#8B5CF6' },
    { id: 'cart',    label: 'Cart',     icon: '🛒', color: '#FF5722' },
  ];

  const handleDragStart = (event) => setActiveId(event.active.id);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const zoneId = over.id;
    if (!zones[zoneId]) return;

    const product = PRODUCTS.find(p => p.id === active.id);
    if (!product) return;

    if (zones[zoneId].find(p => p.id === product.id)) return;

    setZones(prev => ({ ...prev, [zoneId]: [...prev[zoneId], product] }));
    setAvailable(prev => prev.filter(p => p.id !== product.id));
    setDragCount(c => c + 1);
  };

  const handleRemove = (zoneId, productId) => {
    const product = PRODUCTS.find(p => p.id === productId);
    setZones(prev => ({ ...prev, [zoneId]: prev[zoneId].filter(p => p.id !== productId) }));
    setAvailable(prev => [...prev, product]);
  };

  const resetAll = () => {
    setAvailable(PRODUCTS);
    setZones({ wishlist: [], compare: [], cart: [] });
    setDragCount(0);
  };

  const totalDropped = Object.values(zones).reduce((s, arr) => s + arr.length, 0);

  return (
    <main data-testid="drag-drop-page" style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, color: 'var(--text-1)', marginBottom: 8 }}>Drag & Drop</h1>
          <p style={{ color: 'var(--text-3)' }}>Drag products into Wishlist, Compare or Cart zones</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {totalDropped > 0 && (
            <div style={{ fontSize: 13, color: 'var(--text-3)' }}>
              {dragCount} drops · {totalDropped} products placed
            </div>
          )}
          <button data-testid="reset-drag-btn" onClick={resetAll}
            style={{ padding: '8px 16px', background: 'transparent', border: '1.5px solid var(--border)', borderRadius: 'var(--r-full)', color: 'var(--text-1)', fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>
            Reset All
          </button>
        </div>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

          {/* Left — draggable products */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-1)' }}>
                Products ({available.length})
              </h2>
              <span style={{ fontSize: 12, color: 'var(--text-3)' }}>Drag to add →</span>
            </div>

            {available.length === 0 ? (
              <div data-testid="all-products-placed"
                style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--bg-card)', borderRadius: 'var(--r-lg)', border: '1px solid var(--border)', color: 'var(--text-3)' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🎉</div>
                <div style={{ fontWeight: 600, color: 'var(--text-1)', marginBottom: 4 }}>All products placed!</div>
                <div style={{ fontSize: 13 }}>Click Reset All to start over</div>
              </div>
            ) : (
              <div data-testid="draggable-products-list"
                style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {available.map(product => (
                  <DraggableProduct key={product.id} product={product} isDragging={activeId === product.id} />
                ))}
              </div>
            )}
          </div>

          {/* Right — drop zones */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-1)', marginBottom: 0 }}>Drop Zones</h2>
            {ZONE_CONFIG.map(zone => (
              <DroppableZone
                key={zone.id}
                id={zone.id}
                label={zone.label}
                icon={zone.icon}
                color={zone.color}
                items={zones[zone.id]}
                onRemove={handleRemove}
              />
            ))}
          </div>
        </div>

        {/* Drag overlay */}
        <DragOverlay>
          {activeProduct && (
            <div style={{ transform: 'rotate(3deg)', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', borderRadius: 'var(--r-md)', opacity: 0.95 }}>
              <ProductCard product={activeProduct} />
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {/* Instructions */}
      <div style={{ marginTop: 32, padding: 20, background: 'var(--bg-card)', borderRadius: 'var(--r-lg)', border: '1px solid var(--border)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        {[
          { step: '1', text: 'Click and hold any product card on the left' },
          { step: '2', text: 'Drag it over a zone (Wishlist, Compare, or Cart)' },
          { step: '3', text: 'Release to drop the product into that zone' },
          { step: '4', text: 'Click × to remove a product from a zone' },
        ].map(item => (
          <div key={item.step} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--fire)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{item.step}</div>
            <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.5, margin: 0 }}>{item.text}</p>
          </div>
        ))}
      </div>

      {/* Selenium tip */}
      <div style={{ marginTop: 16, padding: 14, background: 'var(--bg-card-2)', borderRadius: 'var(--r-md)', fontSize: 13, color: 'var(--text-2)', border: '1px solid var(--border)' }}>
        <strong style={{ color: 'var(--text-1)' }}>Selenium tip:</strong> Use{' '}
        <code style={{ background: 'var(--bg-card)', padding: '2px 8px', borderRadius: 4, fontSize: 12, color: 'var(--fire)' }}>
          Actions actions = new Actions(driver); actions.dragAndDrop(source, target).perform();
        </code>
      </div>
    </main>
  );
}
