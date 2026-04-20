require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');

const app = express();

app.use(helmet());
app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (
      origin.includes('vercel.app') ||
      origin.includes('localhost') ||
      origin.includes('onrender.com')
    ) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.get('/health', (req, res) => res.json({ status: 'ok', app: 'Scelta API', time: new Date() }));

app.use('/api/auth',       require('./routes/auth'));
app.use('/api/products',   require('./routes/products'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/cart',       require('./routes/cart'));
app.use('/api/wishlist',   require('./routes/wishlist'));
app.use('/api/orders',     require('./routes/orders'));
app.use('/api/reviews',    require('./routes/reviews'));
app.use('/api/coupons',    require('./routes/coupons'));
app.use('/api/profile',    require('./routes/profile'));

app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found' }));
app.use((err, req, res, next) => res.status(err.status || 500).json({ success: false, message: err.message || 'Internal server error' }));

module.exports = app;
