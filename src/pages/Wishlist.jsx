import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';

export default function Wishlist() {
  const { wishlist } = useWishlist();
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) return (
    <div data-testid="wishlist-page" style={{ textAlign: 'center', padding: '80px 20px' }}>
      <h2 style={{ marginBottom: 16, color: 'var(--text-1)' }}>Please login to view your wishlist</h2>
      <Link to="/login" style={{ padding: '12px 28px', background: 'var(--fire)', color: '#fff', borderRadius: 'var(--r-full)', fontWeight: 600 }}>Login</Link>
    </div>
  );

  return (
    <main data-testid="wishlist-page" style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 20px' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: 'var(--text-1)', marginBottom: 32 }}>My Wishlist ({wishlist.length})</h1>
      {wishlist.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🤍</div>
          <h3 style={{ fontSize: 20, marginBottom: 8, color: 'var(--text-1)' }}>Your wishlist is empty</h3>
          <Link to="/products" style={{ padding: '12px 28px', background: 'var(--fire)', color: '#fff', borderRadius: 'var(--r-full)', fontWeight: 600, display: 'inline-block', marginTop: 16 }}>Browse Products</Link>
        </div>
      ) : (
        <div data-testid="wishlist-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 }}>
          {wishlist.map(p => <ProductCard key={p._id} product={p} />)}
        </div>
      )}
    </main>
  );
}
