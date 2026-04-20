import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts } from '../services/api';
import ProductCard from '../components/ProductCard';

const CATEGORIES = [
  { id: '', label: 'All Categories' },
  { id: 'electronics', label: 'Electronics' },
  { id: 'books', label: 'Books' },
  { id: 'clothing', label: 'Clothing' },
  { id: 'home-kitchen', label: 'Home & Kitchen' },
  { id: 'sports', label: 'Sports' },
  { id: 'toys', label: 'Toys' },
];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts]         = useState([]);
  const [allProducts, setAllProducts]   = useState([]);
  const [allBrands, setAllBrands]       = useState([]);
  const [total, setTotal]               = useState(0);
  const [pages, setPages]               = useState(1);
  const [loading, setLoading]           = useState(true);

  const [minPrice, setMinPrice]         = useState('');
  const [maxPrice, setMaxPrice]         = useState('');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [minRating, setMinRating]       = useState(0);
  const [accordion, setAccordion]       = useState({ price: true, brand: true, rating: true });

  const category = searchParams.get('category') || '';
  const search   = searchParams.get('search') || '';
  const sort     = searchParams.get('sort') || 'newest';
  const page     = Number(searchParams.get('page')) || 1;
  const featured = searchParams.get('featured') || '';

  // Fetch all brands once on mount
  useEffect(() => {
    getProducts({ limit: 100 }).then(res => {
      const brands = [...new Set(res.data.products.map(p => p.brand).filter(Boolean))].sort();
      setAllBrands(brands);
      setAllProducts(res.data.products);
    });
  }, []);

  // Fetch filtered products from API
  useEffect(() => {
    setLoading(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    getProducts({
      category, search, sort, page, limit: 12,
      ...(featured ? { featured } : {}),
      ...(minPrice ? { minPrice } : {}),
      ...(maxPrice ? { maxPrice } : {}),
    })
      .then(res => {
        setProducts(res.data.products);
        setTotal(res.data.total);
        setPages(res.data.pages);
      })
      .finally(() => setLoading(false));
  }, [category, search, sort, page, featured, minPrice, maxPrice]);

  const setParam = (key, val) => {
    const p = new URLSearchParams(searchParams);
    if (val) p.set(key, val); else p.delete(key);
    if (key !== 'page') p.delete('page');
    setSearchParams(p);
  };

  const goToPage = (p) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(p));
    setSearchParams(params);
  };

  const resetFilters = () => {
    setMinPrice(''); setMaxPrice('');
    setSelectedBrands([]); setMinRating(0);
    setSearchParams({});
  };

  const toggleBrand = (brand) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const toggleAccordion = (key) => setAccordion(a => ({ ...a, [key]: !a[key] }));

  // Apply brand + rating filters on frontend
  const filteredProducts = products
    .filter(p => selectedBrands.length === 0 || selectedBrands.includes(p.brand))
    .filter(p => minRating === 0 || p.rating >= minRating);

  const hasActiveFilters = category || search || featured || minPrice || maxPrice || selectedBrands.length > 0 || minRating > 0;

  return (
    <main data-testid="products-page" style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 20px' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: 'var(--text-1)', marginBottom: 4 }}>
          {category ? CATEGORIES.find(c => c.id === category)?.label : search ? `Results for "${search}"` : 'All Products'}
        </h1>
        <p style={{ color: 'var(--text-3)' }}>{filteredProducts.length} products found</p>
      </div>

      {/* Sort bar */}
      <div data-testid="filters-bar" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24, alignItems: 'center' }}>
        <select data-testid="sort-filter" value={sort} onChange={e => setParam('sort', e.target.value)}
          style={{ padding: '8px 14px', borderRadius: 'var(--r-full)', border: '1.5px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-1)', fontSize: 14 }}>
          <option value="newest">Newest First</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating">Top Rated</option>
          <option value="popular">Most Popular</option>
        </select>
        <select data-testid="category-filter" value={category} onChange={e => setParam('category', e.target.value)}
          style={{ padding: '8px 14px', borderRadius: 'var(--r-full)', border: '1.5px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-1)', fontSize: 14 }}>
          {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
        {hasActiveFilters && (
          <button data-testid="clear-filters" onClick={resetFilters}
            style={{ padding: '8px 14px', borderRadius: 'var(--r-full)', border: '1.5px solid var(--fire)', color: 'var(--fire)', background: 'transparent', fontSize: 14, cursor: 'pointer' }}>
            ✕ Reset All
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 24, alignItems: 'start' }}>

        {/* ===== FILTER SIDEBAR ===== */}
        <div data-testid="filter-sidebar"
          style={{ background: 'var(--bg-card)', borderRadius: 'var(--r-lg)', border: '1px solid var(--border)', padding: 20, position: 'sticky', top: 80 }}>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <span style={{ fontWeight: 700, fontSize: 16, color: 'var(--text-1)' }}>Filters</span>
            <button data-testid="reset-filters-btn" onClick={resetFilters}
              style={{ fontSize: 12, color: 'var(--fire)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
              Reset All
            </button>
          </div>

          {/* Price Range */}
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16, marginBottom: 4 }}>
            <button data-testid="filter-price-toggle" onClick={() => toggleAccordion('price')}
              style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', paddingBottom: 12 }}>
              <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-1)' }}>💰 Price Range</span>
              <span style={{ fontSize: 12, color: 'var(--text-3)' }}>{accordion.price ? '▲' : '▼'}</span>
            </button>
            {accordion.price && (
              <div data-testid="filter-price-panel">
                <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                  <input data-testid="price-min-input" type="number" placeholder="Min ₹" value={minPrice}
                    onChange={e => setMinPrice(e.target.value)} min="0"
                    style={{ width: '50%', padding: '7px 10px', borderRadius: 'var(--r-sm)', border: '1.5px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-1)', fontSize: 13 }} />
                  <input data-testid="price-max-input" type="number" placeholder="Max ₹" value={maxPrice}
                    onChange={e => setMaxPrice(e.target.value)} min="0"
                    style={{ width: '50%', padding: '7px 10px', borderRadius: 'var(--r-sm)', border: '1.5px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-1)', fontSize: 13 }} />
                </div>
                <input type="range" min="0" max="200000" step="1000"
                  value={maxPrice || 200000}
                  onChange={e => setMaxPrice(String(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--fire)', marginBottom: 6 }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-3)' }}>
                  <span>₹0</span><span>₹2,00,000</span>
                </div>
              </div>
            )}
          </div>

          {/* Brand */}
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16, marginBottom: 4 }}>
            <button data-testid="filter-brand-toggle" onClick={() => toggleAccordion('brand')}
              style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', paddingBottom: 12 }}>
              <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-1)' }}>🏷️ Brand</span>
              <span style={{ fontSize: 12, color: 'var(--text-3)' }}>{accordion.brand ? '▲' : '▼'}</span>
            </button>
            {accordion.brand && (
              <div data-testid="filter-brand-panel"
                style={{ maxHeight: 200, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {allBrands.map(brand => (
                  <label key={brand}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: 'var(--text-1)' }}>
                    <input type="checkbox"
                      data-testid={`brand-checkbox-${brand.replace(/[\s']/g, '-').toLowerCase()}`}
                      checked={selectedBrands.includes(brand)}
                      onChange={() => toggleBrand(brand)}
                      style={{ accentColor: 'var(--fire)', width: 14, height: 14 }} />
                    {brand}
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Min Rating */}
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
            <button data-testid="filter-rating-toggle" onClick={() => toggleAccordion('rating')}
              style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', paddingBottom: 12 }}>
              <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-1)' }}>⭐ Min Rating</span>
              <span style={{ fontSize: 12, color: 'var(--text-3)' }}>{accordion.rating ? '▲' : '▼'}</span>
            </button>
            {accordion.rating && (
              <div data-testid="filter-rating-panel" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[4, 3, 2, 1].map(r => (
                  <label key={r} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: 'var(--text-1)' }}>
                    <input type="radio" name="minRating"
                      data-testid={`rating-radio-${r}`}
                      checked={minRating === r}
                      onChange={() => setMinRating(r)}
                      style={{ accentColor: 'var(--fire)', width: 14, height: 14 }} />
                    <span style={{ color: 'var(--star)' }}>{'★'.repeat(r)}{'☆'.repeat(5 - r)}</span>
                    <span style={{ color: 'var(--text-3)', fontSize: 12 }}>&amp; up</span>
                  </label>
                ))}
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: 'var(--text-1)' }}>
                  <input type="radio" name="minRating"
                    data-testid="rating-radio-all"
                    checked={minRating === 0}
                    onChange={() => setMinRating(0)}
                    style={{ accentColor: 'var(--fire)', width: 14, height: 14 }} />
                  All Ratings
                </label>
              </div>
            )}
          </div>
        </div>

        {/* ===== PRODUCT GRID ===== */}
        <div>
          {loading ? (
            <div className="page-loader"><div className="spinner" /></div>
          ) : filteredProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-3)' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
              <h3 style={{ fontSize: 20, marginBottom: 8, color: 'var(--text-1)' }}>No products found</h3>
              <p style={{ marginBottom: 20 }}>Try adjusting your filters</p>
              <button onClick={resetFilters}
                style={{ padding: '10px 24px', background: 'var(--fire)', color: '#fff', border: 'none', borderRadius: 'var(--r-full)', fontWeight: 600, cursor: 'pointer' }}>
                Clear Filters
              </button>
            </div>
          ) : (
            <div data-testid="products-grid"
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 20, marginBottom: 40 }}>
              {filteredProducts.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          )}

          {/* Pagination */}
          {pages > 1 && (
            <div data-testid="pagination" style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 20, flexWrap: 'wrap' }}>
              <button onClick={() => goToPage(page - 1)} disabled={page === 1}
                style={{ padding: '8px 14px', borderRadius: 'var(--r-sm)', border: '1.5px solid var(--border)', background: 'var(--bg-card)', color: page === 1 ? 'var(--text-3)' : 'var(--text-1)', cursor: page === 1 ? 'not-allowed' : 'pointer', fontWeight: 600 }}>
                ←
              </button>
              {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => goToPage(p)}
                  style={{ width: 40, height: 40, borderRadius: 'var(--r-sm)', border: '1.5px solid', borderColor: p === page ? 'var(--fire)' : 'var(--border)', background: p === page ? 'var(--fire)' : 'var(--bg-card)', color: p === page ? '#fff' : 'var(--text-1)', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>
                  {p}
                </button>
              ))}
              <button onClick={() => goToPage(page + 1)} disabled={page === pages}
                style={{ padding: '8px 14px', borderRadius: 'var(--r-sm)', border: '1.5px solid var(--border)', background: 'var(--bg-card)', color: page === pages ? 'var(--text-3)' : 'var(--text-1)', cursor: page === pages ? 'not-allowed' : 'pointer', fontWeight: 600 }}>
                →
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
