const express = require('express');
const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');
const User = require('../models/User');
const router = express.Router();

// Get user's wishlist
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findOne({ id: req.params.userId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let wishlist = await Wishlist.findOne({ user: user._id }).populate('products');
    
    if (!wishlist) {
      // Create empty wishlist if it doesn't exist
      wishlist = await Wishlist.create({
        user: user._id,
        products: []
      });
    }
    
    res.json({
      wishlist: wishlist,
      count: wishlist.products.length
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add product to wishlist
router.post('/:userId/add', async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    // Find user
    const user = await User.findOne({ id: req.params.userId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Find the product
    const product = await Product.findOne({ id: productId });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Find or create wishlist
    let wishlist = await Wishlist.findOne({ user: user._id });
    
    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: user._id,
        products: []
      });
    }

    // Check if product already in wishlist
    const isAlreadyInWishlist = wishlist.products.some(
      p => p.toString() === product._id.toString()
    );

    if (isAlreadyInWishlist) {
      return res.status(400).json({ 
        error: 'Product is already in wishlist',
        product: {
          id: product.id,
          title: product.title
        }
      });
    }

    // Add product to wishlist
    wishlist.products.push(product._id);
    await wishlist.save();
    await wishlist.populate('products');
    
    res.json({
      message: 'Product added to wishlist successfully',
      wishlist: wishlist,
      count: wishlist.products.length
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Remove product from wishlist
router.delete('/:userId/remove/:productId', async (req, res) => {
  try {
    const user = await User.findOne({ id: req.params.userId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const wishlist = await Wishlist.findOne({ user: user._id });
    if (!wishlist) {
      return res.status(404).json({ error: 'Wishlist not found' });
    }

    const product = await Product.findOne({ id: req.params.productId });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Remove product from wishlist
    wishlist.products = wishlist.products.filter(
      p => p.toString() !== product._id.toString()
    );

    await wishlist.save();
    await wishlist.populate('products');
    
    res.json({
      message: 'Product removed from wishlist successfully',
      wishlist: wishlist,
      count: wishlist.products.length
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Clear wishlist
router.delete('/:userId/clear', async (req, res) => {
  try {
    const user = await User.findOne({ id: req.params.userId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const wishlist = await Wishlist.findOne({ user: user._id });
    if (!wishlist) {
      return res.status(404).json({ error: 'Wishlist not found' });
    }

    wishlist.products = [];
    await wishlist.save();
    
    res.json({ 
      message: 'Wishlist cleared successfully', 
      wishlist: wishlist 
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Check if product is in wishlist
router.get('/:userId/check/:productId', async (req, res) => {
  try {
    const user = await User.findOne({ id: req.params.userId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const wishlist = await Wishlist.findOne({ user: user._id });
    if (!wishlist) {
      return res.json({ 
        inWishlist: false,
        message: 'Wishlist does not exist' 
      });
    }

    const product = await Product.findOne({ id: req.params.productId });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const isInWishlist = wishlist.products.some(
      p => p.toString() === product._id.toString()
    );

    res.json({
      inWishlist: isInWishlist,
      product: {
        id: product.id,
        title: product.title
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get wishlist count
router.get('/:userId/count', async (req, res) => {
  try {
    const user = await User.findOne({ id: req.params.userId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const wishlist = await Wishlist.findOne({ user: user._id });
    const count = wishlist ? wishlist.products.length : 0;

    res.json({ count: count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Move product from wishlist to cart
router.post('/:userId/move-to-cart/:productId', async (req, res) => {
  try {
    const { quantity = 1 } = req.body;
    const Cart = require('../models/Cart');

    const user = await User.findOne({ id: req.params.userId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const wishlist = await Wishlist.findOne({ user: user._id });
    if (!wishlist) {
      return res.status(404).json({ error: 'Wishlist not found' });
    }

    const product = await Product.findOne({ id: req.params.productId });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if product is in wishlist
    const isInWishlist = wishlist.products.some(
      p => p.toString() === product._id.toString()
    );

    if (!isInWishlist) {
      return res.status(400).json({ error: 'Product is not in wishlist' });
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

    // Find or create cart
    let cart = await Cart.findOne({ user: user._id });
    if (!cart) {
      cart = await Cart.create({
        user: user._id,
        items: [],
        total: 0
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

    // Remove from wishlist (optional - you can keep it if you want)
    // wishlist.products = wishlist.products.filter(
    //   p => p.toString() !== product._id.toString()
    // );
    // await wishlist.save();

    await cart.populate('items.product');
    await wishlist.populate('products');

    res.json({
      message: 'Product moved to cart successfully',
      cart: cart,
      wishlist: wishlist
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;

