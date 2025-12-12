import React, { useState, useEffect } from 'react'
import { useCart } from '../Context/CartContext'
import useTemplateScripts from '../hooks/useTemplateScripts'

const Cart = () => {
  useTemplateScripts()

  const { cartItems, removeFromCart, updateQuantity, clearCart, getTotalPrice } = useCart()
  const [showCheckout, setShowCheckout] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [toast, setToast] = useState(null)

  // Toast notification handler
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [toast])

  const formatPrice = (price) => {
    return new Intl.NumberFormat('rw-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(itemId)
      setToast('Item removed from cart')
    } else {
      updateQuantity(itemId, newQuantity)
      setToast('Quantity updated')
    }
  }

  const handleRemove = (itemId, itemName) => {
    removeFromCart(itemId)
    setToast(`${itemName} removed from cart`)
  }

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCart()
      setToast('Cart cleared')
    }
  }

  const subtotal = getTotalPrice()
  const tax = subtotal * 0.15
  const shipping = 0
  const total = subtotal + tax + shipping

  if (cartItems.length === 0 && !showCheckout) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%)' }}>
        <style>{`
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
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
          .empty-cart-container {
            animation: fadeInUp 0.6s ease-out;
          }
          .empty-cart-icon {
            animation: float 3s ease-in-out infinite;
          }
          .empty-cart-button {
            animation: pulse 2s ease-in-out infinite;
          }
        `}</style>

        {/* Header */}
        <header style={{
          background: 'linear-gradient(135deg, #2D8BD1 0%, #1A4F97 50%, #37A6E5 100%)',
          color: 'white',
          padding: '80px 20px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            width: '200%',
            height: '200%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
            animation: 'rotate 20s linear infinite'
          }}></div>
          <style>{`
            @keyframes rotate {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style>
          <h1 style={{ 
            fontSize: '48px', 
            fontWeight: '900', 
            margin: 0,
            textShadow: '0 4px 12px rgba(0,0,0,0.2)',
            position: 'relative',
            zIndex: 1
          }}>Shopping Cart</h1>
          <p style={{ 
            fontSize: '18px', 
            marginTop: '12px',
            opacity: 0.95,
            position: 'relative',
            zIndex: 1
          }}>Your shopping companion</p>
        </header>

        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '80px 20px' }}>
          <div className="empty-cart-container" style={{
            textAlign: 'center',
            padding: '80px 40px',
            background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
            borderRadius: '24px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
            border: '2px dashed rgba(45, 139, 209, 0.2)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div className="empty-cart-icon" style={{
              fontSize: '120px',
              marginBottom: '30px',
              filter: 'drop-shadow(0 8px 16px rgba(45, 139, 209, 0.2))'
            }}>🛒</div>
            <h2 style={{
              fontSize: '32px',
              fontWeight: '800',
              color: '#1a1a1a',
              marginBottom: '16px',
              background: 'linear-gradient(135deg, #2D8BD1 0%, #1A4F97 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>Your cart is empty</h2>
            <p style={{
              color: '#64748b',
              fontSize: '18px',
              marginBottom: '40px',
              lineHeight: '1.6'
            }}>
              Looks like you haven't added any products yet.<br />
              Start exploring our amazing catalog!
            </p>
            <a
              href="/shop"
              className="empty-cart-button"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                background: 'linear-gradient(135deg, #2D8BD1 0%, #1A4F97 100%)',
                color: 'white',
                padding: '16px 40px',
                borderRadius: '12px',
                textDecoration: 'none',
                fontWeight: '700',
                fontSize: '16px',
                boxShadow: '0 12px 32px rgba(45, 139, 209, 0.4)',
                transition: 'all 0.3s ease',
                border: '2px solid transparent'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-4px)'
                e.target.style.boxShadow = '0 16px 40px rgba(45, 139, 209, 0.5)'
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)'
                e.target.style.boxShadow = '0 12px 32px rgba(45, 139, 209, 0.4)'
              }}
            >
              <i className="fa-solid fa-arrow-left"></i>
              Continue Shopping
            </a>
          </div>
        </div>

        {/* Toast Notification */}
        {toast && (
          <div style={{
            position: 'fixed',
            top: '24px',
            right: '24px',
            background: '#0f172a',
            color: '#fff',
            padding: '16px 20px',
            borderRadius: '12px',
            boxShadow: '0 12px 32px rgba(0,0,0,0.3)',
            zIndex: 10000,
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            animation: 'slideInRight 0.3s ease-out'
          }}>
            <i className="fa-solid fa-circle-check" style={{ color: '#22c55e', fontSize: '20px' }}></i>
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
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%)' }}>
      <style>{`
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
        @keyframes scaleIn {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .cart-item-card {
          animation: fadeInUp 0.4s ease-out;
        }
        .cart-item-card:hover {
          transform: translateY(-4px);
        }
      `}</style>

      {/* Header */}
      <header style={{
        background: 'linear-gradient(135deg, #2D8BD1 0%, #1A4F97 50%, #37A6E5 100%)',
        color: 'white',
        padding: '60px 20px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(45, 139, 209, 0.3)'
      }}>
        <div style={{
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
          animation: 'rotate 20s linear infinite'
        }}></div>
        <h1 style={{ 
          fontSize: '42px', 
          fontWeight: '900', 
          margin: 0,
          textShadow: '0 4px 12px rgba(0,0,0,0.2)',
          position: 'relative',
          zIndex: 1
        }}>Shopping Cart</h1>
        <p style={{ 
          fontSize: '16px', 
          marginTop: '8px',
          opacity: 0.95,
          position: 'relative',
          zIndex: 1
        }}>{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart</p>
      </header>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        {/* Breadcrumb */}
        <div style={{
          fontSize: '14px',
          marginBottom: '30px',
          color: '#64748b',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <a href="/" style={{
            color: '#2D8BD1',
            textDecoration: 'none',
            fontWeight: 600,
            transition: 'color 0.3s ease'
          }}
          onMouseEnter={(e) => e.target.style.color = '#1A4F97'}
          onMouseLeave={(e) => e.target.style.color = '#2D8BD1'}>Home</a>
          <span>/</span>
          <a href="/shop" style={{
            color: '#2D8BD1',
            textDecoration: 'none',
            fontWeight: 600,
            transition: 'color 0.3s ease'
          }}
          onMouseEnter={(e) => e.target.style.color = '#1A4F97'}
          onMouseLeave={(e) => e.target.style.color = '#2D8BD1'}>Shop</a>
          <span>/</span>
          <span style={{ color: '#1a1a1a', fontWeight: 700 }}>Cart</span>
        </div>

        {/* Cart Items Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 400px',
          gap: '30px',
          marginBottom: '60px'
        }}>
          {/* Cart Items */}
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px'
            }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: '800',
                color: '#1a1a1a',
                margin: 0
              }}>
                Cart Items <span style={{ color: '#2D8BD1' }}>({cartItems.length})</span>
              </h2>
              {cartItems.length > 0 && (
                <button
                  onClick={handleClearCart}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#ef4444',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(239, 68, 68, 0.1)'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'none'
                  }}
                >
                  <i className="fa-solid fa-trash"></i>
                  Clear Cart
                </button>
              )}
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              {cartItems.map((item, index) => (
                <div
                  key={item.id}
                  className="cart-item-card"
                  style={{
                    background: 'linear-gradient(145deg, #ffffff 0%, #fafbfc 100%)',
                    padding: '24px',
                    borderRadius: '20px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                    border: '1px solid rgba(45, 139, 209, 0.1)',
                    display: 'grid',
                    gridTemplateColumns: '120px 1fr auto auto auto',
                    gap: '24px',
                    alignItems: 'center',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {/* Top accent bar */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: 'linear-gradient(90deg, #2D8BD1 0%, #1A4F97 100%)',
                    transform: 'scaleX(0)',
                    transformOrigin: 'left',
                    transition: 'transform 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'scaleX(1)'
                  }}
                  ></div>

                  {/* Image */}
                  <div style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    background: 'linear-gradient(135deg, #f6f8fb 0%, #e9ecef 100%)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    position: 'relative'
                  }}>
                    <img
                      src={item.image}
                      alt={item.name || item.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease'
                      }}
                      onError={(e) => {
                        e.target.src = '/placeholder-image.png'
                      }}
                    />
                  </div>

                  {/* Details */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}>
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: '800',
                      color: '#1a1a1a',
                      margin: 0,
                      lineHeight: '1.3'
                    }}>{item.name || item.title}</h3>
                    {item.category && (
                      <span style={{
                        fontSize: '12px',
                        color: '#2D8BD1',
                        background: 'rgba(45, 139, 209, 0.1)',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        width: 'fit-content'
                      }}>{item.category}</span>
                    )}
                    <div style={{
                      fontSize: '20px',
                      fontWeight: '900',
                      background: 'linear-gradient(135deg, #2D8BD1 0%, #1A4F97 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}>{formatPrice(item.price)}</div>
                  </div>

                  {/* Quantity Control */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    border: '2px solid rgba(45, 139, 209, 0.2)',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    background: '#fff',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                  }}>
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      style={{
                        background: 'none',
                        border: 'none',
                        width: '40px',
                        height: '40px',
                        cursor: 'pointer',
                        fontSize: '20px',
                        color: '#2D8BD1',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = 'rgba(45, 139, 209, 0.1)'
                        e.target.style.color = '#1A4F97'
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'none'
                        e.target.style.color = '#2D8BD1'
                      }}
                      title="Decrease quantity"
                    >
                      −
                    </button>
                    <span style={{
                      flex: 1,
                      textAlign: 'center',
                      fontSize: '16px',
                      fontWeight: '800',
                      color: '#1a1a1a',
                      minWidth: '50px',
                      padding: '0 8px'
                    }}>{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      style={{
                        background: 'none',
                        border: 'none',
                        width: '40px',
                        height: '40px',
                        cursor: 'pointer',
                        fontSize: '20px',
                        color: '#2D8BD1',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = 'rgba(45, 139, 209, 0.1)'
                        e.target.style.color = '#1A4F97'
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'none'
                        e.target.style.color = '#2D8BD1'
                      }}
                      title="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div style={{
                    fontSize: '20px',
                    fontWeight: '900',
                    color: '#1a1a1a',
                    minWidth: '120px',
                    textAlign: 'right'
                  }}>{formatPrice(item.price * item.quantity)}</div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemove(item.id, item.name || item.title)}
                    style={{
                      background: 'linear-gradient(135deg, #fee2e2 0%, #fecdd3 100%)',
                      border: 'none',
                      color: '#dc2626',
                      cursor: 'pointer',
                      fontSize: '18px',
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 2px 8px rgba(220, 38, 38, 0.2)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'linear-gradient(135deg, #fecdd3 0%, #fca5a5 100%)'
                      e.target.style.transform = 'scale(1.1) rotate(90deg)'
                      e.target.style.boxShadow = '0 4px 12px rgba(220, 38, 38, 0.3)'
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'linear-gradient(135deg, #fee2e2 0%, #fecdd3 100%)'
                      e.target.style.transform = 'scale(1) rotate(0deg)'
                      e.target.style.boxShadow = '0 2px 8px rgba(220, 38, 38, 0.2)'
                    }}
                    title="Remove from cart"
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div style={{
            background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
            borderRadius: '24px',
            padding: '32px',
            height: 'fit-content',
            position: 'sticky',
            top: '100px',
            boxShadow: '0 12px 40px rgba(0,0,0,0.1)',
            border: '1px solid rgba(45, 139, 209, 0.1)'
          }}>
            <div style={{
              fontSize: '24px',
              fontWeight: '900',
              color: '#1a1a1a',
              marginBottom: '24px',
              paddingBottom: '20px',
              borderBottom: '2px solid rgba(45, 139, 209, 0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <i className="fa-solid fa-receipt" style={{ color: '#2D8BD1' }}></i>
              Order Summary
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '12px 0',
                fontSize: '15px',
                color: '#64748b',
                fontWeight: 600
              }}>
                <span>Subtotal</span>
                <span style={{ color: '#1a1a1a', fontWeight: 700 }}>{formatPrice(subtotal)}</span>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '12px 0',
                fontSize: '15px',
                color: '#64748b',
                fontWeight: 600
              }}>
                <span>Shipping</span>
                <span style={{ color: '#22c55e', fontWeight: 700 }}>Free</span>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '12px 0',
                fontSize: '15px',
                color: '#64748b',
                fontWeight: 600
              }}>
                <span>Tax (15%)</span>
                <span style={{ color: '#1a1a1a', fontWeight: 700 }}>{formatPrice(tax)}</span>
              </div>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '20px 0',
              fontSize: '24px',
              fontWeight: '900',
              background: 'linear-gradient(135deg, #2D8BD1 0%, #1A4F97 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              borderTop: '2px solid rgba(45, 139, 209, 0.2)',
              marginTop: '8px'
            }}>
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>

            <button
              onClick={() => setShowCheckout(true)}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #2D8BD1 0%, #1A4F97 100%)',
                color: 'white',
                border: 'none',
                padding: '16px',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '800',
                cursor: 'pointer',
                marginTop: '24px',
                boxShadow: '0 8px 24px rgba(45, 139, 209, 0.4)',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)'
                e.target.style.boxShadow = '0 12px 32px rgba(45, 139, 209, 0.5)'
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)'
                e.target.style.boxShadow = '0 8px 24px rgba(45, 139, 209, 0.4)'
              }}
            >
              <i className="fa-solid fa-lock"></i>
              Proceed to Checkout
            </button>

            <a
              href="/shop"
              style={{
                width: '100%',
                background: 'white',
                color: '#2D8BD1',
                border: '2px solid #2D8BD1',
                padding: '14px',
                borderRadius: '12px',
                fontSize: '15px',
                fontWeight: '700',
                cursor: 'pointer',
                marginTop: '12px',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(45, 139, 209, 0.1)'
                e.target.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'white'
                e.target.style.transform = 'translateY(0)'
              }}
            >
              <i className="fa-solid fa-arrow-left"></i>
              Continue Shopping
            </a>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckout && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '20px',
            animation: 'fadeIn 0.3s ease-out'
          }}
          onClick={() => setShowCheckout(false)}
        >
          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes scaleIn {
              from {
                transform: scale(0.9);
                opacity: 0;
              }
              to {
                transform: scale(1);
                opacity: 1;
              }
            }
          `}</style>
          <div
            style={{
              background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
              borderRadius: '24px',
              padding: '40px',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 24px 60px rgba(0,0,0,0.3)',
              animation: 'scaleIn 0.3s ease-out',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowCheckout(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'rgba(0,0,0,0.05)',
                border: 'none',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                cursor: 'pointer',
                fontSize: '20px',
                color: '#64748b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(239, 68, 68, 0.1)'
                e.target.style.color = '#dc2626'
                e.target.style.transform = 'rotate(90deg)'
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(0,0,0,0.05)'
                e.target.style.color = '#64748b'
                e.target.style.transform = 'rotate(0deg)'
              }}
            >
              <i className="fa-solid fa-times"></i>
            </button>

            <h2 style={{
              fontSize: '32px',
              fontWeight: '900',
              color: '#1a1a1a',
              marginBottom: '12px',
              background: 'linear-gradient(135deg, #2D8BD1 0%, #1A4F97 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Checkout
            </h2>
            <p style={{
              color: '#64748b',
              marginBottom: '32px',
              fontSize: '16px'
            }}>
              Enter your details to complete the purchase
            </p>

            <form onSubmit={(e) => {
              e.preventDefault()
              setShowCheckout(false)
              setShowSuccess(true)
            }}>
              <div style={{ display: 'grid', gap: '20px', marginBottom: '24px' }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '700',
                    color: '#1a1a1a',
                    marginBottom: '8px'
                  }}>Full Name *</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    required
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      border: '2px solid rgba(45, 139, 209, 0.2)',
                      borderRadius: '12px',
                      fontSize: '15px',
                      boxSizing: 'border-box',
                      transition: 'all 0.3s ease',
                      fontFamily: 'inherit'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#2D8BD1'
                      e.target.style.boxShadow = '0 0 0 4px rgba(45, 139, 209, 0.1)'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(45, 139, 209, 0.2)'
                      e.target.style.boxShadow = 'none'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '700',
                      color: '#1a1a1a',
                      marginBottom: '8px'
                    }}>Email Address *</label>
                    <input
                      type="email"
                      placeholder="john@example.com"
                      required
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        border: '2px solid rgba(45, 139, 209, 0.2)',
                        borderRadius: '12px',
                        fontSize: '15px',
                        boxSizing: 'border-box',
                        transition: 'all 0.3s ease',
                        fontFamily: 'inherit'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#2D8BD1'
                        e.target.style.boxShadow = '0 0 0 4px rgba(45, 139, 209, 0.1)'
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'rgba(45, 139, 209, 0.2)'
                        e.target.style.boxShadow = 'none'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '700',
                      color: '#1a1a1a',
                      marginBottom: '8px'
                    }}>Phone Number *</label>
                    <input
                      type="tel"
                      placeholder="+250 700 000 000"
                      required
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        border: '2px solid rgba(45, 139, 209, 0.2)',
                        borderRadius: '12px',
                        fontSize: '15px',
                        boxSizing: 'border-box',
                        transition: 'all 0.3s ease',
                        fontFamily: 'inherit'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#2D8BD1'
                        e.target.style.boxShadow = '0 0 0 4px rgba(45, 139, 209, 0.1)'
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'rgba(45, 139, 209, 0.2)'
                        e.target.style.boxShadow = 'none'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '700',
                    color: '#1a1a1a',
                    marginBottom: '8px'
                  }}>Delivery Address *</label>
                  <input
                    type="text"
                    placeholder="123 Main Street, Kigali"
                    required
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      border: '2px solid rgba(45, 139, 209, 0.2)',
                      borderRadius: '12px',
                      fontSize: '15px',
                      boxSizing: 'border-box',
                      transition: 'all 0.3s ease',
                      fontFamily: 'inherit'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#2D8BD1'
                      e.target.style.boxShadow = '0 0 0 4px rgba(45, 139, 209, 0.1)'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(45, 139, 209, 0.2)'
                      e.target.style.boxShadow = 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '700',
                    color: '#1a1a1a',
                    marginBottom: '8px'
                  }}>Payment Method *</label>
                  <select
                    required
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      border: '2px solid rgba(45, 139, 209, 0.2)',
                      borderRadius: '12px',
                      fontSize: '15px',
                      boxSizing: 'border-box',
                      transition: 'all 0.3s ease',
                      fontFamily: 'inherit',
                      background: 'white',
                      cursor: 'pointer'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#2D8BD1'
                      e.target.style.boxShadow = '0 0 0 4px rgba(45, 139, 209, 0.1)'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(45, 139, 209, 0.2)'
                      e.target.style.boxShadow = 'none'
                    }}
                  >
                    <option value="">Select payment method</option>
                    <option>Credit Card</option>
                    <option>Debit Card</option>
                    <option>Mobile Money</option>
                    <option>Bank Transfer</option>
                  </select>
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '700',
                    color: '#1a1a1a',
                    marginBottom: '8px'
                  }}>Special Notes</label>
                  <textarea
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      border: '2px solid rgba(45, 139, 209, 0.2)',
                      borderRadius: '12px',
                      fontSize: '15px',
                      boxSizing: 'border-box',
                      transition: 'all 0.3s ease',
                      fontFamily: 'inherit',
                      minHeight: '100px',
                      resize: 'vertical'
                    }}
                    placeholder="Any special instructions..."
                    onFocus={(e) => {
                      e.target.style.borderColor = '#2D8BD1'
                      e.target.style.boxShadow = '0 0 0 4px rgba(45, 139, 209, 0.1)'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(45, 139, 209, 0.2)'
                      e.target.style.boxShadow = 'none'
                    }}
                  />
                </div>
              </div>

              <div style={{
                background: 'rgba(45, 139, 209, 0.05)',
                padding: '20px',
                borderRadius: '12px',
                marginBottom: '24px',
                border: '1px solid rgba(45, 139, 209, 0.1)'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '20px',
                  fontWeight: '900',
                  color: '#1a1a1a'
                }}>
                  <span>Total Amount:</span>
                  <span style={{
                    background: 'linear-gradient(135deg, #2D8BD1 0%, #1A4F97 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>{formatPrice(total)}</span>
                </div>
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #2D8BD1 0%, #1A4F97 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '16px',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  boxShadow: '0 8px 24px rgba(45, 139, 209, 0.4)',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)'
                  e.target.style.boxShadow = '0 12px 32px rgba(45, 139, 209, 0.5)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)'
                  e.target.style.boxShadow = '0 8px 24px rgba(45, 139, 209, 0.4)'
                }}
              >
                <i className="fa-solid fa-check"></i>
                Complete Purchase
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccess && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10002,
            padding: '20px',
            animation: 'fadeIn 0.3s ease-out'
          }}
          onClick={() => {
            setShowSuccess(false)
            clearCart()
            setToast('Order placed successfully!')
          }}
        >
          <div
            style={{
              background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
              borderRadius: '24px',
              padding: '50px 40px',
              maxWidth: '550px',
              width: '100%',
              boxShadow: '0 24px 60px rgba(0,0,0,0.3)',
              animation: 'scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
              position: 'relative',
              textAlign: 'center'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Success Icon */}
            <div style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 30px',
              boxShadow: '0 12px 32px rgba(34, 197, 94, 0.3)',
              animation: 'scaleIn 0.5s ease-out 0.2s both'
            }}>
              <i className="fa-solid fa-check" style={{ color: 'white', fontSize: '48px' }}></i>
            </div>

            <h2 style={{
              fontSize: '32px',
              fontWeight: '900',
              color: '#1a1a1a',
              marginBottom: '16px',
              background: 'linear-gradient(135deg, #2D8BD1 0%, #1A4F97 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Order Confirmed!
            </h2>

            <p style={{
              color: '#64748b',
              fontSize: '18px',
              lineHeight: '1.6',
              marginBottom: '12px',
              fontWeight: 600
            }}>
              Thank you for your order!
            </p>

            <div style={{
              background: 'rgba(45, 139, 209, 0.08)',
              padding: '24px',
              borderRadius: '16px',
              marginBottom: '32px',
              border: '2px solid rgba(45, 139, 209, 0.2)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                marginBottom: '16px'
              }}>
                <i className="fa-solid fa-truck" style={{ color: '#2D8BD1', fontSize: '24px' }}></i>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '800',
                  color: '#1a1a1a',
                  margin: 0
                }}>Delivery Information</h3>
              </div>
              <p style={{
                color: '#475467',
                fontSize: '16px',
                lineHeight: '1.7',
                margin: 0
              }}>
                We have received your order and will arrange delivery to your provided address. 
                Our team will contact you shortly via phone or email to confirm the delivery details 
                and schedule.
              </p>
              <p style={{
                color: '#64748b',
                fontSize: '14px',
                marginTop: '16px',
                marginBottom: 0,
                fontStyle: 'italic'
              }}>
                <strong>Note:</strong> Payment gateway integration is coming soon. 
                For now, payment will be arranged upon delivery.
              </p>
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <button
                onClick={() => {
                  setShowSuccess(false)
                  clearCart()
                  setToast('Order placed successfully!')
                }}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #2D8BD1 0%, #1A4F97 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '16px',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  boxShadow: '0 8px 24px rgba(45, 139, 209, 0.4)',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)'
                  e.target.style.boxShadow = '0 12px 32px rgba(45, 139, 209, 0.5)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)'
                  e.target.style.boxShadow = '0 8px 24px rgba(45, 139, 209, 0.4)'
                }}
              >
                <i className="fa-solid fa-home"></i>
                Back to Home
              </button>

              <a
                href="/shop"
                style={{
                  width: '100%',
                  background: 'white',
                  color: '#2D8BD1',
                  border: '2px solid #2D8BD1',
                  padding: '14px',
                  borderRadius: '12px',
                  fontSize: '15px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(45, 139, 209, 0.1)'
                  e.target.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'white'
                  e.target.style.transform = 'translateY(0)'
                }}
              >
                <i className="fa-solid fa-shopping-bag"></i>
                Continue Shopping
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          background: '#0f172a',
          color: '#fff',
          padding: '16px 20px',
          borderRadius: '12px',
          boxShadow: '0 12px 32px rgba(0,0,0,0.3)',
          zIndex: 10001,
          fontWeight: 700,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '12px',
          animation: 'slideInRight 0.3s ease-out'
        }}>
          <i className="fa-solid fa-circle-check" style={{ color: '#22c55e', fontSize: '20px' }}></i>
          <span>{toast}</span>
        </div>
      )}
    </div>
  )
}

export default Cart
