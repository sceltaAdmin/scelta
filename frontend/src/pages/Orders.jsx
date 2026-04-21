import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getOrders, cancelOrder } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const STATUS_COLORS = { pending: '#F59E0B', confirmed: '#3B82F6', processing: '#8B5CF6', shipped: '#06B6D4', delivered: '#10B981', cancelled: '#EF4444' };

function Tooltip({ text, children }) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && (
        <div data-testid="tooltip" style={{ position: 'fixed', bottom: 'auto', top: 'auto', marginTop: -40, left: '50%', transform: 'translateX(-50%)', background: '#1a1c1e', color: '#fff', fontSize: 11, fontWeight: 500, padding: '5px 10px', borderRadius: 6, whiteSpace: 'nowrap', zIndex: 9999, pointerEvents: 'none' }}>
          {text}
          <div style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', borderWidth: 4, borderStyle: 'solid', borderColor: '#1a1c1e transparent transparent transparent' }} />
        </div>
      )}
    </div>
  );
}

function downloadInvoice(order) {
  const lines = [
    '================================================',
    '           SCELTA — YOUR CHOICE, DELIVERED      ',
    '================================================',
    `Invoice Number : INV-${order.orderNumber}`,
    `Order Number   : ${order.orderNumber}`,
    `Order Date     : ${new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`,
    `Status         : ${order.status.toUpperCase()}`,
    `Payment Method : ${order.paymentMethod}`,
    '------------------------------------------------',
    'ITEMS ORDERED:',
    '------------------------------------------------',
    ...order.items.map(item => `  ${item.name}\n    Qty: ${item.quantity} x ₹${item.price?.toLocaleString()} = ₹${(item.price * item.quantity).toLocaleString()}`),
    '------------------------------------------------',
    `Subtotal       : ₹${order.subtotal?.toLocaleString()}`,
    `Delivery Fee   : ₹${order.deliveryFee || 0}`,
    `Discount       : -₹${order.discount || 0}`,
    `TOTAL          : ₹${order.total?.toLocaleString()}`,
    '------------------------------------------------',
    'SHIPPING ADDRESS:',
    `  ${order.shippingAddress?.name}`,
    `  ${order.shippingAddress?.street}`,
    `  ${order.shippingAddress?.city}, ${order.shippingAddress?.state} - ${order.shippingAddress?.pincode}`,
    `  ${order.shippingAddress?.country}`,
    '================================================',
    'Thank you for shopping with Scelta!',
    'For support: support@scelta.in | 1800-123-4567',
    '================================================',
  ].join('\n');

  const blob = new Blob([lines], { type: 'text/plain' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `Scelta_Invoice_${order.orderNumber}.txt`;
  a.click();
  URL.revokeObjectURL(url);
  toast.success('Invoice downloaded!');
}

export default function Orders() {
  const { isLoggedIn } = useAuth();
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    if (isLoggedIn) getOrders().then(r => setOrders(r.data.orders)).finally(() => setLoading(false));
    else setLoading(false);
  }, [isLoggedIn]);

  const handleCancel = async (id) => {
    const confirmed = window.confirm('Are you sure you want to cancel this order? This action cannot be undone.');
    if (!confirmed) return;
    try {
      await cancelOrder(id);
      toast.success('Order cancelled successfully');
      const res = await getOrders();
      setOrders(res.data.orders);
    } catch (err) { toast.error(err.response?.data?.message || 'Cannot cancel this order'); }
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
          <h3 style={{ fontSize: 20, color: 'var(--text-1)', marginBottom: 16 }}>No orders yet</h3>
          <Link to="/products" style={{ padding: '12px 28px', background: 'var(--fire)', color: '#fff', borderRadius: 'var(--r-full)', fontWeight: 600 }}>Start Shopping</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {orders.map(order => (
            <div key={order._id} data-testid={`order-card-${order._id}`}
              style={{ background: 'var(--bg-card)', borderRadius: 'var(--r-lg)', border: '1px solid var(--border)', overflow: 'visible' }}>

              {/* Order header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '16px 24px', background: 'var(--bg-card-2)', borderBottom: '1px solid var(--border)', flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-1)', marginBottom: 3 }}>#{order.orderNumber}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-3)' }}>
                    {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <Tooltip text={`Order is currently ${order.status}`}>
                    <span data-testid={`order-status-${order._id}`}
                      style={{ padding: '4px 12px', borderRadius: 'var(--r-full)', fontSize: 12, fontWeight: 700, background: STATUS_COLORS[order.status] + '20', color: STATUS_COLORS[order.status], cursor: 'default' }}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </Tooltip>

                  {['pending','confirmed'].includes(order.status) && (
                    <Tooltip text="Cancel this order">
                      <button data-testid={`cancel-order-${order._id}`} onClick={() => handleCancel(order._id)}
                        style={{ padding: '4px 12px', border: '1.5px solid var(--red)', color: 'var(--red)', background: 'transparent', borderRadius: 'var(--r-full)', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>
                        Cancel
                      </button>
                    </Tooltip>
                  )}

                  <Tooltip text="Download invoice as text file">
                    <button data-testid={`download-invoice-${order._id}`} onClick={() => downloadInvoice(order)}
                      style={{ padding: '4px 12px', border: '1.5px solid var(--border)', color: 'var(--text-2)', background: 'transparent', borderRadius: 'var(--r-full)', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>
                      ⬇ Invoice
                    </button>
                  </Tooltip>

                  <button onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                    style={{ padding: '4px 12px', border: '1.5px solid var(--border)', color: 'var(--text-2)', background: 'transparent', borderRadius: 'var(--r-full)', fontSize: 12, cursor: 'pointer' }}>
                    {expandedOrder === order._id ? '▲ Hide' : '▼ Details'}
                  </button>
                </div>
              </div>

              {/* Order items */}
              <div style={{ padding: '16px 24px' }}>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 12 }}>
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

                {/* Expanded details */}
                {expandedOrder === order._id && (
                  <div data-testid={`order-details-${order._id}`}
                    style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-3)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>Shipping To</div>
                      <div style={{ fontSize: 13, color: 'var(--text-1)', lineHeight: 1.6 }}>
                        {order.shippingAddress?.name}<br />
                        {order.shippingAddress?.street}<br />
                        {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-3)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>Payment</div>
                      <div style={{ fontSize: 13, color: 'var(--text-1)' }}>{order.paymentMethod}</div>
                      {order.notes && <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 4 }}>📝 {order.notes}</div>}
                    </div>
                  </div>
                )}

                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12, marginTop: 12, display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 700, color: 'var(--text-1)' }}>
                  <span>Total</span><span>₹{order.total?.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
