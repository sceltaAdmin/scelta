import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PRODUCTS_LIST = [
  { id: '1', name: 'Sony WH-1000XM5 Headphones', category: 'Electronics', price: 24999 },
  { id: '2', name: 'Apple iPad Air M2', category: 'Electronics', price: 69999 },
  { id: '3', name: 'Samsung 55" 4K QLED TV', category: 'Electronics', price: 54999 },
  { id: '4', name: 'Atomic Habits', category: 'Books', price: 449 },
  { id: '5', name: 'The Psychology of Money', category: 'Books', price: 399 },
  { id: '6', name: "Levi's 511 Slim Fit Jeans", category: 'Clothing', price: 2499 },
  { id: '7', name: 'Nike Dri-FIT Running T-Shirt', category: 'Clothing', price: 1295 },
  { id: '8', name: 'Instant Pot Duo 7-in-1', category: 'Home & Kitchen', price: 7999 },
  { id: '9', name: 'Philips Air Fryer 4.1L', category: 'Home & Kitchen', price: 9999 },
  { id: '10', name: 'Yonex Astrox 88S Racket', category: 'Sports', price: 8999 },
  { id: '11', name: 'Adidas Ultraboost 22', category: 'Sports', price: 12999 },
  { id: '12', name: 'LEGO Technic Bugatti', category: 'Toys', price: 6999 },
];

const CATEGORIES = ['All', 'Electronics', 'Books', 'Clothing', 'Home & Kitchen', 'Sports', 'Toys'];

