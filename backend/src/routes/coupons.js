const router = require('express').Router();
const auth = require('../middleware/auth');
const Coupon = require('../models/Coupon');

router.get('/validate', auth, async (req, res) => {
  try {
    const { code, total = 0 } = req.query;
    if (!code) return res.status(400).json({ success: false, message: 'Coupon code required' });
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), active: true });
    if (!coupon) return res.status(404).json({ success: false, message: 'Invalid coupon code' });
    if (coupon.expiresAt && coupon.expiresAt < new Date())
      return res.status(400).json({ success: false, message: 'Coupon has expired' });
    if (Number(total) < coupon.minOrder)
      return res.status(400).json({ success: false, message: `Minimum order required: ${coupon.minOrder}` });
    let discount = coupon.type === 'percent' ? (Number(total) * coupon.discount) / 100 : coupon.discount;
    if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
    res.json({ success: true, coupon: { code: coupon.code, type: coupon.type, discount: coupon.discount, calculatedDiscount: Math.round(discount) } });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
