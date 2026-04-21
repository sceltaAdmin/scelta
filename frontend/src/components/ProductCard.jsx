import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { toggle, isInWishlist } = useWishlist();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const inWish = isInWishlist(product._id);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) { toast.error('Please login to add to cart'); navigate('/login'); return; }
    await addItem(product._id);
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) { toast.error('Please login to use wishlist'); navigate('/login'); return; }
    await toggle(product._id);
  };

  return (
    <Link to={`/products/${product._id}`} data-testid={`product-card-${product._id}`}
      style={{ background: 'var(--bg-card)', borderRadius: 'var(--r-lg)', border: '1px solid var(--border)', overflow: 'hidden', display: 'block', transition: 'all 0.2s' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}>
      <div style={{ position: 'relative', background: 'var(--bg-card-2)', aspectRatio: '1', overflow: 'hidden' }}>
        <img src={product.image} alt={product.name} loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 16 }} />
        {product.badge && <span style={{ position: 'absolute', top: 10, left: 10, background: 'var(--fire)', color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 'var(--r-full)' }}>{product.badge}</span>}
        <button data-testid={`wishlist-btn-${product._id}`} onClick={handleWishlist}
          style={{ position: 'absolute', top: 10, right: 10, background: inWish ? 'var(--fire-pale)' : 'var(--bg-card)', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
          {inWish ? '❤️' : '🤍'}
        </button>
      </div>
      <div style={{ padding: '14px 16px' }}>
        <div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 4 }}>{product.brand}</div>
        <div data-testid="product-name" style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-1)', marginBottom: 8, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{product.name}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 10 }}>
          <span style={{ background: 'var(--teal)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '2px 6px', borderRadius: 4 }}>⭐ {product.rating}</span>
          <span style={{ fontSize: 11, color: 'var(--text-3)' }}>({product.reviewCount?.toLocaleString()})</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <span data-testid="product-price" style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-1)' }}>₹{product.price?.toLocaleString()}</span>
          {product.originalPrice && <span style={{ fontSize: 13, color: 'var(--text-3)', textDecoration: 'line-through' }}>₹{product.originalPrice?.toLocaleString()}</span>}
          {product.discount > 0 && <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--green)' }}>{product.discount}% off</span>}
        </div>
        <button data-testid={`add-to-cart-${product._id}`} onClick={handleAddToCart}
          style={{ width: '100%', padding: '10px', background: 'var(--fire)', color: '#fff', border: 'none', borderRadius: 'var(--r-full)', fontSize: 13, fontWeight: 600 }}>
          Add to Cart
        </button>
      </div>
    </Link>
  );
}
