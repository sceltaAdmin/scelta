import { useState } from 'react';

const FAQS = [
  {
    category: 'Orders & Delivery',
    icon: '📦',
    questions: [
      { q: 'How do I track my order?', a: 'Go to My Orders page after logging in. Each order shows its current status — Pending, Confirmed, Processing, Shipped, or Delivered. You will receive updates at every stage.' },
      { q: 'What is the estimated delivery time?', a: 'Standard delivery takes 3-5 business days. Express delivery (available at checkout) takes 1-2 business days. Remote areas may take up to 7 business days.' },
      { q: 'Can I change my delivery address after placing an order?', a: 'You can change the delivery address only if the order is in Pending or Confirmed status. Once shipped, the address cannot be changed. Contact support immediately if you need help.' },
      { q: 'Is free delivery available?', a: 'Yes! All orders above ₹499 qualify for free standard delivery. Orders below ₹499 incur a flat delivery fee of ₹49.' },
    ]
  },
  {
    category: 'Returns & Refunds',
    icon: '↩️',
    questions: [
      { q: 'What is the return policy?', a: 'Scelta offers a 30-day hassle-free return policy. Items must be unused, in original packaging, and accompanied by the original invoice. Electronics have a 7-day return window.' },
      { q: 'How long does a refund take?', a: 'Refunds are processed within 5-7 business days after we receive the returned item. The amount is credited back to your original payment method.' },
      { q: 'Can I exchange a product instead of returning it?', a: 'Yes, exchanges are available for size or colour variants of the same product, subject to availability. Initiate an exchange request from the My Orders page.' },
      { q: 'Are there any items that cannot be returned?', a: 'Perishable goods, personalised items, digital downloads, and items marked as non-returnable cannot be returned. Check the product page for return eligibility.' },
    ]
  },
  {
    category: 'Payments & Coupons',
    icon: '💳',
    questions: [
      { q: 'What payment methods are accepted?', a: 'We accept Cash on Delivery (COD), UPI, Credit/Debit Cards, Net Banking, and popular wallets like Paytm and PhonePe. All online payments are SSL encrypted.' },
      { q: 'How do I apply a coupon code?', a: 'Add items to your cart, then enter your coupon code in the coupon field on the cart page and click Apply. The discount will be applied to your order total automatically.' },
      { q: 'What are the available coupon codes?', a: 'Current active coupons: SCELTA10 (10% off above ₹500), SCELTA20 (20% off above ₹1000), FLAT100 (₹100 off above ₹999), FLAT200 (₹200 off above ₹1999), NEWUSER (15% off for new users).' },
      { q: 'Why was my payment declined?', a: 'Payments can be declined due to incorrect card details, insufficient funds, bank restrictions, or network issues. Try a different payment method or contact your bank. Your order will not be placed if payment fails.' },
    ]
  },
  {
    category: 'Account & Security',
    icon: '🔒',
    questions: [
      { q: 'How do I reset my password?', a: 'Click on Login, then Forgot Password. Enter your registered email address and we will send you a password reset link. The link expires in 24 hours.' },
      { q: 'How do I delete my account?', a: 'Go to My Profile page and scroll to the bottom. Click Delete Account. You will be asked to confirm. Note that this action is irreversible and all your data will be permanently deleted.' },
      { q: 'Is my personal information secure?', a: 'Yes. Scelta uses industry-standard SSL encryption for all data transmission. We never share your personal information with third parties without your consent.' },
      { q: 'Can I have multiple accounts?', a: 'Each email address can only be associated with one Scelta account. If you need to change your email, go to My Profile and update your email address.' },
    ]
  },
  {
    category: 'Products & Reviews',
    icon: '⭐',
    questions: [
      { q: 'Are all products genuine?', a: 'Yes, all products on Scelta are 100% genuine and sourced directly from authorised distributors and brand partners. We have a zero-tolerance policy for counterfeit goods.' },
      { q: 'How do I write a product review?', a: 'Open any product page and scroll to the Customer Reviews section. Click Write a Review, select your rating, add a title and comment, then submit. You can only review products you have purchased.' },
      { q: 'Can I compare products?', a: 'Yes! Use the Size Guide feature on product pages to compare specifications. You can also add up to 3 products to the wishlist for easy comparison.' },
      { q: 'What does the badge on a product mean?', a: 'Badges like Best Seller indicate high sales volume, Top Rated means consistently high customer ratings, New means recently added, and Sale indicates a limited-time discount.' },
    ]
  },
];

