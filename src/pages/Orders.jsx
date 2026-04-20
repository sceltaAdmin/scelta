import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getOrders, cancelOrder } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const STATUS_COLORS = { pending: '#F59E0B', confirmed: '#3B82F6', processing: '#8B5CF6', shipped: '#06B6D4', delivered: '#10B981', cancelled: '#EF4444' };

export default function Orders() {
  const { isLoggedIn } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoggedIn) getOrders().then(r => setOrders(r.data.orders)).finally(() => setLoading(false));
    else setLoading(false);
  }, [isLoggedIn]);

  const handleCancel = async (id) => {
    try {
      await cancelOrder(id);
      toast.success('Order cancelled');
      const res = await getOrders();
      setOrders(res.data.orders);
    } catch (err) { toast.error(err.response?.data?.message || 'Cannot cancel'); }
  };

  if (!isLoggedIn) return (
    <div data-testid="orders-page" style={{ textAlign: 'center', padding: '80px 20px' }}>
      <h2 style={{ marginBottom: 16, color: 'var(--text-1)' }}>Please login to view orders</h2>
      <Link to="/login" style={{ padding: '12px 28px', background: 'var(--fire)', color: '#fff', borderRadius: 'var(--r-full)', fontWeight: 600 }}>Login</Link>
    </div>
  );

  return (
    <main data-testid="orders-page" style={{ maxWidth: 900, margin: '0 auto', padding: '32px 20px' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: 'var(--text-1)', marginBottom: 32 }}>My Orders</h1>
      {loading ? <div className="page-loader"><div className="spinner" /></div> : orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>📦</div>
          <h3 style={{ fontSize: 20, marginBottom: 8, color: 'var(--text-1)' }}>No orders yet</h3>
          <Link to="/products" style={{ padding: '12px 28px', background: 'var(--fire)', color: '#fff', borderRadius: 'var(--r-full)', fontWeight: 600, display: 'inline-block', marginTop: 16 }}>Start Shopping</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {orders.map(order => (
            <div key={order._id} data-testid={`order-card-${order._id}`} style={{ background: 'var(--bg-card)', borderRadius: 'var(--r-lg)', border: '1px solid var(--border)', padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--text-1)', marginBottom: 4 }}>#{order.orderNumber}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span data-testid={`order-status-${order._id}`} style={{ padding: '4px 12px', borderRadius: 'var(--r-full)', fontSize: 12, fontWeight: 700, background: STATUS_COLORS[order.status] + '20', color: STATUS_COLORS[order.status] }}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                  {['pending', 'confirmed'].includes(order.status) && (
                    <button data-testid={`cancel-order-${order._id}`} onClick={() => handleCancel(order._id)}
                      style={{ padding: '4px 12px', border: '1.5px solid var(--red)', color: 'var(--red)', background: 'transparent', borderRadius: 'var(--r-full)', fontSize: 12, cursor: 'pointer' }}>
                      Cancel
                    </button>
                  )}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
                {order.items.map(item => (
                  <div key={item._id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <img src={item.image} alt={item.name} style={{ width: 48, height: 48, objectFit: 'contain', borderRadius: 'var(--r-sm)', background: 'var(--bg-card-2)', padding: 4 }} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-1)' }}>{item.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-3)' }}>Qty: {item.quantity} · ₹{item.price?.toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12, display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 700, color: 'var(--text-1)' }}>
                <span>Total</span><span>₹{order.total?.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
