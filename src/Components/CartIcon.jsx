import React from 'react'

const CartIcon = ({ cartCount = 0, onClick }) => {
  return (
    <div 
      onClick={onClick}
      style={{
        position: 'relative',
        marginRight: '20px',
        fontSize: '20px',
        color: '#2D8BD1',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = '#1A4F97'
        e.currentTarget.style.transform = 'scale(1.1)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = '#2D8BD1'
        e.currentTarget.style.transform = 'scale(1)'
      }}
      title="View Cart"
    >
      <i className="fa-solid fa-shopping-cart"></i>
      {cartCount > 0 && (
        <span
          style={{
            position: 'absolute',
            top: '-8px',
            right: '-8px',
            background: '#1A4F97',
            color: 'white',
            borderRadius: '50%',
            minWidth: '22px',
            height: '22px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '11px',
            fontWeight: 'bold',
            padding: '0 6px',
            boxShadow: '0 2px 8px rgba(26, 79, 151, 0.3)',
            animation: 'cartPulse 0.3s ease'
          }}
        >
          {cartCount}
        </span>
      )}
      <style>{`
        @keyframes cartPulse {
          0% { transform: scale(0.8); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  )
}

export default CartIcon
