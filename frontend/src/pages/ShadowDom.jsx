import { useEffect, useRef, useState } from 'react';

function ShadowWidget({ title, testid, children, accentColor = '#FF5722' }) {
  const hostRef = useRef();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!hostRef.current || hostRef.current.shadowRoot) return;
    const shadow = hostRef.current.attachShadow({ mode: 'open' });
    shadow.innerHTML = `
      <style>
        :host { display: block; }
        .shadow-container {
          font-family: 'DM Sans', system-ui, sans-serif;
          background: #ffffff;
          border: 2px solid ${accentColor};
          border-radius: 12px;
          padding: 20px;
          color: #0A0F1E;
        }
        .shadow-title {
          font-size: 14px;
          font-weight: 700;
          color: ${accentColor};
          margin-bottom: 12px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .shadow-content { font-size: 14px; line-height: 1.6; }
        .shadow-btn {
          margin-top: 12px;
          padding: 8px 18px;
          background: ${accentColor};
          color: #fff;
          border: none;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
        }
        .shadow-input {
          width: 100%;
          padding: 8px 12px;
          border: 1.5px solid #E2E8F0;
          border-radius: 8px;
          font-size: 14px;
          margin-top: 8px;
          box-sizing: border-box;
          color: #0A0F1E;
        }
        .shadow-input:focus {
          outline: none;
          border-color: ${accentColor};
        }
        .badge {
          display: inline-block;
          padding: 2px 8px;
          background: ${accentColor}22;
          color: ${accentColor};
          border-radius: 999px;
          font-size: 11px;
          font-weight: 700;
          margin-bottom: 8px;
        }
      </style>
      <div class="shadow-container" data-testid="${testid}-shadow-root">
        <div class="badge">Shadow DOM</div>
        <div class="shadow-title">${title}</div>
        <div class="shadow-content" id="shadow-content-${testid}"></div>
      </div>
    `;
    setMounted(true);
  }, []);

  return <div ref={hostRef} data-testid={testid} style={{ marginBottom: 16 }} />;
}

