const express = require('express');
const User = require('../models/User');
const Order = require('../models/Order');
const router = express.Router();

// Register user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password, // Note: In production, hash the password before saving
      phone,
      address
    });

    // Don't send password in response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({ message: 'User registered successfully', user: userResponse });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check password (Note: In production, use bcrypt.compare for hashed passwords)
    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Don't send password in response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({ message: 'Login successful', user: userResponse });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create user
router.post('/', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single user by id
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findOne({ id: req.params.id }).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update user
router.put('/:id', async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    ).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete user
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ id: req.params.id });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const userResponse = user.toObject();
    delete userResponse.password;
    res.json({ message: 'User deleted successfully', user: userResponse });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user's order history
router.get('/:id/orders', async (req, res) => {
  try {
    const user = await User.findOne({ id: req.params.id });
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

module.exports = router;

