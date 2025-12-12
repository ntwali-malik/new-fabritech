import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useCart } from '../Context/CartContext'
import useTemplateScripts from '../hooks/useTemplateScripts'

const ProductDetail = () => {
  useTemplateScripts()
  
  const { id } = useParams()
  const { addToCart } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [addedToCart, setAddedToCart] = useState(false)

  // Product database (same as in Shop.jsx)
  const products = [
    { id: 1, name: 'Starlink v3', category: 'satellite', price: 600000, image: '/assets/img/product/starlink-v3.jpg', description: 'Advanced satellite internet with ultra-high speeds. Starlink v3 provides unprecedented connectivity for remote areas. Features 50-200 Mbps download speeds with minimal latency.', rating: 4.9, reviews: 128, stock: 15, specifications: { internet: '50-200 Mbps', latency: '<25ms', coverage: 'Global', power: '70W', warranty: '12 months' } },
    { id: 2, name: 'Starlink Mini', category: 'satellite', price: 400000, image: '/assets/img/product/starlink-mini.jpg', description: 'Portable satellite internet solution. Lightweight and compact design perfect for travel and temporary installations. Get connected anywhere in the world.', rating: 4.8, reviews: 95, stock: 22, specifications: { internet: '30-100 Mbps', latency: '<25ms', coverage: 'Global', power: '45W', warranty: '12 months' } },
    { id: 3, name: 'Hikvision DOM', category: 'security', price: 380000, image: '/assets/img/product/hikvision-dom.jpg', description: 'Outdoor dome camera with 4K resolution. Professional-grade security solution with night vision and motion detection. Perfect for property surveillance.', rating: 4.7, reviews: 156, stock: 35, specifications: { resolution: '4K (8MP)', nightVision: '30m IR', frameRate: '30fps', waterproof: 'IP67', warranty: '24 months' } },
    { id: 4, name: 'Hikvision Bullet', category: 'security', price: 320000, image: '/assets/img/product/hikvision-bullet.jpg', description: 'High-resolution bullet camera for wide-area surveillance. Advanced features include smart motion detection and intelligent video analysis.', rating: 4.6, reviews: 112, stock: 48, specifications: { resolution: '2K (5MP)', nightVision: '20m IR', frameRate: '30fps', waterproof: 'IP66', warranty: '24 months' } },
    { id: 5, name: 'Hikvision Thermal', category: 'security', price: 520000, image: '/assets/img/product/hikvision-thermal.jpg', description: 'Thermal imaging camera for advanced threat detection. Works in complete darkness and poor weather conditions. Ideal for perimeter security.', rating: 4.9, reviews: 87, stock: 12, specifications: { resolution: 'Thermal 640x512', range: '300m', frameRate: '25fps', sensitivity: '<50mK', warranty: '24 months' } },
    { id: 6, name: '4K NVR System', category: 'security', price: 450000, image: '/assets/img/product/nvr-4k.jpg', description: 'Network Video Recorder supporting up to 16 cameras. Enterprise-grade storage and recording capabilities. Supports 4K resolution recording and playback.', rating: 4.8, reviews: 134, stock: 18, specifications: { channels: '16 channels', storage: '4TB included', resolution: '4K', bandwidth: '80 Mbps', warranty: '36 months' } },
    { id: 7, name: 'Access Control System', category: 'security', price: 190000, image: '/assets/img/product/access-control.jpg', description: 'Advanced access control with RFID and facial recognition. Manage facility access with biometric authentication. Integrated database for up to 5000 users.', rating: 4.7, reviews: 89, stock: 25, specifications: { users: 'Up to 5000', recognition: 'Facial + RFID', speed: '<0.5 second', capacity: '50,000 events', warranty: '24 months' } },
    { id: 8, name: 'Enterprise Firewall', category: 'networking', price: 1200000, image: '/assets/img/product/firewall-enterprise.jpg', description: 'High-performance firewall for enterprise networks. Protects against advanced threats with machine learning detection. Supports up to 1 Gbps throughput.', rating: 4.8, reviews: 76, stock: 8, specifications: { throughput: '1 Gbps', connections: '1M concurrent', threat: 'AI-based detection', vpn: 'Yes', warranty: '36 months' } },
    { id: 9, name: 'Managed Switch', category: 'networking', price: 280000, image: '/assets/img/product/managed-switch.jpg', description: 'Professional managed switch with 48 gigabit ports. Features VLAN support, QoS, and advanced management capabilities. Perfect for enterprise deployments.', rating: 4.6, reviews: 98, stock: 30, specifications: { ports: '48x 1G + 4x 10G', vlan: 'Yes', qos: 'Yes', power: 'Redundant PSU', warranty: '24 months' } },
    { id: 10, name: 'Wireless Access Point', category: 'networking', price: 150000, image: '/assets/img/product/wireless-ap.jpg', description: 'High-performance wireless access point with WiFi 6 support. Covers up to 5000 sq ft with strong signal. Perfect for offices and retail spaces.', rating: 4.7, reviews: 142, stock: 55, specifications: { standard: 'WiFi 6 (802.11ax)', coverage: '5000 sq ft', speed: 'AX3000', power: 'PoE', warranty: '24 months' } },
    { id: 11, name: 'Network Router', category: 'networking', price: 380000, image: '/assets/img/product/router-network.jpg', description: 'Enterprise-grade router with dual WAN support. Supports advanced routing protocols and traffic management. Ideal for multi-location setups.', rating: 4.9, reviews: 111, stock: 20, specifications: { wan: 'Dual WAN', throughput: '5 Gbps', protocols: 'BGP, OSPF', failover: 'Automatic', warranty: '36 months' } },
    { id: 12, name: 'Network Cable Bundle', category: 'networking', price: 85000, image: '/assets/img/product/cable-bundle.jpg', description: 'Premium Cat6A networking cables. 100-meter bundle includes termination kit. Perfect for structured cabling installations.', rating: 4.5, reviews: 64, stock: 100, specifications: { standard: 'Cat6A', length: '100m', shield: 'Shielded (STP)', speed: 'Up to 10Gbps', warranty: '12 months' } },
  ]

  // Load product details
  useEffect(() => {
    const foundProduct = products.find((p) => p.id === parseInt(id))
    setProduct(foundProduct)
    setLoading(false)
  }, [id])

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity)
      setAddedToCart(true)
      setTimeout(() => setAddedToCart(false), 2000)
    }
  }

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value)
    if (value > 0 && value <= (product?.stock || 1)) {
      setQuantity(value)
    }
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '200px 20px' }}>
        <div className="spinner" style={{ display: 'inline-block', width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #2D8BD1', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        <p style={{ marginTop: '20px', color: '#666' }}>Loading product details...</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div style={{ textAlign: 'center', padding: '200px 20px' }}>
        <h2 style={{ color: '#333' }}>Product not found</h2>
        <p style={{ color: '#666' }}>Sorry, this product doesn't exist.</p>
        <a href="/shop" style={{ color: '#2D8BD1', textDecoration: 'none', fontWeight: 'bold' }}>← Back to Shop</a>
      </div>
    )
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('rw-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const styles = {
    header: {
      background: 'linear-gradient(135deg, #2D8BD1 0%, #37A6E5 100%)',
      color: 'white',
      padding: '40px 20px',
      textAlign: 'center',
      marginBottom: '40px',
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 20px',
    },
    breadcrumb: {
      fontSize: '14px',
      marginBottom: '30px',
      color: '#666',
    },
    breadcrumbLink: {
      color: '#2D8BD1',
      textDecoration: 'none',
      marginRight: '10px',
    },
    productSection: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '40px',
      marginBottom: '60px',
      '@media (max-width: 768px)': {
        gridTemplateColumns: '1fr',
        gap: '20px',
      },
    },
    imageContainer: {
      background: '#f8f9fa',
      borderRadius: '12px',
      padding: '30px',
      textAlign: 'center',
    },
    image: {
      maxWidth: '100%',
      height: 'auto',
      borderRadius: '8px',
      maxHeight: '500px',
      objectFit: 'cover',
    },
    detailsContainer: {
      paddingRight: '20px',
    },
    title: {
      fontSize: '32px',
      fontWeight: '700',
      color: '#333',
      marginBottom: '15px',
    },
    category: {
      display: 'inline-block',
      background: '#2D8BD1',
      color: 'white',
      padding: '6px 14px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600',
      marginBottom: '20px',
      textTransform: 'capitalize',
    },
    rating: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      marginBottom: '20px',
      fontSize: '14px',
      color: '#666',
    },
    stars: {
      color: '#FFC107',
      fontSize: '16px',
    },
    price: {
      fontSize: '28px',
      fontWeight: '700',
      color: '#2D8BD1',
      marginBottom: '20px',
    },
    description: {
      fontSize: '16px',
      color: '#666',
      lineHeight: '1.6',
      marginBottom: '30px',
    },
    specifications: {
      background: '#f8f9fa',
      padding: '20px',
      borderRadius: '8px',
      marginBottom: '30px',
    },
    specTitle: {
      fontWeight: '600',
      color: '#333',
      marginBottom: '12px',
      fontSize: '14px',
    },
    specItem: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '8px 0',
      borderBottom: '1px solid #e0e0e0',
      fontSize: '14px',
      color: '#666',
    },
    actionButtons: {
      display: 'flex',
      gap: '15px',
      marginTop: '30px',
      flexWrap: 'wrap',
    },
    quantityContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      marginBottom: '20px',
    },
    quantityInput: {
      width: '70px',
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '6px',
      fontSize: '14px',
      textAlign: 'center',
    },
    addButton: {
      background: 'linear-gradient(135deg, #2D8BD1 0%, #37A6E5 100%)',
      color: 'white',
      border: 'none',
      padding: '14px 30px',
      borderRadius: '6px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      flex: '1',
      minWidth: '200px',
    },
    wishlistButton: {
      background: 'white',
      color: '#2D8BD1',
      border: '2px solid #2D8BD1',
      padding: '12px 30px',
      borderRadius: '6px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    successMessage: {
      background: '#4caf50',
      color: 'white',
      padding: '12px 20px',
      borderRadius: '6px',
      marginTop: '10px',
      display: addedToCart ? 'block' : 'none',
      animation: 'slideIn 0.3s ease',
    },
    stockStatus: {
      marginTop: '15px',
      fontSize: '14px',
      fontWeight: '600',
    },
    inStock: {
      color: '#4caf50',
    },
    lowStock: {
      color: '#ff9800',
    },
    outOfStock: {
      color: '#f44336',
    },
    reviewsSection: {
      marginTop: '60px',
      paddingTop: '40px',
      borderTop: '2px solid #e0e0e0',
    },
    reviewsTitle: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#333',
      marginBottom: '20px',
    },
    reviewCard: {
      background: '#f8f9fa',
      padding: '20px',
      borderRadius: '8px',
      marginBottom: '15px',
    },
    reviewerName: {
      fontWeight: '600',
      color: '#333',
      marginBottom: '5px',
    },
    reviewRating: {
      color: '#FFC107',
      fontSize: '14px',
      marginBottom: '10px',
    },
    reviewText: {
      color: '#666',
      fontSize: '14px',
      lineHeight: '1.6',
    },
  }

  return (
    <div>
      {/* Header */}
      <header style={{ background: '#1a1a1a', color: 'white', padding: '20px', marginBottom: '30px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '700', margin: 0 }}>Product Details</h1>
        </div>
      </header>

      <div style={styles.container}>
        {/* Breadcrumb */}
        <div style={styles.breadcrumb}>
          <a href="/" style={styles.breadcrumbLink}>Home</a>
          <span>/</span>
          <a href="/shop" style={styles.breadcrumbLink}>Shop</a>
          <span>/</span>
          <span>{product.name}</span>
        </div>

        {/* Product Section */}
        <div style={styles.productSection}>
          {/* Image */}
          <div style={styles.imageContainer}>
            <img src={product.image} alt={product.name} style={styles.image} />
            <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
              📷 Product Image
            </div>
          </div>

          {/* Details */}
          <div style={styles.detailsContainer}>
            <span style={styles.category}>{product.category}</span>
            <h1 style={styles.title}>{product.name}</h1>

            {/* Rating */}
            <div style={styles.rating}>
              <span style={styles.stars}>
                {'★'.repeat(Math.floor(product.rating))}{'☆'.repeat(5 - Math.floor(product.rating))}
              </span>
              <span>{product.rating}/5</span>
              <span>({product.reviews} reviews)</span>
            </div>

            {/* Price */}
            <div style={styles.price}>{formatPrice(product.price)}</div>

            {/* Description */}
            <p style={styles.description}>{product.description}</p>

            {/* Specifications */}
            <div style={styles.specifications}>
              <div style={styles.specTitle}>Key Specifications</div>
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} style={styles.specItem}>
                  <span style={{ fontWeight: '500', textTransform: 'capitalize' }}>{key.replace(/([A-Z])/g, ' $1')}:</span>
                  <span>{value}</span>
                </div>
              ))}
            </div>

            {/* Stock Status */}
            <div style={styles.stockStatus}>
              {product.stock > 10 ? (
                <span style={styles.inStock}>✓ In Stock ({product.stock} available)</span>
              ) : product.stock > 0 ? (
                <span style={styles.lowStock}>⚠ Low Stock ({product.stock} left)</span>
              ) : (
                <span style={styles.outOfStock}>✗ Out of Stock</span>
              )}
            </div>

            {/* Quantity Selector */}
            <div style={styles.quantityContainer}>
              <label htmlFor="quantity" style={{ fontWeight: '600', color: '#333' }}>
                Quantity:
              </label>
              <select
                id="quantity"
                value={quantity}
                onChange={handleQuantityChange}
                style={styles.quantityInput}
                disabled={product.stock === 0}
              >
                {Array.from({ length: Math.min(product.stock, 10) }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>

            {/* Action Buttons */}
            <div style={styles.actionButtons}>
              <button
                onClick={handleAddToCart}
                style={{
                  ...styles.addButton,
                  opacity: product.stock === 0 ? 0.5 : 1,
                  cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
                }}
                disabled={product.stock === 0}
                onMouseOver={(e) => {
                  if (product.stock > 0) {
                    e.target.style.transform = 'translateY(-2px)'
                    e.target.style.boxShadow = '0 8px 16px rgba(45, 139, 209, 0.3)'
                  }
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)'
                  e.target.style.boxShadow = 'none'
                }}
              >
                {product.stock === 0 ? 'Out of Stock' : '🛒 Add to Cart'}
              </button>
              <button
                style={styles.wishlistButton}
                onMouseOver={(e) => {
                  e.target.style.background = '#f0f6ff'
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'white'
                }}
              >
                ❤ Add to Wishlist
              </button>
            </div>

            {/* Success Message */}
            <div style={styles.successMessage}>
              ✓ Added {quantity} item(s) to cart successfully!
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div style={styles.reviewsSection}>
          <h2 style={styles.reviewsTitle}>Customer Reviews</h2>
          <p style={{ color: '#666', marginBottom: '20px' }}>
            Based on {product.reviews} verified purchases
          </p>

          <div style={styles.reviewCard}>
            <div style={styles.reviewerName}>John Smith</div>
            <div style={styles.reviewRating}>★★★★★ 5/5</div>
            <div style={styles.reviewText}>
              Excellent product! Perfect for our security setup. Highly recommended for professional installations.
            </div>
          </div>

          <div style={styles.reviewCard}>
            <div style={styles.reviewerName}>Sarah Johnson</div>
            <div style={styles.reviewRating}>★★★★☆ 4.5/5</div>
            <div style={styles.reviewText}>
              Great quality and excellent support. The installation process was straightforward and the results exceeded our expectations.
            </div>
          </div>

          <div style={styles.reviewCard}>
            <div style={styles.reviewerName}>Michael Brown</div>
            <div style={styles.reviewRating}>★★★★★ 5/5</div>
            <div style={styles.reviewText}>
              Outstanding performance and reliability. We've been using this for 6 months without any issues. Worth every penny!
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ background: '#1a1a1a', color: 'white', padding: '60px 20px 20px', marginTop: '80px', textAlign: 'center' }}>
        <p>&copy; 2025 Fabritech. All rights reserved.</p>
      </footer>

      <style>{`
        @media (max-width: 768px) {
          ${`
            div[style*="gridTemplateColumns: 1fr 1fr"] {
              grid-template-columns: 1fr !important;
            }
          `}
        }
      `}</style>
    </div>
  )
}

export default ProductDetail
