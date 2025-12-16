import React, { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../Context/CartContext'
import CartIcon from './CartIcon'
import UserMenu from './UserMenu'
import WishlistButton from './WishlistButton'
import useTemplateScripts from '../hooks/useTemplateScripts'
import { getAllProducts } from '../services/productService'

function Shop() {
    useTemplateScripts()
    const navigate = useNavigate()
    const { addToCart, cartItems, removeFromCart } = useCart()
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [priceRange, setPriceRange] = useState([0, 10000000])
    const [searchQuery, setSearchQuery] = useState('')
    const [sortBy, setSortBy] = useState('newest')
    const [addedProduct, setAddedProduct] = useState(null)
    const [showCart, setShowCart] = useState(false)
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [toast, setToast] = useState(null)

    // Toast notification handler
    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 2200)
            return () => clearTimeout(timer)
        }
    }, [toast])

    // Toggle cart function
    const toggleCart = () => setShowCart((prev) => !prev)
    
    // Handle checkout
    const handleCheckout = () => {
        setShowCart(false)
        navigate('/cart')
    }

    // Update price range when products are loaded
    useEffect(() => {
        if (products.length > 0) {
            const prices = products.map(p => p.price).filter(p => p > 0)
            if (prices.length > 0) {
                const maxPrice = Math.max(...prices)
                const minPrice = Math.min(...prices)
                // Set range to include all products with some padding
                setPriceRange([0, Math.ceil(maxPrice * 1.1)])
            }
        }
    }, [products])

    // Fetch products from API
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true)
            setError('')
            try {
                const data = await getAllProducts()
                // Transform API data to match Shop component format
                const transformedProducts = data.map((product, index) => ({
                    id: product.id || product._id || `product-${index + 1}`,
                    name: product.title || product.name || 'Untitled Product',
                    category: (product.category || product.badge || 'other').toLowerCase(),
                    price: product.priceNew || product.price || 0,
                    image: product.image || '/placeholder-image.png',
                    description: product.description || '',
                    rating: product.rating || 0,
                    reviews: product.sold ? parseInt(product.sold.replace(/[^0-9]/g, '')) || 0 : 0,
                    priceOld: product.priceOld || null,
                    discount: product.discount || null,
                    stock: product.stock || 0,
                    // Keep original product data for cart
                    title: product.title,
                    priceNew: product.priceNew
                }))
                setProducts(transformedProducts)
            } catch (err) {
                setError(err.message || 'Failed to load products')
                console.error('Error fetching products:', err)
                // Set empty array on error so UI doesn't break
                setProducts([])
            } finally {
                setLoading(false)
            }
        }

        fetchProducts()
    }, [])

    // Filter products (only if products are loaded)
    let filteredProducts = (products || []).filter(product => {
        const categoryMatch = selectedCategory === 'all' || product.category === selectedCategory
        const priceMatch = product.price >= priceRange[0] && product.price <= priceRange[1]
        const searchMatch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchQuery.toLowerCase())
        return categoryMatch && priceMatch && searchMatch
    })

    // Sort products
    filteredProducts = [...filteredProducts].sort((a, b) => {
        switch(sortBy) {
            case 'price-low':
                return a.price - b.price
            case 'price-high':
                return b.price - a.price
            case 'rating':
                return b.rating - a.rating
            case 'newest':
            default:
                return b.id - a.id
        }
    })

    // Calculate categories from fetched products
    const categories = useMemo(() => {
        if (!products || products.length === 0) {
            return [
                { id: 'all', name: 'All Products', count: 0 },
                { id: 'satellite', name: 'Satellite', count: 0 },
                { id: 'security', name: 'Security', count: 0 },
                { id: 'networking', name: 'Networking', count: 0 }
            ]
        }
        return [
            { id: 'all', name: 'All Products', count: products.length },
            { id: 'satellite', name: 'Satellite', count: products.filter(p => p.category === 'satellite').length },
            { id: 'security', name: 'Security', count: products.filter(p => p.category === 'security').length },
            { id: 'networking', name: 'Networking', count: products.filter(p => p.category === 'networking').length }
        ]
    }, [products])

    return (
        <div>
            {/* <!-- back-to-top-start  --> */}
            <button className="scroll-top scroll-to-target" data-target="html">
                <i className="fa-solid fa-angle-double-up"></i>
            </button>
            {/* <!-- back-to-top-end  --> */}

            {/* <!-- search popup start --> */}
            <div className="search__popup">
                <div className="container">
                    <div className="row">
                        <div className="col-xxl-12">
                            <div className="search__wrapper">
                                <div className="search__top d-flex justify-content-between align-items-center">
                                    <div className="search__logo">
                                        <a href='/'>
                                            <img src="assets/img/logo/F_logo.png" alt="Fabritech" style={{ height: '40px', width: 'auto' }} />
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
                            <img src="assets/img/logo/F_logo.png" alt="Fabritech" style={{ height: '40px', width: 'auto' }} />
                        </a>
                    </div>
                    <div className="itoffcanvas__text">
                        <p>At Fabritech, we deliver cutting-edge technology solutions tailored to transform your business.</p>
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
                                <a href="mailto:info@fabritech.rw">info@fabritech.rw</a>
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
                    </div>
                </div>
            </div>
            <div className="body-overlay"></div>
            {/* <!-- tv-offcanvus-area-end --> */}

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
                                        <a href='/'><img src="assets/img/logo/F_logo.png" alt="Fabritech" style={{ height: '45px', width: 'auto' }} /></a>
                                    </div>
                                </div>
                                <div className=" col-xxl-7 col-xl-7 d-none d-xl-block">
                                    <div className="tv-header-menu tv-header-dropdown">
                                        <nav className="tv-menu-content">
                                            <ul>
                                                <li>
                                                    <a href="/#home">Home</a>
                                                </li>
                                                <li>
                                                    <a href="/#products">Shop</a>
                                                </li>
                                                <li>
                                                    <a href="/#contact">Contact</a>
                                                </li>
                                            </ul>
                                        </nav>
                                    </div>
                                </div>
                                <div className="col-xxl-3 col-xl-3 col-6">
                                    <div className="tv-header-right-action d-flex justify-content-end align-items-center" style={{ gap: '12px' }}>
                                        <UserMenu />
                                        <CartIcon cartCount={cartItems.length} onClick={toggleCart} />
                                        <div className="tv-header-bar">
                                            <button className="tv-menu-bar">
                                                <span className="hamburger-icon">
                                                    <span className="hamburger-line"></span>
                                                    <span className="hamburger-line"></span>
                                                    <span className="hamburger-line"></span>
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

            <main>
                {/* <!-- Hero Section with Background Image --> */}
                <style>{`
                    /* CRITICAL: Ensure logo section stays white on scroll - Override any template styles */
                    #header-sticky.header-sticky .row > div:first-child,
                    #header-sticky.header-sticky [class*="col-"]:first-child,
                    #header-sticky.header-sticky .col-xxl-2:first-child,
                    #header-sticky.header-sticky .col-xl-2:first-child,
                    #header-sticky.header-sticky .col-6:first-child,
                    #header-sticky.header-sticky .row > [class*="col-"]:first-child {
                        background-color: #ffffff !important;
                        background: #ffffff !important;
                        background-image: none !important;
                    }
                    
                    #header-sticky.header-sticky .row > div:first-child *,
                    #header-sticky.header-sticky [class*="col-"]:first-child *,
                    #header-sticky.header-sticky .tv-header-logo,
                    #header-sticky.header-sticky .tv-header-logo * {
                        background-color: transparent !important;
                        background: transparent !important;
                        background-image: none !important;
                    }
                    
                    /* Remove any pseudo-elements that add blue */
                    #header-sticky.header-sticky .col-xxl-2:first-child::before,
                    #header-sticky.header-sticky .col-xxl-2:first-child::after,
                    #header-sticky.header-sticky .col-xl-2:first-child::before,
                    #header-sticky.header-sticky .col-xl-2:first-child::after {
                        display: none !important;
                        background: none !important;
                        content: none !important;
                    }
                    
                    .shop-hero-section {
                        position: relative;
                        min-height: 600px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background: url('assets/img/product/banner.png') center/cover;
                        background-attachment: fixed;
                        overflow: hidden;
                    }

                    .shop-hero-section::before {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background: none;
                        opacity: 0;
                        z-index: 1;
                    }

                    .shop-hero-section::after {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background: none;
                        z-index: 2;
                    }

                    .shop-hero-content {
                        position: relative;
                        z-index: 3;
                        text-align: center;
                        color: white;
                        width: 100%;
                        padding: 60px 20px;
                    }

                    .shop-hero-content h1 {
                        font-size: 64px;
                        font-weight: 800;
                        margin: 0 0 20px 0;
                        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
                        animation: slideInDown 0.8s ease-out;
                    }

                    .shop-hero-content p {
                        font-size: 22px;
                        margin: 0 0 30px 0;
                        color: rgba(255, 255, 255, 0.95);
                        text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
                        animation: slideInUp 0.8s ease-out 0.2s both;
                    }

                    .shop-hero-breadcrumb {
                        display: inline-block;
                        font-size: 16px;
                        color: rgba(255, 255, 255, 0.9);
                        animation: fadeIn 0.8s ease-out 0.4s both;
                    }

                    .shop-hero-breadcrumb a {
                        color: white;
                        text-decoration: none;
                        font-weight: 600;
                        transition: all 0.3s ease;
                        border-bottom: 2px solid transparent;
                    }

                    .shop-hero-breadcrumb a:hover {
                        border-bottom-color: white;
                        text-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
                    }

                    .shop-hero-breadcrumb span {
                        margin: 0 12px;
                        color: rgba(255, 255, 255, 0.8);
                    }

                    .shop-hero-stats {
                        display: flex;
                        justify-content: center;
                        gap: 40px;
                        margin-top: 40px;
                        flex-wrap: wrap;
                        animation: fadeIn 0.8s ease-out 0.6s both;
                    }

                    .shop-hero-stat {
                        text-align: center;
                        background: rgba(255, 255, 255, 0.1);
                        padding: 25px 35px;
                        border-radius: 12px;
                        backdrop-filter: blur(10px);
                        border: 1px solid rgba(255, 255, 255, 0.2);
                        transition: all 0.3s ease;
                        min-width: 150px;
                    }

                    .shop-hero-stat:hover {
                        background: rgba(255, 255, 255, 0.15);
                        border-color: rgba(255, 255, 255, 0.4);
                        transform: translateY(-5px);
                    }

                    .shop-hero-stat-number {
                        font-size: 28px;
                        font-weight: 700;
                        color: #FFD700;
                        display: block;
                        margin-bottom: 5px;
                    }

                    .shop-hero-stat-label {
                        font-size: 14px;
                        color: rgba(255, 255, 255, 0.85);
                    }

                    .shop-hero-decorative {
                        position: absolute;
                        border-radius: 50%;
                        opacity: 0.1;
                        z-index: 1;
                    }

                    .shop-hero-decorative-1 {
                        width: 200px;
                        height: 200px;
                        top: -50px;
                        right: -50px;
                        background: white;
                        animation: float 6s ease-in-out infinite;
                    }

                    .shop-hero-decorative-2 {
                        width: 150px;
                        height: 150px;
                        bottom: -30px;
                        left: -30px;
                        background: white;
                        animation: float 8s ease-in-out infinite 1s;
                    }

                    .shop-hero-decorative-3 {
                        width: 100px;
                        height: 100px;
                        top: 50%;
                        right: 10%;
                        background: white;
                        animation: float 7s ease-in-out infinite 2s;
                    }

                    @keyframes slideInDown {
                        from {
                            opacity: 0;
                            transform: translateY(-30px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }

                    @keyframes slideInUp {
                        from {
                            opacity: 0;
                            transform: translateY(30px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
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

                    @keyframes float {
                        0%, 100% {
                            transform: translateY(0px);
                        }
                        50% {
                            transform: translateY(20px);
                        }
                    }

                    /* Responsive Design */
                    @media (max-width: 1024px) {
                        .shop-hero-section {
                            min-height: 500px;
                        }

                        .shop-hero-content h1 {
                            font-size: 48px;
                        }

                        .shop-hero-content p {
                            font-size: 18px;
                        }

                        .shop-hero-stats {
                            gap: 25px;
                        }

                        .shop-hero-stat {
                            padding: 20px 25px;
                            min-width: 130px;
                        }

                        .shop-hero-stat-number {
                            font-size: 24px;
                        }
                    }

                    @media (max-width: 768px) {
                        .shop-hero-section {
                            min-height: 400px;
                            background-attachment: scroll;
                        }

                        .shop-hero-section::before {
                            opacity: 0.5;
                        }

                        .shop-hero-section::after {
                            background: linear-gradient(135deg, rgba(45, 139, 209, 0.85) 0%, rgba(55, 166, 229, 0.8) 50%, rgba(26, 79, 151, 0.9) 100%);
                        }

                        .shop-hero-content {
                            padding: 40px 15px;
                        }

                        .shop-hero-content h1 {
                            font-size: 36px;
                            margin-bottom: 15px;
                        }

                        .shop-hero-content p {
                            font-size: 16px;
                            margin-bottom: 20px;
                        }

                        .shop-hero-breadcrumb {
                            font-size: 14px;
                        }

                        .shop-hero-stats {
                            gap: 15px;
                            margin-top: 30px;
                        }

                        .shop-hero-stat {
                            padding: 15px 20px;
                            min-width: 120px;
                        }

                        .shop-hero-stat-number {
                            font-size: 20px;
                        }

                        .shop-hero-stat-label {
                            font-size: 12px;
                        }

                        .shop-hero-decorative-1 {
                            width: 150px;
                            height: 150px;
                        }

                        .shop-hero-decorative-2 {
                            width: 100px;
                            height: 100px;
                        }

                        .shop-hero-decorative-3 {
                            display: none;
                        }
                    }

                    @media (max-width: 480px) {
                        .shop-hero-section {
                            min-height: 350px;
                        }

                        .shop-hero-content {
                            padding: 30px 12px;
                        }

                        .shop-hero-content h1 {
                            font-size: 28px;
                            margin-bottom: 12px;
                        }

                        .shop-hero-content p {
                            font-size: 14px;
                            margin-bottom: 15px;
                        }

                        .shop-hero-breadcrumb {
                            font-size: 13px;
                        }

                        .shop-hero-breadcrumb span {
                            margin: 0 8px;
                        }

                        .shop-hero-stats {
                            gap: 10px;
                            margin-top: 25px;
                            flex-direction: row;
                        }

                        .shop-hero-stat {
                            padding: 12px 15px;
                            min-width: 100px;
                        }

                        .shop-hero-stat-number {
                            font-size: 18px;
                        }

                        .shop-hero-stat-label {
                            font-size: 11px;
                        }

                        .shop-hero-decorative-1 {
                            display: none;
                        }

                        .shop-hero-decorative-2 {
                            display: none;
                        }
                    }
                `}</style>

                <div className="shop-hero-section">
                    {/* Decorative Elements */}
                    <div className="shop-hero-decorative shop-hero-decorative-1"></div>
                    <div className="shop-hero-decorative shop-hero-decorative-2"></div>
                    <div className="shop-hero-decorative shop-hero-decorative-3"></div>

                    {/* Hero Content */}
                    <div className="shop-hero-content">
                        <h1>Explore Our Shop</h1>
                        <p>Discover Premium Technology Solutions</p>

                        {/* Breadcrumb */}
                        <div className="shop-hero-breadcrumb">
                            <a href="/">Home</a>
                            <span>/</span>
                            <span>Shop</span>
                        </div>

                        {/* Stats */}
                        <div className="shop-hero-stats">
                            <div className="shop-hero-stat">
                                <span className="shop-hero-stat-number">12+</span>
                                <span className="shop-hero-stat-label">Products</span>
                            </div>
                            <div className="shop-hero-stat">
                                <span className="shop-hero-stat-number">4.7★</span>
                                <span className="shop-hero-stat-label">Avg Rating</span>
                            </div>
                            <div className="shop-hero-stat">
                                <span className="shop-hero-stat-number">3</span>
                                <span className="shop-hero-stat-label">Categories</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* <!-- Shop Section --> */}
                <section className="pt-130 pb-130" style={{ backgroundColor: '#f8f9fa', position: 'relative' }}>
                    <div className="container">
                        <div className="row">
                            {/* <!-- Sidebar --> */}
                            <div className="col-lg-3 mb-50" style={{ position: 'sticky', top: '100px', alignSelf: 'flex-start' }}>
                                <style>{`
                                    .shop-sidebar {
                                        background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
                                        padding: 30px;
                                        border-radius: 16px;
                                        box-shadow: 0 8px 24px rgba(0,0,0,0.08);
                                        border: 1px solid rgba(45, 139, 209, 0.1);
                                        transition: all 0.3s ease;
                                    }
                                    .shop-sidebar:hover {
                                        box-shadow: 0 12px 32px rgba(0,0,0,0.12);
                                        transform: translateY(-2px);
                                    }
                                    .shop-sidebar h3 {
                                        font-size: 20px;
                                        font-weight: 700;
                                        margin-bottom: 20px;
                                        color: #1a1a1a;
                                        border-bottom: 2px solid #2D8BD1;
                                        padding-bottom: 15px;
                                    }
                                    .category-list {
                                        list-style: none;
                                        padding: 0;
                                    }
                                    .category-list li {
                                        margin-bottom: 12px;
                                    }
                                    .category-list button {
                                        background: none;
                                        border: none;
                                        color: #666;
                                        font-size: 15px;
                                        cursor: pointer;
                                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                                        display: flex;
                                        justify-content: space-between;
                                        align-items: center;
                                        width: 100%;
                                        padding: 12px 16px;
                                        border-radius: 10px;
                                        position: relative;
                                    }
                                    .category-list button::before {
                                        content: '';
                                        position: absolute;
                                        left: 0;
                                        top: 50%;
                                        transform: translateY(-50%);
                                        width: 4px;
                                        height: 0;
                                        background: linear-gradient(135deg, #2D8BD1 0%, #1A4F97 100%);
                                        border-radius: 0 4px 4px 0;
                                        transition: height 0.3s ease;
                                    }
                                    .category-list button:hover {
                                        background: rgba(45, 139, 209, 0.08);
                                        color: #2D8BD1;
                                        transform: translateX(4px);
                                    }
                                    .category-list button:hover::before,
                                    .category-list button.active::before {
                                        height: 60%;
                                    }
                                    .category-list button.active {
                                        color: #2D8BD1;
                                        font-weight: 700;
                                        background: rgba(45, 139, 209, 0.12);
                                    }
                                    .category-count {
                                        background: #f0f0f0;
                                        padding: 2px 8px;
                                        border-radius: 4px;
                                        font-size: 12px;
                                    }
                                    .category-list button.active .category-count {
                                        background: #2D8BD1;
                                        color: white;
                                    }
                                `}</style>
                                <div className="shop-sidebar">
                                    <h3><i className="fa-solid fa-filter"></i> Filter</h3>
                                    <h4 style={{ fontSize: '16px', fontWeight: '600', marginTop: '20px', marginBottom: '15px', color: '#1a1a1a' }}>Categories</h4>
                                    <ul className="category-list">
                                        {categories.map(category => (
                                            <li key={category.id}>
                                                <button
                                                    onClick={() => setSelectedCategory(category.id)}
                                                    className={selectedCategory === category.id ? 'active' : ''}
                                                >
                                                    <span>{category.name}</span>
                                                    <span className="category-count">{category.count}</span>
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* <!-- Products Grid --> */}
                            <div className="col-lg-9">
                                <style>{`
                                    .shop-header {
                                        display: flex;
                                        justify-content: space-between;
                                        align-items: center;
                                        margin-bottom: 40px;
                                        background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
                                        padding: 32px 36px;
                                        border-radius: 20px;
                                        box-shadow: 0 8px 32px rgba(0,0,0,0.08);
                                        flex-wrap: wrap;
                                        gap: 20px;
                                        border: 1px solid rgba(45, 139, 209, 0.12);
                                        position: relative;
                                        overflow: hidden;
                                    }
                                    .shop-header::before {
                                        content: '';
                                        position: absolute;
                                        top: 0;
                                        left: 0;
                                        right: 0;
                                        height: 4px;
                                        background: linear-gradient(90deg, #2D8BD1 0%, #1A4F97 50%, #37A6E5 100%);
                                    }
                                    .shop-header h2 {
                                        font-size: 28px;
                                        font-weight: 800;
                                        color: #0f172a;
                                        margin: 0;
                                        flex: 1;
                                        min-width: 250px;
                                        background: linear-gradient(135deg, #2D8BD1 0%, #1A4F97 100%);
                                        -webkit-background-clip: text;
                                        -webkit-text-fill-color: transparent;
                                        background-clip: text;
                                    }
                                    .products-count {
                                        color: #64748b;
                                        font-size: 15px;
                                        font-weight: 600;
                                        background: rgba(45, 139, 209, 0.1);
                                        padding: 8px 16px;
                                        border-radius: 20px;
                                    }
                                    .search-sort-controls {
                                        display: flex;
                                        gap: 12px;
                                        flex-wrap: wrap;
                                        align-items: center;
                                        flex: 1;
                                    }
                                    .search-box {
                                        display: flex;
                                        align-items: center;
                                        border: 2px solid #e2e8f0;
                                        border-radius: 12px;
                                        padding: 12px 16px;
                                        flex: 1;
                                        min-width: 250px;
                                        background: #fff;
                                        transition: all 0.3s ease;
                                    }
                                    .search-box:focus-within {
                                        border-color: #2D8BD1;
                                        box-shadow: 0 0 0 4px rgba(45, 139, 209, 0.1);
                                    }
                                    .search-box input {
                                        border: none;
                                        outline: none;
                                        flex: 1;
                                        font-size: 15px;
                                        font-family: inherit;
                                        color: #1e293b;
                                    }
                                    .search-box i {
                                        color: #94a3b8;
                                        margin-right: 10px;
                                        font-size: 16px;
                                    }
                                    .sort-dropdown {
                                        padding: 12px 16px;
                                        border: 2px solid #e2e8f0;
                                        border-radius: 12px;
                                        font-size: 15px;
                                        color: #1e293b;
                                        cursor: pointer;
                                        background: #fff;
                                        transition: all 0.3s ease;
                                        font-weight: 600;
                                    }
                                    .sort-dropdown:hover, .sort-dropdown:focus {
                                        border-color: #2D8BD1;
                                        box-shadow: 0 0 0 4px rgba(45, 139, 209, 0.1);
                                    }
                                    .products-grid {
                                        display: grid;
                                        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                                        gap: 28px;
                                        margin-bottom: 50px;
                                    }
                                    .deal-card {
                                        width: 100%;
                                        max-width: 100%;
                                        background: linear-gradient(145deg, #ffffff 0%, #fafbfc 100%);
                                        border-radius: 20px;
                                        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
                                        overflow: hidden;
                                        border: 1px solid rgba(45, 139, 209, 0.1);
                                        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                                        position: relative;
                                        animation: fadeInUp 0.6s ease-out forwards;
                                    }
                                    .deal-card::before {
                                        content: '';
                                        position: absolute;
                                        top: 0;
                                        left: 0;
                                        right: 0;
                                        height: 3px;
                                        background: linear-gradient(90deg, #2D8BD1 0%, #1A4F97 100%);
                                        transform: scaleX(0);
                                        transform-origin: left;
                                        transition: transform 0.4s ease;
                                    }
                                    .deal-card:hover::before {
                                        transform: scaleX(1);
                                    }
                                    .deal-card:nth-child(1) { animation-delay: 0.1s; }
                                    .deal-card:nth-child(2) { animation-delay: 0.2s; }
                                    .deal-card:nth-child(3) { animation-delay: 0.3s; }
                                    .deal-card:nth-child(4) { animation-delay: 0.4s; }
                                    .deal-card:nth-child(5) { animation-delay: 0.5s; }
                                    .deal-card:nth-child(6) { animation-delay: 0.6s; }
                                    .deal-card:nth-child(7) { animation-delay: 0.7s; }
                                    .deal-card:nth-child(8) { animation-delay: 0.8s; }
                                    .deal-card:nth-child(9) { animation-delay: 0.9s; }
                                    .deal-card:nth-child(10) { animation-delay: 1s; }
                                    .deal-card:nth-child(11) { animation-delay: 1.1s; }
                                    .deal-card:nth-child(12) { animation-delay: 1.2s; }
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
                                    .deal-card:hover {
                                        transform: translateY(-8px) scale(1.02);
                                        box-shadow: 0 20px 48px rgba(45, 139, 209, 0.2);
                                        border-color: rgba(45, 139, 209, 0.3);
                                    }
                                    .deal-image {
                                        position: relative;
                                        width: 100%;
                                        height: 260px;
                                        overflow: hidden;
                                        background: linear-gradient(135deg, #f6f8fb 0%, #e9ecef 100%);
                                    }
                                    .deal-image img {
                                        width: 100%;
                                        height: 100%;
                                        object-fit: cover;
                                        display: block;
                                        transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                                    }
                                    .deal-card:hover .deal-image img {
                                        transform: scale(1.1) rotate(1deg);
                                        filter: brightness(1.05);
                                    }
                                    .deal-cart-btn {
                                        position: absolute;
                                        right: 14px;
                                        bottom: 14px;
                                        width: 56px;
                                        height: 56px;
                                        border-radius: 50%;
                                        background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
                                        border: 2px solid rgba(45, 139, 209, 0.2);
                                        display: grid;
                                        place-items: center;
                                        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
                                        transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
                                        cursor: pointer;
                                        z-index: 2;
                                    }
                                    .deal-cart-btn:hover {
                                        transform: translateY(-4px) scale(1.1) rotate(5deg);
                                        box-shadow: 0 16px 32px rgba(45, 139, 209, 0.3);
                                        border-color: #2D8BD1;
                                        background: linear-gradient(135deg, #2D8BD1 0%, #1A4F97 100%);
                                    }
                                    .deal-wishlist-btn {
                                        position: absolute;
                                        right: 14px;
                                        top: 14px;
                                        width: 48px;
                                        height: 48px;
                                        border-radius: 50%;
                                        background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
                                        border: 2px solid rgba(220, 38, 38, 0.2);
                                        display: grid;
                                        place-items: center;
                                        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
                                        transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
                                        cursor: pointer;
                                        z-index: 2;
                                    }
                                    .deal-wishlist-btn:hover {
                                        transform: translateY(-2px) scale(1.1);
                                        box-shadow: 0 12px 28px rgba(220, 38, 38, 0.3);
                                        border-color: #dc2626;
                                        background: linear-gradient(135deg, #ffffff 0%, #fef2f2 100%);
                                    }
                                    .deal-wishlist-btn.active {
                                        background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
                                        border-color: #dc2626;
                                    }
                                    .deal-wishlist-btn.active i {
                                        color: #ffffff;
                                    }
                                    .deal-cart-btn:hover i {
                                        color: #fff !important;
                                        animation: cartBounce 0.5s ease;
                                    }
                                    @keyframes cartBounce {
                                        0%, 100% { transform: scale(1); }
                                        50% { transform: scale(1.2); }
                                    }
                                    .deal-badge {
                                        position: absolute;
                                        top: 16px;
                                        left: 16px;
                                        padding: 8px 14px;
                                        border-radius: 12px;
                                        background: linear-gradient(135deg, #2D8BD1 0%, #1A4F97 100%);
                                        color: #fff;
                                        font-size: 11px;
                                        font-weight: 900;
                                        letter-spacing: 0.5px;
                                        text-transform: uppercase;
                                        box-shadow: 0 8px 20px rgba(26, 79, 151, 0.35);
                                        border: 1px solid rgba(255, 255, 255, 0.3);
                                        z-index: 2;
                                        backdrop-filter: blur(10px);
                                        animation: badgePulse 2s ease-in-out infinite;
                                    }
                                    @keyframes badgePulse {
                                        0%, 100% { box-shadow: 0 8px 20px rgba(26, 79, 151, 0.35); }
                                        50% { box-shadow: 0 8px 24px rgba(26, 79, 151, 0.5); }
                                    }
                                    .deal-body {
                                        padding: 22px 24px 24px;
                                        background: linear-gradient(to bottom, transparent, rgba(45, 139, 209, 0.02));
                                    }
                                    .deal-title {
                                        font-size: 17px;
                                        color: #111827;
                                        font-weight: 800;
                                        margin: 0 0 14px 0;
                                        line-height: 1.4;
                                        display: -webkit-box;
                                        -webkit-line-clamp: 2;
                                        -webkit-box-orient: vertical;
                                        overflow: hidden;
                                        transition: color 0.3s ease;
                                    }
                                    .deal-card:hover .deal-title {
                                        color: #2D8BD1;
                                    }
                                    .deal-pricing {
                                        display: flex;
                                        align-items: baseline;
                                        gap: 8px;
                                        margin-bottom: 10px;
                                        flex-wrap: wrap;
                                    }
                                    .deal-price-new {
                                        font-size: 24px;
                                        font-weight: 900;
                                        color: #111827;
                                        background: linear-gradient(135deg, #2D8BD1 0%, #1A4F97 100%);
                                        -webkit-background-clip: text;
                                        -webkit-text-fill-color: transparent;
                                        background-clip: text;
                                    }
                                    .deal-price-old {
                                        font-size: 15px;
                                        color: #9ca3af;
                                        text-decoration: line-through;
                                        font-weight: 600;
                                    }
                                    .deal-discount {
                                        font-size: 12px;
                                        font-weight: 900;
                                        color: #fff;
                                        background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
                                        padding: 4px 10px;
                                        border-radius: 8px;
                                        box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
                                    }
                                    .deal-rating {
                                        display: flex;
                                        align-items: center;
                                        gap: 8px;
                                        font-size: 13px;
                                        color: #4b5563;
                                        margin-top: 8px;
                                    }
                                    .deal-stars {
                                        color: #f59e0b;
                                        display: inline-flex;
                                        align-items: center;
                                        gap: 2px;
                                        font-size: 13px;
                                    }
                                    .no-products {
                                        grid-column: 1 / -1;
                                        text-align: center;
                                        padding: 100px 20px;
                                        background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
                                        border-radius: 20px;
                                        border: 2px dashed rgba(45, 139, 209, 0.2);
                                        position: relative;
                                        overflow: hidden;
                                    }
                                    .no-products::before {
                                        content: '';
                                        position: absolute;
                                        top: -50%;
                                        left: -50%;
                                        width: 200%;
                                        height: 200%;
                                        background: radial-gradient(circle, rgba(45, 139, 209, 0.05) 0%, transparent 70%);
                                        animation: rotate 20s linear infinite;
                                    }
                                    @keyframes rotate {
                                        from { transform: rotate(0deg); }
                                        to { transform: rotate(360deg); }
                                    }
                                    .no-products-icon {
                                        font-size: 80px;
                                        color: #cbd5e1;
                                        margin-bottom: 24px;
                                        position: relative;
                                        z-index: 1;
                                        animation: float 3s ease-in-out infinite;
                                    }
                                    @keyframes float {
                                        0%, 100% { transform: translateY(0px); }
                                        50% { transform: translateY(-10px); }
                                    }
                                    .no-products-text {
                                        font-size: 22px;
                                        color: #64748b;
                                        font-weight: 700;
                                        position: relative;
                                        z-index: 1;
                                    }
                                    .product-modal-overlay {
                                        position: fixed;
                                        inset: 0;
                                        background: rgba(0, 0, 0, 0.6);
                                        backdrop-filter: blur(4px);
                                        display: flex;
                                        align-items: center;
                                        justify-content: center;
                                        z-index: 10000;
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
                                    .product-modal-close {
                                        background: none;
                                        border: none;
                                        font-size: 24px;
                                        color: #64748b;
                                        cursor: pointer;
                                        padding: 4px;
                                        border-radius: 6px;
                                        transition: all 0.2s ease;
                                    }
                                    .product-modal-close:hover {
                                        background: #e2e8f0;
                                        color: #1e293b;
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
                                    @media (max-width: 768px) {
                                        .products-grid {
                                            grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
                                            gap: 20px;
                                        }
                                        .shop-header {
                                            flex-direction: column;
                                            gap: 15px;
                                            padding: 20px;
                                        }
                                        .search-box {
                                            min-width: 100%;
                                        }
                                    }
                                `}</style>

                                <div className="shop-header">
                                    <h2>Our Products</h2>
                                    <div className="search-sort-controls">
                                        <div className="search-box">
                                            <i className="fa-solid fa-search"></i>
                                            <input
                                                type="text"
                                                placeholder="Search products..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                            />
                                        </div>
                                        <select
                                            className="sort-dropdown"
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value)}
                                        >
                                            <option value="newest">Newest First</option>
                                            <option value="price-low">Price: Low to High</option>
                                            <option value="price-high">Price: High to Low</option>
                                            <option value="rating">Highest Rated</option>
                                        </select>
                                    </div>
                                    <span className="products-count">{filteredProducts.length} Products</span>
                                </div>

                                {loading ? (
                                    <div className="loading-container" style={{ textAlign: 'center', padding: '60px 20px' }}>
                                        <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '48px', color: '#2D8BD1', marginBottom: '20px' }}></i>
                                        <p style={{ fontSize: '16px', color: '#6b7280', fontWeight: 600 }}>Loading products...</p>
                                    </div>
                                ) : error ? (
                                    <div className="error-container" style={{ textAlign: 'center', padding: '60px 20px' }}>
                                        <i className="fa-solid fa-exclamation-triangle" style={{ fontSize: '48px', color: '#ef4444', marginBottom: '20px' }}></i>
                                        <p style={{ fontSize: '16px', color: '#6b7280', fontWeight: 600, marginBottom: '12px' }}>{error}</p>
                                        <button 
                                            onClick={() => window.location.reload()} 
                                            style={{
                                                padding: '12px 24px',
                                                background: '#2D8BD1',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '8px',
                                                fontSize: '14px',
                                                fontWeight: 600,
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Retry
                                        </button>
                                    </div>
                                ) : filteredProducts.length > 0 ? (
                                    <div className="products-grid">
                                        {filteredProducts.map(product => {
                                            // Only use discount/priceOld if they exist in the database
                                            const oldPrice = product.priceOld || null
                                            const discount = product.discount || null
                                            // Parse discount - could be number, string like "20" or "-20%"
                                            let discountValue = null
                                            if (discount !== null && discount !== undefined) {
                                                if (typeof discount === 'number') {
                                                    discountValue = discount
                                                } else if (typeof discount === 'string') {
                                                    // Remove % and - signs, parse as number
                                                    const parsed = parseFloat(discount.replace(/[%-]/g, ''))
                                                    discountValue = isNaN(parsed) ? null : parsed
                                                }
                                            }
                                            // Only show discount if both priceOld and discount exist, and priceOld > price
                                            const showDiscount = oldPrice && discountValue !== null && oldPrice > product.price
                                            return (
                                                <div
                                                    key={product.id}
                                                    className="deal-card"
                                                    onClick={() => navigate(`/product-details/${product.id}`, { state: { product } })}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    <div className="deal-image">
                                                        <img 
                                                            src={product.image} 
                                                            alt={product.name}
                                                            onError={(e) => {
                                                                e.target.src = '/placeholder-image.png'
                                                            }}
                                                        />
                                                        <span className="deal-badge">{product.category}</span>
                                                        <WishlistButton 
                                                            product={product}
                                                            className="deal-wishlist-btn"
                                                        />
                                                        <button 
                                                            className="deal-cart-btn" 
                                                            aria-label="Add to cart" 
                                                            onClick={(e) => { 
                                                                e.stopPropagation()
                                                                const cartProduct = {
                                                                    id: product.id,
                                                                    name: product.name,
                                                                    title: product.title || product.name,
                                                                    price: product.price,
                                                                    image: product.image,
                                                                    category: product.category,
                                                                    quantity: 1
                                                                }
                                                                addToCart(cartProduct, 1)
                                                                setAddedProduct(product.id)
                                                                setToast(`${product.name} added to cart`)
                                                                setTimeout(() => setAddedProduct(null), 2000)
                                                            }}
                                                        >
                                                            <i className="fa-solid fa-cart-shopping" style={{ color: addedProduct === product.id ? '#22c55e' : '#111827', fontSize: '18px' }}></i>
                                                        </button>
                                                    </div>
                                                    <div className="deal-body">
                                                        <h4 className="deal-title">{product.name}</h4>
                                                        <div className="deal-pricing">
                                                            <span className="deal-price-new">RWF {product.price.toLocaleString()}</span>
                                                            {showDiscount && (
                                                                <>
                                                                    <span className="deal-price-old">RWF {oldPrice.toLocaleString()}</span>
                                                                    <span className="deal-discount">-{discountValue}%</span>
                                                                </>
                                                            )}
                                                        </div>
                                                        <div className="deal-rating">
                                                            <span className="deal-stars">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <i key={i} className={`fa-solid fa-star${i < Math.floor(product.rating) ? '' : i < product.rating ? '-half-stroke' : ''}`}></i>
                                                                ))}
                                                            </span>
                                                            <span>{product.rating.toFixed(1)}</span>
                                                            <span style={{ color: '#9ca3af' }}>|</span>
                                                            <span>{product.reviews} reviews</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                ) : (
                                    <div className="no-products">
                                        <div className="no-products-icon">
                                            <i className="fa-solid fa-inbox"></i>
                                        </div>
                                        <p className="no-products-text">No products found matching your criteria</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Cart Panel - Same as Home.jsx */}
            {showCart && (
                <div className="product-modal-overlay" onClick={toggleCart}>
                    <div className="cart-panel" onClick={(e) => e.stopPropagation()}>
                        <div className="cart-panel-header">
                            <h4 className="cart-panel-title">Cart ({cartItems.length})</h4>
                            <button className="product-modal-close" onClick={toggleCart}>✕</button>
                        </div>
                        <div className="cart-panel-body">
                            {cartItems.length === 0 && (
                                <div style={{ textAlign: 'center', color: '#6b7280', fontWeight: 700, padding: '40px 20px' }}>
                                    <i className="fa-solid fa-cart-shopping" style={{ fontSize: '48px', color: '#d1d5db', marginBottom: '16px', display: 'block' }}></i>
                                    <div>Your cart is empty.</div>
                                    <a href="/shop" style={{ 
                                        display: 'inline-block', 
                                        marginTop: '16px', 
                                        color: '#2D8BD1', 
                                        textDecoration: 'none',
                                        fontWeight: 600
                                    }}>Continue Shopping</a>
                                </div>
                            )}
                            {cartItems.map((item, index) => (
                                <div key={`${item.id}-${index}`} className="cart-line">
                                    <img src={item.image} alt={item.name || item.title} />
                                    <div>
                                        <h5>{item.name || item.title}</h5>
                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                                            <span className="price">RWF {item.price?.toLocaleString() || item.priceNew}</span>
                                            {item.category && <span className="badge">{item.category}</span>}
                                        </div>
                                        {item.quantity > 1 && (
                                            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                                                Qty: {item.quantity}
                                            </div>
                                        )}
                                    </div>
                                    <button className="cart-remove" onClick={() => {
                                        removeFromCart(item.id)
                                        setToast('Item removed from cart')
                                    }} title="Remove">✕</button>
                                </div>
                            ))}
                        </div>
                        {cartItems.length > 0 && (
                            <div className="cart-panel-footer" style={{ 
                                padding: '20px', 
                                borderTop: '1px solid #e5e7eb',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '12px'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                    <span style={{ fontWeight: 600, color: '#374151' }}>Total:</span>
                                    <span style={{ fontWeight: 700, fontSize: '18px', color: '#2D8BD1' }}>
                                        RWF {cartItems.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0).toLocaleString()}
                                    </span>
                                </div>
                                <button 
                                    onClick={handleCheckout}
                                    style={{
                                        width: '100%',
                                        padding: '14px',
                                        background: 'linear-gradient(135deg, #2D8BD1 0%, #1A4F97 100%)',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontSize: '16px',
                                        fontWeight: 700,
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        boxShadow: '0 4px 12px rgba(45, 139, 209, 0.3)'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.transform = 'translateY(-2px)'
                                        e.target.style.boxShadow = '0 6px 16px rgba(45, 139, 209, 0.4)'
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.transform = 'translateY(0)'
                                        e.target.style.boxShadow = '0 4px 12px rgba(45, 139, 209, 0.3)'
                                    }}
                                >
                                    <i className="fa-solid fa-arrow-right" style={{ marginRight: '8px' }}></i>
                                    Proceed to Checkout
                                </button>
                                <a 
                                    href="/shop"
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        background: '#fff',
                                        color: '#2D8BD1',
                                        border: '2px solid #2D8BD1',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        textAlign: 'center',
                                        textDecoration: 'none',
                                        transition: 'all 0.3s ease',
                                        display: 'block'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.background = '#f0f7ff'
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.background = '#fff'
                                    }}
                                >
                                    Continue Shopping
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Toast Notification */}
            {toast && (
                <div className="toast" style={{
                    position: 'fixed',
                    top: '24px',
                    right: '24px',
                    background: '#0f172a',
                    color: '#fff',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.2)',
                    zIndex: 10000,
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    animation: 'slideInRight 0.3s ease-out'
                }}>
                    <i className="fa-solid fa-circle-check" style={{ color: '#22c55e' }}></i>
                    <span>{toast}</span>
                    <style>{`
                        @keyframes slideInRight {
                            from {
                                transform: translateX(100%);
                                opacity: 0;
                            }
                            to {
                                transform: translateX(0);
                                opacity: 1;
                            }
                        }
                    `}</style>
                </div>
            )}

            {/* <!-- Footer --> */}
            <footer>
                <div className="tv-footer-wrap footer-bg z-index-1" style={{ backgroundColor: '#fff', color: '#333', paddingTop: '80px', paddingBottom: '40px' }}>
                    <div className="container">
                        <div className="row mb-60">
                            <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6 mb-40">
                                <div className="footer-widget">
                                    <div className="footer-logo mb-20">
                                        <a href='/'><img src="assets/img/logo/F_logo.png" alt="Fabritech" style={{ height: '50px', width: 'auto' }} /></a>
                                    </div>
                                    <div className="footer-about">
                                        <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.8', marginBottom: '0' }}>At Fabritech, we are dedicated to providing top-notch IT solutions and services.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-2 col-lg-2 col-md-6 col-sm-6 mb-40">
                                <div className="footer-widget">
                                    <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px', color: '#1a1a1a' }}>Explore</h4>
                                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                        <li style={{ marginBottom: '12px' }}>
                                            <a href='/' style={{ color: '#666', textDecoration: 'none', fontSize: '14px', transition: 'color 0.3s ease' }} onMouseEnter={(e) => e.target.style.color = '#2D8BD1'} onMouseLeave={(e) => e.target.style.color = '#666'}>Home</a>
                                        </li>
                                        <li style={{ marginBottom: '12px' }}>
                                            <a href='/shop' style={{ color: '#666', textDecoration: 'none', fontSize: '14px', transition: 'color 0.3s ease' }} onMouseEnter={(e) => e.target.style.color = '#2D8BD1'} onMouseLeave={(e) => e.target.style.color = '#666'}>Shop</a>
                                        </li>
                                        <li>
                                            <a href='/contact' style={{ color: '#666', textDecoration: 'none', fontSize: '14px', transition: 'color 0.3s ease' }} onMouseEnter={(e) => e.target.style.color = '#2D8BD1'} onMouseLeave={(e) => e.target.style.color = '#666'}>Contact Us</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="col-xl-4 col-lg-4 col-md-6 col-sm-6 mb-40">
                                <div className="footer-widget">
                                    <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px', color: '#1a1a1a' }}>Contact Info</h4>
                                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                        <li style={{ marginBottom: '15px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                                            <i className="fa-solid fa-map-marker-alt" style={{ color: '#2D8BD1', marginTop: '2px', minWidth: '16px' }}></i>
                                            <span style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>YYUSSA Plaza, Kisimenti, Remera</span>
                                        </li>
                                        <li style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <i className="fa-solid fa-envelope" style={{ color: '#2D8BD1', minWidth: '16px' }}></i>
                                            <a href="mailto:info@fabritech.rw" style={{ fontSize: '14px', color: '#666', textDecoration: 'none', transition: 'color 0.3s ease' }} onMouseEnter={(e) => e.target.style.color = '#2D8BD1'} onMouseLeave={(e) => e.target.style.color = '#666'}>info@fabritech.rw</a>
                                        </li>
                                        <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <i className="fa-solid fa-phone" style={{ color: '#2D8BD1', minWidth: '16px' }}></i>
                                            <a href="tel:+250788601280" style={{ fontSize: '14px', color: '#666', textDecoration: 'none', transition: 'color 0.3s ease' }} onMouseEnter={(e) => e.target.style.color = '#2D8BD1'} onMouseLeave={(e) => e.target.style.color = '#666'}>+250788601280</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6 mb-40">
                                <div className="footer-widget">
                                    <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px', color: '#1a1a1a' }}>Follow Us</h4>
                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        <a href="#" style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f0f0', color: '#2D8BD1', borderRadius: '50%', textDecoration: 'none', fontSize: '14px', transition: 'all 0.3s ease' }} onMouseEnter={(e) => { e.target.style.backgroundColor = '#2D8BD1'; e.target.style.color = '#fff' }} onMouseLeave={(e) => { e.target.style.backgroundColor = '#f0f0f0'; e.target.style.color = '#2D8BD1' }}>
                                            <i className="fa-brands fa-facebook-f"></i>
                                        </a>
                                        <a href="#" style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f0f0', color: '#2D8BD1', borderRadius: '50%', textDecoration: 'none', fontSize: '14px', transition: 'all 0.3s ease' }} onMouseEnter={(e) => { e.target.style.backgroundColor = '#2D8BD1'; e.target.style.color = '#fff' }} onMouseLeave={(e) => { e.target.style.backgroundColor = '#f0f0f0'; e.target.style.color = '#2D8BD1' }}>
                                            <i className="fa-brands fa-twitter"></i>
                                        </a>
                                        <a href="#" style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f0f0', color: '#2D8BD1', borderRadius: '50%', textDecoration: 'none', fontSize: '14px', transition: 'all 0.3s ease' }} onMouseEnter={(e) => { e.target.style.backgroundColor = '#2D8BD1'; e.target.style.color = '#fff' }} onMouseLeave={(e) => { e.target.style.backgroundColor = '#f0f0f0'; e.target.style.color = '#2D8BD1' }}>
                                            <i className="fa-brands fa-instagram"></i>
                                        </a>
                                        <a href="#" style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f0f0', color: '#2D8BD1', borderRadius: '50%', textDecoration: 'none', fontSize: '14px', transition: 'all 0.3s ease' }} onMouseEnter={(e) => { e.target.style.backgroundColor = '#2D8BD1'; e.target.style.color = '#fff' }} onMouseLeave={(e) => { e.target.style.backgroundColor = '#f0f0f0'; e.target.style.color = '#2D8BD1' }}>
                                            <i className="fa-brands fa-linkedin-in"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style={{ borderTop: '1px solid #eee', paddingTop: '30px', paddingBottom: '0' }}>
                            <div className="row">
                                <div className="col-12">
                                    <div className="footer-copyright" style={{ textAlign: 'center' }}>
                                        <p style={{ fontSize: '14px', color: '#666', margin: '0' }}>Fabritech, All rights reserved 2025. Developed by <a href="#" style={{ color: '#2D8BD1', textDecoration: 'none', fontWeight: '600' }}>Maliki NTWALI</a></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default Shop
