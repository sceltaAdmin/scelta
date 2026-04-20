import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { validateCoupon, placeOrder } from '../services/api';
import toast from 'react-hot-toast';

export default function Cart() {
  const { cart, updateItem, removeItem, fetchCart } = useCart();
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();
  const [coupon, setCoupon]     = useState('');
  const [discount, setDiscount] = useState(0);
  const [placing, setPlacing]   = useState(false);

  if (!isLoggedIn) return (
    <div data-testid="cart-page" style={{ textAlign: 'center', padding: '80px 20px' }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>🛒</div>
      <h2 style={{ marginBottom: 16, color: 'var(--text-1)' }}>Please login to view your cart</h2>
      <Link to="/login" style={{ padding: '12px 28px', background: 'var(--fire)', color: '#fff', borderRadius: 'var(--r-full)', fontWeight: 600 }}>Login</Link>
    </div>
  );

  const items = cart.items || [];
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const delivery = subtotal >= 499 ? 0 : 49;
  const total = subtotal + delivery - discount;

  const handleCoupon = async () => {
    try {
      const res = await validateCoupon(coupon, subtotal);
      setDiscount(res.data.coupon.calculatedDiscount);
      toast.success(`Coupon applied! ₹${res.data.coupon.calculatedDiscount} off`);
    } catch (err) { toast.error(err.response?.data?.message || 'Invalid coupon'); }
  };

  const handlePlaceOrder = async () => {
    if (items.length === 0) { toast.error('Your cart is empty'); return; }
    setPlacing(true);
    try {
      const shippingAddress = { name: user.name, phone: user.phone || '9999999999', street: '123 Main St', city: 'Bengaluru', state: 'Karnataka', pincode: '560001', country: 'India' };
      const res = await placeOrder({ shippingAddress, paymentMethod: 'COD', coupon });
      toast.success(`Order placed! #${res.data.order.orderNumber}`);
      await fetchCart();
      navigate('/orders');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to place order'); }
    finally { setPlacing(false); }
  };

  return (
    <main data-testid="cart-page" style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 20px' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: 'var(--text-1)', marginBottom: 32 }}>Shopping Cart ({items.length})</h1>

      {items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🛒</div>
          <h3 style={{ fontSize: 20, marginBottom: 8, color: 'var(--text-1)' }}>Your cart is empty</h3>
          <Link to="/products" style={{ padding: '12px 28px', background: 'var(--fire)', color: '#fff', borderRadius: 'var(--r-full)', fontWeight: 600, display: 'inline-block', marginTop: 16 }}>Start Shopping</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 32 }}>
          {/* Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {items.map(item => (
              <div key={item._id} data-testid={`cart-item-${item._id}`} style={{ background: 'var(--bg-card)', borderRadius: 'var(--r-lg)', border: '1px solid var(--border)', padding: 20, display: 'flex', gap: 16, alignItems: 'center' }}>
                <img src={item.product?.image} alt={item.product?.name} style={{ width: 80, height: 80, objectFit: 'contain', borderRadius: 'var(--r-sm)', background: 'var(--bg-card-2)', padding: 8 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--text-1)', marginBottom: 4 }}>{item.product?.name}</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-1)' }}>₹{item.price?.toLocaleString()}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid var(--border)', borderRadius: 'var(--r-full)' }}>
                  <button onClick={() => updateItem(item._id, item.quantity - 1)} style={{ padding: '6px 12px', background: 'none', border: 'none', fontSize: 16, cursor: 'pointer', color: 'var(--text-1)' }}>−</button>
                  <span data-testid={`cart-qty-${item._id}`} style={{ padding: '6px 12px', fontWeight: 600, color: 'var(--text-1)' }}>{item.quantity}</span>
                  <button onClick={() => updateItem(item._id, item.quantity + 1)} style={{ padding: '6px 12px', background: 'none', border: 'none', fontSize: 16, cursor: 'pointer', color: 'var(--text-1)' }}>+</button>
                </div>
                <button data-testid={`remove-cart-item-${item._id}`} onClick={() => removeItem(item._id)}
                  style={{ background: 'var(--red-pale)', border: 'none', borderRadius: 'var(--r-sm)', padding: '6px 10px', color: 'var(--red)', cursor: 'pointer', fontSize: 16 }}>🗑</button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--r-lg)', border: '1px solid var(--border)', padding: 24, height: 'fit-content', position: 'sticky', top: 80 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, color: 'var(--text-1)' }}>Order Summary</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14, color: 'var(--text-2)' }}>
              <span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14, color: 'var(--text-2)' }}>
              <span>Delivery</span><span style={{ color: delivery === 0 ? 'var(--green)' : 'inherit' }}>{delivery === 0 ? 'FREE' : `₹${delivery}`}</span>
            </div>
            {discount > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14, color: 'var(--green)', fontWeight: 600 }}>
              <span>Discount</span><span>−₹{discount}</span>
            </div>}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12, marginTop: 12, display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 18, color: 'var(--text-1)' }}>
              <span>Total</span><span>₹{total.toLocaleString()}</span>
            </div>

            {/* Coupon */}
            <div style={{ marginTop: 20, display: 'flex', gap: 8 }}>
              <input data-testid="coupon-input" value={coupon} onChange={e => setCoupon(e.target.value.toUpperCase())} placeholder="Enter coupon code"
                style={{ flex: 1, padding: '8px 12px', borderRadius: 'var(--r-sm)', border: '1.5px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-1)', fontSize: 13 }} />
              <button data-testid="apply-coupon-btn" onClick={handleCoupon}
                style={{ padding: '8px 14px', background: 'var(--fire)', color: '#fff', border: 'none', borderRadius: 'var(--r-sm)', fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>Apply</button>
            </div>

            <button data-testid="place-order-btn" onClick={handlePlaceOrder} disabled={placing}
              style={{ width: '100%', marginTop: 20, padding: '14px', background: 'var(--fire)', color: '#fff', border: 'none', borderRadius: 'var(--r-full)', fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>
              {placing ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
