import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { registerUser, loginUser } from '../services/userService';
import { useAuth } from '../Context/AuthContext';
import './Login.css'; // Reuse Login styles

function Signup() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: location.state?.email || '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(location.state?.message || '');

  // Check if user is already authenticated and redirect
  useEffect(() => {
    if (isAuthenticated) {
      // Only admins go to dashboard, regular users stay on site
      if (user?.role === 'admin') {
        navigate('/dashboard', { replace: true });
      } else {
        // Regular users go to home page
        navigate('/', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate required fields
    if (!formData.name.trim()) {
      setError('Name is required');
      setLoading(false);
      return;
    }

    if (!formData.email.trim()) {
      setError('Email is required');
      setLoading(false);
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      // Prepare user data matching the User model
      // Only send fields that exist in the model: name, email, password, phone, address
      // role defaults to 'user' on backend, id is auto-generated
      const userData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        // Only include phone and address if they have values
        ...(formData.phone.trim() && { phone: formData.phone.trim() }),
        ...(formData.address.trim() && { address: formData.address.trim() })
      };

      // Call the register API
      const result = await registerUser(userData);
      
      console.log('Registration result:', result); // Debug log
      
      // Handle different response structures
      // Backend might return: { user, token } or just { user } or just the user object
      let user = null;
      let token = null;

      if (result) {
        // Check if result has user and token properties
        if (result.user && result.token) {
          user = result.user;
          token = result.token;
        } 
        // Check if result is the user object directly with token
        else if (result.token && (result.id || result._id || result.email)) {
          user = result;
          token = result.token;
        }
        // Check if result is just the user object (need to login separately)
        else if (result.id || result._id || result.email) {
          user = result;
          // Auto-login after registration
          try {
            const loginResult = await loginUser(formData.email.trim().toLowerCase(), formData.password);
            if (loginResult.user && loginResult.token) {
              user = loginResult.user;
              token = loginResult.token;
            } else if (loginResult.token) {
              token = loginResult.token;
              user = loginResult.user || result;
            }
          } catch (loginErr) {
            console.error('Auto-login error:', loginErr);
            // Registration was successful, but login failed
            // Redirect to login page with success message
            navigate('/login', { 
              state: { 
                message: 'Registration successful! Please login with your credentials.',
                email: formData.email.trim().toLowerCase()
              } 
            });
            return;
          }
        }
      }

      // If we have user, login and redirect (token is optional - not using JWT)
      if (user) {
        // Token is optional - login works with just user object
        login(user, token || null);
        // Only admins go to dashboard, regular users stay on site
        // New users default to 'user' role, so they'll go to home page
        if (user.role === 'admin') {
          navigate('/dashboard');
        } else {
          // Regular users go to home page to start shopping
          navigate('/');
        }
      } 
      // If we have nothing, show error
      else {
        throw new Error('Registration successful but received invalid response from server');
      }
    } catch (err) {
      // Display error message
      setError(err.message || 'Registration failed. Please try again.');
      console.error('Signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Left Panel with Background Image */}
        <div className="login-left-panel">
          <div className="login-background-overlay"></div>
          <svg className="login-curve" viewBox="0 0 200 800" preserveAspectRatio="none">
            <path d="M0,0 Q100,200 0,400 T0,800 L0,800 L200,800 L200,0 Z" fill="white" />
          </svg>
        </div>

        {/* Right Panel with Signup Form */}
        <div className="login-right-panel">
          <div className="login-form-container">
            <h1 className="login-welcome">Create Account</h1>
            <p className="login-subtitle">Sign up to start shopping</p>

            <form onSubmit={handleSubmit} className="login-form">
              {/* Success Message */}
              {successMessage && (
                <div className="login-success-message" style={{
                  background: '#d1fae5',
                  color: '#065f46',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '14px',
                  fontWeight: 600
                }}>
                  <i className="fas fa-check-circle"></i>
                  <span>{successMessage}</span>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="login-error-message">
                  <i className="fas fa-exclamation-circle"></i>
                  <span>{error}</span>
                </div>
              )}

              {/* Name Input - Required */}
              <div className="login-input-group">
                <i className="fas fa-user login-input-icon"></i>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name *"
                  value={formData.name}
                  onChange={handleChange}
                  className="login-input"
                  required
                  disabled={loading}
                  minLength={2}
                  maxLength={100}
                />
              </div>

              {/* Email Input - Required */}
              <div className="login-input-group">
                <i className="fas fa-envelope login-input-icon"></i>
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address *"
                  value={formData.email}
                  onChange={handleChange}
                  className="login-input"
                  required
                  disabled={loading}
                  autoComplete="email"
                />
              </div>

              {/* Password Input - Required */}
              <div className="login-input-group">
                <i className="fas fa-lock login-input-icon"></i>
                <input
                  type="password"
                  name="password"
                  placeholder="Password (min 6 characters) *"
                  value={formData.password}
                  onChange={handleChange}
                  className="login-input"
                  required
                  minLength={6}
                  disabled={loading}
                  autoComplete="new-password"
                />
              </div>

              {/* Confirm Password Input - Required */}
              <div className="login-input-group">
                <i className="fas fa-lock login-input-icon"></i>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password *"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="login-input"
                  required
                  minLength={6}
                  disabled={loading}
                  autoComplete="new-password"
                />
              </div>

              {/* Phone Input - Optional */}
              <div className="login-input-group">
                <i className="fas fa-phone login-input-icon"></i>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number (optional)"
                  value={formData.phone}
                  onChange={handleChange}
                  className="login-input"
                  disabled={loading}
                  autoComplete="tel"
                  maxLength={20}
                />
              </div>

              {/* Address Input - Optional */}
              <div className="login-input-group">
                <i className="fas fa-map-marker-alt login-input-icon"></i>
                <input
                  type="text"
                  name="address"
                  placeholder="Address (optional)"
                  value={formData.address}
                  onChange={handleChange}
                  className="login-input"
                  disabled={loading}
                  autoComplete="street-address"
                  maxLength={200}
                />
              </div>


              {/* Signup Button */}
              <button 
                type="submit" 
                className="login-button"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    <span>Creating account...</span>
                  </>
                ) : (
                  'Sign Up'
                )}
              </button>

              {/* Login Link */}
              <div className="login-signup">
                <span className="login-signup-text">Already have an account? </span>
                <Link to="/login" className="login-signup-link">
                  Log in!
                </Link>
              </div>

              {/* Social Media Icons */}
              <div className="login-social">
                <a href="#" className="login-social-icon" aria-label="Facebook">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" className="login-social-icon" aria-label="Twitter">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="login-social-icon" aria-label="LinkedIn">
                  <i className="fab fa-linkedin-in"></i>
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;

