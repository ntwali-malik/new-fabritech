# Backend Login Response Fix Required

## Current Issue

The login endpoint is returning:
```json
{
  "message": "Login successful",
  "user": {
    "_id": "...",
    "name": "...",
    "email": "...",
    ...
  }
}
```

**But it's missing the `token` field!**

## Required Response Format

The login endpoint **MUST** return a JWT token. The response should be:

```json
{
  "message": "Login successful",
  "user": {
    "_id": "...",
    "name": "...",
    "email": "...",
    "role": "user",
    ...
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## Backend Fix Required

Update your login route to return the token:

```javascript
// Example login route fix
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user and validate password
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' } // or your preferred expiry
    );
    
    // Return user and token
    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address
      },
      token: token  // ← THIS IS MISSING!
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
```

## Alternative: Token in Header

If you prefer to send the token in the response header instead:

```javascript
res.setHeader('Authorization', `Bearer ${token}`);
res.json({
  message: 'Login successful',
  user: { ... }
});
```

The frontend code has been updated to check headers, but **the recommended approach is to return the token in the response body**.

## Register Endpoint

The register endpoint should also return a token after creating the user:

```json
{
  "message": "Registration successful",
  "user": { ... },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## Testing

After fixing the backend, test the login:
1. Login should return both `user` and `token`
2. Frontend will automatically store both
3. Token will be included in all subsequent API requests

