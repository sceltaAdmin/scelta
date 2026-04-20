const router = require('express').Router();
const auth = require('../middleware/auth');
const Order = require('../models/Order');
const Cart = require('../models/Cart');

router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.post('/', auth, async (req, res) => {
  try {
    const { shippingAddress, paymentMethod = 'COD', coupon = '', notes = '' } = req.body;
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart || cart.items.length === 0)
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    const subtotal = cart.items.reduce((s, i) => s + i.price * i.quantity, 0);
    const deliveryFee = subtotal >= 499 ? 0 : 49;
    const total = subtotal + deliveryFee - (cart.discount || 0);
    const order = await Order.create({
      user: req.user._id,
      items: cart.items.map(i => ({ product: i.product._id, name: i.product.name, image: i.product.image, price: i.price, quantity: i.quantity })),
      subtotal, discount: cart.discount || 0, deliveryFee, total,
      shippingAddress, paymentMethod, coupon, notes
    });
    await Cart.findOneAndDelete({ user: req.user._id });
    res.status(201).json({ success: true, order });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.patch('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    if (!['pending', 'confirmed'].includes(order.status))
      return res.status(400).json({ success: false, message: 'Order cannot be cancelled at this stage' });
    order.status = 'cancelled';
    await order.save();
    res.json({ success: true, order });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
