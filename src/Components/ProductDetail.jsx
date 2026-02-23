import React, { useState, useEffect } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { useCart } from '../Context/CartContext'
import useTemplateScripts from '../hooks/useTemplateScripts'
import { getProductById } from '../services/productService'
import CartIcon from './CartIcon'
import UserMenu from './UserMenu'
import '../App.css'

const ProductDetail = () => {
  useTemplateScripts()
  
  // Ensure CSS and template scripts are loaded
  useEffect(() => {
    // Force re-initialization of template scripts if needed
    if (typeof window !== 'undefined' && window.jQuery) {
      // Template scripts are already loaded via useTemplateScripts
    }
  }, [])
  
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { addToCart, cartItems, removeFromCart: removeFromCartContext } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [addedToCart, setAddedToCart] = useState(false)
  const [error, setError] = useState('')
  const [expandedSections, setExpandedSections] = useState({})
  const [selectedOptions, setSelectedOptions] = useState({})
  const [deliveryCountry, setDeliveryCountry] = useState('Rwanda')
  const [deliveryCity, setDeliveryCity] = useState('Kigali')
  const [deliveryType, setDeliveryType] = useState('courier')
  const [isImageFullscreen, setIsImageFullscreen] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [showCart, setShowCart] = useState(false)

  // Icon handlers - defined early so they're always available
  const toggleCart = () => {
    navigate('/cart')
  }
  
  const handleCheckout = () => {
    setShowCart(false)
    navigate('/cart')
  }

  const removeFromCart = (index) => {
    if (cartItems[index]) {
      removeFromCartContext(cartItems[index].id)
    }
  }
  
  // Prevent body scroll when cart is open
  useEffect(() => {
    if (showCart) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [showCart])

  const handleFullscreen = () => {
    setIsImageFullscreen(true)
  }

  const handleShare = async () => {
    if (!product) return
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name || product.title || 'Product',
          text: product.description || '',
          url: window.location.href,
        })
      } catch (err) {
        console.log('Error sharing:', err)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href).then(() => {
        alert('Product link copied to clipboard!')
      }).catch(() => {
        console.log('Failed to copy to clipboard')
      })
    }
  }

  const handleDownload = () => {
    if (!product) return
    const productName = (product.name || product.title || 'product').replace(/\s+/g, '-')
    const link = document.createElement('a')
    link.href = product.image || ''
    link.download = `${productName}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

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

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value)
    if (value > 0 && value <= (product?.stock || 1)) {
      setQuantity(value)
    }
  }

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const selectOption = (section, option) => {
    setSelectedOptions(prev => ({
      ...prev,
      [section]: option
    }))
  }

  const calculateDeliveryCost = () => {
    // Free delivery in Kigali, chargeable outside Kigali
    if (deliveryCity === 'Kigali') {
      return 0
    }
    // Delivery cost based on delivery type for cities outside Kigali
    return deliveryType === 'courier' ? 30000 : deliveryType === 'express' ? 40000 : 20000
  }

  const increaseQuantity = () => {
    const maxStock = product?.stock || 10
    if (quantity < Math.min(maxStock, 10)) {
      setQuantity(quantity + 1)
    }
  }

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
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

  // Handle add to cart - defined after safeProduct is created
  const handleAddToCart = async () => {
    if (safeProduct && safeProduct.stock > 0) {
      try {
        // Add product with selected quantity to cart
        await addToCart(safeProduct, quantity)
        setAddedToCart(true)
        setTimeout(() => setAddedToCart(false), 2000)
      } catch (error) {
        console.error('Error adding to cart:', error)
        alert(error.message || 'Failed to add item to cart. Please try again.')
      }
    }
  }

  // Get customization options from specifications
  const getCustomizationOptions = (specs) => {
    const options = {}
    
    Object.keys(specs || {}).forEach(key => {
      const value = specs[key]
      if (typeof value === 'string' && value.includes(',')) {
        options[key] = value.split(',').map(v => v.trim())
      } else {
        options[key] = [String(value)]
      }
    })
    
    return options
  }

  const styles = {
    page: {
      background: '#ffffff',
      minHeight: '100vh',
      color: '#333333',
    },
    header: {
      background: '#ffffff',
      borderBottom: '1px solid #e5e7eb',
      padding: '16px 24px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    },
    headerContent: {
      maxWidth: '1600px',
      margin: '0 auto',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '20px',
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '24px',
    },
    headerLogo: {
      fontSize: '20px',
      fontWeight: '700',
      color: '#1A4F97',
      textDecoration: 'none',
    },
    breadcrumb: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '14px',
      color: '#6b7280',
    },
    breadcrumbLink: {
      color: '#6b7280',
      textDecoration: 'none',
      transition: 'color 0.2s',
    },
    breadcrumbSeparator: {
      color: '#d1d5db',
    },
    headerIcons: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
    },
    iconButton: {
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      padding: '8px',
      fontSize: '18px',
      color: '#4b5563',
      transition: 'color 0.2s',
      position: 'relative',
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
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '60px 24px',
      position: 'relative',
      width: '100%',
      boxSizing: 'border-box',
    },
    productLayout: {
      display: 'grid',
      gridTemplateColumns: '1fr 450px',
      gap: '60px',
      alignItems: 'flex-start',
      width: '100%',
      boxSizing: 'border-box',
    },
    thumbnailGallery: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '12px',
    },
    thumbnailArrow: {
      background: 'transparent',
      border: '1px solid #e5e7eb',
      borderRadius: '6px',
      padding: '8px',
      cursor: 'pointer',
      color: '#6b7280',
      fontSize: '14px',
      transition: 'all 0.2s ease',
      width: '40px',
      height: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    thumbnailList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      maxHeight: '500px',
      overflowY: 'auto',
    },
    thumbnailItem: {
      width: '80px',
      height: '80px',
      border: '2px solid #e5e7eb',
      borderRadius: '8px',
      overflow: 'hidden',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      background: '#ffffff',
    },
    thumbnailItemActive: {
      borderColor: '#2D8BD1',
      boxShadow: '0 0 0 2px rgba(45, 139, 209, 0.2)',
    },
    thumbnailImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
    mainImageSection: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px',
      opacity: 0,
      animation: 'fadeInLeft 0.8s ease-out 0.2s forwards',
    },
    mainImageContainer: {
      width: '100%',
      maxWidth: '600px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#ffffff',
      borderRadius: '12px',
      overflow: 'hidden',
    },
    mainProductImage: {
      width: '100%',
      height: 'auto',
      maxHeight: '700px',
      objectFit: 'contain',
      display: 'block',
      transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
      opacity: 0,
      animation: 'scaleIn 1s ease-out 0.3s forwards',
    },
    productInfoSection: {
      padding: '0 20px',
      opacity: 0,
      animation: 'fadeInRight 0.8s ease-out 0.4s forwards',
    },
    productCategoryLabel: {
      fontSize: '12px',
      fontWeight: '600',
      color: '#9ca3af',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      marginBottom: '8px',
      opacity: 0,
      animation: 'fadeInUp 0.6s ease-out 0.5s forwards',
    },
    productName: {
      fontSize: '32px',
      fontWeight: '700',
      color: '#111827',
      margin: '0 0 16px 0',
      lineHeight: '1.2',
      opacity: 0,
      animation: 'fadeInUp 0.6s ease-out 0.6s forwards',
    },
    productRating: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '20px',
      opacity: 0,
      animation: 'fadeInUp 0.6s ease-out 0.7s forwards',
    },
    starRating: {
      display: 'flex',
      gap: '2px',
    },
    ratingText: {
      fontSize: '14px',
      color: '#6b7280',
      fontWeight: '500',
    },
    productPrice: {
      fontSize: '36px',
      fontWeight: '800',
      color: '#111827',
      marginBottom: '24px',
      opacity: 0,
      animation: 'fadeInUp 0.6s ease-out 0.8s forwards',
      transition: 'transform 0.3s ease',
    },
    productDescription: {
      fontSize: '15px',
      color: '#6b7280',
      lineHeight: '1.6',
      marginBottom: '32px',
      opacity: 0,
      animation: 'fadeInUp 0.6s ease-out 0.9s forwards',
    },
    colorSection: {
      marginBottom: '32px',
      opacity: 0,
      animation: 'fadeInUp 0.6s ease-out 1s forwards',
    },
    colorLabel: {
      fontSize: '12px',
      fontWeight: '600',
      color: '#374151',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      marginBottom: '12px',
    },
    colorSwatches: {
      display: 'flex',
      gap: '12px',
    },
    colorSwatchItem: {
      position: 'relative',
      cursor: 'pointer',
    },
    colorSwatchActive: {
      position: 'relative',
    },
    colorSwatchBox: {
      width: '50px',
      height: '50px',
      borderRadius: '8px',
      border: '2px solid #e5e7eb',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: 'pointer',
    },
    colorCheckmark: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      color: '#ffffff',
      fontSize: '20px',
      fontWeight: 'bold',
      pointerEvents: 'none',
      animation: 'scaleIn 0.3s ease-out',
    },
    sizeSection: {
      marginBottom: '24px',
    },
    sizeLabel: {
      fontSize: '12px',
      fontWeight: '600',
      color: '#374151',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      marginBottom: '8px',
      display: 'block',
    },
    sizeSelect: {
      width: '100%',
      padding: '14px 16px',
      border: '2px solid #e5e7eb',
      borderRadius: '8px',
      fontSize: '15px',
      fontWeight: '500',
      background: '#ffffff',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    quantitySectionNew: {
      marginBottom: '24px',
      opacity: 0,
      animation: 'fadeInUp 0.6s ease-out 1.1s forwards',
    },
    quantityLabel: {
      fontSize: '12px',
      fontWeight: '600',
      color: '#374151',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      marginBottom: '8px',
      display: 'block',
    },
    quantityControls: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    qtyButton: {
      width: '44px',
      height: '44px',
      border: '2px solid #e5e7eb',
      background: '#ffffff',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      color: '#374151',
    },
    qtyInput: {
      width: '80px',
      padding: '12px',
      border: '2px solid #e5e7eb',
      borderRadius: '8px',
      fontSize: '16px',
      textAlign: 'center',
      fontWeight: '600',
      transition: 'all 0.3s ease',
    },
    stockInfo: {
      fontSize: '14px',
      color: '#10b981',
      fontWeight: '600',
      marginBottom: '24px',
    },
    addToBagButton: {
      width: '100%',
      padding: '18px 24px',
      background: '#000000',
      color: '#ffffff',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '700',
      cursor: 'pointer',
      marginBottom: '24px',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      opacity: 0,
      animation: 'fadeInUp 0.6s ease-out 1.2s forwards',
    },
    successMessage: {
      marginTop: '16px',
      padding: '12px',
      background: '#f0fdf4',
      border: '1px solid #10b981',
      borderRadius: '6px',
      color: '#059669',
      fontSize: '14px',
      fontWeight: '600',
    },
    priceSummary: {
      paddingTop: '24px',
      borderTop: '1px solid #e5e7eb',
      opacity: 0,
      animation: 'fadeInUp 0.6s ease-out 1.3s forwards',
    },
    priceRow: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '12px',
      fontSize: '14px',
      color: '#6b7280',
    },
    priceRowTotal: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '12px',
      paddingTop: '12px',
      borderTop: '1px solid #e5e7eb',
      fontSize: '18px',
      fontWeight: '700',
      color: '#111827',
    },
    leftColumn: {
      background: '#ffffff',
      borderRadius: '12px',
      padding: '24px',
      position: 'sticky',
      top: '100px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
    },
    imageContainer: {
      position: 'relative',
      background: 'linear-gradient(135deg, #f9fafb 0%, #ffffff 100%)',
      borderRadius: '12px',
      padding: '40px',
      minHeight: '500px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '1px solid #e5e7eb',
      overflow: 'visible',
      width: '100%',
      boxSizing: 'border-box',
    },
    productImage: {
      width: '100%',
      height: 'auto',
      maxHeight: '600px',
      maxWidth: '100%',
      objectFit: 'contain',
      transition: 'transform 0.3s ease',
      cursor: 'zoom-in',
      display: 'block',
      visibility: 'visible',
      opacity: 1,
    },
    imageControls: {
      position: 'absolute',
      top: '16px',
      right: '16px',
      display: 'flex',
      gap: '8px',
      zIndex: 10,
    },
    imageControlBtn: {
      background: 'rgba(255,255,255,0.95)',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '10px 12px',
      cursor: 'pointer',
      fontSize: '16px',
      color: '#4b5563',
      transition: 'all 0.2s',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    middleColumn: {
      background: '#ffffff',
      borderRadius: '12px',
      padding: '32px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
    },
    productTitle: {
      fontSize: '32px',
      fontWeight: '800',
      color: '#111827',
      margin: '0 0 12px',
      lineHeight: '1.2',
    },
    productCategory: {
      display: 'inline-block',
      padding: '6px 12px',
      background: 'linear-gradient(135deg, #2D8BD1 0%, #1A4F97 100%)',
      color: '#ffffff',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      marginBottom: '16px',
    },
    sectionTitle: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#111827',
      margin: '32px 0 8px',
    },
    sectionSubtitle: {
      fontSize: '15px',
      color: '#6b7280',
      margin: '0 0 32px',
      lineHeight: '1.6',
    },
    customizationSection: {
      marginBottom: '24px',
      borderBottom: '1px solid #e5e7eb',
      paddingBottom: '24px',
    },
    sectionHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      cursor: 'pointer',
      padding: '12px 0',
    },
    sectionLabel: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#374151',
    },
    sectionArrow: {
      fontSize: '12px',
      color: '#9ca3af',
      transition: 'transform 0.3s',
    },
    sectionContent: {
      marginTop: '16px',
      display: 'grid',
      gap: '12px',
    },
    optionGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
      gap: '12px',
    },
    optionCard: {
      border: '2px solid #e5e7eb',
      borderRadius: '10px',
      padding: '16px 12px',
      cursor: 'pointer',
      textAlign: 'center',
      transition: 'all 0.3s ease',
      background: '#ffffff',
      position: 'relative',
      overflow: 'hidden',
    },
    optionCardSelected: {
      borderColor: '#10b981',
      background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
      boxShadow: '0 4px 12px rgba(16,185,129,0.2)',
      transform: 'scale(1.02)',
    },
    optionCardImage: {
      width: '100%',
      height: '60px',
      objectFit: 'contain',
      marginBottom: '8px',
    },
    optionCardText: {
      fontSize: '12px',
      color: '#374151',
      fontWeight: '500',
    },
    colorSwatch: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      border: '2px solid #e5e7eb',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    colorSwatchSelected: {
      borderColor: '#10b981',
      boxShadow: '0 0 0 3px rgba(16,185,129,0.2)',
    },
    rightColumn: {
      background: '#ffffff',
      borderRadius: '12px',
      padding: '32px',
      border: '1px solid #e5e7eb',
      position: 'sticky',
      top: '100px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
    },
    rightColumnTitle: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#111827',
      margin: '0 0 8px',
    },
    rightColumnSubtitle: {
      fontSize: '14px',
      color: '#6b7280',
      margin: '0 0 32px',
    },
    quantitySection: {
      marginBottom: '24px',
    },
    quantityRow: {
      display: 'flex',
      gap: '12px',
      alignItems: 'center',
    },
    quantityInput: {
      width: '80px',
      padding: '10px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '16px',
      textAlign: 'center',
    },
    quantityButton: {
      width: '36px',
      height: '36px',
      border: '1px solid #d1d5db',
      background: '#ffffff',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '18px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    promoButton: {
      padding: '10px 16px',
      border: '1px solid #d1d5db',
      background: '#ffffff',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
    },
    deliverySection: {
      marginBottom: '32px',
    },
    deliveryLabel: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#374151',
      marginBottom: '8px',
      display: 'block',
    },
    deliverySelect: {
      width: '100%',
      padding: '10px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '14px',
      marginBottom: '16px',
      background: '#ffffff',
    },
    deliveryTime: {
      fontSize: '12px',
      color: '#6b7280',
      marginTop: '4px',
    },
    orderSummary: {
      borderTop: '1px solid #e5e7eb',
      paddingTop: '24px',
      marginTop: '24px',
    },
    summaryRow: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '12px',
      fontSize: '14px',
      color: '#374151',
    },
    summaryRowTotal: {
      fontSize: '18px',
      fontWeight: '700',
      color: '#111827',
      marginTop: '8px',
      paddingTop: '12px',
      borderTop: '1px solid #e5e7eb',
    },
    checkoutButton: {
      width: '100%',
      padding: '16px',
      background: '#10b981',
      color: '#ffffff',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      marginTop: '24px',
      transition: 'background 0.2s',
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
      /* Cart Panel Styles - Same as Home.jsx */
      .product-modal-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.55);
        backdrop-filter: blur(2px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        padding: 20px;
      }
      .cart-panel {
        width: min(520px, 100%);
        max-height: 80vh;
        background: #fff;
        border-radius: 16px;
        box-shadow: 0 24px 60px rgba(0,0,0,0.18);
        overflow: hidden;
        display: flex;
        flex-direction: column;
      }
      .cart-panel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 18px 20px;
        border-bottom: 1px solid #e5e7eb;
        background: #f8fafc;
      }
      .cart-panel-title {
        margin: 0;
        font-size: 18px;
        font-weight: 800;
        color: #0f172a;
      }
      .cart-panel-body {
        padding: 16px 20px;
        overflow-y: auto;
        display: grid;
        gap: 12px;
      }
      .cart-line {
        display: flex;
        gap: 12px;
        align-items: center;
        padding: 12px;
        border: 1px solid #f1f5f9;
        border-radius: 12px;
        background: #fff;
        box-shadow: 0 4px 12px rgba(0,0,0,0.04);
      }
      .cart-line img {
        width: 64px;
        height: 64px;
        object-fit: cover;
        border-radius: 10px;
        background: #f6f8fb;
      }
      .cart-line h5 {
        margin: 0 0 6px 0;
        font-size: 15px;
        color: #0f172a;
        font-weight: 800;
      }
      .cart-line .price {
        font-weight: 800;
        color: #1a1a1a;
        font-size: 14px;
      }
      .cart-line .badge {
        font-size: 11px;
        font-weight: 800;
        color: #1A4F97;
        background: rgba(45, 139, 209, 0.12);
        padding: 4px 8px;
        border-radius: 999px;
        border: 1px solid rgba(45, 139, 209, 0.2);
      }
      .cart-remove {
        margin-left: auto;
        background: #fee2e2;
        color: #b91c1c;
        border: 1px solid #fecdd3;
        border-radius: 10px;
        padding: 8px 10px;
        font-weight: 700;
        cursor: pointer;
        transition: background 0.2s ease, transform 0.2s ease;
      }
      .cart-remove:hover {
        background: #fecdd3;
        transform: translateY(-1px);
      }
      .product-modal-close {
        background: #f3f4f6;
        color: #111827;
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        padding: 12px 16px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .product-modal-close:hover {
        background: #e5e7eb;
      }
      /* Fullscreen Image Modal Styles */
      .fullscreen-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.95);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
      }
      .fullscreen-close {
        position: absolute;
        top: 20px;
        right: 20px;
        background: rgba(255, 255, 255, 0.9);
        border: none;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 24px;
        color: #111827;
        z-index: 10001;
        transition: all 0.3s ease;
      }
      .fullscreen-close:hover {
        background: #fff;
        transform: scale(1.1);
      }
      .fullscreen-image {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
        border-radius: 8px;
      }

      /* Responsive Styles */
      @media (max-width: 1400px) {
        .container {
          padding: 24px 20px;
        }
        .three-column-grid {
          gap: 24px;
        }
      }

      @media (max-width: 1200px) {
        .product-layout {
          grid-template-columns: 1fr 400px;
          gap: 40px;
        }
        .main-product-image {
          max-height: 600px;
        }
        .product-info-section {
          padding: 0 15px;
        }
      }

      @media (max-width: 992px) {
        .container {
          padding: 40px 20px;
        }
        .product-layout {
          grid-template-columns: 1fr 350px;
          gap: 30px;
        }
        .main-image-section {
          padding: 30px;
        }
        .main-product-image {
          max-height: 500px;
        }
        .product-name {
          font-size: 28px;
        }
        .product-price {
          font-size: 32px;
        }
        .product-info-section {
          padding: 0 12px;
        }
      }

      @media (max-width: 768px) {
        .product-layout {
          grid-template-columns: 1fr;
          gap: 30px;
        }
        .main-image-section {
          padding: 20px;
        }
        .main-product-image {
          max-height: 400px;
          width: 100%;
        }
        .product-info-section {
          padding: 0;
        }
        .container {
          padding: 30px 16px;
        }
        .product-name {
          font-size: 24px;
        }
        .product-price {
          font-size: 28px;
        }
        .add-to-bag-button {
          padding: 16px;
          font-size: 15px;
        }
      }

      @media (max-width: 576px) {
        .container {
          padding: 20px 12px;
        }
        .product-layout {
          gap: 24px;
        }
        .main-image-section {
          padding: 15px;
        }
        .main-product-image {
          max-height: 350px;
        }
        .product-name {
          font-size: 22px;
        }
        .product-price {
          font-size: 26px;
        }
        .product-description {
          font-size: 14px;
        }
        .color-swatch-box {
          width: 45px;
          height: 45px;
        }
        .qty-input {
          padding: 12px;
        }
        .qty-button {
          width: 40px;
          height: 40px;
        }
        .add-to-bag-button {
          padding: 14px;
          font-size: 14px;
        }
      }
        .product-category {
          font-size: 10px;
          padding: 4px 8px;
        }
        .customization-section {
          margin-bottom: 16px;
          padding-bottom: 16px;
        }
        .section-header {
          padding: 8px 0;
        }
        .section-label {
          font-size: 13px;
        }
        .option-grid {
          grid-template-columns: repeat(auto-fit, minmax(50px, 1fr));
          gap: 8px;
        }
        .option-card {
          padding: 10px 6px;
        }
        .option-card-text {
          font-size: 10px;
        }
        .quantity-section {
          margin-bottom: 20px;
        }
        .quantity-row {
          gap: 6px;
        }
        .quantity-input {
          width: 60px;
          padding: 8px;
          font-size: 13px;
        }
        .quantity-button {
          width: 28px;
          height: 28px;
          font-size: 14px;
        }
        .promo-button {
          padding: 6px 10px;
          font-size: 12px;
          flex: 1 1 100%;
        }
        .delivery-section {
          margin-bottom: 24px;
        }
        .delivery-select {
          padding: 8px;
          font-size: 12px;
        }
        .delivery-label {
          font-size: 12px;
        }
        .delivery-time {
          font-size: 11px;
        }
        .checkout-button {
          padding: 12px;
          font-size: 14px;
        }
        .right-column-title {
          font-size: 18px;
        }
        .right-column-subtitle {
          font-size: 12px;
        }
        .summary-row {
          font-size: 12px;
          margin-bottom: 8px;
        }
        .summary-rowTotal {
          font-size: 15px;
          padding-top: 10px;
        }
        .order-summary {
          padding-top: 20px;
          margin-top: 20px;
        }
      }

      @media (max-width: 400px) {
        .container {
          padding: 16px 8px;
        }
        .main-product-image {
          max-height: 300px;
        }
        .product-name {
          font-size: 20px;
        }
        .product-price {
          font-size: 24px;
        }
        .color-swatch-box {
          width: 40px;
          height: 40px;
        }
      }

      /* Landscape orientation for mobile */
      @media (max-width: 768px) and (orientation: landscape) {
        .main-product-image {
          max-height: 350px;
        }
      }
      
      /* Animations */
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      @keyframes fadeInLeft {
        from {
          opacity: 0;
          transform: translateX(-30px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      @keyframes fadeInRight {
        from {
          opacity: 0;
          transform: translateX(30px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }
      @keyframes scaleIn {
        from {
          opacity: 0;
          transform: scale(0.9);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }
      @keyframes pulse {
        0%, 100% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.05);
        }
      }
      @keyframes bounce {
        0%, 100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-10px);
        }
      }
      @keyframes slideInRight {
        from {
          opacity: 0;
          transform: translateX(50px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      @keyframes glow {
        0%, 100% {
          box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
        }
        50% {
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.4);
        }
      }
      @keyframes shake {
        0%, 100% {
          transform: translateX(0);
        }
        25% {
          transform: translateX(-10px);
        }
        75% {
          transform: translateX(10px);
        }
      }
      @keyframes rotate {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }

      /* Page Load Animations */
      .product-layout {
        animation: fadeIn 0.6s ease-out;
      }
      .main-image-section {
        animation: fadeInLeft 0.8s ease-out 0.2s both;
      }
      .product-info-section {
        animation: fadeInRight 0.8s ease-out 0.4s both;
      }
      .main-product-image {
        animation: scaleIn 1s ease-out 0.3s both;
        transition: transform 0.3s ease, opacity 0.3s ease;
      }
      .main-product-image:hover {
        transform: scale(1.02);
      }
      .product-category-label {
        animation: fadeInUp 0.6s ease-out 0.5s both;
      }
      .product-name {
        animation: fadeInUp 0.6s ease-out 0.6s both;
      }
      .product-rating {
        animation: fadeInUp 0.6s ease-out 0.7s both;
      }
      .product-price {
        animation: fadeInUp 0.6s ease-out 0.8s both;
      }
      .product-description {
        animation: fadeInUp 0.6s ease-out 0.9s both;
      }
      .color-section {
        animation: fadeInUp 0.6s ease-out 1s both;
      }
      .quantity-section-new {
        animation: fadeInUp 0.6s ease-out 1.1s both;
      }
      .add-to-bag-button {
        animation: fadeInUp 0.6s ease-out 1.2s both;
      }
      .price-summary {
        animation: fadeInUp 0.6s ease-out 1.3s both;
      }

      /* Hover effects with animations */
      .qty-button {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      .qty-button:hover {
        background: #f9fafb;
        border-color: #2D8BD1;
        color: #2D8BD1;
        transform: scale(1.1);
      }
      .qty-button:active {
        transform: scale(0.95);
      }
      .qty-input {
        transition: all 0.3s ease;
      }
      .qty-input:focus {
        outline: none;
        border-color: #2D8BD1;
        box-shadow: 0 0 0 3px rgba(45, 139, 209, 0.1);
        transform: scale(1.02);
      }
      .add-to-bag-button {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        overflow: hidden;
      }
      .add-to-bag-button::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.2);
        transform: translate(-50%, -50%);
        transition: width 0.6s, height 0.6s;
      }
      .add-to-bag-button:hover:not(:disabled)::before {
        width: 300px;
        height: 300px;
      }
      .add-to-bag-button:hover:not(:disabled) {
        background: #1a1a1a;
        transform: translateY(-3px);
        box-shadow: 0 12px 30px rgba(0,0,0,0.3);
      }
      .add-to-bag-button:active:not(:disabled) {
        transform: translateY(-1px);
      }
      .add-to-bag-button:disabled {
        background: #9ca3af;
        cursor: not-allowed;
        opacity: 0.6;
      }
      .color-swatch-item {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      .color-swatch-item:hover .color-swatch-box {
        transform: scale(1.15);
        box-shadow: 0 6px 20px rgba(0,0,0,0.2);
      }
      .color-swatch-item:active {
        animation: bounce 0.4s ease;
      }
      .color-checkmark {
        animation: scaleIn 0.3s ease-out;
      }
      .star-rating span {
        transition: transform 0.2s ease;
      }
      .star-rating span:hover {
        transform: scale(1.2) rotate(10deg);
      }
      .product-price {
        transition: transform 0.3s ease;
      }
      .product-price:hover {
        transform: scale(1.05);
      }

      /* Success message animation */
      .success-message {
        animation: slideInRight 0.5s ease-out;
      }
      @keyframes slideInRight {
        from {
          opacity: 0;
          transform: translateX(100%);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }

      /* Loading state animation */
      .spinner {
        animation: rotate 1s linear infinite;
      }

      /* Image zoom on hover */
      .main-image-container {
        overflow: hidden;
        border-radius: 12px;
      }
      .main-product-image {
        transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      }
      .main-image-container:hover .main-product-image {
        transform: scale(1.05);
      }

      /* Button pulse animation on add to cart */
      .add-to-bag-button.adding {
        animation: pulse 0.5s ease-in-out;
      }

      /* Smooth transitions for all interactive elements */
      .product-info-section > * {
        transition: opacity 0.3s ease, transform 0.3s ease;
      }
    `,
  }

  return (
    <div>
      {/* Ensure CSS is applied - hide popups by default and add responsive styles */}
      <style>{`
        * {
          box-sizing: border-box;
        }
        .search__popup {
          padding-top: 70px;
          padding-bottom: 100px;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          width: 100%;
          height: 100%;
          z-index: 9999999;
          background: var(--tv-common-black, #0F313A);
          transform: translateY(calc(-100% - 80px));
          transition: transform 0.6s ease-in-out, opacity 0.6s ease-in-out;
          transition-delay: 0.7s;
        }
        .search__popup.search-opened {
          transform: translateY(0%);
          transition-delay: 0s;
        }
        @media (max-width: 768px) {
          .search__popup {
            padding-top: 50px;
            padding-bottom: 50px;
          }
        }
        .tv-offcanvas-area .itoffcanvas {
          position: fixed;
          top: 0;
          right: -100%;
          width: 480px;
          bottom: 0;
          background-color: var(--tv-heading-primary, #0A165E);
          z-index: 9999;
          padding: 50px;
          opacity: 0;
          visibility: hidden;
          transition: 0.45s ease-in-out;
          overflow-y: scroll;
        }
        .tv-offcanvas-area .itoffcanvas.opened {
          right: 0;
          opacity: 1;
          visibility: visible;
        }
        .body-overlay {
          position: fixed;
          top: 0;
          left: 0;
          z-index: 999;
          width: 100%;
          height: 100%;
          background: rgba(24, 24, 24, 0.8);
          visibility: hidden;
          opacity: 0;
          transition: 0.45s ease-in-out;
        }
        .body-overlay.apply {
          opacity: 1;
          visibility: visible;
        }
        @media (max-width: 575px) {
          .tv-offcanvas-area .itoffcanvas {
            width: 300px;
            padding: 40px 35px;
          }
        }
        @media only screen and (min-width: 576px) and (max-width: 767px) {
          .tv-offcanvas-area .itoffcanvas {
            width: 400px;
            padding: 40px;
          }
        }
        /* Header responsive styles */
        @media (max-width: 1200px) {
          .tv-header-area .container-1750 {
            padding-left: 15px;
            padding-right: 15px;
          }
        }
        @media (max-width: 768px) {
          .tv-header-top-area {
            padding: 10px 0 !important;
          }
          .tv-header-top-list-box ul li {
            font-size: 12px;
          }
          .tv-header-top-list-box ul li a {
            font-size: 12px;
          }
          .tv-header-logo img {
            height: 35px !important;
          }
        }
        @media (max-width: 576px) {
          .tv-header-top-list-box ul li {
            font-size: 11px;
            padding: 2px 0;
          }
          .tv-header-logo img {
            height: 30px !important;
          }
        }
      `}</style>
      
      {/* <!-- search popup start --> */}
      <div className="search__popup">
        <div className="container">
          <div className="row">
            <div className="col-xxl-12">
              <div className="search__wrapper">
                <div className="search__top d-flex justify-content-between align-items-center">
                  <div className="search__logo">
                    <a href='/'>
                      <img src="/assets/img/logo/F_logo.png" alt="Fabritech" style={{ height: '40px', width: 'auto' }} />
                    </a>
                  </div>
                  <div className="search__close">
                    <button type="button" className="search__close-btn search-close-btn">
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path d="M17 1L1 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                          strokeLinejoin="round" />
                        <path d="M1 1L17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                          strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="search__form">
                  <form action="#">
                    <div className="search__input">
                      <input className="search-input-field" type="text" placeholder="Type here to search..." />
                      <span className="search-focus-border"></span>
                      <button type="submit">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
                          xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M9.55 18.1C14.272 18.1 18.1 14.272 18.1 9.55C18.1 4.82797 14.272 1 9.55 1C4.82797 1 1 4.82797 1 9.55C1 14.272 4.82797 18.1 9.55 18.1Z"
                            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                            strokeLinejoin="round" />
                          <path d="M19.0002 19.0002L17.2002 17.2002" stroke="currentColor" strokeWidth="1.5"
                            strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- search popup end --> */}

      {/* <!-- tv-offcanvus-area-start --> */}
      <div className="tv-offcanvas-area">
        <div className="itoffcanvas">
          <div className="itoffcanvas__close-btn">
            <button className="close-btn"><i className="fa-solid fa-xmark"></i></button>
          </div>
          <div className="itoffcanvas__logo">
            <a href='/'>
              <img src="/assets/img/logo/F_logo.png" alt="Fabritech" style={{ height: '40px', width: 'auto' }} />
            </a>
          </div>
          <div className="itoffcanvas__text">
            <p>At Fabritech, we deliver cutting-edge technology solutions tailored to transform your business. With innovation and excellence at our core, we're committed to your success.</p>
          </div>
          <div className="tv-menu-mobile d-xl-none"></div>
          <div className="itoffcanvas__info">
            <h3 className="offcanva-title">Get In Touch</h3>
            <div className="tv-info-wrapper mb-20 d-flex align-items-center">
              <div className="itoffcanvas__info-icon">
                <a href="#"><i className="fa-solid fa-envelope"></i></a>
              </div>
              <div className="itoffcanvas__info-address">
                <span>Email</span>
                <a href="maito:info@fabritech.rw">info@fabritech.rw</a>
              </div>
            </div>
            <div className="tv-info-wrapper mb-20 d-flex align-items-center">
              <div className="itoffcanvas__info-icon">
                <a href="#"><i className="fa-solid fa-phone"></i></a>
              </div>
              <div className="itoffcanvas__info-address">
                <span>Phone</span>
                <a href="tel:+250788601280">+250 788 601 280</a>
              </div>
            </div>
            <div className="tv-info-wrapper mb-20 d-flex align-items-center">
              <div className="itoffcanvas__info-icon">
                <a href="#"><i className="fa-solid fa-map-marker-alt"></i></a>
              </div>
              <div className="itoffcanvas__info-address">
                <span>Location</span>
                <a href="htits://www.google.com/maps/@37.4801311,22.8928877,3z" target="_blank">YYussa Plza Remera, Kisimenti </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="body-overlay"></div>
      {/* <!-- tv-offcanvus-area-end --> */}

      {/* Header - Same as Home.jsx */}
      <header className="tv-header-height">
        <div className="tv-header-top-area tv-header-top-ptb">
          <div className="container container-1750">
            <div className="row align-items-center">
              <div className="col-xl-8 col-lg-7 col-md-6 col-sm-6">
                <div className="tv-header-top-list-box">
                  <ul>
                    <li className="d-none d-lg-inline-block">
                      <span>
                        <i className="fa-solid fa-phone"></i>
                        <a href="tel:+250788601280"> +250 788 601 280</a>
                      </span>
                    </li>
                    <li><span><i className="fa-solid fa-envelope"></i><a href="mailto:info@fabritech.rw">info@fabritech.rw</a></span></li>
                    <li className="d-none d-xxl-inline-block">
                      <span>
                        <i className="fa-solid fa-location-dot"></i>
                        <a target="_blank" href="https://www.google.com/maps/@23.843848,90.3081992,17.5z?entry=ttu&amp;g_ep=EgoyMDI1MDEwMS4wIKXMDSoASAFQAw%3D%3D">KG 11 Kisimenti, YYussa Plaza</a>
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-xl-4 col-lg-5 col-md-6 col-sm-6 d-none d-sm-block">
                <div className="tv-header-top-right d-flex align-items-center justify-content-end">

                  <div className="tv-header-top-social-box">
                    <a href="#"><i className="fa-brands fa-facebook-f"></i></a>
                    <a href="#"><i className="fa-brands fa-twitter"></i></a>
                    <a href="#"><i className="fa-brands fa-linkedin-in"></i></a>
                    <a href="#"><i className="fa-brands fa-instagram"></i></a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- header-area-start --> */}
        <div id="header-sticky" className="tv-header-area header-style-1 tv-header-ptb p-relative">

          <div className="container container-1750">
            <div className="p-relative">
              <div className="row align-items-center">
                <div className="col-xxl-2 col-xl-2 col-6">
                  <div className="tv-header-logo">
                    <a href='/'><img src="/assets/img/logo/F_logo.png" alt="Fabritech" style={{ height: '45px', width: 'auto' }} /></a>
                  </div>
                </div>
                <div className=" col-xxl-7 col-xl-7 d-none d-xl-block">
                  <div className="tv-header-menu tv-header-dropdown">
                    <nav className="tv-menu-content">
                      <ul>
                        <li>
                          <a href='#home'>Home</a>
                        </li>
                        <li>
                          <a href='#products'>Shop</a>
                        </li>
                        <li>
                          <a href='#contact'>Contact</a>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </div>
                <div className="col-xxl-3 col-xl-3 col-6">
                  <div className="tv-header-right-action d-flex justify-content-end align-items-center" style={{ gap: '12px' }}>
                    <UserMenu />
                    <CartIcon cartCount={cartItems.reduce((total, item) => total + (item.quantity || 1), 0)} onClick={toggleCart} />
                    <button className="tv-header-search search-open-btn d-none d-xxl-block">
                      <i className="fa-solid fa-magnifying-glass"></i>
                    </button>
                    <div className="tv-header-bar">
                      <button
                        style={{
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '10px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          width: '50px',
                          height: '50px'
                        }}
                      >
                        <span
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '6px',
                            width: '30px'
                          }}
                        >
                          <span
                            style={{
                              width: '100%',
                              height: '3px',
                              backgroundColor: '#333',
                              borderRadius: '2px',
                              transition: 'all 0.3s ease'
                            }}
                          ></span>
                          <span
                            style={{
                              width: '100%',
                              height: '3px',
                              backgroundColor: '#333',
                              borderRadius: '2px',
                              transition: 'all 0.3s ease'
                            }}
                          ></span>
                          <span
                            style={{
                              width: '100%',
                              height: '3px',
                              backgroundColor: '#333',
                              borderRadius: '2px',
                              transition: 'all 0.3s ease'
                            }}
                          ></span>
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- header-area-end --> */}
      </header>

      {/* Main Content - Adidas Style Layout */}
      <div style={styles.container}>
        <style>{styles.responsive}</style>
        <div style={styles.productLayout} className="product-layout">
          
          {/* Main Product Image */}
          <div style={styles.mainImageSection} className="main-image-section">
            <div style={styles.mainImageContainer} className="main-image-container">
              <img 
                src={safeProduct.image} 
                alt={safeProduct.name} 
                style={styles.mainProductImage}
                className="main-product-image"
                onError={(e) => {
                  e.target.src = '/placeholder-image.png'
                }}
              />
            </div>
          </div>

          {/* Right Column - Product Info */}
          <div style={styles.productInfoSection} className="product-info-section">
            {/* Category */}
            <div style={styles.productCategoryLabel}>
              {safeProduct.category?.toUpperCase() || 'PRODUCT'}
            </div>

            {/* Product Name */}
            <h1 style={styles.productName}>{safeProduct.name}</h1>

            {/* Rating */}
            <div style={styles.productRating}>
              <div style={styles.starRating}>
                {[...Array(5)].map((_, i) => (
                  <span 
                    key={i}
                    style={{
                      color: i < Math.floor(safeProduct.rating) ? '#fbbf24' : '#d1d5db',
                      fontSize: '18px'
                    }}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span style={styles.ratingText}>
                {safeProduct.rating}/5 ({safeProduct.reviews} reviews)
              </span>
            </div>

            {/* Price */}
            <div style={styles.productPrice}>
              {formatPrice(safeProduct.price)}
            </div>

            {/* Description */}
            <p style={styles.productDescription}>
              {safeProduct.description}
            </p>

            {/* Available Colors */}
            {safeProduct.specifications && Object.keys(safeProduct.specifications).length > 0 && (
              <div style={styles.colorSection}>
                <div style={styles.colorLabel}>AVAILABLE COLORS</div>
                <div style={styles.colorSwatches}>
                  {Object.entries(getCustomizationOptions(safeProduct.specifications)).slice(0, 3).map(([key, options], idx) => (
                    <div
                      key={idx}
                      style={{
                        ...styles.colorSwatchItem,
                        ...(idx === 0 ? styles.colorSwatchActive : {})
                      }}
                      onClick={() => selectOption(key, options[0])}
                    >
                      <div style={{
                        ...styles.colorSwatchBox,
                        background: idx === 0 ? '#000000' : idx === 1 ? '#4a5568' : '#ffffff',
                        border: idx === 2 ? '2px solid #e5e7eb' : 'none'
                      }}></div>
                      {idx === 0 && (
                        <div style={styles.colorCheckmark}>✓</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div style={styles.quantitySectionNew}>
              <label style={styles.quantityLabel}>QTY</label>
              <div style={styles.quantityControls}>
                <button 
                  style={styles.qtyButton}
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                >
                  <i className="fa-solid fa-minus"></i>
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Math.min(parseInt(e.target.value) || 1, safeProduct.stock || 10)))}
                  style={styles.qtyInput}
                  min="1"
                  max={safeProduct.stock || 10}
                />
                <button 
                  style={styles.qtyButton}
                  onClick={increaseQuantity}
                  disabled={quantity >= (safeProduct.stock || 10)}
                >
                  <i className="fa-solid fa-plus"></i>
                </button>
              </div>
            </div>

            {/* Stock Status */}
            {safeProduct.stock > 0 && (
              <div style={styles.stockInfo}>
                ✓ {safeProduct.stock} available in stock
              </div>
            )}

            {/* Delivery Info */}
            <div style={{ 
              fontSize: '13px', 
              color: '#6b7280', 
              marginBottom: '16px',
              padding: '12px',
              background: '#f9fafb',
              borderRadius: '8px',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ fontWeight: '600', color: '#374151', marginBottom: '4px' }}>
                <i className="fa-solid fa-truck" style={{ marginRight: '6px' }}></i>
                Delivery Information
              </div>
              <div style={{ fontSize: '12px', lineHeight: '1.5' }}>
                <span style={{ color: '#10b981', fontWeight: '600' }}>FREE</span> delivery in Kigali
                <br />
                <span style={{ color: '#6b7280' }}>Charges apply for delivery outside Kigali</span>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              style={styles.addToBagButton}
              className="add-to-bag-button"
              disabled={safeProduct.stock === 0}
            >
              {safeProduct.stock === 0 ? (
                'OUT OF STOCK'
              ) : (
                <>
                  ADD TO CART <i className="fa-solid fa-arrow-right" style={{ marginLeft: '8px' }}></i>
                </>
              )}
            </button>

            {addedToCart && (
              <div style={styles.successMessage} className="success-message">
                ✓ Added {quantity} item(s) to cart successfully!
              </div>
            )}

            {/* Price Summary */}
            <div style={styles.priceSummary}>
              <div style={styles.priceRow}>
                <span>Subtotal:</span>
                <span>{formatPrice(safeProduct.price * quantity)}</span>
              </div>
              <div style={styles.priceRow}>
                <span>Delivery:</span>
                <span>
                  {calculateDeliveryCost() === 0 ? (
                    <span style={{ color: '#10b981', fontWeight: '700' }}>FREE</span>
                  ) : (
                    formatPrice(calculateDeliveryCost())
                  )}
                </span>
              </div>
              <div style={styles.priceRowTotal}>
                <span>Total:</span>
                <span>{formatPrice((safeProduct.price * quantity) + calculateDeliveryCost())}</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Fullscreen Image Modal */}
      {isImageFullscreen && (
        <div 
          className="fullscreen-overlay"
          onClick={() => setIsImageFullscreen(false)}
        >
          <button 
            className="fullscreen-close"
            onClick={() => setIsImageFullscreen(false)}
            title="Close"
          >
            <i className="fa-solid fa-times"></i>
          </button>
          <img 
            src={safeProduct.image} 
            alt={safeProduct.name}
            className="fullscreen-image"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Footer */}
      <footer style={styles.footer}>
        <p style={{ margin: 0 }}>&copy; 2025 Fabritech. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default ProductDetail
