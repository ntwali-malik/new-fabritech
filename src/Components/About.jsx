import React from 'react'
import { Link } from 'react-router-dom'
import useTemplateScripts from '../hooks/useTemplateScripts'
import CartIcon from './CartIcon'
import UserMenu from './UserMenu'
import { useCart } from '../Context/CartContext'

function About() {
    useTemplateScripts()
    const { cartItems } = useCart()
    const toggleCart = () => {} // Can be implemented if needed

    return (
        <div>
            {/* <!-- back-to-top-start  --> */}
            <button className="scroll-top scroll-to-target" data-target="html">
                <i className="fa-solid fa-angle-double-up"></i>
            </button>
            {/* <!-- back-to-top-end --> */}

            {/* <!-- search popup start --> */}
            <div className="search__popup">
                <div className="container">
                    <div className="row">
                        <div className="col-xxl-12">
                            <div className="search__wrapper">
                                <div className="search__top d-flex justify-content-between align-items-center">
                                    <div className="search__logo">
                                        <Link to='/'>
                                            <img src="assets/img/logo/F_logo.png" alt="Fabritech" style={{ height: '40px', width: 'auto' }} />
                                        </Link>
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
                        <Link to='/'>
                            <img src="assets/img/logo/F_logo.png" alt="Fabritech" style={{ height: '40px', width: 'auto' }} />
                        </Link>
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
                        <div className="tv-info-wrapper mb-20 d-flex align-items-center">
                            <div className="itoffcanvas__info-icon">
                                <a href="#"><i className="fa-solid fa-map-marker-alt"></i></a>
                            </div>
                            <div className="itoffcanvas__info-address">
                                <span>Location</span>
                                <a href="https://www.google.com/maps/@37.4801311,22.8928877,3z" target="_blank" rel="noopener noreferrer">Yussa Plaza Remera, Kisimenti</a>
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
                                                <a target="_blank" href="https://www.google.com/maps/@23.843848,90.3081992,17.5z?entry=ttu&amp;g_ep=EgoyMDI1MDEwMS4wIKXMDSoASAFQAw%3D%3D" rel="noopener noreferrer">KG 11 Kisimenti, YYussa Plaza</a>
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
                                        <Link to='/'><img src="assets/img/logo/F_logo.png" alt="Fabritech" style={{ height: '45px', width: 'auto' }} /></Link>
                                    </div>
                                </div>
                                <div className="col-xxl-7 col-xl-7 d-none d-xl-block">
                                    <div className="tv-header-menu tv-header-dropdown">
                                        <nav className="tv-menu-content">
                                            <ul>
                                                <li>
                                                    <Link to='/'>Home</Link>
                                                </li>
                                                <li>
                                                    <Link to='/about'>About Us</Link>
                                                </li>
                                                <li>
                                                    <Link to='/shop'>Shop</Link>
                                                </li>
                                                <li>
                                                    <Link to='/#contact'>Contact</Link>
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
                {/* <!-- about-area-start --> */}
                <div className="tv-about-area z-index-1 p-relative pt-130 pb-130 white-bg">
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
                                    <Link className='tv-btn-secondary' to='/#contact'>
                                        <span className="btn-wrap">
                                            <span className="btn-text1">Know More</span>
                                            <span className="btn-text2">Know More</span>
                                        </span>
                                    </Link>
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
            </main>

            <footer>
                {/* <!-- footer-area-start --> */}
                <div className="tv-footer-wrap footer-bg z-index-1" style={{ backgroundColor: '#fff', color: '#333', paddingTop: '80px', paddingBottom: '40px' }}>
                    <div className="container">
                        <div className="row mb-60">
                            <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6 mb-40">
                                <div className="footer-widget">
                                    <div className="footer-logo mb-20">
                                        <Link to='/'><img src="assets/img/logo/F_logo.png" alt="Fabritech" style={{ height: '50px', width: 'auto' }} /></Link>
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
                                            <Link to='/' style={{ color: '#666', textDecoration: 'none', fontSize: '14px', transition: 'color 0.3s ease' }} onMouseEnter={(e) => e.target.style.color = '#4a90e2'} onMouseLeave={(e) => e.target.style.color = '#666'}>Home</Link>
                                        </li>
                                        <li style={{ marginBottom: '12px' }}>
                                            <Link to='/services' style={{ color: '#666', textDecoration: 'none', fontSize: '14px', transition: 'color 0.3s ease' }} onMouseEnter={(e) => e.target.style.color = '#4a90e2'} onMouseLeave={(e) => e.target.style.color = '#666'}>Services</Link>
                                        </li>
                                        <li style={{ marginBottom: '12px' }}>
                                            <Link to='/about' style={{ color: '#666', textDecoration: 'none', fontSize: '14px', transition: 'color 0.3s ease' }} onMouseEnter={(e) => e.target.style.color = '#4a90e2'} onMouseLeave={(e) => e.target.style.color = '#666'}>About Us</Link>
                                        </li>
                                        <li style={{ marginBottom: '12px' }}>
                                            <Link to='/#contact' style={{ color: '#666', textDecoration: 'none', fontSize: '14px', transition: 'color 0.3s ease' }} onMouseEnter={(e) => e.target.style.color = '#4a90e2'} onMouseLeave={(e) => e.target.style.color = '#666'}>Contact Us</Link>
                                        </li>
                                        <li>
                                            <Link to='/gallery' style={{ color: '#666', textDecoration: 'none', fontSize: '14px', transition: 'color 0.3s ease' }} onMouseEnter={(e) => e.target.style.color = '#4a90e2'} onMouseLeave={(e) => e.target.style.color = '#666'}>Gallery</Link>
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
                                            <span style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>YUSSA Plaza, Kisimenti, Remera</span>
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

export default About

