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
  const [products, setProducts] = useState([]);
  const [total, setTotal]       = useState(0);
  const [pages, setPages]       = useState(1);
  const [loading, setLoading]   = useState(true);

  const category = searchParams.get('category') || '';
  const search   = searchParams.get('search') || '';
  const sort     = searchParams.get('sort') || 'newest';
  const page     = Number(searchParams.get('page')) || 1;
  const featured = searchParams.get('featured') || '';

  useEffect(() => {
    setLoading(true);
    getProducts({ category, search, sort, page, limit: 12, ...(featured ? { featured } : {}) })
      .then(res => { setProducts(res.data.products); setTotal(res.data.total); setPages(res.data.pages); })
      .finally(() => setLoading(false));
  }, [category, search, sort, page, featured]);

  const setParam = (key, val) => {
    const p = new URLSearchParams(searchParams);
    if (val) p.set(key, val); else p.delete(key);
    p.delete('page');
    setSearchParams(p);
  };

  return (
    <main data-testid="products-page" style={{ padding: '32px 20px', maxWidth: 1280, margin: '0 auto' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: 'var(--text-1)', marginBottom: 8 }}>
        {category ? CATEGORIES.find(c => c.id === category)?.label : search ? `Results for "${search}"` : 'All Products'}
      </h1>
      <p style={{ color: 'var(--text-3)', marginBottom: 24 }}>{total} products found</p>
      <div data-testid="filters-bar" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 32 }}>
        <select data-testid="category-filter" value={category} onChange={e => setParam('category', e.target.value)}
          style={{ padding: '8px 14px', borderRadius: 'var(--r-full)', border: '1.5px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-1)', fontSize: 14 }}>
          {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
        <select data-testid="sort-filter" value={sort} onChange={e => setParam('sort', e.target.value)}
          style={{ padding: '8px 14px', borderRadius: 'var(--r-full)', border: '1.5px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-1)', fontSize: 14 }}>
          <option value="newest">Newest First</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating">Top Rated</option>
          <option value="popular">Most Popular</option>
        </select>
        {(category || search || featured) && (
          <button data-testid="clear-filters" onClick={() => setSearchParams({})}
            style={{ padding: '8px 14px', borderRadius: 'var(--r-full)', border: '1.5px solid var(--fire)', color: 'var(--fire)', background: 'transparent', fontSize: 14, cursor: 'pointer' }}>
            ✕ Clear filters
          </button>
        )}
      </div>
      {loading ? <div className="page-loader"><div className="spinner" /></div> : products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-3)' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
          <h3 style={{ fontSize: 20, marginBottom: 8, color: 'var(--text-1)' }}>No products found</h3>
        </div>
      ) : (
        <div data-testid="products-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20, marginBottom: 40 }}>
          {products.map(p => <ProductCard key={p._id} product={p} />)}
        </div>
      )}
      {pages > 1 && (
        <div data-testid="pagination" style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
          {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setParam('page', p)}
              style={{ width: 36, height: 36, borderRadius: 'var(--r-sm)', border: '1.5px solid', borderColor: p === page ? 'var(--fire)' : 'var(--border)', background: p === page ? 'var(--fire)' : 'var(--bg-card)', color: p === page ? '#fff' : 'var(--text-1)', fontWeight: 600, cursor: 'pointer' }}>
              {p}
            </button>
          ))}
        </div>
      )}
    </main>
  );
}
