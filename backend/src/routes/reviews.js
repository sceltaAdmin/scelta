const router = require('express').Router();
const auth = require('../middleware/auth');
const Review = require('../models/Review');
const Product = require('../models/Product');

router.get('/', async (req, res) => {
  try {
    const { productId } = req.query;
    if (!productId) return res.status(400).json({ success: false, message: 'productId required' });
    const reviews = await Review.find({ product: productId }).populate('user', 'name avatar').sort({ createdAt: -1 });
    res.json({ success: true, reviews });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.post('/', auth, async (req, res) => {
  try {
    const { productId, rating, title, comment } = req.body;
    const existing = await Review.findOne({ product: productId, user: req.user._id });
    if (existing) return res.status(409).json({ success: false, message: 'You have already reviewed this product' });
    const review = await Review.create({ product: productId, user: req.user._id, rating, title, comment });
    const reviews = await Review.find({ product: productId });
    const avgRating = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
    await Product.findByIdAndUpdate(productId, { rating: Math.round(avgRating * 10) / 10, reviewCount: reviews.length });
    await review.populate('user', 'name avatar');
    res.status(201).json({ success: true, review });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
