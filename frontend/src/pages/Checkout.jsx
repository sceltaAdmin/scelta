import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { placeOrder } from '../services/api';
import toast from 'react-hot-toast';

const TIME_SLOTS = [
  '9:00 AM - 11:00 AM',
  '11:00 AM - 1:00 PM',
  '1:00 PM - 3:00 PM',
  '3:00 PM - 5:00 PM',
  '5:00 PM - 7:00 PM',
  '7:00 PM - 9:00 PM',
];

const getMinDate = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
};

const getMaxDate = () => {
  const d = new Date();
  d.setDate(d.getDate() + 14);
  return d.toISOString().split('T')[0];
};

export default function Checkout() {
  const { cart, fetchCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [placing, setPlacing] = useState(false);

  const [form, setForm] = useState({
    name: user?.name || '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
  });
  const [deliveryDate, setDeliveryDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [errors, setErrors] = useState({});

  const items = cart?.items || [];
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const delivery = subtotal >= 499 ? 0 : 49;
  const total = subtotal + delivery;

  const validateStep1 = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!/^[6-9]\d{9}$/.test(form.phone)) e.phone = 'Enter valid 10-digit mobile number';
    if (!form.street.trim()) e.street = 'Street address is required';
    if (!form.city.trim()) e.city = 'City is required';
    if (!form.state.trim()) e.state = 'State is required';
    if (!/^[1-9][0-9]{5}$/.test(form.pincode)) e.pincode = 'Enter valid 6-digit pincode';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    if (!deliveryDate) { toast.error('Please select a delivery date'); return false; }
    if (!timeSlot) { toast.error('Please select a delivery time slot'); return false; }
    return true;
  };

  const handlePlaceOrder = async () => {
    if (items.length === 0) { toast.error('Your cart is empty'); return; }
    const confirmed = window.confirm(
      'Confirm your order?\n\nTotal: Rs.' + total.toLocaleString() +
      '\nDelivery: ' + deliveryDate + ' (' + timeSlot + ')' +
      '\nPayment: ' + paymentMethod
    );
    if (!confirmed) return;
    setPlacing(true);
    try {
      const res = await placeOrder({
        shippingAddress: form,
        paymentMethod,
        notes: 'Delivery on ' + deliveryDate + ' between ' + timeSlot,
      });
      toast.success('Order placed! #' + res.data.order.orderNumber);
      await fetchCart();
      navigate('/orders');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  const inputStyle = (field) => ({
    width: '100%', padding: '11px 14px',
    borderRadius: 'var(--r-md)',
    border: '1.5px solid ' + (errors[field] ? 'var(--red)' : 'var(--border)'),
    background: 'var(--bg-card)', color: 'var(--text-1)', fontSize: 14,
    outline: 'none',
  });

  const PAYMENT_METHODS = [
    { id: 'COD',        label: 'Cash on Delivery',    icon: 'COD',  desc: 'Pay when your order arrives' },
    { id: 'UPI',        label: 'UPI Payment',          icon: 'UPI',  desc: 'Google Pay, PhonePe, Paytm' },
    { id: 'CARD',       label: 'Credit / Debit Card',  icon: 'CARD', desc: 'Visa, Mastercard, RuPay' },
    { id: 'NETBANKING', label: 'Net Banking',           icon: 'NET',  desc: 'All major banks supported' },
  ];

  return (
    <main data-testid="checkout-page" style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 20px' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: 'var(--text-1)', marginBottom: 32 }}>Checkout</h1>

      {/* Step indicator */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 40 }}>
        {['Shipping', 'Delivery Slot', 'Payment'].map((s, i) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: step >= i + 1 ? 'var(--fire)' : 'var(--border)', color: step >= i + 1 ? '#fff' : 'var(--text-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, marginBottom: 6 }}>
                {step > i + 1 ? '✓' : i + 1}
              </div>
              <span style={{ fontSize: 12, color: step === i + 1 ? 'var(--fire)' : 'var(--text-3)', fontWeight: step === i + 1 ? 600 : 400 }}>{s}</span>
            </div>
            {i < 2 && <div style={{ height: 2, flex: 1, background: step > i + 1 ? 'var(--fire)' : 'var(--border)', marginBottom: 20, marginTop: -14 }} />}
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 32 }}>
        <div>
          {/* Step 1 - Shipping */}
          {step === 1 && (
            <div data-testid="shipping-form" style={{ background: 'var(--bg-card)', borderRadius: 'var(--r-lg)', border: '1px solid var(--border)', padding: 28 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-1)', marginBottom: 24 }}>Shipping Address</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: 6 }}>Full Name</label>
                  <input data-testid="checkout-name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={inputStyle('name')} placeholder="John Doe" />
                  {errors.name && <div style={{ fontSize: 12, color: 'var(--red)', marginTop: 4 }}>⚠ {errors.name}</div>}
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: 6 }}>Phone</label>
                  <input data-testid="checkout-phone" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value.replace(/\D/g, '').slice(0, 10) }))} style={inputStyle('phone')} placeholder="9876543210" />
                  {errors.phone && <div style={{ fontSize: 12, color: 'var(--red)', marginTop: 4 }}>⚠ {errors.phone}</div>}
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: 6 }}>Street Address</label>
                <input data-testid="checkout-street" value={form.street} onChange={e => setForm(f => ({ ...f, street: e.target.value }))} style={inputStyle('street')} placeholder="123 Main Street, Area, Landmark" />
                {errors.street && <div style={{ fontSize: 12, color: 'var(--red)', marginTop: 4 }}>⚠ {errors.street}</div>}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: 6 }}>City</label>
                  <input data-testid="checkout-city" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value.replace(/[^a-zA-Z\s]/g, '') }))} style={inputStyle('city')} placeholder="Bengaluru" />
                  {errors.city && <div style={{ fontSize: 12, color: 'var(--red)', marginTop: 4 }}>⚠ {errors.city}</div>}
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: 6 }}>State</label>
                  <input data-testid="checkout-state" value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value.replace(/[^a-zA-Z\s]/g, '') }))} style={inputStyle('state')} placeholder="Karnataka" />
                  {errors.state && <div style={{ fontSize: 12, color: 'var(--red)', marginTop: 4 }}>⚠ {errors.state}</div>}
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: 6 }}>Pincode</label>
                  <input data-testid="checkout-pincode" value={form.pincode} onChange={e => setForm(f => ({ ...f, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) }))} style={inputStyle('pincode')} placeholder="560001" />
                  {errors.pincode && <div style={{ fontSize: 12, color: 'var(--red)', marginTop: 4 }}>⚠ {errors.pincode}</div>}
                </div>
              </div>
              <button data-testid="checkout-next-1" onClick={() => { if (validateStep1()) setStep(2); }}
                style={{ marginTop: 24, padding: '12px 32px', background: 'var(--fire)', color: '#fff', border: 'none', borderRadius: 'var(--r-full)', fontWeight: 700, cursor: 'pointer', fontSize: 15 }}>
                Continue to Delivery Slot
              </button>
            </div>
          )}

          {/* Step 2 - Date + Time */}
          {step === 2 && (
            <div data-testid="delivery-slot-form" style={{ background: 'var(--bg-card)', borderRadius: 'var(--r-lg)', border: '1px solid var(--border)', padding: 28 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-1)', marginBottom: 24 }}>Choose Delivery Slot</h2>

              <div style={{ marginBottom: 28 }}>
                <label style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-1)', display: 'block', marginBottom: 10 }}>Select Delivery Date</label>
                <input data-testid="delivery-date-picker" type="date"
                  value={deliveryDate} min={getMinDate()} max={getMaxDate()}
                  onChange={e => setDeliveryDate(e.target.value)}
                  style={{ padding: '11px 16px', borderRadius: 'var(--r-md)', border: '1.5px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-1)', fontSize: 15, cursor: 'pointer', width: '100%', maxWidth: 300 }} />
                <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 6 }}>Available for next 14 days</div>
              </div>

              <div style={{ marginBottom: 28 }}>
                <label style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-1)', display: 'block', marginBottom: 10 }}>Select Time Slot</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10 }}>
                  {TIME_SLOTS.map(slot => (
                    <button key={slot} data-testid={'time-slot-' + slot.replace(/[\s:]/g, '-')}
                      onClick={() => setTimeSlot(slot)}
                      style={{ padding: '12px 16px', borderRadius: 'var(--r-md)', border: '1.5px solid', borderColor: timeSlot === slot ? 'var(--fire)' : 'var(--border)', background: timeSlot === slot ? 'var(--fire-pale)' : 'var(--bg-card)', color: timeSlot === slot ? 'var(--fire)' : 'var(--text-1)', fontWeight: timeSlot === slot ? 700 : 400, cursor: 'pointer', fontSize: 13 }}>
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={() => setStep(1)} style={{ padding: '12px 24px', background: 'transparent', color: 'var(--text-2)', border: '1.5px solid var(--border)', borderRadius: 'var(--r-full)', fontWeight: 600, cursor: 'pointer' }}>Back</button>
                <button data-testid="checkout-next-2" onClick={() => { if (validateStep2()) setStep(3); }}
                  style={{ padding: '12px 32px', background: 'var(--fire)', color: '#fff', border: 'none', borderRadius: 'var(--r-full)', fontWeight: 700, cursor: 'pointer', fontSize: 15 }}>
                  Continue to Payment
                </button>
              </div>
            </div>
          )}

          {/* Step 3 - Payment */}
          {step === 3 && (
            <div data-testid="payment-form" style={{ background: 'var(--bg-card)', borderRadius: 'var(--r-lg)', border: '1px solid var(--border)', padding: 28 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-1)', marginBottom: 24 }}>Payment Method</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
                {PAYMENT_METHODS.map(method => (
                  <label key={method.id} data-testid={'payment-' + method.id.toLowerCase()}
                    style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px', borderRadius: 'var(--r-lg)', border: '1.5px solid', borderColor: paymentMethod === method.id ? 'var(--fire)' : 'var(--border)', background: paymentMethod === method.id ? 'rgba(255,87,34,0.15)' : 'var(--bg-card)', cursor: 'pointer' }}>
                    <input type="radio" name="paymentMethod" value={method.id}
                      checked={paymentMethod === method.id} onChange={() => setPaymentMethod(method.id)}
                      style={{ accentColor: 'var(--fire)', width: 16, height: 16 }} />
                    <div style={{ width: 40, height: 28, background: 'var(--bg-card-2)', border: '1px solid var(--border)', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: 'var(--text-2)' }}>{method.icon}</div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-1)', opacity: 1 }}>{method.label}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{method.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={() => setStep(2)} style={{ padding: '12px 24px', background: 'transparent', color: 'var(--text-2)', border: '1.5px solid var(--border)', borderRadius: 'var(--r-full)', fontWeight: 600, cursor: 'pointer' }}>Back</button>
                <button data-testid="place-order-btn" onClick={handlePlaceOrder} disabled={placing}
                  style={{ flex: 1, padding: '14px', background: placing ? 'var(--border)' : 'var(--fire)', color: '#fff', border: 'none', borderRadius: 'var(--r-full)', fontWeight: 700, cursor: placing ? 'not-allowed' : 'pointer', fontSize: 16 }}>
                  {placing ? 'Placing Order...' : 'Place Order - Rs.' + total.toLocaleString()}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--r-lg)', border: '1px solid var(--border)', padding: 24, height: 'fit-content', position: 'sticky', top: 80 }}>
          <h3 style={{ fontWeight: 700, fontSize: 16, color: 'var(--text-1)', marginBottom: 16 }}>Order Summary</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
            {items.map(item => (
              <div key={item._id} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <img src={item.product?.image} alt={item.product?.name} style={{ width: 44, height: 44, objectFit: 'contain', borderRadius: 6, background: 'var(--bg-card-2)', padding: 4 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, color: 'var(--text-1)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.product?.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-3)' }}>Qty: {item.quantity}</div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-1)', flexShrink: 0 }}>Rs.{(item.price * item.quantity).toLocaleString()}</div>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-2)', marginBottom: 6 }}><span>Subtotal</span><span>Rs.{subtotal.toLocaleString()}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: delivery === 0 ? 'var(--green)' : 'var(--text-2)', marginBottom: 12 }}><span>Delivery</span><span>{delivery === 0 ? 'FREE' : 'Rs.' + delivery}</span></div>
            {deliveryDate && <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 4 }}>Date: {deliveryDate}</div>}
            {timeSlot && <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 12 }}>Time: {timeSlot}</div>}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 18, color: 'var(--text-1)' }}><span>Total</span><span>Rs.{total.toLocaleString()}</span></div>
          </div>
        </div>
      </div>
    </main>
  );
}
