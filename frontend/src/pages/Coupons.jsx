import { useState } from 'react';
import toast from 'react-hot-toast';

const COUPONS = [
  { code: 'SCELTA10', type: 'percent', discount: 10, minOrder: 500, maxDiscount: 500, desc: '10% off on orders above ₹500', color: '#3B82F6', expiry: '31 Dec 2026' },
  { code: 'SCELTA20', type: 'percent', discount: 20, minOrder: 1000, maxDiscount: 1000, desc: '20% off on orders above ₹1000', color: '#8B5CF6', expiry: '31 Dec 2026' },
  { code: 'FLAT100', type: 'flat', discount: 100, minOrder: 999, desc: '₹100 off on orders above ₹999', color: '#10B981', expiry: '31 Dec 2026' },
  { code: 'FLAT200', type: 'flat', discount: 200, minOrder: 1999, desc: '₹200 off on orders above ₹1999', color: '#F59E0B', expiry: '31 Dec 2026' },
  { code: 'NEWUSER', type: 'percent', discount: 15, minOrder: 0, maxDiscount: 300, desc: '15% off for new users (max ₹300)', color: '#EF4444', expiry: '31 Dec 2026' },
];

export default function Coupons() {
  const [copied, setCopied] = useState({});

  const copyToClipboard = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(prev => ({ ...prev, [code]: true }));
      toast.success(`Coupon code "${code}" copied to clipboard!`);
      setTimeout(() => setCopied(prev => ({ ...prev, [code]: false })), 2000);
    } catch {
      const el = document.createElement('textarea');
      el.value = code;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(prev => ({ ...prev, [code]: true }));
      toast.success(`Copied "${code}"!`);
      setTimeout(() => setCopied(prev => ({ ...prev, [code]: false })), 2000);
    }
  };

  return (
    <main data-testid="coupons-page" style={{ maxWidth: 800, margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, color: 'var(--text-1)', marginBottom: 8 }}>Coupons & Offers</h1>
      <p style={{ color: 'var(--text-3)', marginBottom: 32 }}>Click the copy button to copy coupon codes to clipboard</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {COUPONS.map(coupon => (
          <div key={coupon.code} data-testid={`coupon-card-${coupon.code}`}
            style={{ background: 'var(--bg-card)', borderRadius: 'var(--r-lg)', border: '1px solid var(--border)', overflow: 'hidden', display: 'flex' }}>

            {/* Left accent */}
            <div style={{ width: 8, background: coupon.color, flexShrink: 0 }} />

            {/* Content */}
            <div style={{ flex: 1, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <span data-testid={`coupon-code-${coupon.code}`}
                    style={{ fontSize: 22, fontWeight: 800, color: coupon.color, fontFamily: 'monospace', letterSpacing: 2 }}>
                    {coupon.code}
                  </span>
                  <span style={{ fontSize: 12, background: coupon.color + '22', color: coupon.color, padding: '2px 8px', borderRadius: 999, fontWeight: 700 }}>
                    {coupon.type === 'percent' ? `${coupon.discount}% OFF` : `₹${coupon.discount} OFF`}
                  </span>
                </div>
                <div style={{ fontSize: 14, color: 'var(--text-2)', marginBottom: 4 }}>{coupon.desc}</div>
                <div style={{ fontSize: 12, color: 'var(--text-3)' }}>Valid till {coupon.expiry}</div>
              </div>

              {/* Copy button */}
              <button
                data-testid={`copy-coupon-${coupon.code}`}
                onClick={() => copyToClipboard(coupon.code)}
                style={{ padding: '10px 20px', background: copied[coupon.code] ? 'var(--green)' : coupon.color, color: '#fff', border: 'none', borderRadius: 'var(--r-full)', fontWeight: 700, cursor: 'pointer', fontSize: 14, transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
                {copied[coupon.code] ? '✓ Copied!' : 'Copy Code'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Clipboard API tip */}
      <div style={{ marginTop: 32, padding: 16, background: 'var(--bg-card)', borderRadius: 'var(--r-md)', border: '1px solid var(--border)', fontSize: 13, color: 'var(--text-2)' }}>
        <strong style={{ color: 'var(--text-1)' }}>Selenium tip:</strong> To verify clipboard content use JavaScript executor:{' '}
        <code style={{ background: 'var(--bg-card-2)', padding: '2px 8px', borderRadius: 4, fontSize: 12, color: 'var(--fire)' }}>
          (String) js.executeScript("return navigator.clipboard.readText()")
        </code>
      </div>
    </main>
  );
}
