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
    const [selectedService, setSelectedService] = useState(null)
    const [toast, setToast] = useState(null)
    const [showCart, setShowCart] = useState(false)
    const [dealProducts, setDealProducts] = useState([])
    const [productsLoading, setProductsLoading] = useState(true)
    const [productsError, setProductsError] = useState('')
    const [showWhatsApp, setShowWhatsApp] = useState(false)

    // Services data
    const servicesData = [
        {
            id: 'network-infrastructure',
            title: 'Network Infrastructure',
            shortDescription: 'Lightning-Fast Networks That Keep Your Business Running 24/7.',
            image: 'assets/img/service/networking.jpeg',
            fullDescription: 'Say goodbye to slow internet and network headaches! We transform your workspace into a connectivity powerhouse. Our mission? Simple: ensure your place has blazing-fast internet and every network resource works flawlessly. No more "the internet is down" moments. No more buffering. No more excuses. Just smooth, reliable, lightning-fast connections that power your business forward. We don\'t just set it up and leave—we stick around to make sure everything stays perfect.',
            features: [
                'Network health check & turbo boost - We diagnose and optimize everything for peak performance',
                'Blazing-fast internet installation - Get speeds that actually match what you\'re paying for',
                'Smart network resource management - Every device, every connection, working in perfect harmony',
                '24/7 network guardians - We watch your network so you can focus on your business',
                'Flexible wireless & wired options - Mix and match solutions that fit your space perfectly',
                'Fortress-level security - Your data stays locked down while your team stays connected',
                'Networks that grow with you - Start small, scale big, zero headaches',
                'Instant problem-solving team - Issues? We fix them fast, usually before you even notice'
            ],
            benefits: [
                '⚡ Internet so fast, your team will notice the difference on day one',
                '🎯 Zero downtime - We prevent problems before they can ruin your day',
                '📈 Productivity boost - When networks work perfectly, your team works faster',
                '🔒 Enterprise-grade security that doesn\'t slow you down',
                '💰 Save money - Optimized networks use resources efficiently',
                '😌 Stress-free networking - Sleep well knowing everything is monitored',
                '🚀 Future-ready tech - Networks designed for tomorrow\'s needs, today',
                '✅ One less thing to worry about - Your network becomes your secret weapon'
            ]
        },
        {
            id: 'digital-security',
            title: 'Digital Security',
            shortDescription: 'Comprehensive Digital Security Solutions.',
            image: 'assets/img/service/security.jpeg',
            fullDescription: 'Protect your business with comprehensive digital security solutions. We offer complete security systems including CCTV surveillance, access control, time & attendance, metal detection, intrusion detection, IT security, and fire safety equipment.',
            features: [
                'End-to-end security solutions',
                'Professional installation and configuration',
                '24/7 monitoring and support',
                'Integration of multiple security systems',
                'Custom security solutions tailored to your needs'
            ],
            benefits: [
                'Complete protection for your business',
                'Reduced security risks and threats',
                'Enhanced safety for employees and assets',
                'Compliance with security standards',
                'Peace of mind with comprehensive coverage'
            ],
            categories: [
                {
                    title: 'CCTV Surveillance Systems',
                    icon: 'video',
                    items: [
                        'IP Cameras',
                        'Analog Cameras',
                        'WiFi Camera',
                        'PTZ Camera',
                        'Dome Cameras',
                        'Bullet Cameras',
                        'Turret Cameras',
                        'Thermal Cameras'
                    ]
                },
                {
                    title: 'Access Control Systems',
                    icon: 'lock',
                    items: [
                        'Biometric Scanners (Fingerprint, Facial Recognition)',
                        'RFID Card Readers',
                        'Digital Identity Management Tools',
                        'Keypad Access Systems',
                        'Smart Locks',
                        'Turnstiles & Speed Gates',
                        'Intercom Systems',
                        'Multi-Factor Authentication Devices'
                    ]
                },
                {
                    title: 'Time & Attendance Systems',
                    icon: 'clock',
                    items: [
                        'Biometric Attendance Devices',
                        'RFID-Based Attendance Solutions',
                        'Wi-Fi & Cloud-Based Attendance Systems',
                        'Mobile Attendance Apps',
                        'Turnstile/Access Gate Integration',
                        'Web-Based Time Tracking Software',
                        'Multi-Shift Scheduling Tools',
                        'Payroll Integration Systems'
                    ]
                },
                {
                    title: 'Metal Detection & Screening Equipment',
                    icon: 'shield-alt',
                    items: [
                        'Walk-Through Metal Detectors',
                        'Hand-Held Metal Detectors',
                        'Luggage & Baggage Scanners',
                        'Explosive Trace Detectors (ETDs)',
                        'Under Vehicle Inspection Systems (UVIS)',
                        'Parcel Scanners',
                        'Radiation Detection Systems'
                    ]
                },
                {
                    title: 'Intrusion Detection Systems',
                    icon: 'bell',
                    items: [
                        'Alarm Systems',
                        'Motion Sensors',
                        'Door & Window Sensors',
                        'Glass Break Detectors',
                        'Vibration Sensors',
                        'Perimeter Security Systems',
                        'Integrated Control Panels',
                        'Remote Monitoring Systems'
                    ]
                },
                {
                    title: 'IT Security Solutions',
                    icon: 'shield',
                    items: [
                        'Network Security (Firewalls, IDS, VPNs)',
                        'Endpoint Protection (Antivirus, Anti-Malware)',
                        'Data Protection & Backup (Encryption, Recovery Solutions)',
                        'Cloud Security (Compliance & Infrastructure Protection)',
                        'Security Monitoring & Analytics (Threat Detection, Dashboards)'
                    ]
                },
                {
                    title: 'Fire Safety Equipment',
                    icon: 'fire-extinguisher',
                    items: [
                        'Fire Extinguishers'
                    ]
                }
            ]
        },
        {
            id: 'starlink-installation',
            title: 'Starlink Installation',
            shortDescription: 'Game-Changing Internet Anywhere - No More Connectivity Struggles!',
            image: 'assets/img/service/starlink.jpeg',
            fullDescription: 'Starlink isn\'t just internet—it\'s a game-changer for anyone tired of daily connectivity headaches. Whether you\'re in the city or the middle of nowhere, Starlink solves your internet problems once and for all. Fast, reliable, and revolutionary. From equipment to connected devices, we\'ve got you covered. One complete solution, zero hassle.',
            features: [
                'Complete equipment supply - Starlink Standard, Starlink Mini, routers, adapters & cables',
                'Professional installation & setup - Expert mounting and configuration done right',
                'Equipment options - Standard kit, Mini kit, Ethernet adapters, routers & cables',
                'End-to-end service - From unboxing to fully connected devices, we handle everything',
                'Signal optimization - Maximum performance tuned for your location',
                'Quick activation - Get online fast with our streamlined process'
            ],
            benefits: [
                '🌐 Solves daily internet struggles - Say goodbye to connectivity problems forever',
                '⚡ High-speed internet anywhere - Even in places traditional providers can\'t reach',
                '📡 Complete equipment package - Everything you need from dish to device',
                '🚀 Quick setup & activation - Get connected faster than you\'d think possible',
                '✅ One-stop solution - We handle equipment, installation, and configuration',
                '💪 Reliability you can count on - Internet that works when you need it most'
            ]
        },
        {
            id: 'software-development',
            title: 'Software Development',
            shortDescription: 'We Turn Your Business Ideas Into Powerful Reality.',
            image: 'assets/img/service/software.jpeg',
            fullDescription: 'Got a business idea? We build your thoughts into reality. That vision in your head? We make it real. Custom software solutions that turn your business dreams into working applications. ERP systems, web apps, mobile apps—we bring your ideas to life with code that actually works. From concept to launch, your thoughts become powerful tools that drive your business forward.',
            features: [
                'Business idea to reality - We transform your vision into working software',
                'Custom ERP systems - Streamline operations with systems built for you',
                'Web applications - Powerful web solutions that work beautifully',
                'Mobile apps (iOS & Android) - Take your business mobile',
                'Database design - Solid foundations that scale with you',
                'API integration - Connect everything seamlessly',
                'Maintenance & updates - Keep your software evolving'
            ],
            benefits: [
                '💡 Your ideas become real software - No more "what if" moments',
                '⚡ Custom-built solutions - Software that fits your business perfectly',
                '🚀 Faster operations - Automate processes, boost productivity',
                '📱 Reach customers everywhere - Web and mobile solutions',
                '💪 Scalable technology - Software that grows with your business',
                '✅ Expert support - We build it, maintain it, improve it',
                '🎯 Ideas to impact - Turn thoughts into tools that drive results'
            ]
        },
        {
            id: 'canalplus-dstv',
            title: 'Canal+ & DStv Services',
            shortDescription: 'Professional Installation, Signal Support & Easy Subscription Renewal.',
            image: 'assets/img/service/payTv.jpeg',
            fullDescription: 'We install both Canal+ and DStv dishes like pros. But we don\'t stop there—when your signal isn\'t working well, we fix it fast. Plus, renew your subscription through us and skip the hassle. One place for everything: installation, signal support, and subscription renewal. Your entertainment, simplified.',
            features: [
                'Professional dish installation - We install both Canal+ and DStv dishes expertly',
                'Signal troubleshooting & support - Bad signal? We fix it quickly',
                'Subscription renewal service - Renew through us, save time and stress',
                'HD & 4K decoder setup - Get the best picture quality from day one',
                'Multi-room installations - TV in every room, all set up properly',
                'Signal optimization - Maximum signal strength, crystal clear picture',
                'Package management - Upgrade, downgrade, or switch packages easily'
            ],
            benefits: [
                '📡 Expert installation - Both Canal+ and DStv done right the first time',
                '🔧 Signal problems solved - We fix weak signals fast, no more frustration',
                '💳 Easy renewals - Skip the queues, renew your subscription with us',
                '📺 Crystal clear picture - Optimized signal means better viewing',
                '✅ One-stop service - Installation, support, and renewal all in one place',
                '⚡ Quick response - Signal issues? We come fast and fix faster',
                '🎯 Hassle-free entertainment - Let us handle everything, you just enjoy'
            ]
        },
        {
            id: 'internships-courses',
            title: 'Internships & Short Courses',
            shortDescription: 'Academic & Professional Internships - Real Hands-On Experience That Matters.',
            image: 'assets/img/service/internship.jpeg',
            fullDescription: 'Ready to level up? We provide both Academic and Professional internships with real hands-on experience. No boring theory—just actual work on real projects. Whether you\'re a student needing academic credit or a professional looking to upskill, our internships give you practical skills that employers actually want. Get your hands dirty, build your portfolio, and launch your career.',
            features: [
                'Academic internships - Perfect for students needing credit and experience',
                'Professional internships - Level up your career with practical skills',
                '100% hands-on experience - Learn by doing, not just listening',
                'Real-world projects - Work on actual projects that matter',
                'Industry mentors - Learn from professionals who\'ve been there',
                'Certificate of completion - Proof of your new skills',
                'Career support - Get guidance and placement assistance',
                'Flexible programs - Choose what fits your schedule'
            ],
            benefits: [
                '🎓 Academic credit + real experience - Get both in one program',
                '💼 Professional growth - Practical skills that boost your career',
                '✋ Hands-on learning - Actually do the work, not just read about it',
                '🚀 Real projects - Build a portfolio employers notice',
                '👥 Expert mentorship - Learn from the best in the industry',
                '📜 Recognized certificates - Proof of your practical skills',
                '💡 Career guidance - Get help landing your next opportunity',
                '⚡ Fast-track your career - Start working on day one'
            ]
        }
    ]

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
    const closeService = () => setSelectedService(null)

    // Prevent body scroll when modals are open
    useEffect(() => {
        if (selectedService || selectedProduct || showCart) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [selectedService, selectedProduct, showCart])

    // Show WhatsApp button when scrolling (same logic as back to top)
    useEffect(() => {
        const handleScroll = () => {
            const scroll = window.pageYOffset || document.documentElement.scrollTop
            if (scroll < 500) {
                setShowWhatsApp(false)
            } else {
                setShowWhatsApp(true)
            }
        }
        window.addEventListener('scroll', handleScroll)
        // Check initial scroll position
        handleScroll()
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

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
                                        <div className="tv-slider-bg" data-background="assets/img/slider/hero1.jpeg" style={{ backgroundImage: "url('assets/img/slider/hero1.jpeg')" }}></div>
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
                                        <div className="tv-slider-bg" data-background="assets/img/slider/sec.jpeg" style={{ backgroundImage: "url('assets/img/slider/slider-1-2.jpg')" }}></div>
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
                            {servicesData.map((service, index) => (
                                <div key={service.id} className="col-lg-4 col-xl-4 col-md-6 scroll-animate fade-up" style={{ animationDelay: `${(index + 1) * 0.1}s` }}>
                                    <div 
                                        className="single-project-item mb-30 service-card-clickable" 
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => setSelectedService(service)}
                                    >
                                        <img src={service.image} alt={service.title} />
                                        <span className="icon">
                                            <button 
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    setSelectedService(service)
                                                }}
                                                style={{ 
                                                    background: 'none', 
                                                    border: 'none', 
                                                    color: 'inherit',
                                                    cursor: 'pointer',
                                                    padding: 0
                                                }}
                                            >
                                                <i className="fa-solid fa-arrow-right"></i>
                                            </button>
                                        </span>
                                        <div className="single-project-content">
                                            <h3>{service.title}</h3>
                                            <p>{service.shortDescription}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
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

                    /* Service modal styles */
                    .service-modal-overlay {
                        position: fixed;
                        inset: 0;
                        background: rgba(0, 0, 0, 0.65);
                        backdrop-filter: blur(8px);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        z-index: 9999;
                        padding: 20px;
                        animation: fadeInOverlay 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    }
                    @keyframes fadeInOverlay {
                        from { 
                            opacity: 0;
                            backdrop-filter: blur(0px);
                        }
                        to { 
                            opacity: 1;
                            backdrop-filter: blur(8px);
                        }
                    }
                    .service-modal-decorative-bg {
                        position: absolute;
                        inset: 0;
                        background: 
                            radial-gradient(circle at 20% 30%, rgba(45, 139, 209, 0.1) 0%, transparent 50%),
                            radial-gradient(circle at 80% 70%, rgba(26, 79, 151, 0.1) 0%, transparent 50%);
                        animation: pulseBg 8s ease-in-out infinite;
                        pointer-events: none;
                    }
                    @keyframes pulseBg {
                        0%, 100% { opacity: 0.5; transform: scale(1); }
                        50% { opacity: 0.8; transform: scale(1.05); }
                    }
                    .service-modal {
                        width: min(1000px, 100%);
                        max-height: 90vh;
                        background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
                        border-radius: 24px;
                        overflow: hidden;
                        box-shadow: 
                            0 24px 60px rgba(0, 0, 0, 0.25),
                            0 0 0 1px rgba(255, 255, 255, 0.5) inset,
                            0 0 100px rgba(45, 139, 209, 0.1);
                        display: grid;
                        grid-template-columns: 1fr 1.2fr;
                        gap: 0;
                        animation: modalEnter 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
                        position: relative;
                        z-index: 1;
                    }
                    @keyframes modalEnter {
                        0% {
                            opacity: 0;
                            transform: translateY(50px) scale(0.9);
                        }
                        100% {
                            opacity: 1;
                            transform: translateY(0) scale(1);
                        }
                    }
                    @media (max-width: 900px) {
                        .service-modal {
                            grid-template-columns: 1fr;
                            max-height: 95vh;
                        }
                    }
                    .service-modal-image {
                        background: linear-gradient(135deg, #f6f8fb 0%, #e9ecef 100%);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        padding: 30px;
                        position: relative;
                        overflow: hidden;
                    }
                    .service-modal-image::before {
                        content: '';
                        position: absolute;
                        inset: 0;
                        background: linear-gradient(135deg, rgba(45, 139, 209, 0.05) 0%, rgba(26, 79, 151, 0.05) 100%);
                        z-index: 1;
                    }
                    .service-modal-image-overlay {
                        position: absolute;
                        inset: 0;
                        background: linear-gradient(180deg, transparent 0%, rgba(255, 255, 255, 0.1) 100%);
                        z-index: 2;
                        pointer-events: none;
                    }
                    .service-modal-decorative-circles {
                        position: absolute;
                        inset: 0;
                        z-index: 1;
                        pointer-events: none;
                    }
                    .decorative-circle {
                        position: absolute;
                        border-radius: 50%;
                        background: linear-gradient(135deg, rgba(45, 139, 209, 0.1), rgba(26, 79, 151, 0.1));
                        animation: float 6s ease-in-out infinite;
                    }
                    .circle-1 {
                        width: 150px;
                        height: 150px;
                        top: -50px;
                        right: -50px;
                        animation-delay: 0s;
                    }
                    .circle-2 {
                        width: 100px;
                        height: 100px;
                        bottom: 20px;
                        left: -30px;
                        animation-delay: 2s;
                    }
                    .circle-3 {
                        width: 80px;
                        height: 80px;
                        top: 50%;
                        right: 10%;
                        animation-delay: 4s;
                    }
                    @keyframes float {
                        0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.6; }
                        33% { transform: translate(20px, -20px) scale(1.1); opacity: 0.8; }
                        66% { transform: translate(-20px, 20px) scale(0.9); opacity: 0.7; }
                    }
                    .service-modal-image img {
                        width: 100%;
                        height: auto;
                        max-height: 100%;
                        object-fit: cover;
                        border-radius: 16px;
                        position: relative;
                        z-index: 2;
                        animation: imageZoom 0.8s ease-out;
                        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
                        transition: transform 0.5s ease;
                    }
                    .service-modal:hover .service-modal-image img {
                        transform: scale(1.02);
                    }
                    @keyframes imageZoom {
                        from {
                            opacity: 0;
                            transform: scale(0.95);
                        }
                        to {
                            opacity: 1;
                            transform: scale(1);
                        }
                    }
                    .service-modal-body {
                        padding: 35px;
                        display: flex;
                        flex-direction: column;
                        gap: 24px;
                        overflow-y: auto;
                        max-height: 90vh;
                        position: relative;
                        background: linear-gradient(to bottom, #ffffff, #fafbfc);
                        animation: bodySlideIn 0.6s ease-out 0.2s both;
                    }
                    .service-modal-body::-webkit-scrollbar {
                        width: 8px;
                    }
                    .service-modal-body::-webkit-scrollbar-track {
                        background: rgba(0, 0, 0, 0.05);
                        border-radius: 10px;
                    }
                    .service-modal-body::-webkit-scrollbar-thumb {
                        background: linear-gradient(135deg, #2D8BD1, #1A4F97);
                        border-radius: 10px;
                        transition: background 0.3s ease;
                    }
                    .service-modal-body::-webkit-scrollbar-thumb:hover {
                        background: linear-gradient(135deg, #3580d2, #1f5ca8);
                    }
                    @keyframes bodySlideIn {
                        from {
                            opacity: 0;
                            transform: translateX(20px);
                        }
                        to {
                            opacity: 1;
                            transform: translateX(0);
                        }
                    }
                    @media (max-width: 900px) {
                        .service-modal-body {
                            max-height: 60vh;
                            padding: 25px;
                        }
                    }
                    .service-modal-chip {
                        align-self: flex-start;
                        padding: 10px 18px;
                        border-radius: 999px;
                        background: linear-gradient(135deg, #2D8BD1 0%, #1A4F97 100%);
                        color: #fff;
                        font-weight: 800;
                        font-size: 12px;
                        letter-spacing: 0.5px;
                        text-transform: uppercase;
                        display: inline-flex;
                        align-items: center;
                        animation: chipBounce 0.6s ease-out 0.3s both;
                        box-shadow: 0 4px 12px rgba(45, 139, 209, 0.3);
                        position: relative;
                        overflow: hidden;
                    }
                    .service-modal-chip::before {
                        content: '';
                        position: absolute;
                        top: -50%;
                        left: -50%;
                        width: 200%;
                        height: 200%;
                        background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.3), transparent);
                        transform: rotate(45deg);
                        animation: shine 3s infinite;
                    }
                    @keyframes chipBounce {
                        0% {
                            opacity: 0;
                            transform: scale(0.5) translateY(-20px);
                        }
                        60% {
                            transform: scale(1.05) translateY(0);
                        }
                        100% {
                            opacity: 1;
                            transform: scale(1) translateY(0);
                        }
                    }
                    @keyframes shine {
                        0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
                        100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
                    }
                    @keyframes sparkle {
                        0%, 100% { transform: scale(1) rotate(0deg); opacity: 1; }
                        50% { transform: scale(1.2) rotate(180deg); opacity: 0.8; }
                    }
                    .service-modal-title {
                        font-size: 32px;
                        font-weight: 900;
                        color: #0f172a;
                        margin: 0;
                        line-height: 1.3;
                        position: relative;
                        animation: titleFadeIn 0.6s ease-out 0.4s both;
                        display: flex;
                        align-items: center;
                        gap: 12px;
                    }
                    .title-decoration {
                        width: 4px;
                        height: 32px;
                        background: linear-gradient(180deg, #2D8BD1, #1A4F97);
                        border-radius: 2px;
                        animation: decorationGrow 0.6s ease-out 0.5s both;
                    }
                    @keyframes decorationGrow {
                        from {
                            height: 0;
                            opacity: 0;
                        }
                        to {
                            height: 32px;
                            opacity: 1;
                        }
                    }
                    @keyframes titleFadeIn {
                        from {
                            opacity: 0;
                            transform: translateY(10px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                    .service-modal-desc {
                        font-size: 16px;
                        color: #475467;
                        line-height: 1.8;
                        margin: 0;
                        animation: descFadeIn 0.6s ease-out 0.5s both;
                    }
                    @keyframes descFadeIn {
                        from {
                            opacity: 0;
                            transform: translateY(10px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                    .service-modal-section {
                        margin-top: 10px;
                        animation: sectionSlideIn 0.6s ease-out both;
                    }
                    .service-modal-section:nth-child(1) {
                        animation-delay: 0.6s;
                    }
                    .service-modal-section:nth-child(2) {
                        animation-delay: 0.7s;
                    }
                    @keyframes sectionSlideIn {
                        from {
                            opacity: 0;
                            transform: translateX(-20px);
                        }
                        to {
                            opacity: 1;
                            transform: translateX(0);
                        }
                    }
                    .service-modal-section-title {
                        font-size: 18px;
                        font-weight: 700;
                        color: #1a1a1a;
                        margin: 0 0 16px 0;
                        display: flex;
                        align-items: center;
                        gap: 10px;
                    }
                    .section-icon-wrapper {
                        width: 36px;
                        height: 36px;
                        border-radius: 10px;
                        background: linear-gradient(135deg, rgba(45, 139, 209, 0.1), rgba(26, 79, 151, 0.1));
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        transition: all 0.3s ease;
                        animation: iconPulse 2s ease-in-out infinite;
                    }
                    .section-icon-wrapper i {
                        color: #2D8BD1;
                        font-size: 16px;
                    }
                    @keyframes iconPulse {
                        0%, 100% { transform: scale(1); }
                        50% { transform: scale(1.1); }
                    }
                    .service-modal-features,
                    .service-modal-benefits {
                        list-style: none;
                        padding: 0;
                        margin: 0;
                        display: flex;
                        flex-direction: column;
                        gap: 12px;
                    }
                    .service-modal-features li,
                    .service-modal-benefits li {
                        font-size: 15px;
                        color: #475467;
                        line-height: 1.7;
                        display: flex;
                        align-items: flex-start;
                        gap: 12px;
                        padding: 12px;
                        border-radius: 10px;
                        background: rgba(255, 255, 255, 0.5);
                        border: 1px solid rgba(229, 231, 235, 0.5);
                        transition: all 0.3s ease;
                        animation: listItemSlideIn 0.5s ease-out both;
                        opacity: 0;
                    }
                    .service-modal-features li {
                        animation: listItemSlideIn 0.5s ease-out both;
                    }
                    .service-modal-benefits li {
                        animation: listItemSlideIn 0.5s ease-out both;
                    }
                    @keyframes listItemSlideIn {
                        from {
                            opacity: 0;
                            transform: translateX(-15px);
                        }
                        to {
                            opacity: 1;
                            transform: translateX(0);
                        }
                    }
                    .service-modal-features li:hover,
                    .service-modal-benefits li:hover {
                        background: rgba(45, 139, 209, 0.05);
                        border-color: rgba(45, 139, 209, 0.2);
                        transform: translateX(5px);
                        box-shadow: 0 2px 8px rgba(45, 139, 209, 0.1);
                    }
                    .feature-icon,
                    .benefit-icon {
                        width: 24px;
                        height: 24px;
                        border-radius: 6px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        flex-shrink: 0;
                        margin-top: 2px;
                        transition: all 0.3s ease;
                    }
                    .feature-icon {
                        background: linear-gradient(135deg, rgba(45, 139, 209, 0.1), rgba(45, 139, 209, 0.2));
                    }
                    .feature-icon i {
                        color: #2D8BD1;
                        font-size: 11px;
                        transition: all 0.3s ease;
                    }
                    .benefit-icon {
                        background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.2));
                    }
                    .benefit-icon i {
                        color: #10b981;
                        font-size: 12px;
                        transition: all 0.3s ease;
                    }
                    .service-modal-features li:hover .feature-icon,
                    .service-modal-benefits li:hover .benefit-icon {
                        transform: scale(1.1) rotate(5deg);
                    }
                    .service-modal-features li:hover .feature-icon i {
                        transform: translateX(2px);
                    }
                    .feature-text,
                    .benefit-text {
                        flex: 1;
                    }
                    
                    /* Service Categories Styles */
                    .service-modal-categories {
                        display: flex;
                        flex-direction: column;
                        gap: 24px;
                    }
                    .service-category-item {
                        animation: categorySlideIn 0.6s ease-out both;
                        opacity: 0;
                    }
                    @keyframes categorySlideIn {
                        from {
                            opacity: 0;
                            transform: translateY(20px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                    .service-category-header {
                        display: flex;
                        align-items: center;
                        gap: 14px;
                        margin-bottom: 16px;
                        padding-bottom: 12px;
                        border-bottom: 2px solid rgba(45, 139, 209, 0.1);
                    }
                    .service-category-icon-wrapper {
                        width: 48px;
                        height: 48px;
                        border-radius: 12px;
                        background: linear-gradient(135deg, #2D8BD1 0%, #1A4F97 100%);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        box-shadow: 0 4px 12px rgba(45, 139, 209, 0.3);
                        animation: iconBounce 2s ease-in-out infinite;
                    }
                    @keyframes iconBounce {
                        0%, 100% { transform: translateY(0); }
                        50% { transform: translateY(-3px); }
                    }
                    .service-category-icon-wrapper i {
                        color: #fff;
                        font-size: 20px;
                    }
                    .service-category-title {
                        font-size: 20px;
                        font-weight: 700;
                        color: #1a1a1a;
                        margin: 0;
                        background: linear-gradient(135deg, #2D8BD1, #1A4F97);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        background-clip: text;
                    }
                    .service-category-items-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                        gap: 12px;
                    }
                    @media (max-width: 600px) {
                        .service-category-items-grid {
                            grid-template-columns: 1fr;
                        }
                    }
                    .service-category-item-card {
                        padding: 14px 16px;
                        background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(248, 250, 252, 0.9));
                        border: 1px solid rgba(229, 231, 235, 0.6);
                        border-radius: 10px;
                        display: flex;
                        align-items: center;
                        gap: 12px;
                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                        cursor: default;
                        animation: itemCardFadeIn 0.5s ease-out both;
                        opacity: 0;
                        position: relative;
                        overflow: hidden;
                    }
                    .service-category-item-card::before {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: -100%;
                        width: 100%;
                        height: 100%;
                        background: linear-gradient(90deg, transparent, rgba(45, 139, 209, 0.1), transparent);
                        transition: left 0.5s ease;
                    }
                    .service-category-item-card:hover::before {
                        left: 100%;
                    }
                    @keyframes itemCardFadeIn {
                        from {
                            opacity: 0;
                            transform: translateX(-10px) scale(0.95);
                        }
                        to {
                            opacity: 1;
                            transform: translateX(0) scale(1);
                        }
                    }
                    .service-category-item-card:hover {
                        transform: translateY(-3px) translateX(5px);
                        box-shadow: 0 6px 20px rgba(45, 139, 209, 0.15);
                        border-color: rgba(45, 139, 209, 0.3);
                        background: linear-gradient(135deg, rgba(255, 255, 255, 1), rgba(248, 250, 252, 1));
                    }
                    .category-item-icon {
                        width: 24px;
                        height: 24px;
                        min-width: 24px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        border-radius: 6px;
                        background: linear-gradient(135deg, rgba(45, 139, 209, 0.15), rgba(45, 139, 209, 0.25));
                        transition: all 0.3s ease;
                    }
                    .category-item-icon i {
                        color: #2D8BD1;
                        font-size: 11px;
                        transition: all 0.3s ease;
                    }
                    .service-category-item-card:hover .category-item-icon {
                        background: linear-gradient(135deg, #2D8BD1, #1A4F97);
                        transform: scale(1.1) rotate(5deg);
                    }
                    .service-category-item-card:hover .category-item-icon i {
                        color: #fff;
                    }
                    .category-item-text {
                        font-size: 14px;
                        color: #475467;
                        line-height: 1.5;
                        font-weight: 500;
                        transition: color 0.3s ease;
                    }
                    .service-category-item-card:hover .category-item-text {
                        color: #1a1a1a;
                        font-weight: 600;
                    }
                    
                    .service-modal-actions {
                        display: flex;
                        gap: 12px;
                        margin-top: 10px;
                        flex-wrap: wrap;
                        padding-top: 20px;
                        border-top: 2px solid rgba(229, 231, 235, 0.5);
                        animation: actionsFadeIn 0.6s ease-out 0.8s both;
                        position: relative;
                    }
                    @keyframes actionsFadeIn {
                        from {
                            opacity: 0;
                            transform: translateY(10px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                    .service-modal-contact-btn {
                        flex: 1;
                        min-width: 150px;
                        background: linear-gradient(135deg, #2D8BD1 0%, #1A4F97 100%);
                        color: #fff;
                        border: none;
                        border-radius: 12px;
                        padding: 16px 24px;
                        font-weight: 700;
                        font-size: 15px;
                        cursor: pointer;
                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 10px;
                        position: relative;
                        overflow: hidden;
                        box-shadow: 0 4px 12px rgba(45, 139, 209, 0.3);
                    }
                    .btn-shine {
                        position: absolute;
                        top: -50%;
                        left: -50%;
                        width: 200%;
                        height: 200%;
                        background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.3), transparent);
                        transform: translateX(-100%) translateY(-100%) rotate(45deg);
                        transition: transform 0.6s;
                    }
                    .service-modal-contact-btn:hover .btn-shine {
                        transform: translateX(100%) translateY(100%) rotate(45deg);
                    }
                    .service-modal-contact-btn:hover {
                        transform: translateY(-3px);
                        box-shadow: 0 8px 24px rgba(45, 139, 209, 0.4);
                        background: linear-gradient(135deg, #3580d2 0%, #1f5ca8 100%);
                    }
                    .service-modal-contact-btn:active {
                        transform: translateY(-1px);
                    }
                    .service-modal-contact-btn i {
                        transition: transform 0.3s ease;
                    }
                    .service-modal-contact-btn:hover i {
                        transform: translateY(-2px) rotate(-10deg);
                    }
                    .service-modal-register-btn {
                        flex: 1;
                        min-width: 150px;
                        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                        color: #fff;
                        border: none;
                        border-radius: 12px;
                        padding: 16px 24px;
                        font-weight: 700;
                        font-size: 15px;
                        cursor: pointer;
                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 10px;
                        position: relative;
                        overflow: hidden;
                        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
                    }
                    .service-modal-register-btn:hover .btn-shine {
                        transform: translateX(100%) translateY(100%) rotate(45deg);
                    }
                    .service-modal-register-btn:hover {
                        transform: translateY(-3px);
                        box-shadow: 0 8px 24px rgba(16, 185, 129, 0.4);
                        background: linear-gradient(135deg, #059669 0%, #047857 100%);
                    }
                    .service-modal-register-btn:active {
                        transform: translateY(-1px);
                    }
                    .service-modal-register-btn i {
                        transition: transform 0.3s ease;
                    }
                    .service-modal-register-btn:hover i {
                        transform: translateY(-2px) scale(1.1);
                    }
                    .service-modal-close {
                        background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
                        color: #111827;
                        border: 1px solid #e5e7eb;
                        border-radius: 12px;
                        padding: 16px 24px;
                        font-weight: 700;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        min-width: 100px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 8px;
                    }
                    .service-modal-close:hover {
                        background: linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%);
                        transform: translateY(-2px);
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    }
                    .service-modal-close i {
                        transition: transform 0.3s ease;
                    }
                    .service-modal-close:hover i {
                        transform: rotate(90deg);
                    }
                    
                    /* Comprehensive Responsive Styles for All Devices */
                    @media (max-width: 1200px) {
                        .service-modal {
                            width: min(900px, 95%);
                        }
                        .service-category-items-grid {
                            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
                        }
                    }
                    @media (max-width: 768px) {
                        .service-modal-overlay {
                            padding: 10px;
                        }
                        .service-modal {
                            width: 100%;
                            max-height: 98vh;
                            border-radius: 16px;
                        }
                        .service-modal-image {
                            padding: 20px;
                            min-height: 200px;
                        }
                        .service-modal-image img {
                            border-radius: 10px;
                        }
                        .decorative-circle {
                            display: none;
                        }
                        .service-modal-body {
                            padding: 20px;
                            gap: 18px;
                            max-height: calc(98vh - 200px);
                        }
                        .service-modal-chip {
                            padding: 8px 14px;
                            font-size: 11px;
                        }
                        .service-modal-title {
                            font-size: 24px;
                            gap: 8px;
                        }
                        .title-decoration {
                            width: 3px;
                            height: 24px;
                        }
                        .service-modal-desc {
                            font-size: 15px;
                            line-height: 1.6;
                        }
                        .service-modal-section-title {
                            font-size: 16px;
                            gap: 8px;
                        }
                        .section-icon-wrapper {
                            width: 32px;
                            height: 32px;
                        }
                        .section-icon-wrapper i {
                            font-size: 14px;
                        }
                        .service-modal-features li,
                        .service-modal-benefits li {
                            font-size: 14px;
                            padding: 10px;
                            gap: 10px;
                        }
                        .feature-icon,
                        .benefit-icon {
                            width: 22px;
                            height: 22px;
                            min-width: 22px;
                        }
                        .feature-icon i {
                            font-size: 10px;
                        }
                        .benefit-icon i {
                            font-size: 11px;
                        }
                        .service-category-header {
                            gap: 12px;
                            margin-bottom: 14px;
                            padding-bottom: 10px;
                        }
                        .service-category-icon-wrapper {
                            width: 40px;
                            height: 40px;
                        }
                        .service-category-icon-wrapper i {
                            font-size: 18px;
                        }
                        .service-category-title {
                            font-size: 18px;
                        }
                        .service-category-items-grid {
                            grid-template-columns: 1fr;
                            gap: 10px;
                        }
                        .service-category-item-card {
                            padding: 12px 14px;
                            gap: 10px;
                        }
                        .category-item-icon {
                            width: 22px;
                            height: 22px;
                            min-width: 22px;
                        }
                        .category-item-icon i {
                            font-size: 10px;
                        }
                        .category-item-text {
                            font-size: 13px;
                        }
                        .service-modal-actions {
                            flex-direction: column;
                            gap: 10px;
                            padding-top: 15px;
                        }
                        .service-modal-contact-btn,
                        .service-modal-register-btn,
                        .service-modal-close {
                            width: 100%;
                            min-width: auto;
                            padding: 14px 20px;
                            font-size: 14px;
                        }
                    }
                    @media (max-width: 480px) {
                        .service-modal-overlay {
                            padding: 5px;
                        }
                        .service-modal {
                            border-radius: 12px;
                            max-height: 99vh;
                        }
                        .service-modal-image {
                            padding: 15px;
                            min-height: 150px;
                        }
                        .service-modal-body {
                            padding: 15px;
                            gap: 15px;
                            max-height: calc(99vh - 150px);
                        }
                        .service-modal-chip {
                            padding: 6px 12px;
                            font-size: 10px;
                        }
                        .service-modal-title {
                            font-size: 20px;
                            flex-direction: column;
                            align-items: flex-start;
                            gap: 6px;
                        }
                        .title-decoration {
                            width: 100%;
                            height: 3px;
                            border-radius: 2px;
                        }
                        .service-modal-desc {
                            font-size: 14px;
                        }
                        .service-modal-section-title {
                            font-size: 15px;
                            flex-wrap: wrap;
                        }
                        .section-icon-wrapper {
                            width: 28px;
                            height: 28px;
                        }
                        .section-icon-wrapper i {
                            font-size: 12px;
                        }
                        .service-modal-features li,
                        .service-modal-benefits li {
                            font-size: 13px;
                            padding: 8px;
                            flex-wrap: wrap;
                        }
                        .service-category-header {
                            flex-wrap: wrap;
                        }
                        .service-category-icon-wrapper {
                            width: 36px;
                            height: 36px;
                        }
                        .service-category-icon-wrapper i {
                            font-size: 16px;
                        }
                        .service-category-title {
                            font-size: 16px;
                        }
                        .service-category-item-card {
                            padding: 10px 12px;
                        }
                        .category-item-text {
                            font-size: 12px;
                        }
                        .service-modal-actions {
                            gap: 8px;
                        }
                        .service-modal-contact-btn,
                        .service-modal-register-btn,
                        .service-modal-close {
                            padding: 12px 16px;
                            font-size: 13px;
                        }
                        .service-modal-contact-btn i,
                        .service-modal-register-btn i,
                        .service-modal-close i {
                            font-size: 14px;
                        }
                    }
                    @media (min-width: 769px) and (max-width: 1024px) {
                        .service-modal {
                            width: min(850px, 90%);
                        }
                        .service-category-items-grid {
                            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                        }
                    }
                    @media (orientation: landscape) and (max-height: 600px) {
                        .service-modal {
                            max-height: 95vh;
                        }
                        .service-modal-image {
                            min-height: 150px;
                            padding: 15px;
                        }
                        .service-modal-body {
                            max-height: calc(95vh - 150px);
                            padding: 20px;
                        }
                    }
                    
                    .service-card-clickable {
                        transition: transform 0.3s ease, box-shadow 0.3s ease;
                        position: relative;
                        overflow: hidden;
                    }
                    .service-card-clickable:hover {
                        transform: translateY(-5px);
                    }
                    .service-card-clickable .icon {
                        position: absolute;
                        top: 20px;
                        right: 20px;
                        width: 50px;
                        height: 50px;
                        background: rgba(255, 255, 255, 0.98);
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        z-index: 10;
                        opacity: 0.9;
                        transform: scale(1);
                        transition: all 0.3s ease;
                        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
                        backdrop-filter: blur(10px);
                    }
                    .service-card-clickable:hover .icon {
                        opacity: 1;
                        transform: scale(1.1);
                        box-shadow: 0 6px 20px rgba(45, 139, 209, 0.3);
                        background: #fff;
                    }
                    .service-card-clickable .icon button {
                        width: 100%;
                        height: 100%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: #2D8BD1 !important;
                        font-size: 18px;
                        transition: all 0.3s ease;
                        border: none;
                        background: transparent;
                        padding: 0;
                    }
                    .service-card-clickable .icon button:hover {
                        color: #1A4F97 !important;
                    }
                    .service-card-clickable .icon button i {
                        color: #2D8BD1 !important;
                        font-size: 18px;
                        transition: all 0.3s ease;
                        display: inline-block;
                    }
                    .service-card-clickable .icon button:hover i {
                        color: #1A4F97 !important;
                        transform: translateX(3px);
                    }
                    .service-card-clickable:hover .icon button i {
                        transform: translateX(2px);
                    }
                    
                    /* Service Cards Responsive Styles */
                    @media (max-width: 768px) {
                        .service-card-clickable .icon {
                            width: 45px;
                            height: 45px;
                            top: 15px;
                            right: 15px;
                        }
                        .service-card-clickable .icon button i {
                            font-size: 16px;
                        }
                        .single-project-content h3 {
                            font-size: 18px;
                        }
                        .single-project-content p {
                            font-size: 14px;
                        }
                    }
                    @media (max-width: 480px) {
                        .service-card-clickable .icon {
                            width: 40px;
                            height: 40px;
                            top: 10px;
                            right: 10px;
                        }
                        .service-card-clickable .icon button i {
                            font-size: 14px;
                        }
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
                                    <span>Shop Now</span>
                                </div>
                                <h2 className="section-title">Welcome to Our <span>Online Store</span></h2>
                                <p className="section-subtitle">Browse our premium collection of technology products. From Starlink internet solutions and professional surveillance systems to power solutions - find everything you need to keep your homes, businesses, and remote sites connected, secure, and powered. Shop with confidence and enjoy fast delivery!</p>
                            </div>
                            <div className="section-actions" style={{ flex: '0 0 auto' }}>
                                <a href='/shop' className="primary-btn">View All Products</a>
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

                {/* <!-- partner-area-start --> */}
                <style>{`
                    /* Partner Section Marquee */
                    .partner-section {
                        background: #ffffff;
                        padding: 80px 0;
                        overflow: hidden;
                        position: relative;
                    }
                    .partner-section::before,
                    .partner-section::after {
                        content: '';
                        position: absolute;
                        top: 0;
                        width: 100px;
                        height: 100%;
                        z-index: 2;
                        pointer-events: none;
                    }
                    .partner-section::before {
                        left: 0;
                        background: linear-gradient(to right, #ffffff, transparent);
                    }
                    .partner-section::after {
                        right: 0;
                        background: linear-gradient(to left, #ffffff, transparent);
                    }
                    .partner-section-title {
                        text-align: center;
                        margin-bottom: 50px;
                    }
                    .partner-section-title h3 {
                        font-size: 32px;
                        font-weight: 700;
                        color: #1a1a1a;
                        margin-bottom: 12px;
                    }
                    .partner-section-title p {
                        font-size: 16px;
                        color: #666;
                        margin: 0;
                    }
                    .partner-marquee-wrapper {
                        overflow: hidden;
                        width: 100%;
                        position: relative;
                    }
                    .partner-marquee {
                        display: flex;
                        width: fit-content;
                        animation: marqueeScroll 40s linear infinite;
                    }
                    .partner-marquee:hover {
                        animation-play-state: paused;
                    }
                    .partner-item {
                        flex-shrink: 0;
                        padding: 20px 50px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        height: 120px;
                    }
                    .partner-item img {
                        max-width: 150px;
                        max-height: 80px;
                        object-fit: contain;
                        filter: grayscale(0%);
                        opacity: 1;
                        transition: all 0.3s ease;
                    }
                    .partner-item:hover img {
                        filter: grayscale(0%);
                        opacity: 1;
                        transform: scale(1.1);
                    }
                    @keyframes marqueeScroll {
                        0% {
                            transform: translateX(0);
                        }
                        100% {
                            transform: translateX(-50%);
                        }
                    }
                    @media (max-width: 768px) {
                        .partner-section {
                            padding: 60px 0;
                        }
                        .partner-section-title h3 {
                            font-size: 24px;
                        }
                        .partner-item {
                            padding: 15px 30px;
                            height: 100px;
                        }
                        .partner-item img {
                            max-width: 120px;
                            max-height: 60px;
                        }
                        .partner-section::before,
                        .partner-section::after {
                            width: 50px;
                        }
                    }
                `}</style>
                <div className="partner-section">
                    <div className="container">
                        <div className="partner-section-title scroll-animate fade-up">
                            <h3>Our Trusted <span style={{ background: 'linear-gradient(135deg, #2D8BD1 0%, #1A4F97 50%, #37A6E5 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Partners</span></h3>
                            <p>Collaborating with industry leaders to deliver exceptional solutions</p>
                        </div>
                        <div className="partner-marquee-wrapper">
                            <div className="partner-marquee">
                                {/* Partner logos */}
                                <div className="partner-item">
                                    <img src="assets/img/partners/Huawei.png" alt="Huawei" />
                                </div>
                                <div className="partner-item">
                                    <img src="assets/img/partners/mtn.jpg" alt="MTN" />
                                </div>
                                <div className="partner-item">
                                    <img src="assets/img/partners/RwandAir-Logo.wine.png" alt="RwandAir" />
                                </div>
                                <div className="partner-item">
                                    <img src="assets/img/partners/Qatar.png" alt="Qatar Airways" />
                                </div>
                                <div className="partner-item">
                                    <img src="assets/img/partners/KICS.png" alt="KICS" />
                                </div>
                                <div className="partner-item">
                                    <img src="assets/img/partners/inkomoko.png" alt="Inkomoko" />
                                </div>
                                <div className="partner-item">
                                    <img src="assets/img/partners/BSC.png" alt="BSC" />
                                </div>
                                <div className="partner-item">
                                    <img src="assets/img/partners/rba.png" alt="RBA" />
                                </div>
                                <div className="partner-item">
                                    <img src="assets/img/partners/ncba.png" alt="NCBA" />
                                </div>
                                <div className="partner-item">
                                    <img src="assets/img/partners/tele10.png" alt="Tele10" />
                                </div>
                                <div className="partner-item">
                                    <img src="assets/img/partners/frontier.png" alt="Frontier" />
                                </div>
                                <div className="partner-item">
                                    <img src="assets/img/partners/ritco.png" alt="RITCO" />
                                </div>
                                {/* Duplicate for seamless loop */}
                                <div className="partner-item">
                                    <img src="assets/img/partners/Huawei.png" alt="Huawei" />
                                </div>
                                <div className="partner-item">
                                    <img src="assets/img/partners/mtn.jpg" alt="MTN" />
                                </div>
                                <div className="partner-item">
                                    <img src="assets/img/partners/RwandAir-Logo.wine.png" alt="RwandAir" />
                                </div>
                                <div className="partner-item">
                                    <img src="assets/img/partners/Qatar.png" alt="Qatar Airways" />
                                </div>
                                <div className="partner-item">
                                    <img src="assets/img/partners/KICS.png" alt="KICS" />
                                </div>
                                <div className="partner-item">
                                    <img src="assets/img/partners/inkomoko.png" alt="Inkomoko" />
                                </div>
                                <div className="partner-item">
                                    <img src="assets/img/partners/BSC.png" alt="BSC" />
                                </div>
                                <div className="partner-item">
                                    <img src="assets/img/partners/rba.png" alt="RBA" />
                                </div>
                                <div className="partner-item">
                                    <img src="assets/img/partners/ncba.png" alt="NCBA" />
                                </div>
                                <div className="partner-item">
                                    <img src="assets/img/partners/tele10.png" alt="Tele10" />
                                </div>
                                <div className="partner-item">
                                    <img src="assets/img/partners/frontier.png" alt="Frontier" />
                                </div>
                                <div className="partner-item">
                                    <img src="assets/img/partners/ritco.png" alt="RITCO" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <!-- partner-area-end --> */}

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

                    /* Back to Top Button Positioning - Stacked above WhatsApp */
                    .scroll-top {
                        position: fixed !important;
                        bottom: 110px !important;
                        right: 30px !important;
                        width: 50px !important;
                        height: 50px !important;
                        line-height: 50px !important;
                        font-size: 18px !important;
                        z-index: 999 !important;
                        border-radius: 50% !important;
                        color: #ffffff !important;
                        cursor: pointer !important;
                        background: linear-gradient(135deg, #2D8BD1 0%, #1A4F97 100%) !important;
                        border: none !important;
                        box-shadow: 0 4px 15px rgba(45, 139, 209, 0.4) !important;
                        transition: all 0.3s ease !important;
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    .scroll-top.open {
                        opacity: 1 !important;
                        transform: translateY(0) !important;
                    }
                    .scroll-top:hover {
                        transform: translateY(-3px) !important;
                        box-shadow: 0 6px 20px rgba(45, 139, 209, 0.6) !important;
                        background: linear-gradient(135deg, #3580d2 0%, #1A4F97 100%) !important;
                    }
                    .scroll-top i {
                        color: #ffffff !important;
                    }

                    /* WhatsApp Floating Button */
                    .whatsapp-float {
                        position: fixed;
                        bottom: 30px;
                        right: 30px;
                        width: 60px;
                        height: 60px;
                        background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        z-index: 1000;
                        box-shadow: 0 4px 20px rgba(37, 211, 102, 0.4);
                        transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                        text-decoration: none;
                        opacity: 0;
                        transform: translateY(100px) scale(0);
                        animation: whatsappFloat 3s ease-in-out infinite;
                    }
                    .whatsapp-float.show {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                        animation: whatsappFloat 3s ease-in-out infinite, whatsappPulse 2s ease-in-out infinite;
                    }
                    .whatsapp-float:hover {
                        animation: none !important;
                        transform: translateY(-5px) scale(1.1) !important;
                        box-shadow: 0 8px 35px rgba(37, 211, 102, 0.6);
                    }
                    .whatsapp-float i {
                        font-size: 32px;
                        color: #ffffff;
                        transition: transform 0.3s ease;
                    }
                    .whatsapp-float:hover i {
                        transform: scale(1.1);
                    }
                    @keyframes whatsappFloat {
                        0%, 100% {
                            transform: translateY(0px) scale(1);
                        }
                        50% {
                            transform: translateY(-15px) scale(1);
                        }
                    }
                    @keyframes whatsappPulse {
                        0%, 100% {
                            box-shadow: 0 4px 20px rgba(37, 211, 102, 0.4), 0 0 0 0 rgba(37, 211, 102, 0.7);
                        }
                        50% {
                            box-shadow: 0 4px 20px rgba(37, 211, 102, 0.4), 0 0 0 15px rgba(37, 211, 102, 0);
                        }
                    }
                    .whatsapp-tooltip {
                        position: absolute;
                        right: 75px;
                        top: 50%;
                        transform: translateY(-50%);
                        background: #1e293b;
                        color: #fff;
                        padding: 10px 16px;
                        border-radius: 8px;
                        font-size: 14px;
                        font-weight: 600;
                        white-space: nowrap;
                        opacity: 0;
                        pointer-events: none;
                        transition: all 0.3s ease;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    }
                    .whatsapp-tooltip::after {
                        content: '';
                        position: absolute;
                        left: 100%;
                        top: 50%;
                        transform: translateY(-50%);
                        border: 8px solid transparent;
                        border-left-color: #1e293b;
                    }
                    .whatsapp-float:hover .whatsapp-tooltip {
                        opacity: 1;
                        right: 70px;
                    }
                    @media (max-width: 768px) {
                        .scroll-top {
                            bottom: 90px !important;
                            right: 20px !important;
                            width: 48px !important;
                            height: 48px !important;
                            line-height: 48px !important;
                            font-size: 16px !important;
                        }
                        .whatsapp-float {
                            width: 56px;
                            height: 56px;
                            bottom: 20px;
                            right: 20px;
                        }
                        .whatsapp-float i {
                            font-size: 28px;
                        }
                        .whatsapp-tooltip {
                            display: none;
                        }
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

            {selectedService && (
                <div className="service-modal-overlay" onClick={closeService}>
                    <div className="service-modal-decorative-bg"></div>
                    <div className="service-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="service-modal-image">
                            <div className="service-modal-image-overlay"></div>
                            <div className="service-modal-decorative-circles">
                                <div className="decorative-circle circle-1"></div>
                                <div className="decorative-circle circle-2"></div>
                                <div className="decorative-circle circle-3"></div>
                            </div>
                            <img src={selectedService.image} alt={selectedService.title} />
                        </div>
                        <div className="service-modal-body">
                            <span className="service-modal-chip">
                                <i className="fa-solid fa-sparkles" style={{ marginRight: '6px', animation: 'sparkle 2s ease-in-out infinite' }}></i>
                                Our Service
                            </span>
                            <h3 className="service-modal-title">
                                <span className="title-decoration"></span>
                                {selectedService.title}
                            </h3>
                            <p className="service-modal-desc">{selectedService.fullDescription}</p>
                            
                            {selectedService.categories ? (
                                <div className="service-modal-categories">
                                    {selectedService.categories.map((category, categoryIndex) => (
                                        <div key={categoryIndex} className="service-category-item" style={{ animationDelay: `${categoryIndex * 0.1}s` }}>
                                            <div className="service-category-header">
                                                <div className="service-category-icon-wrapper">
                                                    <i className={`fa-solid fa-${category.icon}`}></i>
                                                </div>
                                                <h4 className="service-category-title">{category.title}</h4>
                                            </div>
                                            <div className="service-category-items-grid">
                                                {category.items.map((item, itemIndex) => (
                                                    <div key={itemIndex} className="service-category-item-card" style={{ animationDelay: `${(categoryIndex * 0.1) + (itemIndex * 0.05)}s` }}>
                                                        <span className="category-item-icon">
                                                            <i className="fa-solid fa-circle-check"></i>
                                                        </span>
                                                        <span className="category-item-text">{item}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <>
                                    <div className="service-modal-section">
                                        <h4 className="service-modal-section-title">
                                            <span className="section-icon-wrapper">
                                                <i className="fa-solid fa-check-circle"></i>
                                            </span>
                                            Key Features
                                        </h4>
                                        <ul className="service-modal-features">
                                            {selectedService.features.map((feature, index) => (
                                                <li key={index} style={{ animationDelay: `${index * 0.1}s` }}>
                                                    <span className="feature-icon">
                                                        <i className="fa-solid fa-arrow-right"></i>
                                                    </span>
                                                    <span className="feature-text">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="service-modal-section">
                                        <h4 className="service-modal-section-title">
                                            <span className="section-icon-wrapper">
                                                <i className="fa-solid fa-star"></i>
                                            </span>
                                            Benefits
                                        </h4>
                                        <ul className="service-modal-benefits">
                                            {selectedService.benefits.map((benefit, index) => (
                                                <li key={index} style={{ animationDelay: `${index * 0.1}s` }}>
                                                    <span className="benefit-icon">
                                                        <i className="fa-solid fa-check"></i>
                                                    </span>
                                                    <span className="benefit-text">{benefit}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </>
                            )}

                            <div className="service-modal-actions">
                                {selectedService.id === 'internships-courses' ? (
                                    <>
                                        <button 
                                            className="service-modal-register-btn" 
                                            onClick={() => {
                                                closeService()
                                                setTimeout(() => {
                                                    const contactElement = document.getElementById('contact')
                                                    if (contactElement) {
                                                        const headerOffset = 100
                                                        const elementPosition = contactElement.getBoundingClientRect().top
                                                        const offsetPosition = elementPosition + window.pageYOffset - headerOffset
                                                        window.scrollTo({
                                                            top: offsetPosition,
                                                            behavior: 'smooth'
                                                        })
                                                        // Optionally pre-fill the service dropdown if needed
                                                        setTimeout(() => {
                                                            const serviceSelect = document.querySelector('select[name="service"]')
                                                            if (serviceSelect) {
                                                                serviceSelect.value = 'training'
                                                                serviceSelect.dispatchEvent(new Event('change', { bubbles: true }))
                                                            }
                                                        }, 500)
                                                    }
                                                }, 100)
                                            }}
                                        >
                                            <span className="btn-shine"></span>
                                            <i className="fa-solid fa-user-plus"></i>
                                            <span>Register Now</span>
                                        </button>
                                        <button 
                                            className="service-modal-contact-btn" 
                                            onClick={() => {
                                                closeService()
                                                setTimeout(() => {
                                                    const contactElement = document.getElementById('contact')
                                                    if (contactElement) {
                                                        const headerOffset = 100
                                                        const elementPosition = contactElement.getBoundingClientRect().top
                                                        const offsetPosition = elementPosition + window.pageYOffset - headerOffset
                                                        window.scrollTo({
                                                            top: offsetPosition,
                                                            behavior: 'smooth'
                                                        })
                                                    }
                                                }, 100)
                                            }}
                                        >
                                            <span className="btn-shine"></span>
                                            <i className="fa-solid fa-envelope"></i>
                                            <span>Contact Us</span>
                                        </button>
                                    </>
                                ) : (
                                    <button 
                                        className="service-modal-contact-btn" 
                                        onClick={() => {
                                            closeService()
                                            setTimeout(() => {
                                                const contactElement = document.getElementById('contact')
                                                if (contactElement) {
                                                    const headerOffset = 100
                                                    const elementPosition = contactElement.getBoundingClientRect().top
                                                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset
                                                    window.scrollTo({
                                                        top: offsetPosition,
                                                        behavior: 'smooth'
                                                    })
                                                }
                                            }, 100)
                                        }}
                                    >
                                        <span className="btn-shine"></span>
                                        <i className="fa-solid fa-envelope"></i>
                                        <span>Contact Us</span>
                                    </button>
                                )}
                                <button className="service-modal-close" onClick={closeService}>
                                    <i className="fa-solid fa-times"></i>
                                    Close
                                </button>
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

            {/* WhatsApp Floating Button */}
            <a 
                href="https://wa.me/250788601280?text=Hello%20Fabritech!%20I%20would%20like%20to%20know%20more%20about%20your%20services." 
                target="_blank" 
                rel="noopener noreferrer" 
                className={`whatsapp-float ${showWhatsApp ? 'show' : ''}`}
                aria-label="Chat with us on WhatsApp"
            >
                <i className="fa-brands fa-whatsapp"></i>
                <span className="whatsapp-tooltip">Chat with us on WhatsApp</span>
            </a>
        </div>
    )
}
export default Home;