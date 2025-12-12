import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import * as wishlistService from '../services/wishlistService'

// Create Wishlist Context
const WishlistContext = createContext()

// Create Wishlist Provider Component
export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([])
  const [loading, setLoading] = useState(false)
  const { isAuthenticated, token, user } = useAuth()
  
  // Get userId from user object
  const userId = user?.id || user?._id || null

  // Load wishlist from localStorage or backend on mount
  useEffect(() => {
    const loadWishlist = async () => {
      if (isAuthenticated && userId) {
        // User is logged in - load from backend (token optional)
        try {
          setLoading(true)
          const serverItems = await wishlistService.getWishlist(userId, token || null)
          setWishlistItems(serverItems)
          localStorage.setItem('wishlist', JSON.stringify(serverItems))
        } catch (error) {
          console.error('Error loading wishlist from server:', error)
          // Fallback to local storage
          const savedWishlist = localStorage.getItem('wishlist')
          if (savedWishlist) {
            try {
              setWishlistItems(JSON.parse(savedWishlist))
            } catch (e) {
              console.error('Error loading local wishlist:', e)
            }
          }
        } finally {
          setLoading(false)
        }
      } else {
        // User is not logged in - load from localStorage only
        const savedWishlist = localStorage.getItem('wishlist')
        if (savedWishlist) {
          try {
            setWishlistItems(JSON.parse(savedWishlist))
          } catch (error) {
            console.error('Error loading wishlist:', error)
          }
        }
      }
    }

    loadWishlist()
  }, [isAuthenticated, token, userId])

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlistItems))
  }, [wishlistItems])

  // Add item to wishlist
  const addToWishlist = async (product) => {
    // Check if already in wishlist
    if (isInWishlist(product.id)) {
      return
    }

    // Optimistic update for guest users
    if (!isAuthenticated || !userId) {
      const wishlistItem = {
        id: product.id,
        productId: product.id,
        name: product.name || product.title,
        price: product.price,
        image: product.image,
        category: product.category
      }
      setWishlistItems((prevItems) => [...prevItems, wishlistItem])
      return
    }

    // For authenticated users, sync with backend
    try {
      // Optimistic update
      const wishlistItem = {
        id: product.id,
        productId: product.id,
        name: product.name || product.title,
        price: product.price,
        image: product.image,
        category: product.category
      }
      setWishlistItems((prevItems) => [...prevItems, wishlistItem])

      // Sync with backend
      const updatedItems = await wishlistService.addToWishlist(userId, product, token || null)
      // Update with server response to ensure consistency
      setWishlistItems(updatedItems)
      // Also update localStorage
      localStorage.setItem('wishlist', JSON.stringify(updatedItems))
    } catch (error) {
      console.error('Error syncing add to wishlist:', error)
      // Revert on error
      setWishlistItems((prevItems) =>
        prevItems.filter((item) => item.id !== product.id)
      )
      throw error // Re-throw so UI can handle it
    }
  }

  // Remove item from wishlist
  const removeFromWishlist = async (productId) => {
    // Optimistic update for guest users
    if (!isAuthenticated || !userId) {
      setWishlistItems((prevItems) =>
        prevItems.filter((item) => item.id !== productId)
      )
      return
    }

    // For authenticated users, sync with backend
    // Store previous state for rollback
    const previousItems = [...wishlistItems]
    
    // Optimistic update
    setWishlistItems((prevItems) =>
      prevItems.filter((item) => item.id !== productId)
    )

    try {
      // Sync with backend
      const updatedItems = await wishlistService.removeFromWishlist(userId, productId, token || null)
      // Update with server response to ensure consistency
      setWishlistItems(updatedItems)
      // Also update localStorage
      localStorage.setItem('wishlist', JSON.stringify(updatedItems))
    } catch (error) {
      console.error('Error syncing remove from wishlist:', error)
      // Revert on error
      setWishlistItems(previousItems)
      throw error // Re-throw so UI can handle it
    }
  }

  // Check if product is in wishlist
  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item.id === productId || item.productId === productId)
  }

  // Clear entire wishlist
  const clearWishlist = async () => {
    // Optimistic update for guest users
    if (!isAuthenticated || !userId) {
      setWishlistItems([])
      return
    }

    // For authenticated users, sync with backend
    // Store previous state for rollback
    const previousItems = [...wishlistItems]
    
    // Optimistic update
    setWishlistItems([])

    try {
      // Sync with backend
      await wishlistService.clearWishlist(userId, token || null)
      // Server returns empty array, state is already cleared
      // Also update localStorage
      localStorage.setItem('wishlist', JSON.stringify([]))
    } catch (error) {
      console.error('Error syncing clear wishlist:', error)
      // Revert on error
      setWishlistItems(previousItems)
      throw error // Re-throw so UI can handle it
    }
  }

  // Get wishlist count
  const getWishlistCount = () => {
    return wishlistItems.length
  }

  const value = {
    wishlistItems,
    loading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
    getWishlistCount
  }

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

// Custom hook to use Wishlist Context
export const useWishlist = () => {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider')
  }
  return context
}

