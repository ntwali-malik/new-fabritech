# User Account Implementation Guide

## Overview
This implementation adds user account functionality with persistent cart and wishlist storage. Cart and wishlist items are automatically synced to the backend when users are logged in.

## What Was Implemented

### 1. Authentication System
- **AuthContext** (`src/Context/AuthContext.js`)
  - Manages user authentication state
  - Handles login/logout
  - Stores user data and JWT tokens
  - Provides authentication headers for API requests

### 2. Cart Backend Integration
- **cartService.js** (`src/services/cartService.js`)
  - API endpoints for cart management
  - Functions: `getCart`, `addToCart`, `updateCartItem`, `removeFromCart`, `clearCart`, `syncCart`
  
- **Updated CartContext** (`src/Context/CartContext.js`)
  - Automatically syncs with backend when user is logged in
  - Falls back to localStorage for guest users
  - Merges guest cart with user cart on login

### 3. Wishlist System
- **wishlistService.js** (`src/services/wishlistService.js`)
  - API endpoints for wishlist management
  - Functions: `getWishlist`, `addToWishlist`, `removeFromWishlist`, `isInWishlist`, `clearWishlist`

- **WishlistContext** (`src/Context/WishlistContext.js`)
  - Manages wishlist state
  - Syncs with backend when authenticated
  - Falls back to localStorage for guests

- **Wishlist Components**:
  - `WishlistIcon.jsx` - Navbar wishlist icon with badge
  - `WishlistButton.jsx` - Add/remove from wishlist button
  - `Wishlist.jsx` - Full wishlist page

### 4. User Registration
- **Signup Component** (`src/Components/Signup.jsx`)
  - User registration form
  - Auto-login after registration
  - Password validation

### 5. Updated Components
- **Login.jsx** - Now uses AuthContext
- **App.js** - Wrapped with AuthProvider, CartProvider, and WishlistProvider

## Required Backend API Endpoints

### Authentication Endpoints
```
POST /api/users/register
Body: { name, email, password, phone?, address? }
Response: { user: {...}, token: "jwt_token" }

POST /api/users/login
Body: { email, password }
Response: { user: {...}, token: "jwt_token" }
```

### Cart Endpoints
```
GET /api/cart
Headers: { Authorization: "Bearer <token>" }
Response: { items: [...] }

POST /api/cart/items
Headers: { Authorization: "Bearer <token>" }
Body: { productId, quantity, price, name, image, category }
Response: { items: [...] }

PUT /api/cart/items/:itemId
Headers: { Authorization: "Bearer <token>" }
Body: { quantity }
Response: { items: [...] }

DELETE /api/cart/items/:itemId
Headers: { Authorization: "Bearer <token>" }
Response: { items: [...] }

DELETE /api/cart
Headers: { Authorization: "Bearer <token>" }
Response: { items: [] }

POST /api/cart/sync
Headers: { Authorization: "Bearer <token>" }
Body: { items: [...] }
Response: { items: [...] }
```

### Wishlist Endpoints
```
GET /api/wishlist
Headers: { Authorization: "Bearer <token>" }
Response: { items: [...] }

POST /api/wishlist/items
Headers: { Authorization: "Bearer <token>" }
Body: { productId, name, price, image, category }
Response: { items: [...] }

DELETE /api/wishlist/items/:productId
Headers: { Authorization: "Bearer <token>" }
Response: { items: [...] }

DELETE /api/wishlist
Headers: { Authorization: "Bearer <token>" }
Response: { items: [] }
```

## Database Schema Suggestions

### Cart Model
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  items: [{
    productId: String,
    quantity: Number,
    price: Number,
    name: String,
    image: String,
    category: String,
    addedAt: Date
  }],
  updatedAt: Date,
  createdAt: Date
}
```

### Wishlist Model
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  items: [{
    productId: String,
    name: String,
    price: Number,
    image: String,
    category: String,
    addedAt: Date
  }],
  updatedAt: Date,
  createdAt: Date
}
```

## How It Works

### For Guest Users (Not Logged In)
1. Cart and wishlist stored in localStorage
2. No backend sync
3. Data persists across browser sessions

### For Authenticated Users
1. On login:
   - Local cart is synced with server cart (merged)
   - Wishlist loaded from server
   
2. During use:
   - All cart/wishlist changes sync to backend
   - Changes also saved to localStorage as backup
   
3. On logout:
   - Cart and wishlist cleared from localStorage
   - User can continue as guest

## Usage Examples

### Adding Wishlist Button to Product Card
```jsx
import WishlistButton from './WishlistButton'

<WishlistButton product={product} />
```

### Adding Wishlist Icon to Navbar
```jsx
import WishlistIcon from './WishlistIcon'

<WishlistIcon />
```

### Using Wishlist in Component
```jsx
import { useWishlist } from '../Context/WishlistContext'

const { wishlistItems, addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
```

### Using Auth in Component
```jsx
import { useAuth } from '../Context/AuthContext'

const { user, isAuthenticated, logout } = useAuth()
```

## Routes Added
- `/signup` - User registration
- `/wishlist` - Wishlist page (requires login)

## Notes
- All API calls include JWT token in Authorization header
- Cart sync happens automatically with 1-second debounce
- Wishlist syncs immediately on add/remove
- Error handling falls back to localStorage if backend fails
- Guest cart is merged with user cart on login

