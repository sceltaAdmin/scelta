const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name:     String,
  image:    String,
  price:    Number,
  quantity: Number
});

const orderSchema = new mongoose.Schema({
  user:          { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderNumber:   { type: String, unique: true },
  items:         [orderItemSchema],
  subtotal:      Number,
  discount:      { type: Number, default: 0 },
  deliveryFee:   { type: Number, default: 0 },
  total:         Number,
  status:        { type: String, enum: ['pending','confirmed','processing','shipped','delivered','cancelled'], default: 'pending' },
  paymentMethod: { type: String, default: 'COD' },
  paymentStatus: { type: String, enum: ['pending','paid','failed'], default: 'pending' },
  shippingAddress: {
    name:    String,
    phone:   String,
    street:  String,
    city:    String,
    state:   String,
    pincode: String,
    country: { type: String, default: 'India' }
  },
  coupon:   { type: String, default: '' },
  notes:    { type: String, default: '' }
}, { timestamps: true });

orderSchema.pre('save', async function() {
  if (!this.orderNumber) {
    this.orderNumber = 'SCL' + Date.now().toString().slice(-8) + Math.floor(Math.random() * 1000);
  }
});

module.exports = mongoose.model('Order', orderSchema);
