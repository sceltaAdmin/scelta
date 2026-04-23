import { useState, useEffect, useRef, useCallback } from 'react';
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
      <style>{`@keyframes shimmer { 0% { transform: translateX(-100%) } 100% { transform: translateX(100%) } } @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [allBrands, setAllBrands] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [minRating, setMinRating] = useState(0);
  const [accordion, setAccordion] = useState({ price: true, brand: true, rating: true });
  const [showFilters, setShowFilters] = useState(false);
  const isMobile = window.innerWidth < 768;
  const observerRef = useRef();
  const loadMoreRef = useRef();

  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || 'newest';
  const featured = searchParams.get('featured') || '';

  useEffect(() => {
    setProducts([]);
    setPage(1);
    setHasMore(true);
    setLoading(true);
    fetchProducts(1, true, category, search, sort, featured, minPrice, maxPrice);
  }, [category, search, sort, featured, minPrice, maxPrice]);

  const fetchProducts = async (pageNum, reset = false, cat, srch, srt, feat, mn, mx) => {
    try {
      const res = await getProducts({
        category: cat, search: srch, sort: srt, page: pageNum, limit: 12,
        ...(feat ? { featured: feat } : {}),
        ...(mn ? { minPrice: mn } : {}),
        ...(mx ? { maxPrice: mx } : {}),
      });
      const newProducts = res.data.products;
      const totalCount = res.data.total;
      const totalPages = res.data.pages;

      setTotal(totalCount);
      setProducts(prev => reset ? newProducts : [...prev, ...newProducts]);
      setHasMore(pageNum < totalPages);

      // Build brands list from first load
      if (pageNum === 1) {
        const brands = [...new Set(newProducts.map(p => p.brand).filter(Boolean))].sort();
        setAllBrands(brands);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Infinite scroll observer
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
          setLoadingMore(true);
          const nextPage = page + 1;
          setPage(nextPage);
          fetchProducts(nextPage, false, category, search, sort, featured, minPrice, maxPrice);
        }
      },
      { threshold: 0.1 }
    );
    if (loadMoreRef.current) observerRef.current.observe(loadMoreRef.current);
    return () => observerRef.current?.disconnect();
  }, [hasMore, loadingMore, loading, page]);

  const setParam = (key, val) => {
    const p = new URLSearchParams(searchParams);
    if (val) p.set(key, val); else p.delete(key);
    setSearchParams(p);
  };

  const resetFilters = () => {
    setMinPrice(''); setMaxPrice('');
    setSelectedBrands([]); setMinRating(0);
    setSearchParams({});
  };

  const toggleBrand = (brand) => setSelectedBrands(prev => prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]);
  const toggleAccordion = (key) => setAccordion(a => ({ ...a, [key]: !a[key] }));

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

      {/* Mobile filter toggle */}
      <div style={{ display: 'none' }} className="mobile-filter-btn">
        <button onClick={() => setShowFilters(f => !f)}
          data-testid="mobile-filter-toggle"
          style={{ padding: '10px 20px', background: 'var(--bg-card)', border: '1.5px solid var(--border)', borderRadius: 'var(--r-full)', fontSize: 14, fontWeight: 600, color: 'var(--text-1)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          ⚙ {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '240px 1fr', gap: 24, alignItems: 'start' }}>
        {/* Filter Sidebar */}
        {isMobile && (
          <button onClick={() => setShowFilters(f => !f)}
            data-testid="mobile-filter-toggle"
            style={{ padding: '10px 20px', background: 'var(--bg-card)', border: '1.5px solid var(--border)', borderRadius: 'var(--r-full)', fontSize: 14, fontWeight: 600, color: 'var(--text-1)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, width: '100%', justifyContent: 'center' }}>
            Filters {showFilters ? '▲' : '▼'}
          </button>
        )}
        {(!isMobile || showFilters) && <div data-testid="filter-sidebar"
          style={{ background: 'var(--bg-card)', borderRadius: 'var(--r-lg)', border: '1px solid var(--border)', padding: 20, position: 'sticky', top: 80 }}>
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

          {/* Rating */}
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
            <button data-testid="filter-rating-toggle" onClick={() => toggleAccordion('rating')}
              style={{ width: '100%', display: 'flex', justifyContent: 'space-between', background: 'none', border: 'none', cursor: 'pointer', paddingBottom: 12, color: 'var(--text-1)' }}>
              <span style={{ fontWeight: 600, fontSize: 14 }}>⭐ Min Rating</span>
              <span style={{ fontSize: 12, color: 'var(--text-3)' }}>{accordion.rating ? '▲' : '▼'}</span>
            </button>
            {accordion.rating && (
              <div data-testid="filter-rating-panel" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[4, 3, 2, 1].map(r => (
                  <label key={r} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: 'var(--text-1)' }}>
                    <input type="radio" name="minRating" data-testid={`rating-radio-${r}`}
                      checked={minRating === r} onChange={() => setMinRating(r)}
                      style={{ accentColor: 'var(--fire)', width: 14, height: 14 }} />
                    <span style={{ color: 'var(--star)' }}>{'★'.repeat(r)}{'☆'.repeat(5 - r)}</span>
                    <span style={{ color: 'var(--text-3)', fontSize: 12 }}>&amp; up</span>
                  </label>
                ))}
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: 'var(--text-1)' }}>
                  <input type="radio" name="minRating" data-testid="rating-radio-all"
                    checked={minRating === 0} onChange={() => setMinRating(0)}
                    style={{ accentColor: 'var(--fire)', width: 14, height: 14 }} />
                  All Ratings
                </label>
              </div>
            )}
          </div>
        </div>}

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
                style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(200px, 1fr))', gap: isMobile ? 10 : 20, marginBottom: 24 }}>
                {filteredProducts.map((p, index) => (
                  <div key={p._id}
                    data-testid={`product-item-${p._id}`}
                    style={{
                      animation: `fadeInUp 0.35s ease both`,
                      animationDelay: `${(index % 12) * 30}ms`,
                    }}>
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>

              {/* Infinite scroll trigger */}
              <div ref={loadMoreRef} data-testid="infinite-scroll-trigger" style={{ height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {loadingMore && (
                  <div data-testid="loading-more-indicator" style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-3)', fontSize: 14 }}>
                    <div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />
                    Loading more products...
                  </div>
                )}
                {!hasMore && filteredProducts.length > 0 && (
                  <div data-testid="all-products-loaded" style={{ color: 'var(--text-3)', fontSize: 13, padding: '8px 20px', border: '1px solid var(--border)', borderRadius: 'var(--r-full)' }}>
                    All {filteredProducts.length} products loaded
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
