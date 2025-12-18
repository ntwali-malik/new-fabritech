const express = require('express');
const dpoService = require('../services/dpoService');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const User = require('../models/User');
const Product = require('../models/Product');
const emailService = require('../services/emailService');
const router = express.Router();

// Initialize DPO payment for an order
router.post('/:userId/initiate', async (req, res) => {
  try {
    const { shippingAddress, phone, currency = 'USD' } = req.body;

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
    const stockIssues = [];
    
    for (const cartItem of cart.items) {
      const product = cartItem.product;
      
      if (!product) {
        stockIssues.push({
          productId: 'unknown',
          title: 'Product not found',
          issue: 'Product has been removed from catalog',
          type: 'not_found'
        });
        continue;
      }

      if (product.stock === 0) {
        stockIssues.push({
          productId: product.id,
          title: product.title,
          requestedQuantity: cartItem.quantity,
          availableStock: 0,
          issue: 'Product is out of stock',
          type: 'out_of_stock'
        });
        continue;
      }
      
      if (product.stock < cartItem.quantity) {
        stockIssues.push({
          productId: product.id,
          title: product.title,
          requestedQuantity: cartItem.quantity,
          availableStock: product.stock,
          issue: `Only ${product.stock} available, but ${cartItem.quantity} requested`,
          type: 'insufficient_stock'
        });
        continue;
      }

      orderItems.push({
        product: product._id,
        title: product.title,
        quantity: cartItem.quantity,
        price: cartItem.price
      });
    }

    // If there are stock issues, return error with details
    if (stockIssues.length > 0) {
      return res.status(400).json({ 
        error: 'Cannot proceed with payment due to stock issues',
        stockIssues: stockIssues,
        message: 'Please review your cart and remove or adjust quantities for items with stock issues'
      });
    }

    // Ensure we have items to order
    if (orderItems.length === 0) {
      return res.status(400).json({ 
        error: 'No valid items in cart to process payment' 
      });
    }

    // Create order with pending payment status
    const order = await Order.create({
      user: user._id,
      items: orderItems,
      total: cart.total,
      shippingAddress,
      phone,
      paymentStatus: 'pending'
    });

    // Prepare customer name
    const nameParts = user.name.split(' ');
    const firstName = nameParts[0] || user.name;
    const lastName = nameParts.slice(1).join(' ') || user.name;

    // Create DPO payment token
    const baseURL = process.env.FRONTEND_URL || 'http://localhost:3000';
    const paymentData = {
      orderId: order.id,
      amount: cart.total,
      currency: currency,
      customerEmail: user.email,
      customerFirstName: firstName,
      customerLastName: lastName,
      customerPhone: phone,
      redirectURL: `${baseURL}/payment/success?orderId=${order.id}`,
      backURL: `${baseURL}/payment/cancel?orderId=${order.id}`
    };

    const dpoResponse = await dpoService.createPaymentToken(paymentData);

    if (!dpoResponse.success) {
      // Delete the order if payment token creation fails
      await Order.findByIdAndDelete(order._id);
      return res.status(400).json({ 
        error: 'Failed to initialize payment', 
        details: dpoResponse.error 
      });
    }

    // Update order with DPO transaction token
    order.dpoTransactionId = dpoResponse.transactionToken;
    await order.save();

    res.json({
      message: 'Payment initialized successfully',
      order: {
        id: order.id,
        total: order.total,
        status: order.status,
        paymentStatus: order.paymentStatus
      },
      payment: {
        token: dpoResponse.token,
        paymentURL: dpoResponse.paymentURL,
        transactionToken: dpoResponse.transactionToken
      }
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DPO callback/webhook handler
router.post('/callback', async (req, res) => {
  try {
    const { TransactionToken, CompanyRef } = req.body;

    if (!TransactionToken) {
      return res.status(400).json({ error: 'Transaction token is required' });
    }

    // Verify payment with DPO
    const verification = await dpoService.verifyPayment(TransactionToken);

    if (!verification.success || !verification.verified) {
      return res.status(400).json({ 
        error: 'Payment verification failed', 
        details: verification.error 
      });
    }

    // Find order by ID
    const order = await Order.findOne({ id: CompanyRef || verification.orderId });
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check if payment amount matches
    if (verification.amount !== order.total) {
      return res.status(400).json({ error: 'Payment amount mismatch' });
    }

    // Update order payment status
    if (verification.status === '3' || verification.status === 'Paid') {
      // Payment successful
      order.paymentStatus = 'paid';
      order.dpoTransactionId = TransactionToken;
      
      // Update product stock only if not already done
      if (order.status === 'pending') {
        for (const orderItem of order.items) {
          const product = await Product.findById(orderItem.product);
          if (product) {
            product.stock -= orderItem.quantity;
            await product.save();
          }
        }
        order.status = 'processing';
      }

      await order.save();

      // Clear user's cart
      const cart = await Cart.findOne({ user: order.user });
      if (cart) {
        cart.items = [];
        await cart.save();
      }

      // Populate order for email
      await order.populate('items.product');
      await order.populate('user', 'name email');

      // Send emails (don't block response if email fails)
      try {
        await emailService.sendOrderEmails({ order, user: order.user });
      } catch (emailError) {
        console.error('Failed to send order emails:', emailError);
        // Continue even if email fails - payment is still verified successfully
      }

      res.json({ 
        message: 'Payment verified successfully', 
        order: {
          id: order.id,
          paymentStatus: order.paymentStatus,
          status: order.status
        }
      });
    } else {
      // Payment failed or pending
      order.paymentStatus = verification.status === 'Failed' ? 'failed' : 'pending';
      await order.save();

      res.json({ 
        message: 'Payment status updated', 
        order: {
          id: order.id,
          paymentStatus: order.paymentStatus
        }
      });
    }
  } catch (err) {
    console.error('DPO Callback Error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Verify payment status
router.get('/verify/:transactionToken', async (req, res) => {
  try {
    const { transactionToken } = req.params;

    const verification = await dpoService.verifyPayment(transactionToken);

    if (!verification.success) {
      return res.status(400).json({ 
        error: 'Payment verification failed', 
        details: verification.error 
      });
    }

    // Find order
    const order = await Order.findOne({ 
      $or: [
        { id: verification.orderId },
        { dpoTransactionId: transactionToken }
      ]
    }).populate('user', 'name email').populate('items.product');

    res.json({
      verified: verification.verified,
      paymentStatus: verification.status,
      order: order || null,
      verification: verification
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Check payment status
router.get('/status/:orderId', async (req, res) => {
  try {
    const order = await Order.findOne({ id: req.params.orderId })
      .populate('user', 'name email')
      .populate('items.product');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.dpoTransactionId) {
      const status = await dpoService.getPaymentStatus(order.dpoTransactionId);
      res.json({
        order: order,
        paymentStatus: status
      });
    } else {
      res.json({
        order: order,
        paymentStatus: {
          success: false,
          message: 'No DPO transaction ID found'
        }
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

