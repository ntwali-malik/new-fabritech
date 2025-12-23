const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();
app.use(cors()); // Enable CORS for all routes and origins
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For DPO callback form data

const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const contactRoutes = require('./routes/contactRoutes');

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/contact', contactRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Fabritech Backend API is running' });
});

// Connect to database (only connect once, reuse connection)
const mongoose = require('mongoose');
const connectToDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return; // Already connected
  }
  try {
    await connectDB();
  } catch (error) {
    console.error('Database connection error:', error);
    // Don't throw - let the request continue (might be a health check)
  }
};

// Connect to DB on first request
app.use(async (req, res, next) => {
  await connectToDB();
  next();
});

// For Vercel serverless functions, export the app
module.exports = app;

// For local development, listen on port 5000
if (require.main === module) {
  connectDB();
  app.listen(5000, () => console.log('Server running on port 5000'));
}
