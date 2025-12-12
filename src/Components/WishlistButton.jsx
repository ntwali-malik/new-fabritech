import React from 'react'
import { useWishlist } from '../Context/WishlistContext'
import { useAuth } from '../Context/AuthContext'
import { useNavigate } from 'react-router-dom'

function WishlistButton({ product, className = '', style = {} }) {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const inWishlist = isInWishlist(product.id)

  const handleClick = (e) => {
    e.stopPropagation()
    
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    if (inWishlist) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
  }

  return (
    <button
      onClick={handleClick}
      className={`${className} ${inWishlist ? 'active' : ''}`}
      style={{
        ...style
      }}
      aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
      title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <i className={`fa-solid fa-heart`} style={{ 
        color: inWishlist ? '#dc2626' : '#111827',
        fontSize: '20px',
        transition: 'all 0.3s ease'
      }}></i>
    </button>
  )
}

export default WishlistButton