export default function MultiSelect() {
  const [selected, setSelected]       = useState([]);
  const [filterCat, setFilterCat]     = useState('All');
  const [searchTerm, setSearchTerm]   = useState('');
  const [sortBy, setSortBy]           = useState('name');
  const [submitted, setSubmitted]     = useState(false);
  const navigate = useNavigate();

  const filtered = PRODUCTS_LIST
    .filter(p => filterCat === 'All' || p.category === filterCat)
    .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => sortBy === 'price' ? a.price - b.price : a.name.localeCompare(b.name));

  const toggle = (id) => setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  const selectAll = () => setSelected(filtered.map(p => p.id));
  const clearAll  = () => setSelected([]);
  const isAllSelected = filtered.length > 0 && filtered.every(p => selected.includes(p.id));

  const selectedProducts = PRODUCTS_LIST.filter(p => selected.includes(p.id));
  const totalPrice = selectedProducts.reduce((s, p) => s + p.price, 0);

  const handleCompare = () => {
    if (selected.length < 2) { alert('Please select at least 2 products to compare'); return; }
    if (selected.length > 4) { alert('You can compare a maximum of 4 products'); return; }
    setSubmitted(true);
  };

  return (
    <main data-testid="multi-select-page" style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, color: 'var(--text-1)', marginBottom: 8 }}>Product Comparison</h1>
      <p style={{ color: 'var(--text-3)', marginBottom: 40 }}>Select multiple products to compare — multi-select checkbox interactions</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, alignItems: 'start' }}>
        {/* Left — product list */}
        <div>
          {/* Controls */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20, alignItems: 'center' }}>
            <input data-testid="multi-select-search" type="text" placeholder="Search products..." value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ padding: '9px 14px', borderRadius: 'var(--r-full)', border: '1.5px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-1)', fontSize: 14, width: 200 }} />

            <select data-testid="multi-select-category" value={filterCat} onChange={e => setFilterCat(e.target.value)}
              style={{ padding: '9px 14px', borderRadius: 'var(--r-full)', border: '1.5px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-1)', fontSize: 14 }}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <select data-testid="multi-select-sort" value={sortBy} onChange={e => setSortBy(e.target.value)}
              style={{ padding: '9px 14px', borderRadius: 'var(--r-full)', border: '1.5px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-1)', fontSize: 14 }}>
              <option value="name">Sort by Name</option>
              <option value="price">Sort by Price</option>
            </select>
          </div>

          {/* Select All row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', background: 'var(--bg-card-2)', borderRadius: 'var(--r-md)', marginBottom: 12, border: '1px solid var(--border)' }}>
            <input type="checkbox" data-testid="select-all-checkbox"
              checked={isAllSelected} onChange={isAllSelected ? clearAll : selectAll}
              style={{ accentColor: 'var(--fire)', width: 16, height: 16, cursor: 'pointer' }} />
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-1)', flex: 1 }}>Select All ({filtered.length} products)</span>
            {selected.length > 0 && (
              <button onClick={clearAll} data-testid="clear-selection-btn"
                style={{ fontSize: 12, color: 'var(--fire)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                Clear ({selected.length})
              </button>
            )}
          </div>

          {/* Product list with checkboxes */}
          <div data-testid="multi-select-list" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {filtered.map(product => {
              const isSelected = selected.includes(product.id);
              return (
                <label key={product.id}
                  data-testid={'multi-select-item-' + product.id}
                  style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', background: isSelected ? 'var(--fire-pale)' : 'var(--bg-card)', border: '1.5px solid', borderColor: isSelected ? 'var(--fire)' : 'var(--border)', borderRadius: 'var(--r-md)', cursor: 'pointer', transition: 'all 0.15s' }}>
                  <input type="checkbox"
                    data-testid={'checkbox-' + product.id}
                    checked={isSelected}
                    onChange={() => toggle(product.id)}
                    style={{ accentColor: 'var(--fire)', width: 16, height: 16, cursor: 'pointer', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: isSelected ? 600 : 400, color: 'var(--text-1)' }}>{product.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>{product.category}</div>
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: isSelected ? 'var(--fire)' : 'var(--text-1)', flexShrink: 0 }}>
                    Rs.{product.price.toLocaleString()}
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Right — selected summary */}
        <div style={{ position: 'sticky', top: 80 }}>
          <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--r-lg)', border: '1px solid var(--border)', padding: 24 }}>
            <h3 style={{ fontWeight: 700, fontSize: 16, color: 'var(--text-1)', marginBottom: 16 }}>
              Selected Products ({selected.length})
            </h3>

            {selected.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-3)' }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>☑</div>
                <p style={{ fontSize: 13 }}>Select products to compare</p>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                  {selectedProducts.map(p => (
                    <div key={p.id} data-testid={'selected-item-' + p.id}
                      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'var(--bg-card-2)', borderRadius: 'var(--r-sm)', fontSize: 13 }}>
                      <span style={{ color: 'var(--text-1)', flex: 1, marginRight: 8 }}>{p.name}</span>
                      <button onClick={() => toggle(p.id)}
                        style={{ background: 'none', border: 'none', color: 'var(--red)', cursor: 'pointer', fontSize: 16, lineHeight: 1 }}>×</button>
                    </div>
                  ))}
                </div>
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12, marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 700, color: 'var(--text-1)' }}>
                    <span>Total Value</span>
                    <span>Rs.{totalPrice.toLocaleString()}</span>
                  </div>
                </div>
              </>
            )}

            <button data-testid="compare-btn" onClick={handleCompare}
              disabled={selected.length < 2}
              style={{ width: '100%', padding: '12px', background: selected.length >= 2 ? 'var(--fire)' : 'var(--border)', color: '#fff', border: 'none', borderRadius: 'var(--r-full)', fontWeight: 700, cursor: selected.length >= 2 ? 'pointer' : 'not-allowed', fontSize: 14, marginBottom: 8 }}>
              Compare Selected ({selected.length}/4)
            </button>
            <p style={{ fontSize: 11, color: 'var(--text-3)', textAlign: 'center' }}>Select 2-4 products to compare</p>
          </div>

          {/* Comparison result */}
          {submitted && selectedProducts.length >= 2 && (
            <div data-testid="comparison-result"
              style={{ marginTop: 16, background: 'var(--bg-card)', borderRadius: 'var(--r-lg)', border: '1px solid var(--border)', padding: 20, overflowX: 'auto' }}>
              <h4 style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-1)', marginBottom: 14 }}>Comparison Table</h4>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead>
                  <tr>
                    <th style={{ padding: '8px', textAlign: 'left', color: 'var(--text-3)', fontWeight: 600, borderBottom: '1px solid var(--border)' }}>Field</th>
                    {selectedProducts.map(p => (
                      <th key={p.id} style={{ padding: '8px', textAlign: 'left', color: 'var(--text-1)', fontWeight: 600, borderBottom: '1px solid var(--border)' }}>{p.name.split(' ').slice(0, 2).join(' ')}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { field: 'Category', key: 'category' },
                    { field: 'Price', key: 'price', format: v => 'Rs.' + v.toLocaleString() },
                  ].map(row => (
                    <tr key={row.field}>
                      <td style={{ padding: '8px', color: 'var(--text-3)', fontWeight: 600, borderBottom: '1px solid var(--border)' }}>{row.field}</td>
                      {selectedProducts.map(p => (
                        <td key={p.id} style={{ padding: '8px', color: 'var(--text-1)', borderBottom: '1px solid var(--border)' }}>
                          {row.format ? row.format(p[row.key]) : p[row.key]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <button onClick={() => setSubmitted(false)}
                style={{ marginTop: 12, width: '100%', padding: '8px', background: 'transparent', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', color: 'var(--text-2)', cursor: 'pointer', fontSize: 12 }}>
                Close Comparison
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
