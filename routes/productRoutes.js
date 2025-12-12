const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

// Create product
router.post('/', async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all products (with optional category and stock filters)
router.get('/', async (req, res) => {
  try {
    const { category, inStock, lowStock } = req.query;
    const query = {};
    
    if (category) {
      query.category = category;
    }
    
    if (inStock === 'true') {
      query.stock = { $gt: 0 };
    } else if (inStock === 'false') {
      query.stock = 0;
    }
    
    if (lowStock === 'true') {
      // Get products with stock > 0 and <= lowStockThreshold
      const products = await Product.find(query);
      const lowStockProducts = products.filter(p => p.isLowStock);
      return res.json(lowStockProducts);
    }
    
    const products = await Product.find(query);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all categories
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single product by id
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ id: req.params.id });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update product
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update product stock
router.put('/:id/stock', async (req, res) => {
  try {
    const { stock, operation } = req.body; // operation: 'set', 'add', 'subtract'
    
    if (stock === undefined && !operation) {
      return res.status(400).json({ error: 'Stock value or operation is required' });
    }

    const product = await Product.findOne({ id: req.params.id });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    let newStock;
    if (operation === 'add') {
      newStock = product.stock + (stock || 0);
    } else if (operation === 'subtract') {
      newStock = Math.max(0, product.stock - (stock || 0));
    } else {
      newStock = stock;
    }

    product.stock = newStock;
    await product.save();

    res.json({
      message: 'Stock updated successfully',
      product: product,
      previousStock: product.stock - (operation === 'add' ? stock : operation === 'subtract' ? -stock : 0)
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get low stock products
router.get('/stock/low', async (req, res) => {
  try {
    const products = await Product.find({ stock: { $gt: 0 } });
    const lowStockProducts = products.filter(p => p.isLowStock);
    res.json({
      count: lowStockProducts.length,
      products: lowStockProducts
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get out of stock products
router.get('/stock/out', async (req, res) => {
  try {
    const products = await Product.find({ stock: 0 });
    res.json({
      count: products.length,
      products: products
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete product
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ id: req.params.id });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully', product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
