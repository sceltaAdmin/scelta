const router = require('express').Router();
const auth = require('../middleware/auth');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

router.get('/', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart) return res.json({ success: true, cart: { items: [], subtotal: 0, discount: 0, total: 0 } });
    const subtotal = cart.items.reduce((s, i) => s + i.price * i.quantity, 0);
    res.json({ success: true, cart: { ...cart.toObject(), subtotal, total: subtotal - cart.discount } });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.post('/', auth, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = new Cart({ user: req.user._id, items: [] });
    const existing = cart.items.find(i => i.product.toString() === productId);
    if (existing) { existing.quantity += quantity; } else { cart.items.push({ product: productId, quantity, price: product.price }); }
    await cart.save();
    await cart.populate('items.product');
    const subtotal = cart.items.reduce((s, i) => s + i.price * i.quantity, 0);
    res.json({ success: true, message: 'Added to cart', cart: { ...cart.toObject(), subtotal, total: subtotal - cart.discount } });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.patch('/:itemId', auth, async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });
    const item = cart.items.id(req.params.itemId);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    if (quantity <= 0) { item.deleteOne(); } else { item.quantity = quantity; }
    await cart.save();
    await cart.populate('items.product');
    const subtotal = cart.items.reduce((s, i) => s + i.price * i.quantity, 0);
    res.json({ success: true, cart: { ...cart.toObject(), subtotal, total: subtotal - cart.discount } });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.delete('/:itemId', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) { cart.items = cart.items.filter(i => i._id.toString() !== req.params.itemId); await cart.save(); }
    res.json({ success: true, message: 'Item removed' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
