import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { loginUser } from '../services/userService';
import { useAuth } from '../Context/AuthContext';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, user } = useAuth();
  const [formData, setFormData] = useState({
    email: location.state?.email || '',
    password: ''
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

    try {
      // Call the login API
      const result = await loginUser(formData.email.trim().toLowerCase(), formData.password);
      
      console.log('Login result:', result); // Debug log
      console.log('Login result keys:', result ? Object.keys(result) : 'null'); // Debug log
      console.log('Login result.user:', result?.user); // Debug log
      console.log('Login result.token:', result?.token); // Debug log
      
      // Handle different response structures
      let user = null;
      let token = null;

      if (result) {
        // Case 1: { message: "...", user: {...}, token: "..." }
        if (result.user && result.token) {
          user = result.user;
          token = result.token;
        } 
        // Case 2: { message: "...", user: {...}, authToken: "..." } or { user: {...}, accessToken: "..." }
        else if (result.user && (result.authToken || result.accessToken)) {
          user = result.user;
          token = result.authToken || result.accessToken;
        }
        // Case 3: { message: "...", user: {...} } - user exists (token optional - not using JWT)
        else if (result.user) {
          user = result.user;
          // Token is optional - check if it exists but don't require it
          token = result.token || result.authToken || result.accessToken || null;
          
          // No error if token is missing - we're not using JWT authentication
          if (!token) {
            console.log('✓ User authenticated (session-based, no JWT token required)');
          }
        }
        // Case 4: User object directly with token property
        else if (result.token && (result.id || result._id || result.email)) {
          user = result;
          token = result.token;
        }
        // Case 5: User object with authToken or accessToken
        else if ((result.authToken || result.accessToken) && (result.id || result._id || result.email)) {
          user = result;
          token = result.authToken || result.accessToken;
        }
        // Case 6: Just user object, try to find token in any property
        else if (result.id || result._id || result.email) {
          user = result;
          // Check for token in various possible properties
          token = result.token || result.authToken || result.accessToken || result.jwt || result.jwtToken;
          
          if (!token) {
            console.warn('Token not found in response. Available keys:', Object.keys(result));
            throw new Error('Login successful but no token received from server');
          }
        }
        // Case 7: Check if result itself is a nested structure
        else if (result.data) {
          const data = result.data;
          if (data.user && data.token) {
            user = data.user;
            token = data.token;
          } else if (data.token && (data.id || data._id || data.email)) {
            user = data;
            token = data.token;
          }
        }
      }

      // If we have user, login and redirect (token is optional - not using JWT)
      if (user) {
        console.log('Logging in user:', user);
        // Token is optional - login works with just user object
        login(user, token || null);
        // Only admins go to dashboard, regular users stay on site
        if (user.role === 'admin') {
          navigate('/dashboard');
        } else {
          // Regular users go to home page to continue shopping
          navigate('/');
        }
      } else {
        // Last resort: try to use the result directly if it looks like a user object
        if (result && (result.id || result._id || result.email)) {
          console.warn('Attempting to use result directly as user object');
          // Try to find token anywhere in the result (optional)
          const foundToken = result.token || result.authToken || result.accessToken || 
                           result.jwt || result.jwtToken || 
                           (result.data && (result.data.token || result.data.authToken));
          
          login(result, foundToken || null);
          // Only admins go to dashboard, regular users stay on site
          if (result.role === 'admin') {
            navigate('/dashboard');
          } else {
            navigate('/');
          }
          return;
        }
        
        console.error('Failed to extract user from response:', {
          user: user ? 'Present' : 'Missing',
          result: result,
          resultStringified: JSON.stringify(result, null, 2)
        });
        throw new Error(`Invalid response from server. Could not extract user data.`);
      }
    } catch (err) {
      // Display error message
      setError(err.message || 'Login failed. Please try again.');
      console.error('Login error:', err);
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

        {/* Right Panel with Login Form */}
        <div className="login-right-panel">
          <div className="login-form-container">
            <h1 className="login-welcome">Welcome</h1>
            <p className="login-subtitle">Log in to your account to continue</p>

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

              {/* Email Input */}
              <div className="login-input-group">
                <i className="fas fa-user login-input-icon"></i>
                <input
                  type="email"
                  name="email"
                  placeholder="awesome@user.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="login-input"
                  required
                  disabled={loading}
                />
              </div>

              {/* Password Input */}
              <div className="login-input-group">
                <i className="fas fa-lock login-input-icon"></i>
                <input
                  type="password"
                  name="password"
                  placeholder="............"
                  value={formData.password}
                  onChange={handleChange}
                  className="login-input"
                  required
                  disabled={loading}
                />
              </div>

              {/* Forgot Password Link */}
              <div className="login-forgot-password">
                <Link to="/forgot-password" className="login-forgot-link">
                  Forgot your password?
                </Link>
              </div>

              {/* Login Button */}
              <button 
                type="submit" 
                className="login-button"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    <span>Logging in...</span>
                  </>
                ) : (
                  'Log In'
                )}
              </button>

              {/* Sign Up Link */}
              <div className="login-signup">
                <span className="login-signup-text">Don't have an account? </span>
                <Link to="/signup" className="login-signup-link">
                  Sign up!
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

export default Login;

