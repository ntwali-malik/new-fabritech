# Backend Models Design Guide for Fabritech E-commerce

## Overview
This document provides design hints and structure for creating backend models for products and shopping functionality.

---

## 1. Product Model Design

### Core Fields to Include:
```
- id: Unique identifier
- title/name: Product name
- description: Detailed product description
- price: Current selling price (Number)
- priceOld: Original price (for discount display)
- priceNew: Formatted price string (e.g., "RWF600,000")
- discount: Discount percentage (e.g., "-20%")
- image: Main product image URL
- images: Array of additional images
- category: Product category (Featured, Portable, WiFi, Security, etc.)
- badge: Badge label (Featured, Portable, New, etc.)
- rating: Average rating (0-5)
- reviews: Number of reviews
- sold: Number of items sold (string format like "500+")
- stock: Available quantity
- inStock: Boolean for stock status
- sku: Stock Keeping Unit (unique product code)
- isActive: Whether product is active/visible
- isFeatured: Whether to show in featured section
- createdAt/updatedAt: Timestamps
```

### Design Hints:
- Use **MongoDB/Mongoose** or **SQL/Sequelize** based on your preference
- Add **indexes** on: category, price, isActive, isFeatured for faster queries
- Include **text search** indexes on title and description
- Add **validation** for required fields and price ranges
- Consider **virtual fields** for calculated discount percentage

---

## 2. Cart Model Design

### Core Fields to Include:
```
- id: Unique identifier
- user: Reference to User (optional for guest carts)
- sessionId: Unique session identifier (for guest carts)
- items: Array of cart items
  - product: Reference to Product
  - quantity: Number of items
  - price: Price at time of adding (snapshot)
  - addedAt: When item was added
- totalAmount: Calculated total
- totalItems: Total quantity of items
- createdAt/updatedAt: Timestamps
- expiresAt: When cart expires (for cleanup)
```

### Design Hints:
- Support both **authenticated users** and **guest sessions**
- Store **price snapshot** in cart items (prices may change)
- Add **methods** for:
  - `addItem(productId, quantity)`
  - `removeItem(productId)`
  - `updateQuantity(productId, quantity)`
  - `calculateTotals()`
  - `clearCart()`
- Set **expiration** for guest carts (e.g., 30 days)
- Use **indexes** on: user, sessionId, expiresAt

---

## 3. Order Model Design

### Core Fields to Include:
```
- id: Unique identifier
- orderNumber: Unique order number (e.g., "ORD-20250101-0001")
- user: Reference to User (optional for guest orders)
- items: Array of order items
  - product: Reference to Product
  - productName: Snapshot of product name
  - productImage: Snapshot of product image
  - quantity: Number ordered
  - price: Price at time of order
  - total: Line total (price × quantity)
- shippingAddress: Object with:
  - fullName, email, phone
  - address, city, country, postalCode
- subtotal: Sum of all items
- tax: Tax amount
- shippingFee: Shipping cost
- discount: Any discount applied
- totalAmount: Final total
- paymentMethod: Credit Card, Mobile Money, etc.
- paymentStatus: Pending, Paid, Failed, Refunded
- orderStatus: Pending, Processing, Shipped, Delivered, Cancelled
- trackingNumber: Shipping tracking number
- notes: Customer notes
- deliveredAt/cancelledAt: Timestamps
- createdAt/updatedAt: Timestamps
```

### Design Hints:
- **Snapshot product data** in order items (products may change/delete)
- Generate **unique order numbers** automatically
- Track **order lifecycle** with status fields
- Add **methods** for:
  - `calculateTotals()`
  - `updateStatus(newStatus)`
- Use **indexes** on: user, orderNumber, orderStatus, createdAt
- Consider **order history** for users

---

## 4. User Model Design (Optional - for authentication)

### Core Fields to Include:
```
- id: Unique identifier
- name: User's full name
- email: Unique email address
- password: Hashed password
- phone: Contact number
- role: customer or admin
- addresses: Array of shipping addresses
  - fullName, phone, address, city, country
  - isDefault: Boolean
- isActive: Account status
- isEmailVerified: Email verification status
- createdAt/updatedAt: Timestamps
```

### Design Hints:
- **Hash passwords** using bcrypt
- Support **multiple addresses** with default selection
- Add **authentication methods**:
  - `comparePassword(candidatePassword)`
  - `generateAuthToken()`
- Use **indexes** on: email

---

## 5. Database Choice Hints

### MongoDB (NoSQL) - Recommended for flexibility:
- **Pros**: Flexible schema, easy to add fields, good for product variations
- **Use Mongoose** as ODM (Object Document Mapper)
- Good for: Rapid development, changing requirements

### PostgreSQL/MySQL (SQL) - Recommended for complex queries:
- **Pros**: ACID compliance, complex joins, better for analytics
- **Use Sequelize** or **TypeORM** as ORM
- Good for: Financial transactions, complex reporting

---

## 6. API Endpoints Design Hints

### Products:
```
GET    /api/products          - Get all products (with filters)
GET    /api/products/:id      - Get single product
POST   /api/products          - Create product (admin)
PUT    /api/products/:id      - Update product (admin)
DELETE /api/products/:id      - Delete product (admin)
```

### Cart:
```
GET    /api/cart              - Get user's cart
POST   /api/cart/items        - Add item to cart
PUT    /api/cart/items/:id    - Update cart item quantity
DELETE /api/cart/items/:id    - Remove item from cart
DELETE /api/cart              - Clear cart
```

### Orders:
```
GET    /api/orders            - Get user's orders
GET    /api/orders/:id        - Get single order
POST   /api/orders            - Create order (checkout)
PUT    /api/orders/:id/status - Update order status (admin)
```

---

## 7. Key Design Principles

1. **Data Integrity**: Use references/foreign keys properly
2. **Price Snapshots**: Store prices in cart/order (don't rely on current product price)
3. **Soft Deletes**: Use `isActive` flag instead of hard deletes
4. **Indexing**: Index frequently queried fields
5. **Validation**: Validate all inputs at model level
6. **Timestamps**: Always track createdAt/updatedAt
7. **Guest Support**: Design for both logged-in and guest users

---

## 8. Sample Model Structure (MongoDB/Mongoose Example)

```javascript
// Product Schema
const productSchema = {
  title: String (required),
  price: Number (required, min: 0),
  category: String (enum),
  image: String (required),
  // ... other fields
}

// Cart Schema
const cartSchema = {
  user: ObjectId (ref: 'User', optional),
  sessionId: String (required, unique),
  items: [{
    product: ObjectId (ref: 'Product'),
    quantity: Number,
    price: Number
  }],
  totalAmount: Number
}

// Order Schema
const orderSchema = {
  orderNumber: String (unique),
  user: ObjectId (ref: 'User', optional),
  items: [{
    product: ObjectId (ref: 'Product'),
    productName: String, // snapshot
    quantity: Number,
    price: Number
  }],
  totalAmount: Number,
  orderStatus: String (enum)
}
```

---

## 9. Next Steps

1. Choose your database (MongoDB or SQL)
2. Set up database connection
3. Create models with the fields listed above
4. Add validation and indexes
5. Create API routes
6. Test with sample data
7. Connect frontend to backend APIs

---

## 10. Quick Reference

- **Product**: Store product information, prices, images, categories
- **Cart**: Temporary storage for items before checkout
- **Order**: Permanent record of completed purchases
- **User**: Customer accounts and authentication (optional)

Remember: Keep it simple, validate inputs, and design for both guests and authenticated users!


