const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    id: { 
      type: String, 
      required: true, 
      unique: true,
      default: () => new mongoose.Types.ObjectId().toString()
    },
    title: { type: String, required: true },
    badge: { type: String },
    image: { type: String },
    priceNew: { type: Number, required: true },
    priceOld: { type: Number },
    discount: { type: Number },
    rating: { type: Number, default: 0 },
    sold: { type: String },
    description: { type: String },
    category: { type: String, required: true },
    stock: { type: Number, default: 0 },
    lowStockThreshold: { type: Number, default: 10 } // Alert when stock is below this
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for stock status
ProductSchema.virtual('isInStock').get(function() {
  return this.stock > 0;
});

ProductSchema.virtual('isOutOfStock').get(function() {
  return this.stock === 0;
});

ProductSchema.virtual('isLowStock').get(function() {
  return this.stock > 0 && this.stock <= this.lowStockThreshold;
});

ProductSchema.virtual('stockStatus').get(function() {
  if (this.stock === 0) {
    return 'out_of_stock';
  } else if (this.stock <= this.lowStockThreshold) {
    return 'low_stock';
  } else {
    return 'in_stock';
  }
});

module.exports = mongoose.model('Product', ProductSchema);
