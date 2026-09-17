const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  price: {
    type: Number,
    required: true
  }
});

const CartSchema = new mongoose.Schema(
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
    items: [CartItemSchema],
    total: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

// Calculate total before saving (Mongoose 7+ does not pass next to sync middleware)
CartSchema.pre('save', function () {
  this.total = this.items.reduce((sum, item) => {
    return sum + ((item.price || 0) * (item.quantity || 0));
  }, 0);
});

// Index for faster queries
CartSchema.index({ user: 1 });
CartSchema.index({ 'items.product': 1 });

module.exports = mongoose.model('Cart', CartSchema);