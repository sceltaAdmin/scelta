const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code:        { type: String, required: true, unique: true, uppercase: true },
  discount:    { type: Number, required: true },
  type:        { type: String, enum: ['percent', 'flat'], default: 'percent' },
  minOrder:    { type: Number, default: 0 },
  maxDiscount: { type: Number, default: null },
  active:      { type: Boolean, default: true },
  expiresAt:   { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Coupon', couponSchema);
