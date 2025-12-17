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

// Calculate total before saving - Use synchronous function with next callback
CartSchema.pre('save', function(next) {
  try {
    // Calculate total from items
    this.total = this.items.reduce((sum, item) => {
      const itemTotal = (item.price || 0) * (item.quantity || 0);
      return sum + itemTotal;
    }, 0);
    
    // Call next to continue the save operation
    next();
  } catch (error) {
    // Pass error to next to abort the save operation
    next(error);
  }
});

// Alternative: Use pre('save') without async if you don't need async operations
// CartSchema.pre('save', function(next) {
//   try {
//     this.total = this.items.reduce((sum, item) => {
//       return sum + ((item.price || 0) * (item.quantity || 0));
//     }, 0);
//     next();
//   } catch (error) {
//     next(error);
//   }
// });

// Index for faster queries
CartSchema.index({ user: 1 });
CartSchema.index({ 'items.product': 1 });

module.exports = mongoose.model('Cart', CartSchema);