# Product Model Design Based on Home.jsx Product Cards

## Product Data Structure from Home.jsx

Based on the `dealProducts` array in `src/Components/Home.jsx`, here's the exact structure:

```javascript
{
    id: 'starlink-v3',
    title: 'Starlink v3 Satellite Kit',
    badge: 'Featured',
    image: 'assets/img/product/starlinkV3.jpeg',
    priceNew: 'RWF600,000',
    priceOld: 'RWF750,000',
    discount: '-20%',
    rating: '4.9',
    sold: '500+',
    description: 'High-performance satellite internet kit...'
}
```

---

## Product Model Schema Design

### MongoDB/Mongoose Version

```javascript
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    // ID - MongoDB will auto-generate _id, but you can also use custom id
    id: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true
    },
    
    // Product Information
    title: {
        type: String,
        required: true,
        trim: true,
        index: true  // For search
    },
    
    // Badge/Category Badge
    badge: {
        type: String,
        required: true,
        enum: ['Featured', 'Portable', 'WiFi', 'Security', 'Outdoor', 'NVR', 'New', 'Sale'],
        default: 'New'
    },
    
    // Image
    image: {
        type: String,
        required: true
    },
    
    // Pricing (as strings to match frontend format)
    priceNew: {
        type: String,
        required: true,
        // Format: 'RWF600,000'
    },
    priceOld: {
        type: String,
        // Format: 'RWF750,000'
    },
    discount: {
        type: String,
        default: '0%',
        // Format: '-20%'
    },
    
    // Numeric price for calculations and sorting
    price: {
        type: Number,
        required: true,
        min: 0,
        index: true  // For price filtering/sorting
    },
    priceOldNumeric: {
        type: Number,
        min: 0
    },
    
    // Rating
    rating: {
        type: String,
        default: '0',
        // Format: '4.9' (as string to match frontend)
    },
    ratingNumeric: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    
    // Sales Information
    sold: {
        type: String,
        default: '0+',
        // Format: '500+'
    },
    soldCount: {
        type: Number,
        default: 0,
        min: 0
    },
    
    // Description
    description: {
        type: String,
        required: true
    },
    
    // Additional Fields (for Shop.jsx compatibility)
    name: {
        type: String,
        // Same as title, for consistency
    },
    category: {
        type: String,
        // Can be same as badge or different
        enum: ['Featured', 'Portable', 'WiFi', 'Security', 'Outdoor', 'NVR', 'Networking', 'Starlink', 'Camera', 'Other']
    },
    reviews: {
        type: Number,
        default: 0,
        min: 0
    },
    
    // Stock Management
    stock: {
        type: Number,
        default: 0,
        min: 0
    },
    inStock: {
        type: Boolean,
        default: true
    },
    
    // Status
    isActive: {
        type: Boolean,
        default: true
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    
    // Timestamps
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Indexes for performance
productSchema.index({ title: 'text', description: 'text' }); // Text search
productSchema.index({ badge: 1 });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ isActive: 1, isFeatured: 1 });
productSchema.index({ ratingNumeric: -1 });

// Pre-save middleware to sync fields
productSchema.pre('save', function(next) {
    // Sync name with title if not set
    if (!this.name) {
        this.name = this.title;
    }
    
    // Sync category with badge if not set
    if (!this.category) {
        this.category = this.badge;
    }
    
    // Calculate discount if priceOldNumeric and price are set
    if (this.priceOldNumeric && this.priceOldNumeric > this.price) {
        const discountPercent = Math.round(((this.priceOldNumeric - this.price) / this.priceOldNumeric) * 100);
        this.discount = `-${discountPercent}%`;
    }
    
    // Format priceNew from numeric price
    if (this.price && !this.priceNew) {
        this.priceNew = `RWF${this.price.toLocaleString()}`;
    }
    
    // Format priceOld from numeric price
    if (this.priceOldNumeric && !this.priceOld) {
        this.priceOld = `RWF${this.priceOldNumeric.toLocaleString()}`;
    }
    
    // Sync rating
    if (this.ratingNumeric && !this.rating) {
        this.rating = this.ratingNumeric.toString();
    }
    
    // Sync sold
    if (this.soldCount !== undefined && !this.sold) {
        this.sold = `${this.soldCount}+`;
    }
    
    next();
});

module.exports = mongoose.model('Product', productSchema);
```

---

