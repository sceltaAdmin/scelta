const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price:       { type: Number, required: true },
  originalPrice: { type: Number },
  discount:    { type: Number, default: 0 },
  category:    { type: String, required: true },
  brand:       { type: String, default: '' },
  image:       { type: String, required: true },
  images:      [String],
  stock:       { type: Number, default: 100 },
  rating:      { type: Number, default: 4.0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },
  tags:        [String],
  featured:    { type: Boolean, default: false },
  badge:       { type: String, default: '' },
  specs:       { type: Map, of: String }
}, { timestamps: true });

productSchema.index({ name: 'text', description: 'text', brand: 'text', tags: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ rating: -1 });

module.exports = mongoose.model('Product', productSchema);
