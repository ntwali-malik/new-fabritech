import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useWishlist } from '../Context/WishlistContext'
import { useAuth } from '../Context/AuthContext'

function WishlistIcon({ onClick }) {
  const navigate = useNavigate()
  const { getWishlistCount } = useWishlist()
  const { isAuthenticated } = useAuth()
  const count = getWishlistCount()

  const handleClick = () => {
    if (onClick) {
      onClick()
    } else {
      if (isAuthenticated) {
        navigate('/wishlist')
      } else {
        navigate('/login')
      }
    }
  }

  return (
    <button
      onClick={handleClick}
      className="wishlist-icon"
      aria-label={`Wishlist (${count} items)`}
      style={{
        position: 'relative',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '8px',
        color: '#111827',
        fontSize: '20px',
        transition: 'all 0.3s ease'
      }}
      onMouseEnter={(e) => {
        e.target.style.color = '#2D8BD1'
        e.target.style.transform = 'scale(1.1)'
      }}
      onMouseLeave={(e) => {
        e.target.style.color = '#111827'
        e.target.style.transform = 'scale(1)'
      }}
    >
      <i className="fa-solid fa-heart"></i>
      {count > 0 && (
        <span
          className="wishlist-badge"
          style={{
            position: 'absolute',
            top: '0',
            right: '0',
            background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
            color: '#fff',
            borderRadius: '50%',
            width: '18px',
            height: '18px',
            fontSize: '11px',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(220, 38, 38, 0.3)',
            animation: count > 0 ? 'pulse 2s ease-in-out infinite' : 'none'
          }}
        >
          {count > 9 ? '9+' : count}
        </span>
      )}
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `}</style>
    </button>
  )
}

export default WishlistIcon

