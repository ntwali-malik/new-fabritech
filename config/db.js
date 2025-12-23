const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Check if already connected
    if (mongoose.connection.readyState === 1) {
      console.log('MongoDB already connected');
      return;
    }
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected Successfully');
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    // Don't exit process in serverless environment - throw error instead
    throw error;
  }
};

module.exports = connectDB;
