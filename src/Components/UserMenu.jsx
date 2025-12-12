import React, { useState, useRef, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../Context/AuthContext'

function UserMenu() {
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef(null)
  const timeoutRef = useRef(null)

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsOpen(true)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false)
    }, 200) // Small delay to allow moving to dropdown
  }

  const handleLogout = () => {
    logout()
    setIsOpen(false)
    navigate('/')
  }

  // User initials for authenticated users
  const userInitials = user?.name
    ? user.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U'

  return (
    <div 
      className="user-menu" 
      ref={menuRef} 
      style={{ position: 'relative' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="user-menu-button"
        style={{
          height: '52px',
          width: '52px',
          background: isOpen ? '#2D8BD1' : '#F5F6F7',
          border: `1px solid ${isOpen ? '#2D8BD1' : 'rgba(88, 91, 111, 0.2)'}`,
          borderRadius: '50%',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
          position: 'relative',
          padding: 0,
          color: isOpen ? '#fff' : '#111827',
          fontSize: '18px'
        }}
        title={isAuthenticated ? (user?.name || 'User') : 'Account'}
      >
        {isAuthenticated ? (
          <div
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #2D8BD1 0%, #1A4F97 100%)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              fontWeight: 700,
              transition: 'all 0.3s ease'
            }}
          >
            {userInitials}
          </div>
        ) : (
          <i className="fa-solid fa-user"></i>
        )}
      </button>

      {isOpen && (
        <div
          className="user-menu-dropdown"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{
            position: 'absolute',
            top: 'calc(100% + 12px)',
            right: '0',
            background: '#fff',
            borderRadius: '12px',
            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)',
            minWidth: '200px',
            zIndex: 10000,
            overflow: 'hidden',
            border: '1px solid rgba(45, 139, 209, 0.1)',
            animation: 'slideDown 0.2s ease-out'
          }}
        >
          <style>{`
            @keyframes slideDown {
              from {
                opacity: 0;
                transform: translateY(-10px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}</style>
          
          {isAuthenticated ? (
            <>
              {/* User Info Header */}
              <div style={{ 
                padding: '16px 20px', 
                borderBottom: '1px solid #f1f5f9',
                background: 'linear-gradient(135deg, rgba(45, 139, 209, 0.05) 0%, rgba(26, 79, 151, 0.03) 100%)'
              }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px'
                }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #2D8BD1 0%, #1A4F97 100%)',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      fontWeight: 700,
                      flexShrink: 0
                    }}
                  >
                    {userInitials}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ 
                      fontSize: '14px', 
                      fontWeight: 700, 
                      color: '#111827',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {user?.name || 'User'}
                    </div>
                    <div style={{ 
                      fontSize: '11px', 
                      color: '#6b7280', 
                      marginTop: '2px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {user?.email || ''}
                    </div>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div style={{ padding: '8px 0' }}>
                {/* Dashboard - Only for admins */}
                {user?.role === 'admin' && (
                  <Link
                    to="/dashboard"
                    onClick={() => setIsOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 16px',
                      color: '#111827',
                      textDecoration: 'none',
                      fontSize: '14px',
                      fontWeight: 600,
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'rgba(45, 139, 209, 0.1)'
                      e.target.style.color = '#2D8BD1'
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'transparent'
                      e.target.style.color = '#111827'
                    }}
                  >
                    <i className="fa-solid fa-gauge-high"></i>
                    <span>Dashboard</span>
                  </Link>
                )}

                <Link
                  to="/wishlist"
                  onClick={() => setIsOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    color: '#111827',
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: 600,
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(45, 139, 209, 0.1)'
                    e.target.style.color = '#2D8BD1'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'transparent'
                    e.target.style.color = '#111827'
                  }}
                >
                  <i className="fa-solid fa-heart"></i>
                  <span>Wishlist</span>
                </Link>

                {user?.role === 'admin' && (
                  <Link
                    to="/admin/products"
                    onClick={() => setIsOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 16px',
                      color: '#111827',
                      textDecoration: 'none',
                      fontSize: '14px',
                      fontWeight: 600,
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'rgba(45, 139, 209, 0.1)'
                      e.target.style.color = '#2D8BD1'
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'transparent'
                      e.target.style.color = '#111827'
                    }}
                  >
                    <i className="fa-solid fa-cog"></i>
                    <span>Admin Panel</span>
                  </Link>
                )}
              </div>

              {/* Logout */}
              <div style={{ padding: '8px 0', borderTop: '1px solid #f1f5f9' }}>
                <button
                  onClick={handleLogout}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    background: 'none',
                    border: 'none',
                    color: '#dc2626',
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textAlign: 'left'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(220, 38, 38, 0.1)'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'transparent'
                  }}
                >
                  <i className="fa-solid fa-sign-out-alt"></i>
                  <span>Logout</span>
                </button>
              </div>
            </>
          ) : (
            /* Not Authenticated - Show Login and Sign Up */
            <div style={{ padding: '8px 0' }}>
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  color: '#111827',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: 600,
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(45, 139, 209, 0.1)'
                  e.target.style.color = '#2D8BD1'
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent'
                  e.target.style.color = '#111827'
                }}
              >
                <i className="fa-solid fa-sign-in-alt"></i>
                <span>Login</span>
              </Link>

              <Link
                to="/signup"
                onClick={() => setIsOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  color: '#111827',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: 600,
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(45, 139, 209, 0.1)'
                  e.target.style.color = '#2D8BD1'
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent'
                  e.target.style.color = '#111827'
                }}
              >
                <i className="fa-solid fa-user-plus"></i>
                <span>Sign Up</span>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default UserMenu

