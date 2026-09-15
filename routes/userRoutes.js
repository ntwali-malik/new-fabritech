const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const Order = require('../models/Order');
const router = express.Router();

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function getGoogleProfile({ idToken, accessToken }) {
  if (idToken) {
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    const payload = ticket.getPayload();
    if (!payload?.email) {
      throw new Error('Google account email is required');
    }
    return {
      email: payload.email.toLowerCase(),
      name: payload.name || payload.email.split('@')[0],
      googleId: payload.sub
    };
  }

  if (accessToken) {
    const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch Google user profile');
    }
    const data = await response.json();
    if (!data?.email) {
      throw new Error('Google account email is required');
    }
    return {
      email: data.email.toLowerCase(),
      name: data.name || data.email.split('@')[0],
      googleId: data.sub
    };
  }

  throw new Error('idToken or accessToken is required');
}

// Register user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      address,
      authProvider: 'local'
    });

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

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (user.authProvider === 'google' && !user.password) {
      return res.status(401).json({
        error: 'This account uses Google sign-in. Please continue with Google.'
      });
    }

    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({ message: 'Login successful', user: userResponse });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Google OAuth login / signup
router.post('/google', async (req, res) => {
  try {
    if (!process.env.GOOGLE_CLIENT_ID) {
      return res.status(500).json({ error: 'Google sign-in is not configured on the server' });
    }

    const { idToken, accessToken } = req.body;
    const profile = await getGoogleProfile({ idToken, accessToken });

    let user = await User.findOne({
      $or: [
        { email: profile.email },
        ...(profile.googleId ? [{ googleId: profile.googleId }] : [])
      ]
    });

    if (!user) {
      user = await User.create({
        name: profile.name,
        email: profile.email,
        googleId: profile.googleId,
        authProvider: 'google'
      });
    } else {
      let changed = false;
      if (!user.googleId && profile.googleId) {
        user.googleId = profile.googleId;
        changed = true;
      }
      if (changed) {
        await user.save();
      }
    }

    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({ message: 'Login successful', user: userResponse });
  } catch (err) {
    console.error('Google auth error:', err);
    res.status(401).json({ error: err.message || 'Google authentication failed' });
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
