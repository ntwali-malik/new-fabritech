const express = require('express');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const User = require('../models/User');
const router = express.Router();

// Get user's cart
router.get('/:userId', async (req, res) => {
  try {
    const { autoRemoveOutOfStock = 'false' } = req.query;
    const user = await User.findOne({ id: req.params.userId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let cart = await Cart.findOne({ user: user._id }).populate('items.product');
    
    if (!cart) {
      // Create empty cart if it doesn't exist
      // Total will be calculated automatically by the pre-save hook
      cart = await Cart.create({
        user: user._id,
        items: []
      });
    }

    // Check stock availability for all items
    const stockWarnings = [];
    const outOfStockItems = [];
    const updatedItems = [];

    for (const item of cart.items) {
      const product = item.product;
      if (!product) {
        // Product was deleted, remove from cart
        continue;
      }

      if (product.stock === 0) {
        outOfStockItems.push({
          productId: product.id,
          title: product.title,
          requestedQuantity: item.quantity,
          availableStock: 0
        });
        
        if (autoRemoveOutOfStock === 'true') {
          // Skip adding to updatedItems (remove from cart)
          continue;
        }
      } else if (product.stock < item.quantity) {
        stockWarnings.push({
          productId: product.id,
          title: product.title,
          requestedQuantity: item.quantity,
          availableStock: product.stock,
          message: `Only ${product.stock} available in stock`
        });
        
        // Adjust quantity to available stock if auto-remove is enabled
        if (autoRemoveOutOfStock === 'true') {
          item.quantity = product.stock;
        }
      }
      
      updatedItems.push(item);
    }

    // Update cart if items were removed or adjusted
    if (autoRemoveOutOfStock === 'true' && (outOfStockItems.length > 0 || stockWarnings.length > 0)) {
      cart.items = updatedItems;
      await cart.save();
    }

    await cart.populate('items.product');
    
    res.json({
      cart: cart,
      stockWarnings: stockWarnings,
      outOfStockItems: outOfStockItems,
      hasStockIssues: stockWarnings.length > 0 || outOfStockItems.length > 0
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add item to cart
router.post('/:userId/add', async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    // Find the product
    const product = await Product.findOne({ id: productId });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if product is out of stock
    if (product.stock === 0) {
      return res.status(400).json({ 
        error: 'Product is out of stock',
        product: {
          id: product.id,
          title: product.title,
          stock: 0,
          stockStatus: 'out_of_stock'
        }
      });
    }

    // Check stock availability
    if (product.stock < quantity) {
      return res.status(400).json({ 
        error: 'Insufficient stock available',
        product: {
          id: product.id,
          title: product.title,
          requestedQuantity: quantity,
          availableStock: product.stock,
          stockStatus: product.stockStatus
        }
      });
    }

    // Find user
    const user = await User.findOne({ id: req.params.userId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Find or create cart
    let cart = await Cart.findOne({ user: user._id });
    
    if (!cart) {
      // Total will be calculated automatically by the pre-save hook
      cart = await Cart.create({
        user: user._id,
        items: []
      });
    }

    // Check if product already in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.product.toString() === product._id.toString()
    );

    if (existingItemIndex > -1) {
      // Update quantity
      const newQuantity = cart.items[existingItemIndex].quantity + quantity;
      if (product.stock < newQuantity) {
        return res.status(400).json({ 
          error: 'Insufficient stock available',
          product: {
            id: product.id,
            title: product.title,
            requestedQuantity: newQuantity,
            availableStock: product.stock,
            currentCartQuantity: cart.items[existingItemIndex].quantity,
            stockStatus: product.stockStatus
          }
        });
      }
      cart.items[existingItemIndex].quantity = newQuantity;
    } else {
      // Add new item
      cart.items.push({
        product: product._id,
        quantity: quantity,
        price: product.priceNew
      });
    }

    await cart.save();
    await cart.populate('items.product');
    
    res.json(cart);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update item quantity in cart
router.put('/:userId/update', async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || quantity === undefined) {
      return res.status(400).json({ error: 'Product ID and quantity are required' });
    }

    if (quantity < 1) {
      return res.status(400).json({ error: 'Quantity must be at least 1' });
    }

    const user = await User.findOne({ id: req.params.userId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const cart = await Cart.findOne({ user: user._id });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    // Find the product
    const product = await Product.findOne({ id: productId });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if product is out of stock
    if (product.stock === 0) {
      return res.status(400).json({ 
        error: 'Product is out of stock',
        product: {
          id: product.id,
          title: product.title,
          stock: 0,
          stockStatus: 'out_of_stock'
        }
      });
    }

    // Check stock availability
    if (product.stock < quantity) {
      return res.status(400).json({ 
        error: 'Insufficient stock available',
        product: {
          id: product.id,
          title: product.title,
          requestedQuantity: quantity,
          availableStock: product.stock,
          stockStatus: product.stockStatus
        }
      });
    }

    const itemIndex = cart.items.findIndex(
      item => item.product.toString() === product._id.toString()
    );

    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();
    await cart.populate('items.product');
    
    res.json(cart);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Remove item from cart
router.delete('/:userId/remove/:productId', async (req, res) => {
  try {
    const user = await User.findOne({ id: req.params.userId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const cart = await Cart.findOne({ user: user._id });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const product = await Product.findOne({ id: req.params.productId });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    cart.items = cart.items.filter(
      item => item.product.toString() !== product._id.toString()
    );

    await cart.save();
    await cart.populate('items.product');
    
    res.json(cart);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Clear cart
router.delete('/:userId/clear', async (req, res) => {
  try {
    const user = await User.findOne({ id: req.params.userId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const cart = await Cart.findOne({ user: user._id });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    cart.items = [];
    await cart.save();
    
    res.json({ message: 'Cart cleared successfully', cart });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Validate cart stock before checkout
router.get('/:userId/validate', async (req, res) => {
  try {
    const user = await User.findOne({ id: req.params.userId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const cart = await Cart.findOne({ user: user._id }).populate('items.product');
    
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ 
        valid: false,
        error: 'Cart is empty' 
      });
    }

    const stockIssues = [];
    const outOfStockItems = [];
    let isValid = true;

    for (const item of cart.items) {
      const product = item.product;
      
      if (!product) {
        stockIssues.push({
          productId: item.product?.id || 'unknown',
          title: 'Product not found',
          issue: 'Product has been removed',
          type: 'not_found'
        });
        isValid = false;
        continue;
      }

      if (product.stock === 0) {
        outOfStockItems.push({
          productId: product.id,
          title: product.title,
          requestedQuantity: item.quantity,
          availableStock: 0,
          type: 'out_of_stock'
        });
        isValid = false;
      } else if (product.stock < item.quantity) {
        stockIssues.push({
          productId: product.id,
          title: product.title,
          requestedQuantity: item.quantity,
          availableStock: product.stock,
          issue: `Only ${product.stock} available, but ${item.quantity} requested`,
          type: 'insufficient_stock'
        });
        isValid = false;
      }
    }

    res.json({
      valid: isValid,
      canProceedToCheckout: isValid,
      stockIssues: stockIssues,
      outOfStockItems: outOfStockItems,
      totalIssues: stockIssues.length + outOfStockItems.length,
      message: isValid 
        ? 'All items are in stock and ready for checkout' 
        : 'Some items have stock issues. Please review your cart.'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

