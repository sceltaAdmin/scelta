import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct, getReviews, postReview } from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import ImageZoom from '../components/ImageZoom';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { toggle, isInWishlist } = useWishlist();
  const { isLoggedIn, user } = useAuth();
  const [product, setProduct]       = useState(null);
  const [reviews, setReviews]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [qty, setQty]               = useState(1);
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', comment: '' });
  const [hasReviewed, setHasReviewed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([getProduct(id), getReviews(id)])
      .then(([pRes, rRes]) => {
        setProduct(pRes.data.product);
        const fetchedReviews = rRes.data.reviews;
        setReviews(fetchedReviews);
        if (isLoggedIn && user) {
          const alreadyReviewed = fetchedReviews.some(r => r.user?._id === user.id || r.user?.email === user.email);
          setHasReviewed(alreadyReviewed);
        }
      })
      .finally(() => setLoading(false));
  }, [id, isLoggedIn, user]);

  const handleAddToCart = async () => {
    if (!isLoggedIn) { toast.error('Please login'); navigate('/login'); return; }
    await addItem(product._id, qty);
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) { toast.error('Please login to review'); return; }
    setSubmitting(true);
    try {
      await postReview({ productId: id, ...reviewForm });
      toast.success('Review submitted!');
      const res = await getReviews(id);
      setReviews(res.data.reviews);
      setHasReviewed(true);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit review';
      if (msg.includes('already reviewed')) setHasReviewed(true);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;
  if (!product) return <div style={{ textAlign: 'center', padding: 80 }}>Product not found</div>;
  const inWish = isInWishlist(product._id);

  const userReview = reviews.find(r => r.user?._id === user?.id || r.user?.email === user?.email);

  return (
    <main data-testid="product-detail-page" style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 20px' }}>
      <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'var(--text-3)', marginBottom: 24, cursor: 'pointer', fontSize: 14 }}>← Back</button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, marginBottom: 60 }}>
        <ImageZoom src={product.image} alt={product.name} />
        <div>
          {product.badge && <span style={{ background: 'var(--fire)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 'var(--r-full)', marginBottom: 12, display: 'inline-block' }}>{product.badge}</span>}
          <h1 data-testid="product-detail-name" style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--text-1)', marginBottom: 12, lineHeight: 1.3 }}>{product.name}</h1>
          <div style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 16 }}>by <strong>{product.brand}</strong></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <span style={{ background: 'var(--teal)', color: '#fff', padding: '4px 10px', borderRadius: 6, fontWeight: 700 }}>⭐ {product.rating}</span>
            <span style={{ color: 'var(--text-3)', fontSize: 14 }}>{product.reviewCount?.toLocaleString()} reviews</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 24 }}>
            <span data-testid="product-detail-price" style={{ fontSize: 36, fontWeight: 800, color: 'var(--text-1)' }}>₹{product.price?.toLocaleString()}</span>
            {product.originalPrice && <span style={{ fontSize: 18, color: 'var(--text-3)', textDecoration: 'line-through' }}>₹{product.originalPrice?.toLocaleString()}</span>}
            {product.discount > 0 && <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--green)' }}>{product.discount}% off</span>}
          </div>
          <p style={{ color: 'var(--text-2)', lineHeight: 1.7, marginBottom: 28 }}>{product.description}</p>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid var(--border)', borderRadius: 'var(--r-full)', overflow: 'hidden' }}>
              <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ padding: '8px 14px', background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: 'var(--text-1)' }}>−</button>
              <span data-testid="quantity-input" style={{ padding: '8px 16px', fontWeight: 600, color: 'var(--text-1)' }}>{qty}</span>
              <button onClick={() => setQty(q => q + 1)} style={{ padding: '8px 14px', background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: 'var(--text-1)' }}>+</button>
            </div>
            <button data-testid="add-to-cart-detail" onClick={handleAddToCart}
              style={{ flex: 1, padding: '12px 24px', background: 'var(--fire)', color: '#fff', border: 'none', borderRadius: 'var(--r-full)', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
              Add to Cart
            </button>
            <button data-testid="wishlist-detail-btn" onClick={() => toggle(product._id)}
              style={{ padding: '12px 16px', background: inWish ? 'var(--fire-pale)' : 'var(--bg-card)', border: '1.5px solid var(--border)', borderRadius: 'var(--r-full)', fontSize: 20, cursor: 'pointer' }}>
              {inWish ? '❤️' : '🤍'}
            </button>
          </div>
          <div style={{ fontSize: 13, color: 'var(--green)', fontWeight: 600 }}>✓ In Stock · Free delivery above ₹499</div>
        </div>
      </div>

      {/* Reviews */}
      <section data-testid="reviews-section">
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, marginBottom: 24, color: 'var(--text-1)' }}>Customer Reviews</h2>

        {reviews.length === 0 ? (
          <p style={{ color: 'var(--text-3)', marginBottom: 32 }}>No reviews yet. Be the first!</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 40 }}>
            {reviews.map(r => (
              <div key={r._id} data-testid="review-card"
                style={{ background: 'var(--bg-card)', borderRadius: 'var(--r-lg)', padding: 20, border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--fire)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700 }}>{r.user?.name?.[0]}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-1)', display: 'flex', alignItems: 'center', gap: 8 }}>
                      {r.user?.name}
                      {(r.user?._id === user?.id || r.user?.email === user?.email) && (
                        <span style={{ fontSize: 10, background: 'var(--fire-pale)', color: 'var(--fire)', padding: '2px 7px', borderRadius: 999, fontWeight: 700 }}>Your review</span>
                      )}
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--star)' }}>{'⭐'.repeat(r.rating)}</div>
                  </div>
                  <div style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--text-3)' }}>
                    {new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                </div>
                {r.title && <div style={{ fontWeight: 600, marginBottom: 4, color: 'var(--text-1)' }}>{r.title}</div>}
                <p style={{ color: 'var(--text-2)', fontSize: 14, lineHeight: 1.6 }}>{r.comment}</p>
              </div>
            ))}
          </div>
        )}

        {/* Review form area */}
        {isLoggedIn ? (
          hasReviewed ? (
            /* Already reviewed — success state */
            <div data-testid="review-submitted"
              style={{ background: 'var(--bg-card)', borderRadius: 'var(--r-lg)', padding: 32, border: '1px solid var(--border)', maxWidth: 600, textAlign: 'center' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--green-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, margin: '0 auto 16px' }}>✅</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-1)', marginBottom: 8 }}>Review Submitted!</h3>
              <p style={{ color: 'var(--text-3)', fontSize: 14, lineHeight: 1.6 }}>
                Thank you for sharing your experience. Your review helps other shoppers make better decisions.
              </p>
              {userReview && (
                <div style={{ marginTop: 20, background: 'var(--bg-card-2)', borderRadius: 'var(--r-md)', padding: '14px 16px', textAlign: 'left', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 13, color: 'var(--star)', marginBottom: 4 }}>{'⭐'.repeat(userReview.rating)}</div>
                  {userReview.title && <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-1)', marginBottom: 4 }}>{userReview.title}</div>}
                  <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6, margin: 0 }}>{userReview.comment}</p>
                </div>
              )}
            </div>
          ) : (
            /* Review form */
            <form data-testid="review-form" onSubmit={handleReview}
              style={{ background: 'var(--bg-card)', borderRadius: 'var(--r-lg)', padding: 28, border: '1px solid var(--border)', maxWidth: 600 }}>
              <h3 style={{ marginBottom: 20, color: 'var(--text-1)', fontSize: 17, fontWeight: 700 }}>Write a Review</h3>

              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: 6 }}>Rating</label>
                <select data-testid="review-rating"
                  value={reviewForm.rating}
                  onChange={e => setReviewForm(f => ({ ...f, rating: Number(e.target.value) }))}
                  style={{ padding: '9px 14px', borderRadius: 'var(--r-sm)', border: '1.5px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-1)', fontSize: 14, cursor: 'pointer' }}>
                  {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} Stars {'⭐'.repeat(n)}</option>)}
                </select>
              </div>

              <input placeholder="Review title (optional)"
                value={reviewForm.title}
                onChange={e => setReviewForm(f => ({ ...f, title: e.target.value }))}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--r-sm)', border: '1.5px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-1)', fontSize: 14, marginBottom: 12 }} />

              <textarea data-testid="review-comment" required
                placeholder="Share your experience with this product..."
                value={reviewForm.comment}
                onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))}
                rows={4}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--r-sm)', border: '1.5px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-1)', resize: 'vertical', fontSize: 14, marginBottom: 16, fontFamily: 'inherit' }} />

              <button data-testid="submit-review-btn" type="submit" disabled={submitting}
                style={{ padding: '11px 28px', background: submitting ? 'var(--border)' : 'var(--fire)', color: '#fff', border: 'none', borderRadius: 'var(--r-full)', fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer', fontSize: 14, transition: 'background 0.2s' }}>
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          )
        ) : (
          <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--r-lg)', padding: 24, border: '1px solid var(--border)', maxWidth: 600, textAlign: 'center' }}>
            <p style={{ color: 'var(--text-3)', marginBottom: 16 }}>Please login to write a review</p>
            <button onClick={() => navigate('/login')}
              style={{ padding: '10px 24px', background: 'var(--fire)', color: '#fff', border: 'none', borderRadius: 'var(--r-full)', fontWeight: 600, cursor: 'pointer' }}>
              Login to Review
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
