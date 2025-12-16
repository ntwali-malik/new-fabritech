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
    <>
      <style>{`
        .user-menu-button {
          position: relative;
          height: 44px;
          width: 44px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          padding: 0;
          border: 2px solid transparent;
          background: #ffffff;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        
        .user-menu-button:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(45, 139, 209, 0.25);
        }
        
        .user-menu-button.active {
          border-color: #2D8BD1;
          box-shadow: 0 0 0 3px rgba(45, 139, 209, 0.15);
        }
        
        .user-avatar {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: linear-gradient(135deg, #2D8BD1 0%, #1A4F97 100%);
          color: #ffffff !important;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 15px;
          font-weight: 700;
          letter-spacing: 0.5px;
          transition: all 0.3s ease;
          box-shadow: 0 2px 6px rgba(45, 139, 209, 0.3);
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }
        
        .user-menu-button:hover .user-avatar {
          background: linear-gradient(135deg, #3580d2 0%, #1f5ca8 100%);
          box-shadow: 0 3px 10px rgba(45, 139, 209, 0.4);
        }
        
        .user-icon {
          color: #2D8BD1 !important;
          font-size: 18px;
          transition: all 0.3s ease;
        }
        
        .user-menu-button:hover .user-icon {
          color: #1A4F97 !important;
          transform: scale(1.1);
        }
        
        .user-menu-dropdown {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          background: #ffffff !important;
          border-radius: 16px;
          box-shadow: 
            0 20px 60px rgba(0, 0, 0, 0.15),
            0 0 0 1px #e2e8f0,
            0 8px 24px rgba(0, 0, 0, 0.1);
          min-width: 240px;
          width: max-content;
          z-index: 10000;
          overflow: hidden;
          border: 1px solid #e2e8f0;
          animation: menuSlideDown 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 1;
        }
        
        @keyframes menuSlideDown {
          from {
            opacity: 0;
            transform: translateY(-8px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .user-info-header {
          padding: 18px 20px;
          border-bottom: 1px solid #e2e8f0;
          background: #ffffff !important;
        }
        
        .user-info-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: linear-gradient(135deg, #2D8BD1 0%, #1A4F97 100%);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 15px;
          font-weight: 700;
          letter-spacing: 0.5px;
          flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(45, 139, 209, 0.3);
        }
        
        .user-name {
          font-size: 15px;
          font-weight: 700;
          color: #0f172a;
          line-height: 1.4;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          letter-spacing: -0.01em;
        }
        
        .user-email {
          font-size: 12px;
          color: #475569;
          margin-top: 3px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .menu-items-container {
          padding: 6px 0;
          background: #ffffff !important;
        }
        
        .menu-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 11px 18px;
          color: #1e293b;
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
          cursor: pointer;
        }
        
        .menu-item i {
          width: 20px;
          text-align: center;
          font-size: 15px;
          color: #475569;
          transition: all 0.2s ease;
        }
        
        .menu-item:hover {
          background: rgba(45, 139, 209, 0.1);
          color: #1A4F97;
        }
        
        .menu-item:hover i {
          color: #1A4F97;
          transform: translateX(2px);
        }
        
        .menu-item.logout {
          color: #dc2626;
        }
        
        .menu-item.logout i {
          color: #dc2626;
        }
        
        .menu-item.logout:hover {
          background: rgba(220, 38, 38, 0.1);
          color: #b91c1c;
        }
        
        .menu-item.logout:hover i {
          color: #b91c1c;
        }
        
        .menu-divider {
          height: 1px;
          background: #e2e8f0;
          margin: 8px 0;
        }
        
        @media (max-width: 768px) {
          .user-menu-dropdown {
            right: -10px;
            min-width: 220px;
          }
        }
      `}</style>
      
      <div 
        className="user-menu" 
        ref={menuRef} 
        style={{ position: 'relative' }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`user-menu-button ${isOpen ? 'active' : ''}`}
          title={isAuthenticated ? (user?.name || 'User') : 'Account'}
        >
          {isAuthenticated ? (
            <div className="user-avatar">
              {userInitials}
            </div>
          ) : (
            <i className="fa-solid fa-user user-icon"></i>
          )}
        </button>

      {isOpen && (
        <div
          className="user-menu-dropdown"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{ background: '#ffffff', opacity: 1 }}
        >
          {isAuthenticated ? (
            <>
              {/* User Info Header */}
              <div className="user-info-header">
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '14px'
                }}>
                  <div className="user-info-avatar">
                    {userInitials}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="user-name">
                      {user?.name || 'User'}
                    </div>
                    <div className="user-email">
                      {user?.email || ''}
                    </div>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="menu-items-container">
                {/* Dashboard - Only for admins */}
                {user?.role === 'admin' && (
                  <Link
                    to="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="menu-item"
                  >
                    <i className="fa-solid fa-gauge-high"></i>
                    <span>Dashboard</span>
                  </Link>
                )}

                <Link
                  to="/wishlist"
                  onClick={() => setIsOpen(false)}
                  className="menu-item"
                >
                  <i className="fa-solid fa-heart"></i>
                  <span>Wishlist</span>
                </Link>

                {user?.role === 'admin' && (
                  <Link
                    to="/admin/products"
                    onClick={() => setIsOpen(false)}
                    className="menu-item"
                  >
                    <i className="fa-solid fa-cog"></i>
                    <span>Admin Panel</span>
                  </Link>
                )}
              </div>

              {/* Logout */}
              <div className="menu-divider"></div>
              <div className="menu-items-container">
                <button
                  onClick={handleLogout}
                  className="menu-item logout"
                >
                  <i className="fa-solid fa-right-from-bracket"></i>
                  <span>Logout</span>
                </button>
              </div>
            </>
          ) : (
            /* Not Authenticated - Show Login and Sign Up */
            <div className="menu-items-container">
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="menu-item"
              >
                <i className="fa-solid fa-right-to-bracket"></i>
                <span>Login</span>
              </Link>

              <Link
                to="/signup"
                onClick={() => setIsOpen(false)}
                className="menu-item"
              >
                <i className="fa-solid fa-user-plus"></i>
                <span>Sign Up</span>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
    </>
  )
}

export default UserMenu

