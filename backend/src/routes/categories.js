const router = require('express').Router();
const Product = require('../models/Product');

router.get('/', async (req, res) => {
  try {
    const categories = [
      { id: 'electronics',  name: 'Electronics',   icon: '📱', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400' },
      { id: 'books',        name: 'Books',          icon: '📚', image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400' },
      { id: 'clothing',     name: 'Clothing',       icon: '👕', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400' },
      { id: 'home-kitchen', name: 'Home & Kitchen', icon: '🏠', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400' },
      { id: 'sports',       name: 'Sports',         icon: '⚽', image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400' },
      { id: 'toys',         name: 'Toys',           icon: '🧸', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400' }
    ];
    const counts = await Product.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]);
    const countMap = Object.fromEntries(counts.map(c => [c._id, c.count]));
    res.json({ success: true, categories: categories.map(cat => ({ ...cat, productCount: countMap[cat.id] || 0 })) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
