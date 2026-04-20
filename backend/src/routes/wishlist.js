const router = require('express').Router();
const auth = require('../middleware/auth');
const Wishlist = require('../models/Wishlist');

router.get('/', auth, async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id }).populate('products');
    res.json({ success: true, wishlist: wishlist?.products || [] });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.post('/', auth, async (req, res) => {
  try {
    const { productId } = req.body;
    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) wishlist = new Wishlist({ user: req.user._id, products: [] });
    const idx = wishlist.products.indexOf(productId);
    let action;
    if (idx > -1) { wishlist.products.splice(idx, 1); action = 'removed'; }
    else { wishlist.products.push(productId); action = 'added'; }
    await wishlist.save();
    res.json({ success: true, action, message: `Product ${action} ${action === 'added' ? 'to' : 'from'} wishlist` });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.delete('/:productId', auth, async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id });
    if (wishlist) { wishlist.products = wishlist.products.filter(p => p.toString() !== req.params.productId); await wishlist.save(); }
    res.json({ success: true, message: 'Removed from wishlist' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
