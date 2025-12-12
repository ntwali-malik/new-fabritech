import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductsManagement from './ProductsManagement';
import UsersManagement from './UsersManagement';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('Products');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);

  // Load user data from localStorage
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (err) {
        console.error('Error parsing user data:', err);
      }
    }
  }, []);

  // Get user initials for avatar
  const getUserInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Logout handler
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
      navigate('/login');
    }
  };

  return (
    <div className="dashboard-container">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Left Sidebar */}
      <aside className={`dashboard-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <button 
          className="sidebar-close-btn"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close menu"
        >
          <i className="fas fa-times"></i>
        </button>
        <div className="sidebar-logo">logo</div>
        
        <div className="sidebar-profile">
          <div className="profile-avatar">
            <div className="avatar-circle">{user ? getUserInitials(user.name) : 'U'}</div>
          </div>
          <div className="profile-info">
            <div className="profile-name">{user?.name || 'User'}</div>
            <div className="profile-role">{user?.role || 'Admin'}</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            <div className="nav-section-title">MANAGEMENT</div>
            <ul className="nav-list">
              <li 
                className={activeSection === 'Products' ? 'active' : ''} 
                onClick={() => {
                  setActiveSection('Products');
                  setSidebarOpen(false);
                }}
              >
                <i className="fas fa-box"></i>
                <span>Products</span>
              </li>
              <li 
                className={activeSection === 'Users' ? 'active' : ''} 
                onClick={() => {
                  setActiveSection('Users');
                  setSidebarOpen(false);
                }}
              >
                <i className="fas fa-users"></i>
                <span>Users</span>
              </li>
            </ul>
          </div>
        </nav>

        {/* Logout Button */}
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Header */}
        <header className="dashboard-header">
          <button 
            className="mobile-menu-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle menu"
          >
            <i className="fas fa-bars"></i>
          </button>
          <div className="header-search">
            <i className="fas fa-search"></i>
            <input type="text" placeholder="Search" />
          </div>
          <div className="header-actions">
            <button className="logout-btn-header" onClick={handleLogout} title="Logout">
              <i className="fas fa-sign-out-alt"></i>
            </button>
            <div className="header-profile-avatar">
              <div className="avatar-circle-small">{user ? getUserInitials(user.name) : 'U'}</div>
            </div>
          </div>
        </header>

        {/* Welcome Message */}
        <div className="dashboard-welcome">
          <h1>Hey, Welcome back</h1>
        </div>

        {/* Conditional Content Based on Active Section */}
        {activeSection === 'Products' ? (
          <ProductsManagement />
        ) : activeSection === 'Users' ? (
          <UsersManagement />
        ) : (
          <ProductsManagement />
        )}
      </main>
    </div>
  );
}

export default Dashboard;

