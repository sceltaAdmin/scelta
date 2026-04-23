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

function SkeletonCard() {
  return (
    <div data-testid="skeleton-card"
      style={{ background: 'var(--bg-card)', borderRadius: 'var(--r-lg)', border: '1px solid var(--border)', overflow: 'hidden' }}>
      <div style={{ aspectRatio: '1', background: 'var(--bg-card-2)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)', animation: 'shimmer 1.5s infinite' }} />
      </div>
      <div style={{ padding: '14px 16px' }}>
        {[80, 100, 60].map((w, i) => (
          <div key={i} style={{ height: i === 1 ? 14 : 10, width: w + '%', background: 'var(--bg-card-2)', borderRadius: 4, marginBottom: 10, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)', animation: 'shimmer 1.5s infinite' }} />
          </div>
        ))}
        <div style={{ height: 36, background: 'var(--bg-card-2)', borderRadius: 999, marginTop: 8, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)', animation: 'shimmer 1.5s infinite' }} />
        </div>
      </div>
      <style>{`@keyframes shimmer{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}} @keyframes fadeInUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts]     = useState([]);
  const [allBrands, setAllBrands]   = useState([]);
  const [total, setTotal]           = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading]       = useState(true);
  const [minPrice, setMinPrice]     = useState('');
  const [maxPrice, setMaxPrice]     = useState('');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [accordion, setAccordion]   = useState({ price: true, brand: true });
  const [showFilters, setShowFilters] = useState(false);
  const [isMobile, setIsMobile]     = useState(window.innerWidth < 768);

  const category = searchParams.get('category') || '';
  const search   = searchParams.get('search')   || '';
  const sort     = searchParams.get('sort')     || 'newest';
  const featured = searchParams.get('featured') || '';
  const page     = parseInt(searchParams.get('page') || '1');

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setLoading(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    getProducts({
      category, search, sort, page, limit: 12,
      ...(featured   ? { featured }   : {}),
      ...(minPrice   ? { minPrice }   : {}),
      ...(maxPrice   ? { maxPrice }   : {}),
    }).then(res => {
      setProducts(res.data.products || []);
      setTotal(res.data.total || 0);
      setTotalPages(res.data.pages || 1);
      if (page === 1) {
        const brands = [...new Set((res.data.products || []).map(p => p.brand).filter(Boolean))].sort();
        setAllBrands(brands);
      }
    }).catch(err => {
      console.error('Fetch error:', err);
    }).finally(() => {
      setLoading(false);
    });
  }, [category, search, sort, featured, minPrice, maxPrice, page]);

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

  const toggleBrand     = (b) => setSelectedBrands(prev => prev.includes(b) ? prev.filter(x => x !== b) : [...prev, b]);
  const toggleAccordion = (k) => setAccordion(a => ({ ...a, [k]: !a[k] }));

  const filteredProducts = products
    .filter(p => selectedBrands.length === 0 || selectedBrands.includes(p.brand))
;

  const hasActiveFilters = category || search || featured || minPrice || maxPrice || selectedBrands.length > 0 || minRating > 0;

  // Pagination page numbers
  const getPageNumbers = () => {
    const pages = [];
    const delta = 2;
    for (let i = Math.max(1, page - delta); i <= Math.min(totalPages, page + delta); i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <main data-testid="products-page" style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 20px' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: 'var(--text-1)', marginBottom: 4 }}>
          {category ? CATEGORIES.find(c => c.id === category)?.label : search ? `Results for "${search}"` : 'All Products'}
        </h1>
        <p style={{ color: 'var(--text-3)' }}>{total} products found</p>
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

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '240px 1fr', gap: 24, alignItems: 'start' }}>

        {/* Filter Sidebar */}
        <div>
          {isMobile && (
            <button onClick={() => setShowFilters(f => !f)} data-testid="mobile-filter-toggle"
              style={{ padding: '10px 20px', background: 'var(--bg-card)', border: '1.5px solid var(--border)', borderRadius: 'var(--r-full)', fontSize: 14, fontWeight: 600, color: 'var(--text-1)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, width: '100%', justifyContent: 'center' }}>
              Filters {showFilters ? '▲' : '▼'}
            </button>
          )}
          {(!isMobile || showFilters) && (
            <div data-testid="filter-sidebar"
              style={{ background: 'var(--bg-card)', borderRadius: 'var(--r-lg)', border: '1px solid var(--border)', padding: 20, position: isMobile ? 'static' : 'sticky', top: 80 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <span style={{ fontWeight: 700, fontSize: 16, color: 'var(--text-1)' }}>Filters</span>
                <button data-testid="reset-filters-btn" onClick={resetFilters}
                  style={{ fontSize: 12, color: 'var(--fire)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Reset All</button>
              </div>

              {/* Price */}
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16, marginBottom: 4 }}>
                <button data-testid="filter-price-toggle" onClick={() => toggleAccordion('price')}
                  style={{ width: '100%', display: 'flex', justifyContent: 'space-between', background: 'none', border: 'none', cursor: 'pointer', paddingBottom: 12, color: 'var(--text-1)' }}>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>💰 Price Range</span>
                  <span style={{ fontSize: 12, color: 'var(--text-3)' }}>{accordion.price ? '▲' : '▼'}</span>
                </button>
                {accordion.price && (
                  <div data-testid="filter-price-panel">
                    <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                      <input data-testid="price-min-input" type="number" placeholder="Min ₹" value={minPrice}
                        onChange={e => setMinPrice(e.target.value)}
                        style={{ width: '50%', padding: '7px 10px', borderRadius: 'var(--r-sm)', border: '1.5px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-1)', fontSize: 13 }} />
                      <input data-testid="price-max-input" type="number" placeholder="Max ₹" value={maxPrice}
                        onChange={e => setMaxPrice(e.target.value)}
                        style={{ width: '50%', padding: '7px 10px', borderRadius: 'var(--r-sm)', border: '1.5px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-1)', fontSize: 13 }} />
                    </div>
                    <input type="range" min="0" max="200000" step="1000" value={maxPrice || 200000}
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
                  style={{ width: '100%', display: 'flex', justifyContent: 'space-between', background: 'none', border: 'none', cursor: 'pointer', paddingBottom: 12, color: 'var(--text-1)' }}>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>🏷️ Brand</span>
                  <span style={{ fontSize: 12, color: 'var(--text-3)' }}>{accordion.brand ? '▲' : '▼'}</span>
                </button>
                {accordion.brand && (
                  <div data-testid="filter-brand-panel" style={{ maxHeight: 180, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {allBrands.map(brand => (
                      <label key={brand} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: 'var(--text-1)' }}>
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

        {/* Product Grid */}
        <div>
          {loading ? (
            <div data-testid="skeleton-grid"
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 20 }}>
              {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-3)' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
              <h3 style={{ fontSize: 20, marginBottom: 8, color: 'var(--text-1)' }}>No products found</h3>
              <button onClick={resetFilters}
                style={{ marginTop: 12, padding: '10px 24px', background: 'var(--fire)', color: '#fff', border: 'none', borderRadius: 'var(--r-full)', fontWeight: 600, cursor: 'pointer' }}>
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div data-testid="products-grid"
                style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(200px, 1fr))', gap: isMobile ? 10 : 20, marginBottom: 32 }}>
                {filteredProducts.map((p, index) => (
                  <div key={p._id} data-testid={`product-item-${p._id}`}
                    style={{ animation: 'fadeInUp 0.4s ease both', animationDelay: `${index * 50}ms` }}>
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div data-testid="pagination"
                  style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginTop: 16 }}>

                  {/* Prev */}
                  <button data-testid="pagination-prev" onClick={() => goToPage(page - 1)} disabled={page === 1}
                    style={{ padding: '8px 16px', borderRadius: 'var(--r-sm)', border: '1.5px solid var(--border)', background: 'var(--bg-card)', color: page === 1 ? 'var(--text-3)' : 'var(--text-1)', cursor: page === 1 ? 'not-allowed' : 'pointer', fontWeight: 600, fontSize: 14 }}>
                    ← Prev
                  </button>

                  {/* First page */}
                  {getPageNumbers()[0] > 1 && (
                    <>
                      <button onClick={() => goToPage(1)}
                        style={{ width: 40, height: 40, borderRadius: 'var(--r-sm)', border: '1.5px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-1)', cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>
                        1
                      </button>
                      {getPageNumbers()[0] > 2 && <span style={{ color: 'var(--text-3)' }}>...</span>}
                    </>
                  )}

                  {/* Page numbers */}
                  {getPageNumbers().map(p => (
                    <button key={p} data-testid={`pagination-page-${p}`} onClick={() => goToPage(p)}
                      style={{ width: 40, height: 40, borderRadius: 'var(--r-sm)', border: '1.5px solid', borderColor: p === page ? 'var(--fire)' : 'var(--border)', background: p === page ? 'var(--fire)' : 'var(--bg-card)', color: p === page ? '#fff' : 'var(--text-1)', cursor: 'pointer', fontWeight: 700, fontSize: 14 }}>
                      {p}
                    </button>
                  ))}

                  {/* Last page */}
                  {getPageNumbers()[getPageNumbers().length - 1] < totalPages && (
                    <>
                      {getPageNumbers()[getPageNumbers().length - 1] < totalPages - 1 && <span style={{ color: 'var(--text-3)' }}>...</span>}
                      <button onClick={() => goToPage(totalPages)}
                        style={{ width: 40, height: 40, borderRadius: 'var(--r-sm)', border: '1.5px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-1)', cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>
                        {totalPages}
                      </button>
                    </>
                  )}

                  {/* Next */}
                  <button data-testid="pagination-next" onClick={() => goToPage(page + 1)} disabled={page === totalPages}
                    style={{ padding: '8px 16px', borderRadius: 'var(--r-sm)', border: '1.5px solid var(--border)', background: 'var(--bg-card)', color: page === totalPages ? 'var(--text-3)' : 'var(--text-1)', cursor: page === totalPages ? 'not-allowed' : 'pointer', fontWeight: 600, fontSize: 14 }}>
                    Next →
                  </button>

                  {/* Page info */}
                  <span style={{ fontSize: 13, color: 'var(--text-3)', marginLeft: 8 }}>
                    Page {page} of {totalPages} · {total} products
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}
