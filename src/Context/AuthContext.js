import React, { createContext, useContext, useState, useEffect } from 'react'

// Create Auth Context
const AuthContext = createContext()

// Create Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  // Load user from localStorage on mount (no token required)
  useEffect(() => {
    const loadAuth = () => {
      try {
        const savedUser = localStorage.getItem('user')
        const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'

        // User is authenticated if we have a user object (no token required)
        if (isAuthenticated && savedUser) {
          const userData = JSON.parse(savedUser)
          setUser(userData)
          // Token is optional - set to null if not using JWT
          const savedToken = localStorage.getItem('token')
          if (savedToken) {
            setToken(savedToken)
          }
        }
      } catch (error) {
        console.error('Error loading auth:', error)
        // Clear invalid data
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        localStorage.removeItem('isAuthenticated')
      } finally {
        setLoading(false)
      }
    }

    loadAuth()
  }, [])

  // Login function (token is optional)
  const login = (userData, authToken = null) => {
    setUser(userData)
    setToken(authToken)
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('isAuthenticated', 'true')
    // Only save token if provided (for JWT systems)
    if (authToken) {
      localStorage.setItem('token', authToken)
    } else {
      localStorage.removeItem('token')
    }
  }

  // Logout function
  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('cart') // Clear cart on logout
    localStorage.removeItem('wishlist') // Clear wishlist on logout
  }

  // Update user function
  const updateUser = (userData) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  // Check if user is authenticated (based on user object, not token)
  const isAuthenticated = () => {
    return !!user
  }

  // Get auth headers for API requests (optional - only if using JWT)
  const getAuthHeaders = () => {
    const headers = {
      'Content-Type': 'application/json'
    }
    // Only add Authorization header if token exists (JWT systems)
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    return headers
  }

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    updateUser,
    isAuthenticated: isAuthenticated(),
    getAuthHeaders
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Custom hook to use Auth Context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