export default function ShadowDomPage() {
  const searchHostRef   = useRef();
  const couponHostRef   = useRef();
  const ratingHostRef   = useRef();
  const [results, setResults] = useState('');

  useEffect(() => {
    setupSearchWidget();
    setupCouponWidget();
    setupRatingWidget();
  }, []);

  const setupSearchWidget = () => {
    if (!searchHostRef.current || searchHostRef.current.shadowRoot) return;
    const shadow = searchHostRef.current.attachShadow({ mode: 'open' });
    shadow.innerHTML = `
      <style>
        .container { font-family: system-ui; background: #fff; border: 2px solid #3B82F6; border-radius: 12px; padding: 20px; }
        .title { font-size: 13px; font-weight: 700; color: #3B82F6; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; }
        .badge { display: inline-block; padding: 2px 8px; background: #3B82F622; color: #3B82F6; border-radius: 999px; font-size: 11px; font-weight: 700; margin-bottom: 8px; }
        .search-wrap { display: flex; gap: 8px; }
        input { flex: 1; padding: 10px 14px; border: 1.5px solid #E2E8F0; border-radius: 999px; font-size: 14px; outline: none; }
        input:focus { border-color: #3B82F6; }
        button { padding: 10px 18px; background: #3B82F6; color: #fff; border: none; border-radius: 999px; cursor: pointer; font-weight: 600; font-size: 13px; }
        .result { margin-top: 12px; font-size: 13px; color: #4A5568; padding: 8px 12px; background: #EFF6FF; border-radius: 8px; display: none; }
      </style>
      <div class="container">
        <div class="badge">Shadow DOM</div>
        <div class="title">Product Search Widget</div>
        <div class="search-wrap">
          <input data-testid="shadow-search-input" id="shadow-search" placeholder="Search inside shadow DOM..." />
          <button data-testid="shadow-search-btn" id="shadow-btn">Search</button>
        </div>
        <div class="result" id="shadow-result" data-testid="shadow-search-result"></div>
      </div>
    `;
    const btn    = shadow.getElementById('shadow-btn');
    const input  = shadow.getElementById('shadow-search');
    const result = shadow.getElementById('shadow-result');
    btn.addEventListener('click', () => {
      if (input.value.trim()) {
        result.style.display = 'block';
        result.textContent = `Searching for "${input.value}" in Scelta catalogue...`;
      }
    });
  };

  const setupCouponWidget = () => {
    if (!couponHostRef.current || couponHostRef.current.shadowRoot) return;
    const shadow = couponHostRef.current.attachShadow({ mode: 'open' });
    shadow.innerHTML = `
      <style>
        .container { font-family: system-ui; background: #fff; border: 2px solid #10B981; border-radius: 12px; padding: 20px; }
        .title { font-size: 13px; font-weight: 700; color: #10B981; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; }
        .badge { display: inline-block; padding: 2px 8px; background: #10B98122; color: #10B981; border-radius: 999px; font-size: 11px; font-weight: 700; margin-bottom: 8px; }
        .wrap { display: flex; gap: 8px; }
        input { flex: 1; padding: 10px 14px; border: 1.5px solid #E2E8F0; border-radius: 999px; font-size: 14px; outline: none; text-transform: uppercase; letter-spacing: 2px; font-weight: 600; }
        input:focus { border-color: #10B981; }
        button { padding: 10px 18px; background: #10B981; color: #fff; border: none; border-radius: 999px; cursor: pointer; font-weight: 600; font-size: 13px; }
        .msg { margin-top: 12px; font-size: 13px; padding: 8px 12px; border-radius: 8px; display: none; }
        .msg.success { background: #D1FAE5; color: #065F46; }
        .msg.error { background: #FEE2E2; color: #991B1B; }
      </style>
      <div class="container">
        <div class="badge">Shadow DOM</div>
        <div class="title">Coupon Validator Widget</div>
        <div class="wrap">
          <input data-testid="shadow-coupon-input" id="shadow-coupon" placeholder="Enter coupon code" />
          <button data-testid="shadow-coupon-btn" id="shadow-coupon-btn">Apply</button>
        </div>
        <div class="msg" id="shadow-coupon-msg" data-testid="shadow-coupon-result"></div>
      </div>
    `;
    const VALID = ['SCELTA10', 'SCELTA20', 'FLAT100', 'FLAT200', 'NEWUSER'];
    const btn   = shadow.getElementById('shadow-coupon-btn');
    const input = shadow.getElementById('shadow-coupon');
    const msg   = shadow.getElementById('shadow-coupon-msg');
    btn.addEventListener('click', () => {
      const code = input.value.trim().toUpperCase();
      msg.style.display = 'block';
      if (VALID.includes(code)) {
        msg.className = 'msg success';
        msg.textContent = `Coupon ${code} applied successfully!`;
      } else {
        msg.className = 'msg error';
        msg.textContent = `Invalid coupon code. Try SCELTA10 or SCELTA20.`;
      }
    });
  };

  const setupRatingWidget = () => {
    if (!ratingHostRef.current || ratingHostRef.current.shadowRoot) return;
    const shadow = ratingHostRef.current.attachShadow({ mode: 'open' });
    shadow.innerHTML = `
      <style>
        .container { font-family: system-ui; background: #fff; border: 2px solid #F59E0B; border-radius: 12px; padding: 20px; }
        .title { font-size: 13px; font-weight: 700; color: #F59E0B; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; }
        .badge { display: inline-block; padding: 2px 8px; background: #F59E0B22; color: #F59E0B; border-radius: 999px; font-size: 11px; font-weight: 700; margin-bottom: 8px; }
        .stars { display: flex; gap: 8px; margin-bottom: 12px; }
        .star { font-size: 32px; cursor: pointer; transition: transform 0.1s; filter: grayscale(1); }
        .star:hover, .star.active { filter: grayscale(0); transform: scale(1.2); }
        .msg { font-size: 13px; color: #4A5568; margin-top: 4px; min-height: 20px; }
        button { margin-top: 10px; padding: 8px 18px; background: #F59E0B; color: #fff; border: none; border-radius: 999px; cursor: pointer; font-weight: 600; font-size: 13px; }
      </style>
      <div class="container">
        <div class="badge">Shadow DOM</div>
        <div class="title">Product Rating Widget</div>
        <div class="stars" id="stars">
          ${[1,2,3,4,5].map(i => `<span class="star" data-testid="shadow-star-${i}" data-val="${i}">⭐</span>`).join('')}
        </div>
        <div class="msg" id="rating-msg" data-testid="shadow-rating-msg">Click a star to rate</div>
        <button data-testid="shadow-submit-rating" id="submit-rating">Submit Rating</button>
      </div>
    `;
    let selected = 0;
    const stars  = shadow.querySelectorAll('.star');
    const msg    = shadow.getElementById('rating-msg');
    const btn    = shadow.getElementById('submit-rating');
    stars.forEach(star => {
      star.addEventListener('click', () => {
        selected = parseInt(star.dataset.val);
        stars.forEach((s, i) => s.classList.toggle('active', i < selected));
        msg.textContent = `You selected ${selected} star${selected > 1 ? 's' : ''}`;
      });
    });
    btn.addEventListener('click', () => {
      if (selected) msg.textContent = `Rating of ${selected} stars submitted! Thank you.`;
      else msg.textContent = 'Please select a rating first.';
    });
  };

  return (
    <main data-testid="shadow-dom-page" style={{ maxWidth: 900, margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, color: 'var(--text-1)', marginBottom: 8 }}>Shadow DOM</h1>
      <p style={{ color: 'var(--text-3)', marginBottom: 12 }}>Components encapsulated in Shadow DOM — for Selenium shadow root testing</p>
      <div style={{ padding: '10px 16px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', fontSize: 13, color: 'var(--text-2)', marginBottom: 32 }}>
        <strong style={{ color: 'var(--text-1)' }}>Selenium tip:</strong> Use{' '}
        <code style={{ background: 'var(--bg-card-2)', padding: '2px 8px', borderRadius: 4, fontSize: 12, color: 'var(--fire)' }}>
          SearchContext shadowRoot = (SearchContext) ((JavascriptExecutor) driver).executeScript("return arguments[0].shadowRoot", hostElement);
        </code>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        <div data-testid="shadow-search-host" ref={searchHostRef} />
        <div data-testid="shadow-coupon-host" ref={couponHostRef} />
      </div>
      <div data-testid="shadow-rating-host" ref={ratingHostRef} style={{ maxWidth: 440 }} />
    </main>
  );
}
