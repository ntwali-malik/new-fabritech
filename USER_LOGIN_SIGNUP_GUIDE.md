# User Login & Signup Guide

## Overview
Users can now log in or sign up directly from the website navigation. The authentication system is fully integrated with cart and wishlist functionality.

## How Users Access Login/Signup

### 1. **Navigation Header (All Pages)**
- **When NOT logged in**: Shows "Login" and "Sign Up" buttons in the header
- **When logged in**: Shows user menu with:
  - User avatar with initials
  - User name and email
  - Dropdown menu with:
    - Dashboard
    - Wishlist
    - Admin Panel (if admin)
    - Logout

### 2. **Direct Routes**
- `/login` - Login page
- `/signup` - Signup/Registration page

## User Flow

### Sign Up (New Users)
1. Click "Sign Up" button in header (or navigate to `/signup`)
2. Fill in registration form:
   - Full Name (required)
   - Email (required)
   - Password (required, min 6 characters)
   - Confirm Password (required)
   - Phone (optional)
   - Address (optional)
3. Click "Sign Up" button
4. User is automatically logged in after successful registration
5. Redirected to Dashboard

### Login (Existing Users)
1. Click "Login" button in header (or navigate to `/login`)
2. Enter email and password
3. Click "Log In" button
4. On successful login:
   - User data and token stored
   - Cart and wishlist synced with backend
   - Redirected to Dashboard

### After Login
- **Cart**: Guest cart (if any) is merged with user's saved cart
- **Wishlist**: User's saved wishlist is loaded
- **Navigation**: Header shows user menu instead of login buttons

### Logout
1. Click user menu in header
2. Click "Logout" button
3. User session cleared
4. Cart and wishlist cleared from localStorage
5. Redirected to home page
6. Header shows "Login" and "Sign Up" buttons again

## Components

### UserMenu Component (`src/Components/UserMenu.jsx`)
- Displays login/signup buttons when not authenticated
- Shows user menu dropdown when authenticated
- Handles logout functionality
- Responsive design (hides text on mobile, shows icons only)

### Login Component (`src/Components/Login.jsx`)
- Email and password form
- Error handling
- Auto-redirect if already logged in
- Link to signup page
- Social login placeholders (for future implementation)

### Signup Component (`src/Components/Signup.jsx`)
- Registration form with validation
- Password confirmation
- Auto-login after registration
- Link to login page

## Protected Routes

### Dashboard (`/dashboard`)
- Requires authentication
- Redirects to `/login` if not authenticated
- Shows user dashboard after login

### Wishlist (`/wishlist`)
- Requires authentication
- Redirects to `/login` if not authenticated
- Shows user's saved wishlist items

## Features

### Automatic Cart Sync
- When user logs in, guest cart is merged with saved cart
- All cart operations sync to backend automatically
- Falls back to localStorage if backend unavailable

### Automatic Wishlist Sync
- User's wishlist loaded from backend on login
- All wishlist operations sync to backend
- Falls back to localStorage if backend unavailable

### Session Persistence
- User session stored in localStorage
- Automatically restored on page refresh
- Token included in all API requests

## Backend Requirements

### Login Endpoint
```
POST /api/users/login
Body: { email, password }
Response: { user: {...}, token: "jwt_token" }
```

### Register Endpoint
```
POST /api/users/register
Body: { name, email, password, phone?, address? }
Response: { user: {...}, token: "jwt_token" }
```

## User Experience

### Guest Users
- Can browse products
- Can add items to cart (stored in localStorage)
- Can add items to wishlist (stored in localStorage)
- Prompted to login when trying to checkout
- Cart/wishlist preserved after signup/login

### Authenticated Users
- Full access to all features
- Cart and wishlist synced across devices
- Order history in dashboard
- Personalized experience

## Responsive Design

### Desktop
- Full "Login" and "Sign Up" buttons visible
- User menu shows name and email
- Full dropdown menu

### Mobile
- Icons only for login/signup buttons
- User menu shows avatar only
- Compact dropdown menu

## Security Features

- Passwords validated (min 6 characters)
- Password confirmation required
- JWT tokens for authentication
- Secure token storage
- Auto-logout on token expiration (handled by backend)

## Future Enhancements

- Social login (Facebook, Google)
- Password reset functionality
- Email verification
- Remember me option
- Two-factor authentication

