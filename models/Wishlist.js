const mongoose = require('mongoose');

const WishlistSchema = new mongoose.Schema(
  {
    id: { 
      type: String, 
      required: true, 
      unique: true,
      default: () => new mongoose.Types.ObjectId().toString()
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    products: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    }]
  },
  { timestamps: true }
);

// Index for faster queries
WishlistSchema.index({ user: 1 });

module.exports = mongoose.model('Wishlist', WishlistSchema);