export default function Help() {
  const [openItems, setOpenItems] = useState({});
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const toggle = (key) => setOpenItems(prev => ({ ...prev, [key]: !prev[key] }));

  const filteredFaqs = FAQS.map(cat => ({
    ...cat,
    questions: cat.questions.filter(item =>
      search === '' ||
      item.q.toLowerCase().includes(search.toLowerCase()) ||
      item.a.toLowerCase().includes(search.toLowerCase())
    )
  })).filter(cat =>
    (activeCategory === 'all' || cat.category === activeCategory) &&
    cat.questions.length > 0
  );

  return (
    <main data-testid="help-page" style={{ maxWidth: 860, margin: '0 auto', padding: '40px 20px' }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 40, color: 'var(--text-1)', marginBottom: 12 }}>
          Help & Support
        </h1>
        <p style={{ color: 'var(--text-3)', fontSize: 16, marginBottom: 32 }}>
          Find answers to frequently asked questions
        </p>

        {/* Search */}
        <div style={{ maxWidth: 480, margin: '0 auto', position: 'relative' }}>
          <input
            data-testid="faq-search"
            type="text"
            placeholder="Search for answers..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '14px 20px 14px 48px', borderRadius: 'var(--r-full)', border: '1.5px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-1)', fontSize: 15, outline: 'none' }}
          />
          <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', fontSize: 18 }}>🔍</span>
          {search && (
            <button onClick={() => setSearch('')}
              style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: 'var(--text-3)' }}>×</button>
          )}
        </div>
      </div>

      {/* Category tabs */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 32, justifyContent: 'center' }}>
        {[{ id: 'all', label: 'All Topics' }, ...FAQS.map(c => ({ id: c.category, label: c.icon + ' ' + c.category }))].map(cat => (
          <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
            data-testid={`faq-cat-${cat.id.replace(/\s+/g, '-').toLowerCase()}`}
            style={{ padding: '8px 16px', borderRadius: 'var(--r-full)', border: '1.5px solid', borderColor: activeCategory === cat.id ? 'var(--fire)' : 'var(--border)', background: activeCategory === cat.id ? 'var(--fire)' : 'var(--bg-card)', color: activeCategory === cat.id ? '#fff' : 'var(--text-2)', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
            {cat.label}
          </button>
        ))}
      </div>

      {/* FAQ Accordion */}
      {filteredFaqs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-3)' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🤔</div>
          <h3 style={{ color: 'var(--text-1)', marginBottom: 8 }}>No results found</h3>
          <p>Try different keywords or browse all topics</p>
        </div>
      ) : (
        filteredFaqs.map(cat => (
          <div key={cat.category} style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-1)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>{cat.icon}</span>{cat.category}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {cat.questions.map((item, idx) => {
                const key = `${cat.category}-${idx}`;
                const isOpen = openItems[key];
                return (
                  <div key={key} data-testid={`faq-item-${key.replace(/\s+/g, '-').toLowerCase()}`}
                    style={{ background: 'var(--bg-card)', border: `1.5px solid ${isOpen ? 'var(--fire)' : 'var(--border)'}`, borderRadius: 'var(--r-lg)', overflow: 'hidden', transition: 'border-color 0.2s' }}>
                    <button onClick={() => toggle(key)}
                      data-testid={`faq-toggle-${key.replace(/\s+/g, '-').toLowerCase()}`}
                      style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 20px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', gap: 16 }}>
                      <span style={{ fontWeight: 600, fontSize: 15, color: 'var(--text-1)', lineHeight: 1.4 }}>{item.q}</span>
                      <span style={{ fontSize: 20, color: 'var(--fire)', flexShrink: 0, transition: 'transform 0.3s', transform: isOpen ? 'rotate(45deg)' : 'rotate(0)' }}>+</span>
                    </button>
                    {isOpen && (
                      <div data-testid={`faq-answer-${key.replace(/\s+/g, '-').toLowerCase()}`}
                        style={{ padding: '0 20px 18px', fontSize: 14, color: 'var(--text-2)', lineHeight: 1.7, borderTop: '1px solid var(--border)' }}>
                        <p style={{ margin: '14px 0 0' }}>{item.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}

      {/* Contact support */}
      <div style={{ marginTop: 48, background: 'linear-gradient(135deg, var(--fire), var(--fire-dark))', borderRadius: 'var(--r-xl)', padding: '40px 32px', textAlign: 'center' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: '#fff', marginBottom: 8 }}>Still need help?</h3>
        <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 24 }}>Our support team is available Mon–Sat, 9am–6pm</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="mailto:support@scelta.in"
            style={{ padding: '12px 24px', background: '#fff', color: 'var(--fire)', borderRadius: 'var(--r-full)', fontWeight: 700, fontSize: 14 }}>
            📧 Email Support
          </a>
          <a href="tel:18001234567"
            style={{ padding: '12px 24px', background: 'rgba(255,255,255,0.2)', color: '#fff', borderRadius: 'var(--r-full)', fontWeight: 700, fontSize: 14, border: '1.5px solid rgba(255,255,255,0.4)' }}>
            📞 1800-123-4567
          </a>
        </div>
      </div>
    </main>
  );
}
