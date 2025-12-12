import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useTemplateScripts from '../hooks/useTemplateScripts'
import CartIcon from './CartIcon'
import UserMenu from './UserMenu'
import { useCart } from '../Context/CartContext'
import { getAllProducts } from '../services/productService'

function Home() {
    useTemplateScripts()
    const navigate = useNavigate()
    const { cartItems, addToCart: addToCartContext, removeFromCart: removeFromCartContext } = useCart()
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [toast, setToast] = useState(null)
    const [showCart, setShowCart] = useState(false)
    const [dealProducts, setDealProducts] = useState([])
    const [productsLoading, setProductsLoading] = useState(true)
    const [productsError, setProductsError] = useState('')

    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 2200)
            return () => clearTimeout(timer)
        }
    }, [toast])

    // Smooth scroll handler for anchor links
    useEffect(() => {
        const handleAnchorClick = (e) => {
            const href = e.target.getAttribute('href')
            if (href && href.startsWith('#')) {
                e.preventDefault()
                const targetId = href.substring(1)
                const targetElement = document.getElementById(targetId)
                if (targetElement) {
                    const headerOffset = 100 // Account for fixed header
                    const elementPosition = targetElement.getBoundingClientRect().top
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    })
                }
            }
        }

        // Add event listener to all anchor links
        const links = document.querySelectorAll('a[href^="#"]')
        links.forEach(link => {
            link.addEventListener('click', handleAnchorClick)
        })

        return () => {
            links.forEach(link => {
                link.removeEventListener('click', handleAnchorClick)
            })
        }
    }, [])

    // Scroll animation observer
    useEffect(() => {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('scroll-animated')
                    observer.unobserve(entry.target)
                }
            })
        }, observerOptions)

        // Observe all elements with scroll-animate class
        const observeElements = () => {
            const animateElements = document.querySelectorAll('.scroll-animate:not(.scroll-animated)')
            animateElements.forEach(el => observer.observe(el))
        }

        // Initial observation
        observeElements()

        // Re-observe when products are loaded (for dynamically added product cards)
        if (dealProducts.length > 0) {
            // Small delay to ensure DOM is updated
            setTimeout(observeElements, 100)
        }

        return () => {
            const animateElements = document.querySelectorAll('.scroll-animate')
            animateElements.forEach(el => observer.unobserve(el))
        }
    }, [dealProducts])

    // Fetch products from API
    useEffect(() => {
        const fetchProducts = async () => {
            setProductsLoading(true)
            setProductsError('')
            try {
                const data = await getAllProducts()
                console.log('Fetched products data:', data) // Debug log
                
                // Check if data is an array
                if (!Array.isArray(data)) {
                    console.error('Products data is not an array:', data)
                    setProductsError('Invalid products data format')
                    setDealProducts([])
                    return
                }
                
                // Transform API data to match Home component format
                const transformedProducts = data.map((product, index) => {
                    const id = product.id || product._id || `product-${index + 1}`
                    const priceNew = parseFloat(product.priceNew) || parseFloat(product.price) || 0
                    const priceOld = product.priceOld ? parseFloat(product.priceOld) : null
                    
                    // Calculate discount if not provided
                    let discount = product.discount ? parseFloat(product.discount) : null
                    if (!discount && priceOld && priceOld > priceNew && priceNew > 0) {
                        discount = Math.round(((priceOld - priceNew) / priceOld) * 100)
                    }
                    
                    // Format prices as strings
                    const formattedPriceNew = priceNew > 0 ? `RWF${priceNew.toLocaleString()}` : 'RWF0'
                    const formattedPriceOld = priceOld && priceOld > 0 ? `RWF${priceOld.toLocaleString()}` : null
                    const formattedDiscount = discount && discount > 0 ? `-${discount}%` : null
                    
                    return {
                        id,
                        title: product.title || product.name || 'Untitled Product',
                        badge: product.badge || product.category || 'Featured',
                        image: product.image || '/placeholder-image.png',
                        priceNew: formattedPriceNew,
                        priceOld: formattedPriceOld,
                        discount: formattedDiscount,
                        rating: (parseFloat(product.rating) || 0).toFixed(1),
                        sold: product.sold || '0+',
                        description: product.description || 'No description available.',
                        // Keep original numeric values for cart
                        priceNewNum: priceNew,
                        priceOldNum: priceOld
                    }
                })
                
                console.log('Transformed products:', transformedProducts) // Debug log
                
                // Limit to 6 products for featured section
                const featuredProducts = transformedProducts.slice(0, 6)
                console.log('Featured products to display:', featuredProducts) // Debug log
                setDealProducts(featuredProducts)
            } catch (err) {
                setProductsError(err.message || 'Failed to load products')
                console.error('Error fetching products:', err)
                // Set empty array on error
                setDealProducts([])
            } finally {
                setProductsLoading(false)
            }
        }

        fetchProducts()
    }, [])

    const openProduct = (product) => setSelectedProduct(product)
    const closeProduct = () => setSelectedProduct(null)

    const addToCart = (product) => {
        // Convert product format to match CartContext format
        const cartProduct = {
            id: product.id,
            name: product.title,
            title: product.title, // Keep both for compatibility
            price: product.priceNewNum || parseFloat(product.priceNew.replace(/[^\d]/g, '')),
            image: product.image,
            category: product.badge,
            quantity: 1
        }
        addToCartContext(cartProduct, 1)
        setToast(`${product.title} added to cart`)
        closeProduct()
    }

    const removeFromCart = (index) => {
        if (cartItems[index]) {
            removeFromCartContext(cartItems[index].id)
            setToast(`Item removed from cart`)
        }
    }

    const toggleCart = () => setShowCart((prev) => !prev)
    
    const handleCheckout = () => {
        setShowCart(false)
        navigate('/cart')
    }
    return (
        <div>
            <style>{`
                html {
                    scroll-behavior: smooth;
                }
                a[href^="#"] {
                    cursor: pointer;
                }

                /* Navbar styling is now unified in App.css */

                /* Scroll Animation Styles */
                .scroll-animate {
                    opacity: 0;
                    transition: opacity 0.8s ease-out, transform 0.8s ease-out;
                }
                /* Ensure product cards are always visible (they're dynamically loaded) */
                .deal-card {
                    opacity: 1 !important;
                    transform: translateY(0) !important;
                    animation: fadeInUp 0.6s ease-out forwards;
                }
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .scroll-animate.fade-up {
                    transform: translateY(40px);
                }

                .scroll-animate.fade-down {
                    transform: translateY(-40px);
                }

                .scroll-animate.fade-left {
                    transform: translateX(-40px);
                }

                .scroll-animate.fade-right {
                    transform: translateX(40px);
                }

                .scroll-animate.scale-up {
                    transform: scale(0.9);
                }

                .scroll-animate.rotate-in {
                    transform: rotate(-5deg) scale(0.95);
                }

                .scroll-animated {
                    opacity: 1 !important;
                    transform: translateY(0) translateX(0) scale(1) rotate(0deg) !important;
                }

                /* Stagger animation delays for child elements */
                .scroll-animate-delay-1 { transition-delay: 0.1s; }
                .scroll-animate-delay-2 { transition-delay: 0.2s; }
                .scroll-animate-delay-3 { transition-delay: 0.3s; }
                .scroll-animate-delay-4 { transition-delay: 0.4s; }
                .scroll-animate-delay-5 { transition-delay: 0.5s; }
                .scroll-animate-delay-6 { transition-delay: 0.6s; }
            `}</style>



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
                                                <a target="_blank" href="https://www.google.com/maps/@23.843848,90.3081992,17.5z?entry=ttu&amp;g_ep=EgoyMDI1MDEwMS4wIKXMDSoASAFQAw%3D%3D">371 7th Ave, New York, NY 10001</a>
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
                                        <a href='/'><img src="assets/img/logo/F_logo.png" alt="Fabritech" style={{ height: '45px', width: 'auto' }} /></a>
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
                                                    <a href='#about'>About Us</a>
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
                                        <CartIcon cartCount={cartItems.length} onClick={toggleCart} />
                                        <button className="tv-header-search search-open-btn d-none d-xxl-block">
                                            <i className="fa-solid fa-magnifying-glass"></i>
                                        </button>
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
                {/* <!-- slider-area-start --> */}
                <div id="home" className="tv-slider-area">
                    <div className="tv-slider-wrap">
                        <div className="swiper-container tv-slider-active tv-slider-animation p-relative">
                            <div className="swiper-wrapper">
                                <div className="swiper-slide">
                                    <div className="tv-slider-overlay z-index-1 fix p-relative">
                                        <div className="tv-slider-bg" data-background="assets/img/slider/slider-1-1.jpg" style={{ backgroundImage: "url('assets/img/slider/slider-1-1.jpg')" }}></div>
                                        <div className="container">
                                            <div className="row">
                                                <div className="col-xl-6 col-lg-6">
                                                    <div className="tv-slider-content z-index-1">
                                                        <span className="tv-slider-subtitle">Starlink & Networking</span>
                                                        <h1 className="tv-slider-title p-relative">Connect Anywhere With Next-Gen Satellite Solutions
                                                        </h1>
                                                        <div className="tv-slider-text pb-20">
                                                            <p>Experience ultra-fast, reliable connectivity powered by Starlink and enterprise-grade networking infrastructure built for your growth.
                                                            </p>
                                                        </div>
                                                        <div className="tv-slider-btn">
                                                            <a className='tv-btn-primary' href='/contact'>
                                                                <span className="btn-wrap">
                                                                    <span className="btn-text1">Let’s Talk With Us</span>
                                                                    <span className="btn-text2">Let’s Talk With Us</span>
                                                                </span>
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="swiper-slide">
                                    <div className="tv-slider-overlay z-index-1 fix p-relative">
                                        <div className="tv-slider-bg" data-background="assets/img/slider/slider-1-2.jpg" style={{ backgroundImage: "url('assets/img/slider/slider-1-2.jpg')" }}></div>
                                        <div className="container">
                                            <div className="row">
                                                <div className="col-xl-6 col-lg-6">
                                                    <div className="tv-slider-content z-index-1">
                                                        <span className="tv-slider-subtitle">Digital Security</span>
                                                        <h1 className="tv-slider-title p-relative">Protect Your Business With Advanced Cybersecurity
                                                        </h1>
                                                        <div className="tv-slider-text pb-20">
                                                            <p>Safeguard your digital assets with cutting-edge security solutions that defend against evolving threats and keep your business secure.
                                                            </p>
                                                        </div>
                                                        <div className="tv-slider-btn">
                                                            <a className='tv-btn-primary' href='/contact'>
                                                                <span className="btn-wrap">
                                                                    <span className="btn-text1">Let’s Talk With Us</span>
                                                                    <span className="btn-text2">Let’s Talk With Us</span>
                                                                </span>
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="swiper-slide">
                                    <div className="tv-slider-overlay z-index-1 fix p-relative">
                                        <div className="tv-slider-bg" data-background="assets/img/slider/slider-1-3.jpg" style={{ backgroundImage: "url('assets/img/slider/slider-1-3.jpg')" }}></div>
                                        <div className="container">
                                            <div className="row">
                                                <div className="col-xl-6 col-lg-6">
                                                    <div className="tv-slider-content z-index-1">
                                                        <span className="tv-slider-subtitle">Web & Software Development</span>
                                                        <h1 className="tv-slider-title p-relative">Build Your Digital Future With Custom Solutions
                                                        </h1>
                                                        <div className="tv-slider-text pb-20">
                                                            <p>From concept to deployment, we create innovative web and software solutions that drive business growth and user engagement.
                                                            </p>
                                                        </div>
                                                        <div className="tv-slider-btn">
                                                            <a className='tv-btn-primary' href='/contact'>
                                                                <span className="btn-wrap">
                                                                    <span className="btn-text1">Let’s Talk With Us</span>
                                                                    <span className="btn-text2">Let’s Talk With Us</span>
                                                                </span>
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="tv-slider-arrow-box d-none d-lg-block">
                                <div className="swiper-pagination"></div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <!-- slider-area-end --> */}

                {/* <!-- about-area-start --> */}
                <div id="about" className="tv-about-area z-index-1 p-relative pt-130 pb-130 white-bg">

                    <div className="container">
                        <div className="row align-items-end">
                            <div className="col-xl-5 col-lg-5 scroll-animate fade-left">
                                <div className="tv-section-title-box">
                                    <span className="tv-section-subtitle tv-spltv-text tv-spltv-in-right">About Fabritech</span>
                                    <h4 className="tv-section-title pb-20 tv-spltv-text tv-spltv-in-right">Innovating Tomorrow's Technology Today</h4>
                                </div>
                            </div>
                            <div className="col-xl-7 col-lg-7 text-end scroll-animate fade-right">
                                <div className="tv-fade-anim button" data-fade-from="top" data-ease="bounce" data-delay=".5">
                                    <a className='tv-btn-secondary' href='#contact'>
                                        <span className="btn-wrap">
                                            <span className="btn-text1">Know More</span>
                                            <span className="btn-text2">Know More</span>
                                        </span>
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="tv-about-section mt-60">
                            <div className="row align-items-center">
                                <div className="col-xl-4 col-lg-6 col-md-6 scroll-animate fade-up scroll-animate-delay-1">
                                    <div className="tv-about-left">
                                        <div className="single-icon-box">
                                            <span><img src="assets/img/icon/about-icon-1.png" alt="" /></span>
                                            <div className="icon-box-content">
                                                <h3>Our Mission</h3>
                                                <p>To deliver cutting-edge technology solutions that empower businesses to connect, secure, and innovate in an increasingly digital world.</p>
                                            </div>
                                        </div>
                                        <div className="single-icon-box">
                                            <span><img src="assets/img/icon/about-icon-2.png" alt="" /></span>
                                            <div className="icon-box-content">
                                                <h3>Our Vision</h3>
                                                <p>To be the leading technology partner trusted by businesses worldwide for transformative digital solutions and unparalleled support.</p>
                                            </div>
                                        </div>
                                        <div className="single-icon-box">
                                            <span><img src="assets/img/icon/about-icon-3.png" alt="" /></span>
                                            <div className="icon-box-content">
                                                <h3>Our Values</h3>
                                                <p>Excellence, Innovation, Integrity, and Client Success drive everything we do at Fabritech.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-4 col-lg-6 col-md-6 scroll-animate scale-up scroll-animate-delay-2">
                                    <div className="tv-about-middle">
                                        <img src="assets/img/about/about-1-1.png" alt="" />
                                        <p>Fabritech is a forward-thinking technology company specializing in Starlink & Networking, Digital Security, and Web & Software Development. We combine expertise, innovation, and dedication to deliver solutions that transform businesses and create lasting impact.</p>
                                    </div>
                                </div>
                                <div className="col-xl-4 d-xxl-block d-xl-block d-none col-md-6 col-sm-6 scroll-animate fade-right scroll-animate-delay-3">
                                    <div className="tv-about-right">
                                        <img src="assets/img/about/about-1-2.png" alt="" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <!-- about-area-end --> */}
                {/* <!-- service-area-start --> */}
                <div className="tv-service-area pt-130 pb-130">
                    <div className="container">
                        <div className="row  justify-content-center">
                            <div className="col-12 text-center scroll-animate fade-up">
                                <div className="tv-section-title-box mb-60">
                                    <span className="tv-section-subtitle tv-spltv-text tv-spltv-in-right">Our Services</span>
                                    <h4 className="tv-section-title pb-20 tv-spltv-text tv-spltv-in-right">Tech Solutions Driving Global <br /> Connectivity</h4>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-4 col-xl-4 col-md-6 scroll-animate fade-up scroll-animate-delay-1">
                                <div className="single-project-item mb-30">
                                    <img src="assets/img/service/networking.jpeg" alt="Network Infrastructure" />
                                    <span className="icon">
                                        <a href='/service-details/network-infrastructure'> <i className="fa-solid fa-arrow-right"></i></a>
                                    </span>
                                    <div className="single-project-content">
                                        <h3>Network Infrastructure</h3>
                                        <p>High-Speed Network Setup for Corporate Offices.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 col-xl-4 col-md-6 scroll-animate fade-up scroll-animate-delay-2">
                                <div className="single-project-item mb-30">
                                    <img src="assets/img/service/security.jpeg" alt="Digital Security" />
                                    <span className="icon">
                                        <a href='/service-details/digital-security'> <i className="fa-solid fa-arrow-right"></i></a>
                                    </span>
                                    <div className="single-project-content">
                                        <h3>Digital Security</h3>
                                        <p>Comprehensive Digital Security Solutions.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 col-xl-4 col-md-6 scroll-animate fade-up scroll-animate-delay-3">
                                <div className="single-project-item mb-30">
                                    <img src="assets/img/service/starlink.jpeg" alt="Starlink Installation" />
                                    <span className="icon">
                                        <a href='/service-details/starlink-installation'> <i className="fa-solid fa-arrow-right"></i></a>
                                    </span>
                                    <div className="single-project-content">
                                        <h3>Starlink Installation</h3>
                                        <p>Professional Starlink setup and configuration for high-speed internet anywhere.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 col-xl-4 col-md-6 scroll-animate fade-up scroll-animate-delay-4">
                                <div className="single-project-item mb-30">
                                    <img src="assets/img/service/software.jpeg" alt="Software Development" />
                                    <span className="icon">
                                        <a href='/service-details/software-development'> <i className="fa-solid fa-arrow-right"></i></a>
                                    </span>
                                    <div className="single-project-content">
                                        <h3>Software Development</h3>
                                        <p>Bespoke ERP System for Small Businesses.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 col-xl-4 col-md-6 scroll-animate fade-up scroll-animate-delay-5">
                                <div className="single-project-item mb-30">
                                    <img src="assets/img/service/payTv.jpeg" alt="Canal+ & DStv Services" />
                                    <span className="icon">
                                        <a href='/service-details/canalplus-dstv'> <i className="fa-solid fa-arrow-right"></i></a>
                                    </span>
                                    <div className="single-project-content">
                                        <h3>Canal+ & DStv Services</h3>
                                        <p>Installation & Subscription Services for Canal+ and DStv.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 col-xl-4 col-md-6 scroll-animate fade-up scroll-animate-delay-6">
                                <div className="single-project-item mb-30">
                                    <img src="assets/img/service/internship.jpeg" alt="Internships & Short Courses" />
                                    <span className="icon">
                                        <a href='/service-details/internships-courses'> <i className="fa-solid fa-arrow-right"></i></a>
                                    </span>
                                    <div className="single-project-content">
                                        <h3>Internships & Short Courses</h3>
                                        <p>Gain Practical Experience with Our Internship Programs.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <!-- service-area-end --> */}

                {/* <!-- product-area-start --> */}
                <style>{`
                    @keyframes productSlideInUp {
                        from {
                            opacity: 0;
                            transform: translateY(40px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                    @keyframes productImageZoom {
                        from {
                            transform: scale(1);
                        }
                        to {
                            transform: scale(1.1);
                        }
                    }
                    @keyframes overlayFadeIn {
                        from {
                            opacity: 0;
                            backdrop-filter: blur(0px);
                        }
                        to {
                            opacity: 1;
                            backdrop-filter: blur(4px);
                        }
                    }
                    @keyframes pulseGlow {
                        0%, 100% {
                            box-shadow: 0 0 0 0 rgba(74, 144, 226, 0.4);
                        }
                        50% {
                            box-shadow: 0 0 0 10px rgba(74, 144, 226, 0);
                        }
                    }
                    @keyframes sizeButtonGlow {
                        0%, 100% {
                            box-shadow: 0 0 0 0 rgba(45, 139, 209, 0.3);
                        }
                        50% {
                            box-shadow: 0 0 0 8px rgba(45, 139, 209, 0);
                        }
                    }
                    @keyframes cartButtonHover {
                        0% {
                            transform: scale(1);
                        }
                        50% {
                            transform: scale(1.08);
                        }
                        100% {
                            transform: scale(1);
                        }
                    }
                    .product-card {
                        background: #fff;
                        border-radius: 12px;
                        overflow: hidden;
                        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
                        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                        border: 1px solid #f0f0f0;
                        animation: productSlideInUp 0.8s ease-out forwards;
                    }
                    .product-card:nth-child(1) { animation-delay: 0.1s; }
                    .product-card:nth-child(2) { animation-delay: 0.2s; }
                    .product-card:nth-child(3) { animation-delay: 0.3s; }
                    .product-card:nth-child(4) { animation-delay: 0.4s; }
                    .product-card:nth-child(5) { animation-delay: 0.5s; }
                    .product-card:nth-child(6) { animation-delay: 0.6s; }
                    .product-card:hover {
                        box-shadow: 0 12px 24px rgba(74, 144, 226, 0.15);
                        transform: translateY(-8px);
                        border-color: #4a90e2;
                    }
                    .product-image-container {
                        position: relative;
                        width: 100%;
                        height: 280px;
                        overflow: hidden;
                        background: linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%);
                    }
                    .product-image-container img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                        transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                    }
                    .product-card:hover .product-image-container img {
                        animation: productImageZoom 0.6s ease-out forwards;
                    }
                    .product-overlay {
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background: rgba(26, 26, 26, 0.75);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        opacity: 0;
                        animation: overlayFadeIn 0.4s ease-out;
                        transition: opacity 0.4s ease;
                    }
                    .product-card:hover .product-overlay {
                        opacity: 1;
                    }
                    .product-view-btn {
                        width: 56px;
                        height: 56px;
                        border-radius: 50%;
                        background: #4a90e2;
                        color: #fff;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 24px;
                        transition: all 0.3s ease;
                        box-shadow: 0 4px 12px rgba(74, 144, 226, 0.3);
                        text-decoration: none;
                        animation: pulseGlow 2s infinite;
                    }
                    .product-view-btn:hover {
                        background: #3580d2;
                        transform: scale(1.15);
                        box-shadow: 0 6px 16px rgba(74, 144, 226, 0.4);
                        animation: none;
                    }

                    /* Product quick-view modal */
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
                    .product-modal {
                        width: min(900px, 100%);
                        background: #fff;
                        border-radius: 18px;
                        overflow: hidden;
                        box-shadow: 0 24px 60px rgba(0, 0, 0, 0.18);
                        display: grid;
                        grid-template-columns: 1.1fr 1fr;
                        gap: 0;
                    }
                    @media (max-width: 900px) {
                        .product-modal {
                            grid-template-columns: 1fr;
                        }
                    }
                    .product-modal-image {
                        background: #f6f8fb;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        padding: 30px;
                    }
                    .product-modal-image img {
                        width: 100%;
                        height: auto;
                        object-fit: contain;
                    }
                    .product-modal-body {
                        padding: 26px 28px;
                        display: flex;
                        flex-direction: column;
                        gap: 14px;
                    }
                    .product-modal-chip {
                        align-self: flex-start;
                        padding: 8px 12px;
                        border-radius: 999px;
                        background: linear-gradient(135deg, #2D8BD1 0%, #1A4F97 100%);
                        color: #fff;
                        font-weight: 800;
                        font-size: 12px;
                        letter-spacing: 0.3px;
                        text-transform: uppercase;
                    }
                    .product-modal-title {
                        font-size: 24px;
                        font-weight: 900;
                        color: #0f172a;
                        margin: 0;
                        line-height: 1.2;
                    }
                    .product-modal-desc {
                        font-size: 15px;
                        color: #475467;
                        line-height: 1.6;
                        margin: 0;
                    }
                    .product-modal-meta {
                        display: flex;
                        align-items: center;
                        gap: 12px;
                        color: #111827;
                        font-weight: 800;
                    }
                    .product-modal-meta .old {
                        color: #9ca3af;
                        text-decoration: line-through;
                        font-weight: 600;
                    }
                    .product-modal-meta .discount {
                        color: #dc2626;
                        font-weight: 800;
                    }
                    .product-modal-rating {
                        display: flex;
                        align-items: center;
                        gap: 6px;
                        color: #475467;
                        font-size: 14px;
                    }
                    .product-modal-stars {
                        color: #f59e0b;
                        display: inline-flex;
                        gap: 2px;
                    }
                    .product-modal-actions {
                        display: flex;
                        gap: 12px;
                        margin-top: 10px;
                        flex-wrap: wrap;
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
                    .product-body {
                        padding: 28px 24px;
                    }
                    .product-title {
                        font-size: 18px;
                        font-weight: 700;
                        color: #1a1a1a;
                        margin-bottom: 12px;
                        transition: color 0.3s ease;
                    }
                    .product-title a {
                        color: #1a1a1a;
                        text-decoration: none;
                        transition: color 0.3s ease;
                    }
                    .product-title a:hover {
                        color: #4a90e2;
                    }
                    .product-description {
                        font-size: 14px;
                        color: #666;
                        line-height: 1.7;
                        margin-bottom: 20px;
                        min-height: 70px;
                    }
                    .product-footer-info {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding-top: 16px;
                        border-top: 1px solid #f0f0f0;
                        gap: 12px;
                    }
                    .product-price-tag {
                        font-size: 13px;
                        font-weight: 600;
                        color: #4a90e2;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                    }
                    .product-inquiry-btn {
                        width: 40px;
                        height: 40px;
                        border-radius: 50%;
                        background: #f8f9fa;
                        color: #4a90e2;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 16px;
                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                        text-decoration: none;
                        border: 2px solid transparent;
                    }
                    .product-inquiry-btn:hover {
                        background: #4a90e2;
                        color: #fff;
                        transform: translateX(4px) scale(1.1);
                        box-shadow: 0 4px 12px rgba(74, 144, 226, 0.3);
                    }

                    /* Shop-style deal card (inspiration from provided sample) */
                    .deal-card {
                        width: 100%;
                        max-width: 340px;
                        background: #fff;
                        border-radius: 16px;
                        box-shadow: 0 10px 28px rgba(0, 0, 0, 0.08);
                        overflow: hidden;
                        border: 1px solid #f1f1f1;
                        transition: transform 0.25s ease, box-shadow 0.25s ease;
                        position: relative;
                    }
                    .deal-card:hover {
                        transform: translateY(-6px);
                        box-shadow: 0 16px 36px rgba(0, 0, 0, 0.12);
                    }
                    .deal-image {
                        position: relative;
                        width: 100%;
                        height: 220px;
                        overflow: hidden;
                        background: #f6f6f6;
                    }
                    .deal-image img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                        display: block;
                        transition: transform 0.35s ease;
                    }
                    .deal-card:hover .deal-image img {
                        transform: scale(1.04);
                    }
                    .deal-cart-btn {
                        position: absolute;
                        right: 14px;
                        bottom: 14px;
                        width: 54px;
                        height: 54px;
                        border-radius: 50%;
                        background: #fff;
                        border: 1px solid #e6e6e6;
                        display: grid;
                        place-items: center;
                        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
                        transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
                        cursor: pointer;
                    }
                    .deal-cart-btn:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 14px 24px rgba(0, 0, 0, 0.12);
                        border-color: #d0d0d0;
                    }
                    .deal-badge {
                        position: absolute;
                        top: 12px;
                        left: 12px;
                        padding: 6px 10px;
                        border-radius: 8px;
                        background: linear-gradient(135deg, #2D8BD1 0%, #1A4F97 100%);
                        color: #fff;
                        font-size: 12px;
                        font-weight: 800;
                        letter-spacing: 0.3px;
                        text-transform: uppercase;
                        box-shadow: 0 8px 16px rgba(26, 79, 151, 0.25);
                        border: 1px solid rgba(26, 79, 151, 0.5);
                    }
                    .toast {
                        position: fixed;
                        top: 24px;
                        right: 24px;
                        background: #0f172a;
                        color: #fff;
                        padding: 12px 16px;
                        border-radius: 10px;
                        box-shadow: 0 12px 24px rgba(0,0,0,0.2);
                        z-index: 10000;
                        font-weight: 700;
                        display: inline-flex;
                        align-items: center;
                        gap: 10px;
                    }
                    .cart-fab {
                        position: fixed;
                        bottom: 28px;
                        right: 24px;
                        background: #1A4F97;
                        color: #fff;
                        border: none;
                        border-radius: 14px;
                        padding: 12px 16px;
                        font-weight: 800;
                        display: inline-flex;
                        align-items: center;
                        gap: 10px;
                        box-shadow: 0 12px 26px rgba(26, 79, 151, 0.35);
                        cursor: pointer;
                        z-index: 10001;
                        transition: transform 0.2s ease, box-shadow 0.2s ease;
                    }
                    .cart-fab:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 16px 30px rgba(26, 79, 151, 0.45);
                    }
                    .cart-badge {
                        min-width: 22px;
                        height: 22px;
                        border-radius: 999px;
                        background: #fff;
                        color: #1A4F97;
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 12px;
                        font-weight: 900;
                        padding: 0 6px;
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
                    .deal-body {
                        padding: 14px 16px 16px;
                    }
                    .deal-title {
                        font-size: 15px;
                        color: #111827;
                        font-weight: 700;
                        margin: 0 0 10px 0;
                        line-height: 1.4;
                        display: -webkit-box;
                        -webkit-line-clamp: 2;
                        -webkit-box-orient: vertical;
                        overflow: hidden;
                    }
                    .deal-pricing {
                        display: flex;
                        align-items: baseline;
                        gap: 8px;
                        margin-bottom: 8px;
                    }
                    .deal-price-new {
                        font-size: 20px;
                        font-weight: 800;
                        color: #111827;
                    }
                    .deal-price-old {
                        font-size: 14px;
                        color: #9ca3af;
                        text-decoration: line-through;
                    }
                    .deal-discount {
                        font-size: 14px;
                        font-weight: 800;
                        color: #dc2626;
                    }
                    .deal-rating {
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        font-size: 14px;
                        color: #4b5563;
                        margin-top: 6px;
                    }
                    .deal-stars {
                        color: #f59e0b;
                        display: inline-flex;
                        align-items: center;
                        gap: 2px;
                        font-size: 14px;
                    }

                    /* Section headers for product blocks */
                    .section-header {
                        display: flex;
                        align-items: flex-start;
                        justify-content: space-between;
                        gap: 24px;
                        flex-wrap: wrap;
                        position: relative;
                    }
                    .section-header.centered {
                        flex-direction: column;
                        align-items: center;
                        text-align: center;
                        justify-content: center;
                    }
                    .section-header.highlight::after {
                        content: '';
                        position: absolute;
                        left: -60px;
                        top: -80px;
                        width: 240px;
                        height: 240px;
                        background: radial-gradient(circle, rgba(45, 139, 209, 0.28) 0%, rgba(45, 139, 209, 0) 65%);
                        filter: blur(18px);
                        z-index: 0;
                        pointer-events: none;
                    }
                    .section-chip {
                        display: inline-flex;
                        align-items: center;
                        gap: 10px;
                        padding: 10px 16px;
                        background: rgba(45, 139, 209, 0.12);
                        color: #1A4F97;
                        border: 1px solid rgba(45, 139, 209, 0.2);
                        border-radius: 999px;
                        font-size: 12px;
                        font-weight: 800;
                        letter-spacing: 1px;
                        text-transform: uppercase;
                        box-shadow: 0 10px 30px rgba(45, 139, 209, 0.12);
                        position: relative;
                        z-index: 1;
                    }
                    .pulse-dot {
                        width: 10px;
                        height: 10px;
                        border-radius: 50%;
                        background: linear-gradient(135deg, #2D8BD1, #37A6E5);
                        box-shadow: 0 0 0 0 rgba(45, 139, 209, 0.5);
                        animation: pulse 2.4s infinite;
                    }
                    @keyframes pulse {
                        0% { box-shadow: 0 0 0 0 rgba(45, 139, 209, 0.35); }
                        70% { box-shadow: 0 0 0 18px rgba(45, 139, 209, 0); }
                        100% { box-shadow: 0 0 0 0 rgba(45, 139, 209, 0); }
                    }
                    .section-title {
                        font-size: 40px;
                        font-weight: 900;
                        color: #0f172a;
                        margin: 14px 0 10px 0;
                        line-height: 1.15;
                        letter-spacing: -0.8px;
                    }
                    .section-title span {
                        background: linear-gradient(135deg, #2D8BD1 0%, #1A4F97 50%, #37A6E5 100%);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        background-clip: text;
                    }
                    .section-subtitle {
                        font-size: 15px;
                        color: #4b5563;
                        line-height: 1.7;
                        max-width: 620px;
                        margin: 0;
                        z-index: 1;
                    }
                    .section-actions {
                        display: flex;
                        align-items: center;
                        gap: 12px;
                        z-index: 1;
                    }
                    .primary-btn {
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                        padding: 14px 26px;
                        background: linear-gradient(135deg, #2D8BD1 0%, #1A4F97 100%);
                        color: #fff;
                        border-radius: 10px;
                        font-weight: 700;
                        font-size: 15px;
                        text-decoration: none;
                        border: 2px solid transparent;
                        box-shadow: 0 12px 28px rgba(45, 139, 209, 0.3);
                        transition: all 0.3s ease;
                        cursor: pointer;
                    }
                    .primary-btn:hover {
                        transform: translateY(-3px) scale(1.01);
                        box-shadow: 0 16px 36px rgba(26, 79, 151, 0.35);
                        background: linear-gradient(135deg, #1A4F97 0%, #2D8BD1 100%);
                    }
                    .primary-btn:active {
                        transform: translateY(-1px);
                    }
                    .ghost-btn {
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                        padding: 12px 20px;
                        background: #fff;
                        color: #1A4F97;
                        border-radius: 10px;
                        font-weight: 700;
                        font-size: 14px;
                        text-decoration: none;
                        border: 2px solid rgba(45, 139, 209, 0.22);
                        transition: all 0.25s ease;
                    }
                    .ghost-btn:hover {
                        background: rgba(45, 139, 209, 0.08);
                        color: #0f172a;
                        transform: translateY(-2px);
                    }

                    /* Fabritech Featured Product Card Styles */
                    .hydro-sync-card {
                        position: relative;
                        background: linear-gradient(145deg, #ffffff 0%, #f7f9fc 100%);
                        border-radius: 20px;
                        overflow: hidden;
                        box-shadow: 0 14px 40px rgba(16, 24, 40, 0.12);
                        transition: all 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
                        border: 1px solid rgba(45, 139, 209, 0.08);
                        max-width: 430px;
                        margin: 0 auto;
                        isolation: isolate;
                    }
                    .hydro-sync-card::before {
                        content: '';
                        position: absolute;
                        inset: 0;
                        border-radius: 20px;
                        padding: 1px;
                        background: linear-gradient(135deg, rgba(45, 139, 209, 0.4), rgba(255, 255, 255, 0));
                        -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                        -webkit-mask-composite: xor;
                        mask-composite: exclude;
                        opacity: 0.6;
                    }
                    .hydro-sync-card:hover {
                        box-shadow: 0 24px 60px rgba(16, 24, 40, 0.16);
                        transform: translateY(-10px) scale(1.01);
                        border-color: rgba(45, 139, 209, 0.25);
                    }
                    .hydro-image-wrapper {
                        position: relative;
                        width: 100%;
                        height: 340px;
                        background: radial-gradient(circle at 20% 20%, rgba(45, 139, 209, 0.12), transparent 40%), #f5f7fb;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        overflow: hidden;
                    }
                    .hydro-image-wrapper img {
                        width: 80%;
                        height: auto;
                        object-fit: contain;
                        transition: transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
                    }
                    .hydro-sync-card:hover .hydro-image-wrapper img {
                        transform: scale(1.12) rotate(2deg);
                    }
                    .hydro-body {
                        padding: 28px;
                        display: flex;
                        flex-direction: column;
                        gap: 12px;
                    }
                    .hydro-meta {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        gap: 10px;
                    }
                    .hydro-chip {
                        display: inline-flex;
                        align-items: center;
                        gap: 8px;
                        padding: 8px 12px;
                        border-radius: 999px;
                        background: rgba(45, 139, 209, 0.12);
                        color: #1A4F97;
                        font-weight: 700;
                        font-size: 12px;
                        letter-spacing: 0.5px;
                    }
                    .hydro-rating {
                        display: inline-flex;
                        align-items: center;
                        gap: 6px;
                        padding: 6px 10px;
                        background: #fff;
                        border: 1px solid #eef2f7;
                        border-radius: 10px;
                        font-weight: 700;
                        color: #0f172a;
                        box-shadow: 0 8px 18px rgba(15, 23, 42, 0.08);
                    }
                    .hydro-rating i {
                        color: #f59e0b;
                    }
                    .hydro-product-title {
                        font-size: 22px;
                        font-weight: 800;
                        color: #0f172a;
                        margin: 0;
                        letter-spacing: -0.3px;
                    }
                    .hydro-product-subtitle {
                        font-size: 13px;
                        color: #2D8BD1;
                        font-weight: 700;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                        margin: 0;
                    }
                    .hydro-description {
                        font-size: 14px;
                        color: #4b5563;
                        line-height: 1.7;
                        margin: 0;
                    }
                    .hydro-feature-list {
                        list-style: none;
                        padding: 0;
                        margin: 0;
                        display: grid;
                        grid-template-columns: repeat(2, minmax(0, 1fr));
                        gap: 8px 12px;
                    }
                    .hydro-feature-list li {
                        display: inline-flex;
                        align-items: center;
                        gap: 8px;
                        font-size: 13px;
                        color: #475467;
                    }
                    .hydro-feature-list li i {
                        color: #2D8BD1;
                        font-size: 12px;
                    }
                    .hydro-size-selector {
                        margin-bottom: 28px;
                    }
                    .hydro-size-label {
                        display: block;
                        font-size: 12px;
                        font-weight: 700;
                        color: #1a1a1a;
                        text-transform: uppercase;
                        letter-spacing: 0.8px;
                        margin-bottom: 12px;
                    }
                    .hydro-size-options {
                        display: flex;
                        gap: 10px;
                        flex-wrap: wrap;
                    }
                    .hydro-size-btn {
                        padding: 10px 16px;
                        border: 2px solid #ddd;
                        background: #fff;
                        color: #666;
                        border-radius: 24px;
                        font-size: 13px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        flex: 1 1 calc(50% - 5px);
                        text-align: center;
                        min-width: 70px;
                    }
                    .hydro-size-btn:hover {
                        border-color: #ff8c3c;
                        color: #ff8c3c;
                    }
                    .hydro-size-btn.active {
                        background: #ff8c3c;
                        color: #fff;
                        border-color: #ff8c3c;
                        animation: sizeButtonGlow 2s infinite;
                    }
                    .hydro-footer {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding-top: 18px;
                        border-top: 1px solid #eef2f7;
                        gap: 12px;
                    }
                    .hydro-price {
                        font-size: 28px;
                        font-weight: 800;
                        color: #1a1a1a;
                        letter-spacing: -0.5px;
                    }
                    .hydro-price-currency {
                        font-size: 14px;
                        font-weight: 700;
                        color: #2D8BD1;
                    }
                    .hydro-add-to-cart {
                        flex: 1;
                        padding: 15px 22px;
                        background: #1A4F97;
                        color: #fff;
                        border: 1px solid #1A4F97;
                        border-radius: 14px;
                        font-size: 15px;
                        font-weight: 800;
                        cursor: pointer;
                        transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                        gap: 12px;
                        box-shadow: 0 12px 26px rgba(26, 79, 151, 0.28);
                        letter-spacing: 0.4px;
                        position: relative;
                        overflow: hidden;
                        text-transform: uppercase;
                    }
                    .hydro-add-to-cart::before {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: -100%;
                        width: 100%;
                        height: 100%;
                        background: linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.22) 50%, rgba(255, 255, 255, 0) 100%);
                        transition: left 0.55s ease;
                    }
                    .hydro-add-to-cart::after {
                        content: '';
                        position: absolute;
                        inset: 2px;
                        border-radius: 12px;
                        border: 1px solid rgba(255, 255, 255, 0.18);
                        opacity: 0.8;
                        pointer-events: none;
                    }
                    .hydro-add-to-cart:hover::before {
                        left: 100%;
                    }
                    .hydro-add-to-cart:hover {
                        transform: translateY(-4px);
                        box-shadow: 0 16px 32px rgba(26, 79, 151, 0.4);
                        background: #18427f;
                        border-color: #18427f;
                    }
                    .hydro-add-to-cart:active {
                        transform: translateY(-1px);
                        box-shadow: 0 8px 16px rgba(26, 79, 151, 0.3);
                    }
                    .hydro-cart-icon {
                        font-size: 18px;
                        transition: transform 0.35s ease, color 0.35s ease;
                        color: #fff;
                    }
                    .hydro-add-to-cart:hover .hydro-cart-icon {
                        transform: scale(1.2) translateX(3px);
                    }
                `}</style>
                <div id="products" style={{ backgroundColor: '#f8f9fa', paddingTop: '130px', paddingBottom: '130px' }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto', paddingLeft: '15px', paddingRight: '15px' }}>
                        <div className="section-header highlight scroll-animate fade-up" style={{ marginBottom: '80px' }}>
                            <div style={{ flex: '1 1 auto', minWidth: '300px', zIndex: 1 }}>
                                <div className="section-chip">
                                    <span className="pulse-dot"></span>
                                    <span>Featured Product</span>
                                </div>
                                <h2 className="section-title">Discover the <span>Fabritech Pro Line</span></h2>
                                <p className="section-subtitle">Fabritech's curated suite of Starlink internet gear, pro-grade surveillance, and resilient power solutions—ready to keep your homes, businesses, and remote sites online, secure, and powered.</p>
                            </div>
                            <div className="section-actions" style={{ flex: '0 0 auto' }}>
                                <a href='/shop' className="primary-btn">All Products</a>
                                <a href='#contact' className="ghost-btn">Talk to an expert</a>
                            </div>
                        </div>

                        {/* Deal-style grid */}
                        {productsLoading ? (
                            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                                <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '48px', color: '#2D8BD1', marginBottom: '20px' }}></i>
                                <p style={{ fontSize: '16px', color: '#6b7280', fontWeight: 600 }}>Loading products...</p>
                            </div>
                        ) : productsError ? (
                            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                                <i className="fa-solid fa-exclamation-triangle" style={{ fontSize: '48px', color: '#ef4444', marginBottom: '20px' }}></i>
                                <p style={{ fontSize: '16px', color: '#6b7280', fontWeight: 600, marginBottom: '12px' }}>{productsError}</p>
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
                        ) : dealProducts.length > 0 ? (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '28px', marginBottom: '80px' }}>
                                {dealProducts.map((product, index) => {
                                    const delayClass = `scroll-animate-delay-${Math.min(index + 1, 6)}`
                                    const ratingNum = parseFloat(product.rating) || 0
                                    const fullStars = Math.floor(ratingNum)
                                    const hasHalfStar = ratingNum % 1 >= 0.5
                                    return (
                                    <div key={product.id} className={`deal-card ${delayClass}`} onClick={() => openProduct(product)} style={{ cursor: 'pointer' }}>
                                        <div className="deal-image">
                                            <img 
                                                src={product.image} 
                                                alt={product.title}
                                                onError={(e) => {
                                                    e.target.src = '/placeholder-image.png'
                                                }}
                                            />
                                            <span className="deal-badge">{product.badge}</span>
                                            <button className="deal-cart-btn" aria-label="Add to cart" onClick={(e) => { e.stopPropagation(); addToCart(product); }}>
                                                <i className="fa-solid fa-cart-shopping" style={{ color: '#111827', fontSize: '18px' }}></i>
                                            </button>
                                        </div>
                                        <div className="deal-body">
                                            <h4 className="deal-title">{product.title}</h4>
                                            <div className="deal-pricing">
                                                <span className="deal-price-new">{product.priceNew}</span>
                                                {product.priceOld && (
                                                    <span className="deal-price-old">{product.priceOld}</span>
                                                )}
                                                {product.discount && (
                                                    <span className="deal-discount">{product.discount}</span>
                                                )}
                                            </div>
                                            <div className="deal-rating">
                                                <span className="deal-stars">
                                                    {[...Array(5)].map((_, i) => (
                                                        <i 
                                                            key={i} 
                                                            className={`fa-solid fa-star${i < fullStars ? '' : i === fullStars && hasHalfStar ? '-half-stroke' : ''}`}
                                                            style={{ color: i < fullStars || (i === fullStars && hasHalfStar) ? '#f59e0b' : '#d1d5db' }}
                                                        ></i>
                                                    ))}
                                                </span>
                                                <span>{product.rating}</span>
                                                <span style={{ color: '#9ca3af' }}>|</span>
                                                <span>{product.sold} sold</span>
                                            </div>
                                        </div>
                                    </div>
                                    )
                                })}
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                                <i className="fa-solid fa-inbox" style={{ fontSize: '48px', color: '#d1d5db', marginBottom: '20px' }}></i>
                                <p style={{ fontSize: '16px', color: '#6b7280', fontWeight: 600 }}>No products available at the moment</p>
                            </div>
                        )}

                    </div>
                </div>
                {/* <!-- product-area-end --> */}

                <style>{`
                    @keyframes slideInLeft {
                        from {
                            opacity: 0;
                            transform: translateX(-50px);
                        }
                        to {
                            opacity: 1;
                            transform: translateX(0);
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
                    @keyframes float {
                        0%, 100% {
                            transform: translateY(0px);
                        }
                        50% {
                            transform: translateY(-10px);
                        }
                    }
                    @keyframes pulse {
                        0%, 100% {
                            box-shadow: 0 2px 10px rgba(45, 139, 209, 0);
                        }
                        50% {
                            box-shadow: 0 2px 20px rgba(45, 139, 209, 0.3);
                        }
                    }
                    .contact-left-animated {
                        animation: slideInLeft 0.8s ease-out forwards;
                    }
                    .contact-form-animated {
                        animation: slideInRight 0.8s ease-out 0.2s forwards;
                        opacity: 0;
                    }
                    .contact-info-animated {
                        animation: fadeInUp 0.6s ease-out forwards;
                        opacity: 0;
                    }
                    .contact-info-animated:nth-child(1) { animation-delay: 0.3s; }
                    .contact-info-animated:nth-child(2) { animation-delay: 0.5s; }
                    .contact-info-animated:nth-child(3) { animation-delay: 0.7s; }
                    .contact-info-item:hover {
                        animation: pulse 1.5s ease-in-out infinite;
                        transform: translateY(-5px);
                        transition: transform 0.3s ease;
                    }
                    .form-input-animated {
                        position: relative;
                        overflow: hidden;
                    }
                    .form-input-animated::after {
                        content: '';
                        position: absolute;
                        bottom: 0;
                        left: -100%;
                        width: 100%;
                        height: 2px;
                        background: linear-gradient(90deg, transparent, #2D8BD1, transparent);
                        transition: left 0.5s ease;
                    }
                    .form-input-animated:focus-within::after {
                        left: 100%;
                    }
                    .btn-submit-animated {
                        position: relative;
                        overflow: hidden;
                    }
                    .btn-submit-animated::before {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: -100%;
                        width: 100%;
                        height: 100%;
                        background: rgba(255, 255, 255, 0.2);
                        transition: left 0.5s ease;
                    }
                    .btn-submit-animated:hover::before {
                        left: 100%;
                    }
                    .btn-submit-animated:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 8px 20px rgba(74, 144, 226, 0.4) !important;
                    }
                    .contact-link-hover {
                        display: inline-block;
                        transition: transform 0.3s ease;
                    }
                    .contact-link-hover:hover {
                        transform: translateX(5px);
                    }
                `}</style>
                <div id="contact" className="tv-contact-us-area pt-130 pb-130" style={{ backgroundColor: '#f8f9fa' }}>
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-12 mb-50 mb-md-0">
                                <div className="contact-us-left-content scroll-animate fade-left" style={{ paddingRight: '40px' }}>
                                    <div className="tv-section-title-box mb-40">
                                        <h2 className="contact-section-title pb-20" style={{ fontSize: '36px', fontWeight: '700', marginBottom: '20px', color: '#1a1a1a' }}>Get In Touch With Us</h2>
                                        <p className="contact-description" style={{ fontSize: '16px', color: '#666', lineHeight: '1.8', marginBottom: '30px' }}>We'd love to hear from you. Whether you have a question about our services or want to discuss your technology needs, our team is ready to help.</p>
                                    </div>

                                    <div className="contact-info-items">
                                        <div className="contact-info-item scroll-animate fade-up scroll-animate-delay-1 mb-30 d-flex" style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', transition: 'all 0.3s ease' }}>
                                            <div className="contact-info-icon mr-20" style={{ minWidth: '50px', textAlign: 'center' }}>
                                                <i className="fa-solid fa-phone" style={{ fontSize: '24px', color: '#4a90e2', transition: 'all 0.3s ease' }}></i>
                                            </div>
                                            <div className="contact-info-text">
                                                <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#1a1a1a' }}>Phone Number</h4>
                                                <a href="tel:+250788601280" className="contact-link-hover" style={{ color: '#4a90e2', textDecoration: 'none', fontSize: '15px' }}>+250 788 601 280</a>
                                            </div>
                                        </div>

                                        <div className="contact-info-item scroll-animate fade-up scroll-animate-delay-2 mb-30 d-flex" style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', transition: 'all 0.3s ease' }}>
                                            <div className="contact-info-icon mr-20" style={{ minWidth: '50px', textAlign: 'center' }}>
                                                <i className="fa-solid fa-envelope" style={{ fontSize: '24px', color: '#4a90e2', transition: 'all 0.3s ease' }}></i>
                                            </div>
                                            <div className="contact-info-text">
                                                <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#1a1a1a' }}>Email Address</h4>
                                                <a href="mailto:info@fabritech.rw" className="contact-link-hover" style={{ color: '#4a90e2', textDecoration: 'none', fontSize: '15px' }}>info@fabritech.rw</a>
                                            </div>
                                        </div>

                                        <div className="contact-info-item scroll-animate fade-up scroll-animate-delay-3 d-flex" style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', transition: 'all 0.3s ease' }}>
                                            <div className="contact-info-icon mr-20" style={{ minWidth: '50px', textAlign: 'center' }}>
                                                <i className="fa-solid fa-map-marker-alt" style={{ fontSize: '24px', color: '#4a90e2', transition: 'all 0.3s ease' }}></i>
                                            </div>
                                            <div className="contact-info-text">
                                                <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#1a1a1a' }}>Office Location</h4>
                                                <a href="https://www.google.com/maps/@37.4801311,22.8928877,3z" target="_blank" className="contact-link-hover" style={{ color: '#4a90e2', textDecoration: 'none', fontSize: '15px' }}>Yussa Plaza Remera, Kisimenti, Rwanda</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-12 p-relative">
                                <div className="contact-us-form-wrapper scroll-animate fade-right" style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.08)', transition: 'all 0.3s ease' }}>
                                    <h3 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '10px', color: '#1a1a1a' }}>Send us a Message</h3>
                                    <p style={{ fontSize: '15px', color: '#666', marginBottom: '30px', lineHeight: '1.6' }}>Fill out the form below and we'll get back to you as soon as possible.</p>

                                    <form action="#">
                                        <div className="form-row mb-20">
                                            <div className="form-group form-input-animated">
                                                <input type="text" placeholder="Your Full Name *" required style={{ width: '100%', padding: '12px 15px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', fontFamily: 'inherit', transition: 'all 0.3s ease' }} onFocus={(e) => { e.target.style.borderColor = '#4a90e2'; e.target.style.boxShadow = '0 0 0 3px rgba(74, 144, 226, 0.1)'; }} onBlur={(e) => { e.target.style.borderColor = '#ddd'; e.target.style.boxShadow = 'none'; }} />
                                            </div>
                                        </div>

                                        <div className="form-row mb-20" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                            <div className="form-group form-input-animated half-width">
                                                <input type="email" placeholder="Your Email *" required style={{ width: '100%', padding: '12px 15px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', fontFamily: 'inherit', transition: 'all 0.3s ease' }} onFocus={(e) => { e.target.style.borderColor = '#4a90e2'; e.target.style.boxShadow = '0 0 0 3px rgba(74, 144, 226, 0.1)'; }} onBlur={(e) => { e.target.style.borderColor = '#ddd'; e.target.style.boxShadow = 'none'; }} />
                                            </div>
                                            <div className="form-group form-input-animated half-width">
                                                <input type="tel" placeholder="Your Phone Number" style={{ width: '100%', padding: '12px 15px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', fontFamily: 'inherit', transition: 'all 0.3s ease' }} onFocus={(e) => { e.target.style.borderColor = '#4a90e2'; e.target.style.boxShadow = '0 0 0 3px rgba(74, 144, 226, 0.1)'; }} onBlur={(e) => { e.target.style.borderColor = '#ddd'; e.target.style.boxShadow = 'none'; }} />
                                            </div>
                                        </div>

                                        <div className="form-row mb-20">
                                            <div className="form-group form-input-animated">
                                                <input type="text" placeholder="Subject *" required style={{ width: '100%', padding: '12px 15px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', fontFamily: 'inherit', transition: 'all 0.3s ease' }} onFocus={(e) => { e.target.style.borderColor = '#4a90e2'; e.target.style.boxShadow = '0 0 0 3px rgba(74, 144, 226, 0.1)'; }} onBlur={(e) => { e.target.style.borderColor = '#ddd'; e.target.style.boxShadow = 'none'; }} />
                                            </div>
                                        </div>

                                        <div className="form-row mb-20">
                                            <div className="form-group form-input-animated">
                                                <select required defaultValue="" style={{ width: '100%', padding: '12px 15px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', fontFamily: 'inherit', backgroundColor: '#fff', color: '#666', transition: 'all 0.3s ease', cursor: 'pointer' }} onFocus={(e) => { e.target.style.borderColor = '#4a90e2'; e.target.style.boxShadow = '0 0 0 3px rgba(74, 144, 226, 0.1)'; }} onBlur={(e) => { e.target.style.borderColor = '#ddd'; e.target.style.boxShadow = 'none'; }}>
                                                    <option value="">Select Service Interest *</option>
                                                    <option value="starlink">Starlink & Networking</option>
                                                    <option value="security">Digital Security</option>
                                                    <option value="web">Web Development</option>
                                                    <option value="software">Software Development</option>
                                                    <option value="entertainment">Canal+ & DStv Services</option>
                                                    <option value="training">Internships & Short Courses</option>
                                                    <option value="other">Other</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="form-row mb-20">
                                            <div className="form-group form-input-animated">
                                                <textarea placeholder="Your Message *" rows="5" required style={{ width: '100%', padding: '12px 15px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', fontFamily: 'inherit', resize: 'vertical', transition: 'all 0.3s ease' }} onFocus={(e) => { e.target.style.borderColor = '#4a90e2'; e.target.style.boxShadow = '0 0 0 3px rgba(74, 144, 226, 0.1)'; }} onBlur={(e) => { e.target.style.borderColor = '#ddd'; e.target.style.boxShadow = 'none'; }}></textarea>
                                            </div>
                                        </div>

                                        <div className="form-checkbox mb-20" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#666', transition: 'all 0.3s ease' }}>
                                            <input type="checkbox" id="agree" required style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#4a90e2', transition: 'all 0.3s ease' }} />
                                            <label htmlFor="agree" style={{ cursor: 'pointer', margin: '0' }}>I agree to the privacy policy and terms & conditions</label>
                                        </div>

                                        <div className="form-submit">
                                            <button type="submit" className="tv-btn-primary p-relative btn-submit-animated" style={{ width: '100%', padding: '14px 30px', backgroundColor: '#4a90e2', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.3s ease' }}>
                                                <span className="btn-wrap">
                                                    <span className="btn-text1">Send Message</span>
                                                    <span className="btn-text2">Send Message</span>
                                                </span>
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <!-- Contact-Us-area-end --> */}
            </main>

            {selectedProduct && (
                <div className="product-modal-overlay" onClick={closeProduct}>
                    <div className="product-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="product-modal-image">
                            <img src={selectedProduct.image} alt={selectedProduct.title} />
                        </div>
                        <div className="product-modal-body">
                            <span className="product-modal-chip">{selectedProduct.badge}</span>
                            <h3 className="product-modal-title">{selectedProduct.title}</h3>
                            <p className="product-modal-desc">{selectedProduct.description}</p>
                            <div className="product-modal-meta">
                                <span className="new">{selectedProduct.priceNew}</span>
                                {selectedProduct.priceOld && (
                                    <span className="old">{selectedProduct.priceOld}</span>
                                )}
                                {selectedProduct.discount && (
                                    <span className="discount">{selectedProduct.discount}</span>
                                )}
                            </div>
                            <div className="product-modal-rating">
                                <span className="product-modal-stars">
                                    {(() => {
                                        const ratingNum = parseFloat(selectedProduct.rating) || 0
                                        const fullStars = Math.floor(ratingNum)
                                        const hasHalfStar = ratingNum % 1 >= 0.5
                                        return [...Array(5)].map((_, i) => (
                                            <i 
                                                key={i} 
                                                className={`fa-solid fa-star${i < fullStars ? '' : i === fullStars && hasHalfStar ? '-half-stroke' : ''}`}
                                                style={{ color: i < fullStars || (i === fullStars && hasHalfStar) ? '#f59e0b' : '#d1d5db' }}
                                            ></i>
                                        ))
                                    })()}
                                </span>
                                <span>{selectedProduct.rating}</span>
                                <span style={{ color: '#9ca3af' }}>|</span>
                                <span>{selectedProduct.sold} sold</span>
                            </div>
                            <div className="product-modal-actions">
                                <button className="hydro-add-to-cart" style={{ flex: '0 0 auto' }} onClick={() => addToCart(selectedProduct)}>
                                    <i className="fa-solid fa-shopping-cart hydro-cart-icon"></i>
                                    Add to Cart
                                </button>
                                <button className="product-modal-close" onClick={closeProduct}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showCart && (
                <div className="product-modal-overlay" onClick={toggleCart}>
                    <div className="cart-panel" onClick={(e) => e.stopPropagation()}>
                        <div className="cart-panel-header">
                            <h4 className="cart-panel-title">Cart ({cartItems.length})</h4>
                            <button className="product-modal-close" onClick={toggleCart}>Close</button>
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
                                    <button className="cart-remove" onClick={() => removeFromCart(index)} title="Remove">✕</button>
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

            {toast && (
                <div className="toast">
                    <i className="fa-solid fa-circle-check" style={{ color: '#22c55e' }}></i>
                    <span>{toast}</span>
                </div>
            )}

            <footer>

                {/* <!-- footer-area-start --> */}
                <div className="tv-footer-wrap footer-bg z-index-1" style={{ backgroundColor: '#fff', color: '#333', paddingTop: '80px', paddingBottom: '40px' }}>
                    <div className="container">
                        <div className="row mb-60">
                            <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6 mb-40">
                                <div className="footer-widget">
                                    <div className="footer-logo mb-20">
                                        <a href='/'><img src="assets/img/logo/F_logo.png" alt="Fabritech" style={{ height: '50px', width: 'auto' }} /></a>
                                    </div>
                                    <div className="footer-about">
                                        <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.8', marginBottom: '0' }}>At Fabritech, we are dedicated to providing top-notch IT solutions and services. From networking to surveillance, we ensure high standards in every project.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="col-xl-2 col-lg-2 col-md-6 col-sm-6 mb-40">
                                <div className="footer-widget">
                                    <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px', color: '#1a1a1a' }}>Explore</h4>
                                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                        <li style={{ marginBottom: '12px' }}>
                                            <a href='/' style={{ color: '#666', textDecoration: 'none', fontSize: '14px', transition: 'color 0.3s ease' }} onMouseEnter={(e) => e.target.style.color = '#4a90e2'} onMouseLeave={(e) => e.target.style.color = '#666'}>Home</a>
                                        </li>
                                        <li style={{ marginBottom: '12px' }}>
                                            <a href='/services' style={{ color: '#666', textDecoration: 'none', fontSize: '14px', transition: 'color 0.3s ease' }} onMouseEnter={(e) => e.target.style.color = '#4a90e2'} onMouseLeave={(e) => e.target.style.color = '#666'}>Services</a>
                                        </li>
                                        <li style={{ marginBottom: '12px' }}>
                                            <a href='/about' style={{ color: '#666', textDecoration: 'none', fontSize: '14px', transition: 'color 0.3s ease' }} onMouseEnter={(e) => e.target.style.color = '#4a90e2'} onMouseLeave={(e) => e.target.style.color = '#666'}>About Us</a>
                                        </li>
                                        <li style={{ marginBottom: '12px' }}>
                                            <a href='/contact' style={{ color: '#666', textDecoration: 'none', fontSize: '14px', transition: 'color 0.3s ease' }} onMouseEnter={(e) => e.target.style.color = '#4a90e2'} onMouseLeave={(e) => e.target.style.color = '#666'}>Contact Us</a>
                                        </li>
                                        <li>
                                            <a href='/gallery' style={{ color: '#666', textDecoration: 'none', fontSize: '14px', transition: 'color 0.3s ease' }} onMouseEnter={(e) => e.target.style.color = '#4a90e2'} onMouseLeave={(e) => e.target.style.color = '#666'}>Gallery</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div className="col-xl-4 col-lg-4 col-md-6 col-sm-6 mb-40">
                                <div className="footer-widget">
                                    <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px', color: '#1a1a1a' }}>Contact Info</h4>
                                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                        <li style={{ marginBottom: '15px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                                            <i className="fa-solid fa-map-marker-alt" style={{ color: '#4a90e2', marginTop: '2px', minWidth: '16px' }}></i>
                                            <span style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>YYUSSA Plaza, Kisimenti, Remera</span>
                                        </li>
                                        <li style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <i className="fa-solid fa-envelope" style={{ color: '#4a90e2', minWidth: '16px' }}></i>
                                            <a href="mailto:info@fabritech.rw" style={{ fontSize: '14px', color: '#666', textDecoration: 'none', transition: 'color 0.3s ease' }} onMouseEnter={(e) => e.target.style.color = '#4a90e2'} onMouseLeave={(e) => e.target.style.color = '#666'}>info@fabritech.rw</a>
                                        </li>
                                        <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <i className="fa-solid fa-phone" style={{ color: '#4a90e2', minWidth: '16px' }}></i>
                                            <a href="tel:+250788601280" style={{ fontSize: '14px', color: '#666', textDecoration: 'none', transition: 'color 0.3s ease' }} onMouseEnter={(e) => e.target.style.color = '#4a90e2'} onMouseLeave={(e) => e.target.style.color = '#666'}>+250788601280</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6 mb-40">
                                <div className="footer-widget">
                                    <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px', color: '#1a1a1a' }}>Follow Us</h4>
                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        <a href="#" style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f0f0', color: '#4a90e2', borderRadius: '50%', textDecoration: 'none', fontSize: '14px', transition: 'all 0.3s ease' }} onMouseEnter={(e) => {e.target.style.backgroundColor = '#4a90e2'; e.target.style.color = '#fff'}} onMouseLeave={(e) => {e.target.style.backgroundColor = '#f0f0f0'; e.target.style.color = '#4a90e2'}}>
                                            <i className="fa-brands fa-facebook-f"></i>
                                        </a>
                                        <a href="#" style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f0f0', color: '#4a90e2', borderRadius: '50%', textDecoration: 'none', fontSize: '14px', transition: 'all 0.3s ease' }} onMouseEnter={(e) => {e.target.style.backgroundColor = '#4a90e2'; e.target.style.color = '#fff'}} onMouseLeave={(e) => {e.target.style.backgroundColor = '#f0f0f0'; e.target.style.color = '#4a90e2'}}>
                                            <i className="fa-brands fa-twitter"></i>
                                        </a>
                                        <a href="#" style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f0f0', color: '#4a90e2', borderRadius: '50%', textDecoration: 'none', fontSize: '14px', transition: 'all 0.3s ease' }} onMouseEnter={(e) => {e.target.style.backgroundColor = '#4a90e2'; e.target.style.color = '#fff'}} onMouseLeave={(e) => {e.target.style.backgroundColor = '#f0f0f0'; e.target.style.color = '#4a90e2'}}>
                                            <i className="fa-brands fa-instagram"></i>
                                        </a>
                                        <a href="#" style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f0f0', color: '#4a90e2', borderRadius: '50%', textDecoration: 'none', fontSize: '14px', transition: 'all 0.3s ease' }} onMouseEnter={(e) => {e.target.style.backgroundColor = '#4a90e2'; e.target.style.color = '#fff'}} onMouseLeave={(e) => {e.target.style.backgroundColor = '#f0f0f0'; e.target.style.color = '#4a90e2'}}>
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
                                        <p style={{ fontSize: '14px', color: '#666', margin: '0' }}>Fabritech, All rights reserved 2025. Developed by <a href="#" style={{ color: '#4a90e2', textDecoration: 'none', fontWeight: '600' }}>Maliki NTWALI</a></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <!-- footer-area-end --> */}

            </footer>
        </div>
    )
}
export default Home;