## Sample Product Data (Matching Home.jsx Structure)

```javascript
{
    id: 'starlink-v3',
    title: 'Starlink v3 Satellite Kit',
    name: 'Starlink v3 Satellite Kit',  // Same as title
    badge: 'Featured',
    category: 'Featured',
    image: 'assets/img/product/starlinkV3.jpeg',
    priceNew: 'RWF600,000',
    priceOld: 'RWF750,000',
    discount: '-20%',
    price: 600000,  // Numeric for calculations
    priceOldNumeric: 750000,
    rating: '4.9',
    ratingNumeric: 4.9,
    sold: '500+',
    soldCount: 500,
    reviews: 127,
    description: 'High-performance satellite internet kit delivering faster speeds, low latency, and reliable uptime for homes, offices, and remote sites.',
    stock: 25,
    inStock: true,
    isActive: true,
    isFeatured: true
}
```

---

## Key Design Decisions

### 1. **Dual Format Fields**
- **String formats** (`priceNew`, `priceOld`, `rating`, `sold`) - Match frontend display exactly
- **Numeric formats** (`price`, `priceOldNumeric`, `ratingNumeric`, `soldCount`) - For calculations, sorting, filtering

### 2. **Why Both Formats?**
- Frontend displays formatted strings: `'RWF600,000'`, `'4.9'`, `'500+'`
- Backend needs numbers for: filtering by price range, sorting, calculations
- Pre-save middleware automatically syncs between formats

### 3. **Badge vs Category**
- `badge`: Visual label shown on product card (Featured, Portable, WiFi, etc.)
- `category`: Can be same as badge or more specific for filtering

### 4. **ID Field**
- Custom `id` field (e.g., 'starlink-v3') for SEO-friendly URLs
- MongoDB `_id` is still auto-generated
- Both can be used depending on needs

---

## API Response Format

When returning products to frontend, format should match Home.jsx structure:

```javascript
// GET /api/products/:id
{
    id: 'starlink-v3',
    title: 'Starlink v3 Satellite Kit',
    badge: 'Featured',
    image: 'assets/img/product/starlinkV3.jpeg',
    priceNew: 'RWF600,000',
    priceOld: 'RWF750,000',
    discount: '-20%',
    rating: '4.9',
    sold: '500+',
    description: 'High-performance satellite internet kit...'
}
```

---

## Helper Functions

### Format Price to String
```javascript
function formatPrice(amount) {
    return `RWF${amount.toLocaleString()}`;
}
// Usage: formatPrice(600000) => 'RWF600,000'
```

### Parse Price String to Number
```javascript
function parsePrice(priceString) {
    return parseFloat(priceString.replace(/[^\d]/g, ''));
}
// Usage: parsePrice('RWF600,000') => 600000
```

### Calculate Discount
```javascript
function calculateDiscount(oldPrice, newPrice) {
    if (oldPrice > newPrice) {
        const percent = Math.round(((oldPrice - newPrice) / oldPrice) * 100);
        return `-${percent}%`;
    }
    return '0%';
}
```

---

## Database Indexes

For optimal performance, create these indexes:

1. **Text Search**: `title`, `description`
2. **Filtering**: `badge`, `category`, `isActive`, `isFeatured`
3. **Sorting**: `price`, `ratingNumeric`, `createdAt`
4. **Unique**: `id`

---

## Migration from Frontend Data

To migrate existing `dealProducts` array to database:

```javascript
const products = [
    {
        id: 'starlink-v3',
        title: 'Starlink v3 Satellite Kit',
        // ... rest of data
    },
    // ... more products
];

// Convert to database format
products.forEach(product => {
    const dbProduct = {
        ...product,
        price: parsePrice(product.priceNew),
        priceOldNumeric: product.priceOld ? parsePrice(product.priceOld) : null,
        ratingNumeric: parseFloat(product.rating),
        soldCount: parseInt(product.sold) || 0,
        name: product.title,
        category: product.badge
    };
    // Save to database
});
```

---

## Summary

The Product model should:
- ✅ Match the exact structure from `Home.jsx` `dealProducts`
- ✅ Include both string (display) and numeric (calculation) formats
- ✅ Support all fields used in product cards
- ✅ Auto-sync between formats using pre-save middleware
- ✅ Include indexes for search, filter, and sort operations
- ✅ Be compatible with both Home.jsx and Shop.jsx components


