const express = require('express');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const User = require('../models/User');
const router = express.Router();

// Create order from cart
router.post('/:userId/create', async (req, res) => {
  try {
    const { shippingAddress, phone, dpoTransactionId } = req.body;

    if (!shippingAddress || !phone) {
      return res.status(400).json({ error: 'Shipping address and phone are required' });
    }

    // Find user
    const user = await User.findOne({ id: req.params.userId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get user's cart
    const cart = await Cart.findOne({ user: user._id }).populate('items.product');
    
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Validate stock and prepare order items
    const orderItems = [];
    for (const cartItem of cart.items) {
      const product = cartItem.product;
      
      if (product.stock < cartItem.quantity) {
        return res.status(400).json({ 
          error: `Insufficient stock for ${product.title}. Available: ${product.stock}` 
        });
      }

      orderItems.push({
        product: product._id,
        title: product.title,
        quantity: cartItem.quantity,
        price: cartItem.price
      });
    }

    // Create order
    const order = await Order.create({
      user: user._id,
      items: orderItems,
      total: cart.total,
      shippingAddress,
      phone,
      dpoTransactionId: dpoTransactionId || null,
      paymentStatus: dpoTransactionId ? 'paid' : 'pending'
    });

    // Update product stock
    for (const cartItem of cart.items) {
      const product = cartItem.product;
      product.stock -= cartItem.quantity;
      await product.save();
    }

    // Clear cart
    cart.items = [];
    await cart.save();

    await order.populate('items.product');
    await order.populate('user', 'name email');
    
    res.status(201).json({ message: 'Order created successfully', order });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all orders (for admin)
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('items.product')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user's orders
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findOne({ id: req.params.userId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const orders = await Order.find({ user: user._id })
      .populate('items.product')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single order by id
router.get('/order/:orderId', async (req, res) => {
  try {
    const order = await Order.findOne({ id: req.params.orderId })
      .populate('user', 'name email')
      .populate('items.product');
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update order status
router.put('/:orderId/status', async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const order = await Order.findOneAndUpdate(
      { id: req.params.orderId },
      { status },
      { new: true, runValidators: true }
    ).populate('items.product').populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ message: 'Order status updated successfully', order });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update payment status
router.put('/:orderId/payment', async (req, res) => {
  try {
    const { paymentStatus, dpoTransactionId } = req.body;

    if (!paymentStatus) {
      return res.status(400).json({ error: 'Payment status is required' });
    }

    const validStatuses = ['pending', 'paid', 'failed'];
    if (!validStatuses.includes(paymentStatus)) {
      return res.status(400).json({ error: 'Invalid payment status' });
    }

    const updateData = { paymentStatus };
    if (dpoTransactionId) {
      updateData.dpoTransactionId = dpoTransactionId;
    }

    const order = await Order.findOneAndUpdate(
      { id: req.params.orderId },
      updateData,
      { new: true, runValidators: true }
    ).populate('items.product').populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ message: 'Payment status updated successfully', order });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;

