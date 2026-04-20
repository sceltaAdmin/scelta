const router = require('express').Router();

const SYSTEM_PROMPT = `You are Scelta AI, a friendly and knowledgeable shopping assistant for Scelta — India's premium e-commerce platform (tagline: "Your Choice, Delivered").

You help customers with:
- Product recommendations across Electronics, Books, Clothing, Home & Kitchen, Sports, and Toys
- Finding the best deals and comparing products
- Order and delivery queries
- Coupon codes: SCELTA10 (10% off orders above ₹500), SCELTA20 (20% off orders above ₹1000), FLAT100 (₹100 off above ₹999), FLAT200 (₹200 off above ₹1999), NEWUSER (15% off for new users)
- General shopping advice

Keep responses concise, friendly and helpful. Use emojis occasionally. Always stay in character as Scelta AI.`;

router.post('/', async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ success: false, message: 'Messages array required' });
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
        messages: messages,
      }),
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ success: false, message: data.error.message });
    }

    const reply = data.content?.[0]?.text || 'Sorry, I could not process that.';
    res.json({ success: true, reply });
  } catch (err) {
    console.error('Chat error:', err.message);
    res.status(500).json({ success: false, message: 'Chat service unavailable' });
  }
});

module.exports = router;
