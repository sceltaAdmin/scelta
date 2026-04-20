const router = require('express').Router();
const Product = require('../models/Product');

router.get('/', async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, sort, page = 1, limit = 12, featured } = req.query;
    const query = {};
    if (search) query.$text = { $search: search };
    if (category && category !== 'all') query.category = category;
    if (minPrice || maxPrice) query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
    if (featured === 'true') query.featured = true;

    const sortMap = { price_asc: { price: 1 }, price_desc: { price: -1 }, rating: { rating: -1 }, newest: { createdAt: -1 }, popular: { reviewCount: -1 } };
    const sortObj = sortMap[sort] || { createdAt: -1 };
    const skip = (Number(page) - 1) * Number(limit);

    const [products, total] = await Promise.all([
      Product.find(query).sort(sortObj).skip(skip).limit(Number(limit)),
      Product.countDocuments(query)
    ]);
    res.json({ success: true, products, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
