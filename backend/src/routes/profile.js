const router = require('express').Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

router.get('/', auth, async (req, res) => {
  res.json({ success: true, user: req.user });
});

router.put('/', auth, async (req, res) => {
  try {
    const { name, phone, avatar, address } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { name, phone, avatar, address }, { new: true, runValidators: true }).select('-password');
    res.json({ success: true, user });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
