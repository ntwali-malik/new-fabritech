import React, { useState, useEffect } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { useCart } from '../Context/CartContext'
import useTemplateScripts from '../hooks/useTemplateScripts'
import { getProductById } from '../services/productService'

const ProductDetail = () => {
  useTemplateScripts()
  
  const { id } = useParams()
  const location = useLocation()
  const { addToCart } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [addedToCart, setAddedToCart] = useState(false)
  const [error, setError] = useState('')

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
  // Load product details (prioritize navigation state, then API, then fallback list)
  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true)
      setError('')

      // 1) If product was passed via navigation state, use it directly
      const stateProduct = location.state?.product
      if (stateProduct) {
        setProduct(stateProduct)
        setLoading(false)
        return
      }

      // 2) Try to fetch from API
      try {
        const apiProduct = await getProductById(id)
        setProduct(apiProduct)
        setLoading(false)
        return
      } catch (apiError) {
        console.warn('API product fetch failed, falling back to static list:', apiError)
        setError(apiError.message || 'Product not found')
      }

      // 3) Fallback to static catalog
      const fallback = products.find((p) => String(p.id) === String(id))
      setProduct(fallback || null)
      setLoading(false)
    }

    loadProduct()
  }, [id, location.state])

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
        <p style={{ color: '#666' }}>{error || "Sorry, this product doesn't exist."}</p>
        <a href="/shop" style={{ color: '#2D8BD1', textDecoration: 'none', fontWeight: 'bold' }}>← Back to Shop</a>
      </div>
    )
  }

  const normalizePrice = (price) => {
    if (typeof price === 'number') return price
    if (typeof price === 'string') {
      const numeric = parseFloat(price.replace(/[^\d.]/g, ''))
      return Number.isNaN(numeric) ? 0 : numeric
    }
    return 0
  }

  // Normalize product fields to avoid null/undefined access
  const safeProduct = {
    ...product,
    specifications: product?.specifications || {},
    rating: normalizePrice(product?.rating) || product?.rating || 0,
    reviews: product?.reviews || 0,
    stock: product?.stock ?? 0,
    image: product?.image || '/placeholder-image.png',
    category: product?.category || 'general',
    name: product?.name || product?.title || 'Product',
    price: product?.price ?? product?.priceNew ?? 0,
  }

  const formatPrice = (price) => {
    const numeric = normalizePrice(price)
    return new Intl.NumberFormat('rw-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numeric)
  }

  const styles = {
    page: {
      background: 'linear-gradient(135deg, #f5f7fa 0%, #e9f1fb 100%)',
      minHeight: '100vh',
      color: '#0f172a',
    },
    hero: {
      position: 'relative',
      padding: '60px 20px 80px',
      backgroundImage: `linear-gradient(135deg, rgba(45,139,209,0.9) 0%, rgba(55,166,229,0.85) 50%, rgba(26,79,151,0.85) 100%), url('${safeProduct.image || '/assets/img/product/banner.png'}')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      overflow: 'hidden',
    },
    heroOverlay: {
      position: 'absolute',
      inset: 0,
      background: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.08), transparent 40%), radial-gradient(circle at 80% 0%, rgba(255,255,255,0.06), transparent 35%)',
      pointerEvents: 'none',
    },
    nav: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '16px',
      maxWidth: '1200px',
      margin: '0 auto 32px',
      padding: '0 10px',
      position: 'relative',
      zIndex: 2,
    },
    logo: {
      fontWeight: '900',
      fontSize: '20px',
      color: '#fff',
      textDecoration: 'none',
      letterSpacing: '0.5px',
    },
    navLinks: {
      display: 'flex',
      gap: '18px',
      flexWrap: 'wrap',
      alignItems: 'center',
    },
    navLink: {
      color: '#0f172a',
      textDecoration: 'none',
      fontWeight: 700,
      fontSize: '14px',
      padding: '10px 14px',
      borderRadius: '10px',
      transition: 'all 0.25s ease',
      border: '1px solid rgba(26,79,151,0.08)',
      background: 'rgba(255,255,255,0.9)',
    },
    cta: {
      color: '#fff',
      background: 'linear-gradient(135deg, #2D8BD1 0%, #1A4F97 100%)',
      borderRadius: '12px',
      fontWeight: 800,
      padding: '10px 16px',
      textDecoration: 'none',
      boxShadow: '0 12px 30px rgba(45,139,209,0.35)',
      border: 'none',
    },
    heroContent: {
      position: 'relative',
      zIndex: 2,
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 10px',
      display: 'grid',
      gap: '16px',
    },
    badgeRow: {
      display: 'flex',
      gap: '10px',
      alignItems: 'center',
      flexWrap: 'wrap',
      color: '#0f172a',
      fontSize: '13px',
      fontWeight: 700,
      letterSpacing: '0.5px',
    },
    heroTitle: {
      fontSize: '40px',
      fontWeight: '900',
      color: '#fff',
      margin: '0',
      textShadow: '0 12px 30px rgba(0,0,0,0.25)',
    },
    heroSubtitle: {
      color: '#e8f2fb',
      maxWidth: '720px',
      lineHeight: 1.7,
      margin: '0',
      fontSize: '16px',
    },
    breadcrumb: {
      display: 'flex',
      gap: '8px',
      alignItems: 'center',
      fontSize: '13px',
      color: '#1f2937',
      flexWrap: 'wrap',
      marginTop: '4px',
    },
    breadcrumbLink: {
      color: '#0f172a',
      textDecoration: 'none',
      fontWeight: 700,
    },
    container: {
      maxWidth: '1200px',
      margin: '-60px auto 60px',
      padding: '0 16px',
      position: 'relative',
      zIndex: 3,
    },
    cardGrid: {
      display: 'grid',
      gridTemplateColumns: '1.05fr 0.95fr',
      gap: '28px',
      alignItems: 'stretch',
    },
    panel: {
      background: '#ffffff',
      border: '1px solid rgba(0,0,0,0.04)',
      borderRadius: '18px',
      padding: '24px',
      boxShadow: '0 18px 40px rgba(15,23,42,0.12)',
      backdropFilter: 'none',
    },
    imageContainer: {
      position: 'relative',
      borderRadius: '14px',
      overflow: 'hidden',
      background: 'linear-gradient(145deg, #f8fafc 0%, #eef2f7 100%)',
      border: '1px solid rgba(0,0,0,0.04)',
      minHeight: '420px',
      display: 'grid',
      placeItems: 'center',
      padding: '12px',
    },
    image: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      borderRadius: '10px',
      boxShadow: '0 16px 38px rgba(15,23,42,0.18)',
    },
    detailsContainer: {
      display: 'grid',
      gap: '14px',
    },
    chipRow: {
      display: 'flex',
      gap: '10px',
      flexWrap: 'wrap',
      alignItems: 'center',
    },
    category: {
      background: 'rgba(45,139,209,0.12)',
      color: '#1A4F97',
      padding: '8px 14px',
      borderRadius: '999px',
      fontSize: '12px',
      fontWeight: '800',
      letterSpacing: '0.6px',
      border: '1px solid rgba(45,139,209,0.2)',
      textTransform: 'uppercase',
    },
    title: {
      fontSize: '32px',
      fontWeight: '900',
      color: '#0f172a',
      margin: '0',
      lineHeight: 1.2,
    },
    rating: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      color: '#475569',
      fontWeight: 700,
    },
    stars: {
      color: '#facc15',
      fontSize: '16px',
    },
    price: {
      fontSize: '30px',
      fontWeight: '900',
      color: '#1A4F97',
      margin: '4px 0 6px',
      textShadow: '0 10px 26px rgba(56,189,248,0.35)',
    },
    description: {
      fontSize: '15px',
      color: '#475569',
      lineHeight: 1.7,
      margin: '6px 0 4px',
    },
    specsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
      gap: '12px',
      marginTop: '6px',
    },
    specCard: {
      background: '#f8fafc',
      border: '1px solid rgba(0,0,0,0.04)',
      borderRadius: '12px',
      padding: '12px 14px',
      color: '#0f172a',
      fontSize: '13px',
      lineHeight: 1.5,
    },
    specLabel: {
      fontWeight: 800,
      color: '#64748b',
      textTransform: 'capitalize',
      fontSize: '12px',
    },
    specValue: {
      fontWeight: 800,
      color: '#0f172a',
      marginTop: '4px',
    },
    stockStatus: {
      marginTop: '6px',
      fontSize: '13px',
      fontWeight: '800',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 12px',
      borderRadius: '10px',
      border: '1px solid rgba(0,0,0,0.05)',
      background: '#eef2f7',
      color: '#0f172a',
    },
    inStock: { color: '#16a34a' },
    lowStock: { color: '#d97706' },
    outOfStock: { color: '#dc2626' },
    quantityRow: {
      display: 'flex',
      gap: '10px',
      alignItems: 'center',
      flexWrap: 'wrap',
      marginTop: '10px',
    },
    quantityInput: {
      width: '82px',
      padding: '12px',
      background: '#fff',
      border: '1px solid rgba(0,0,0,0.08)',
      color: '#0f172a',
      borderRadius: '10px',
      fontWeight: 800,
      textAlign: 'center',
    },
    actionButtons: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '12px',
      marginTop: '14px',
    },
    addButton: {
      background: 'linear-gradient(135deg, #2D8BD1 0%, #1A4F97 100%)',
      color: '#fff',
      border: 'none',
      padding: '14px 18px',
      borderRadius: '12px',
      fontSize: '15px',
      fontWeight: '800',
      cursor: 'pointer',
      boxShadow: '0 14px 34px rgba(26,79,151,0.25)',
      flex: '1 1 220px',
      transition: 'all 0.25s ease',
    },
    wishlistButton: {
      background: '#ffffff',
      color: '#1A4F97',
      border: '1px solid rgba(26,79,151,0.2)',
      padding: '12px 16px',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '800',
      cursor: 'pointer',
      flex: '1 1 180px',
      transition: 'all 0.25s ease',
    },
    successMessage: {
      background: 'rgba(74,222,128,0.12)',
      color: '#166534',
      padding: '12px 14px',
      borderRadius: '12px',
      marginTop: '10px',
      display: addedToCart ? 'block' : 'none',
      border: '1px solid rgba(74,222,128,0.25)',
      fontWeight: 800,
      fontSize: '14px',
    },
    reviewsSection: {
      marginTop: '32px',
      padding: '24px',
      borderRadius: '16px',
      background: '#ffffff',
      border: '1px solid rgba(0,0,0,0.05)',
      boxShadow: '0 12px 30px rgba(15,23,42,0.12)',
    },
    reviewsTitle: {
      fontSize: '22px',
      fontWeight: '900',
      color: '#0f172a',
      marginBottom: '12px',
    },
    reviewCard: {
      background: '#f8fafc',
      border: '1px solid rgba(0,0,0,0.04)',
      borderRadius: '12px',
      padding: '14px',
      marginBottom: '12px',
      color: '#0f172a',
    },
    reviewerName: {
      fontWeight: '800',
      marginBottom: '6px',
    },
    reviewRating: {
      color: '#fbbf24',
      fontSize: '13px',
      marginBottom: '6px',
    },
    reviewText: {
      color: '#475569',
      fontSize: '14px',
      lineHeight: 1.6,
    },
    footer: {
      background: '#f8fafc',
      color: '#475569',
      textAlign: 'center',
      padding: '32px 16px',
      borderTop: '1px solid rgba(0,0,0,0.05)',
    },
    responsive: `
      @media (max-width: 1024px) {
        .pd-grid { grid-template-columns: 1fr; }
      }
      @media (max-width: 768px) {
        .pd-nav { flex-direction: column; align-items: flex-start; }
        .pd-card { padding: 18px; }
        .pd-hero-title { font-size: 32px; }
        .pd-hero { padding: 48px 16px 70px; }
      }
    `,
  }

  return (
    <div style={styles.page}>
      {/* Hero + Navbar */}
      <section style={styles.hero} className="pd-hero">
        <div style={styles.heroOverlay}></div>
        <nav style={styles.nav} className="pd-nav">
          <a href="/" style={styles.logo}>Fabritech</a>
          <div style={styles.navLinks}>
            <a href="/#home" style={styles.navLink}>Home</a>
            <a href="/#products" style={styles.navLink}>Shop</a>
            <a href="/#contact" style={styles.navLink}>Contact</a>
            <a href="/contact" style={styles.cta}>Talk to us</a>
          </div>
        </nav>

        <div style={styles.heroContent}>
          <div style={styles.badgeRow}>
            <span style={{ background: 'rgba(255,255,255,0.14)', padding: '6px 12px', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.18)' }}>
              {safeProduct.category}
            </span>
          </div>
          <h1 style={styles.heroTitle} className="pd-hero-title">{safeProduct.name}</h1>
          <div style={styles.breadcrumb}>
            <a href="/" style={styles.breadcrumbLink}>Home</a>
            <span>/</span>
            <a href="/shop" style={styles.breadcrumbLink}>Shop</a>
            <span>/</span>
            <span>{safeProduct.name}</span>
          </div>
        </div>
      </section>

      {/* Main content */}
      <div style={styles.container}>
        <style>{styles.responsive}</style>
        <div style={styles.cardGrid} className="pd-grid">
          {/* Image panel */}
          <div style={{ ...styles.panel, padding: '18px' }} className="pd-card">
            <div style={styles.imageContainer}>
              <img src={safeProduct.image} alt={safeProduct.name} style={styles.image} />
            </div>
          </div>

          {/* Details panel */}
          <div style={styles.panel} className="pd-card">
            <div style={styles.detailsContainer}>
              <div style={styles.chipRow}>
                <span style={styles.category}>{safeProduct.category}</span>
                <span style={styles.stockStatus}>
                  {safeProduct.stock > 10 ? (
                    <span style={styles.inStock}>● In Stock ({safeProduct.stock})</span>
                  ) : safeProduct.stock > 0 ? (
                    <span style={styles.lowStock}>● Low Stock ({safeProduct.stock})</span>
                  ) : (
                    <span style={styles.outOfStock}>● Out of Stock</span>
                  )}
                </span>
              </div>

              <h1 style={styles.title}>{safeProduct.name}</h1>

              <div style={styles.rating}>
                <span style={styles.stars}>
                  {'★'.repeat(Math.floor(safeProduct.rating))}{'☆'.repeat(5 - Math.floor(safeProduct.rating))}
                </span>
                <span>{safeProduct.rating}/5</span>
              </div>

              <div style={styles.price}>{formatPrice(safeProduct.price)}</div>

              <p style={styles.description}>{safeProduct.description}</p>

              {/* Key Features - Show only top 3 specifications if available */}
              {Object.keys(safeProduct.specifications).length > 0 && (
                <div style={{ marginTop: '16px', padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.04)' }}>
                  <h4 style={{ margin: '0 0 12px', fontSize: '14px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Key Features</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
                    {Object.entries(safeProduct.specifications).slice(0, 4).map(([key, value]) => (
                      <div key={key} style={{ fontSize: '13px', lineHeight: 1.6 }}>
                        <span style={{ fontWeight: 700, color: '#64748b' }}>{key.replace(/([A-Z])/g, ' $1').trim()}: </span>
                        <span style={{ fontWeight: 800, color: '#0f172a' }}>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div style={styles.quantityRow}>
                <label htmlFor="quantity" style={{ fontWeight: 800, color: '#64748b', fontSize: '14px' }}>Quantity:</label>
                <select
                  id="quantity"
                  value={quantity}
                  onChange={handleQuantityChange}
                  style={styles.quantityInput}
                  disabled={safeProduct.stock === 0}
                >
                  {Array.from({ length: Math.min(safeProduct.stock, 10) }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>

              <div style={styles.actionButtons}>
                <button
                  onClick={handleAddToCart}
                  style={{
                    ...styles.addButton,
                    opacity: safeProduct.stock === 0 ? 0.5 : 1,
                    cursor: safeProduct.stock === 0 ? 'not-allowed' : 'pointer',
                  }}
                  disabled={safeProduct.stock === 0}
                  onMouseOver={(e) => {
                    if (safeProduct.stock > 0) {
                      e.target.style.transform = 'translateY(-2px)'
                      e.target.style.boxShadow = '0 8px 16px rgba(56,189,248,0.35)'
                    }
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0)'
                    e.target.style.boxShadow = 'none'
                  }}
                >
                  {safeProduct.stock === 0 ? 'Out of Stock' : '🛒 Add to Cart'}
                </button>
                <button
                  style={styles.wishlistButton}
                  onMouseOver={(e) => { e.target.style.borderColor = '#38bdf8'; e.target.style.color = '#38bdf8' }}
                  onMouseOut={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.color = '#e0f2fe' }}
                >
                  ❤ Add to Wishlist
                </button>
              </div>

              <div style={styles.successMessage}>
                ✓ Added {quantity} item(s) to cart successfully!
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Footer */}
      <footer style={styles.footer}>
        <p style={{ margin: 0 }}>&copy; 2025 Fabritech. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default ProductDetail
