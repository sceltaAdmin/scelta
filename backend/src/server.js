require('dotenv').config();
const app = require('./app');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 4000;
const MONGO = process.env.MONGODB_URI;

console.log('PORT:', PORT);
console.log('MONGO defined:', !!MONGO);
console.log('NODE_ENV:', process.env.NODE_ENV);

if (!MONGO) {
  console.error('❌ MONGODB_URI is not defined. Check environment variables.');
  process.exit(1);
}

mongoose.connect(MONGO)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
