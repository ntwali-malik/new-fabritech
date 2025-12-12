import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useWishlist } from '../Context/WishlistContext'
import { useCart } from '../Context/CartContext'
import { useAuth } from '../Context/AuthContext'
import useTemplateScripts from '../hooks/useTemplateScripts'

function Wishlist() {
  useTemplateScripts()
  const navigate = useNavigate()
  const { wishlistItems, removeFromWishlist, loading } = useWishlist()
  const { addToCart } = useCart()
  const { isAuthenticated } = useAuth()

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
    }
  }, [isAuthenticated, navigate])

  if (!isAuthenticated) {
    return null
  }

  return (
    <div>
      <main>
        <section className="pt-130 pb-130" style={{ backgroundColor: '#f8f9fa', minHeight: '60vh' }}>
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div style={{ 
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                  padding: '40px',
                  borderRadius: '20px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                  marginBottom: '40px'
                }}>
                  <h1 style={{ 
                    fontSize: '32px', 
                    fontWeight: '800', 
                    marginBottom: '10px',
                    background: 'linear-gradient(135deg, #2D8BD1 0%, #1A4F97 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>
                    <i className="fa-solid fa-heart" style={{ color: '#dc2626', marginRight: '12px' }}></i>
                    My Wishlist
                  </h1>
                  <p style={{ color: '#64748b', fontSize: '16px' }}>
                    {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
                  </p>
                </div>

                {loading ? (
                  <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                    <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '48px', color: '#2D8BD1', marginBottom: '20px' }}></i>
                    <p style={{ fontSize: '16px', color: '#6b7280', fontWeight: 600 }}>Loading wishlist...</p>
                  </div>
                ) : wishlistItems.length === 0 ? (
                  <div style={{
                    textAlign: 'center',
                    padding: '100px 20px',
                    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                    borderRadius: '20px',
                    border: '2px dashed rgba(45, 139, 209, 0.2)'
                  }}>
                    <i className="fa-solid fa-heart" style={{ fontSize: '80px', color: '#cbd5e1', marginBottom: '24px' }}></i>
                    <h2 style={{ fontSize: '24px', color: '#64748b', fontWeight: 700, marginBottom: '12px' }}>
                      Your wishlist is empty
                    </h2>
                    <p style={{ color: '#94a3b8', marginBottom: '24px' }}>
                      Start adding products you love to your wishlist
                    </p>
                    <button
                      onClick={() => navigate('/shop')}
                      style={{
                        padding: '12px 24px',
                        background: 'linear-gradient(135deg, #2D8BD1 0%, #1A4F97 100%)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '16px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)'
                        e.target.style.boxShadow = '0 6px 16px rgba(45, 139, 209, 0.4)'
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)'
                        e.target.style.boxShadow = 'none'
                      }}
                    >
                      Browse Products
                    </button>
                  </div>
                ) : (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '28px'
                  }}>
                    {wishlistItems.map((item) => (
                      <div
                        key={item.id}
                        style={{
                          background: 'linear-gradient(145deg, #ffffff 0%, #fafbfc 100%)',
                          borderRadius: '20px',
                          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.1)',
                          overflow: 'hidden',
                          border: '1px solid rgba(45, 139, 209, 0.1)',
                          transition: 'all 0.4s ease',
                          cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)'
                          e.currentTarget.style.boxShadow = '0 20px 48px rgba(45, 139, 209, 0.2)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0) scale(1)'
                          e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.1)'
                        }}
                        onClick={() => navigate(`/product-details/${item.id}`)}
                      >
                        <div style={{
                          position: 'relative',
                          width: '100%',
                          height: '260px',
                          overflow: 'hidden',
                          background: 'linear-gradient(135deg, #f6f8fb 0%, #e9ecef 100%)'
                        }}>
                          <img
                            src={item.image}
                            alt={item.name}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              display: 'block'
                            }}
                            onError={(e) => {
                              e.target.src = '/placeholder-image.png'
                            }}
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              removeFromWishlist(item.id)
                            }}
                            style={{
                              position: 'absolute',
                              top: '16px',
                              right: '16px',
                              width: '40px',
                              height: '40px',
                              borderRadius: '50%',
                              background: 'rgba(255, 255, 255, 0.9)',
                              border: 'none',
                              cursor: 'pointer',
                              color: '#dc2626',
                              fontSize: '18px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                              transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.background = '#dc2626'
                              e.target.style.color = '#fff'
                              e.target.style.transform = 'scale(1.1)'
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.background = 'rgba(255, 255, 255, 0.9)'
                              e.target.style.color = '#dc2626'
                              e.target.style.transform = 'scale(1)'
                            }}
                            aria-label="Remove from wishlist"
                          >
                            <i className="fa-solid fa-heart"></i>
                          </button>
                        </div>
                        <div style={{ padding: '22px 24px' }}>
                          <h4 style={{
                            fontSize: '17px',
                            color: '#111827',
                            fontWeight: 800,
                            margin: '0 0 14px 0',
                            lineHeight: '1.4'
                          }}>
                            {item.name}
                          </h4>
                          <div style={{
                            fontSize: '24px',
                            fontWeight: 900,
                            color: '#111827',
                            background: 'linear-gradient(135deg, #2D8BD1 0%, #1A4F97 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            marginBottom: '16px'
                          }}>
                            RWF {item.price?.toLocaleString() || '0'}
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              addToCart(item, 1)
                            }}
                            style={{
                              width: '100%',
                              padding: '12px',
                              background: 'linear-gradient(135deg, #2D8BD1 0%, #1A4F97 100%)',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '10px',
                              fontSize: '14px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.transform = 'translateY(-2px)'
                              e.target.style.boxShadow = '0 6px 16px rgba(45, 139, 209, 0.4)'
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.transform = 'translateY(0)'
                              e.target.style.boxShadow = 'none'
                            }}
                          >
                            <i className="fa-solid fa-cart-shopping" style={{ marginRight: '8px' }}></i>
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Wishlist

