const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  title: { type: String, required: true },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true
  }
});

const OrderSchema = new mongoose.Schema(
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
      required: true
    },
    items: [OrderItemSchema],
    subtotal: {
      type: Number,
      default: 0
    },
    tax: {
      type: Number,
      default: 0
    },
    shippingFee: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending'
    },
    shippingAddress: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    customerName: {
      type: String,
      default: ''
    },
    customerEmail: {
      type: String,
      default: ''
    },
    deliveryMethod: {
      type: String,
      enum: ['delivery', 'store'],
      default: 'delivery'
    },
    notes: {
      type: String,
      default: ''
    },
    paymentMethod: {
      type: String,
      default: 'Mobile Money'
    },
    momoProvider: {
      type: String,
      default: ''
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending'
    },
    dpoTransactionId: {
      type: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', OrderSchema);
