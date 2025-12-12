import React, { createContext, useContext, useState, useEffect, useRef } from 'react'
import { useAuth } from './AuthContext'
import * as cartService from '../services/cartService'

// Create Cart Context
const CartContext = createContext()

// Create Cart Provider Component
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const { isAuthenticated, token, user } = useAuth()
  const hasSyncedRef = useRef(false)
  
  // Get userId from user object
  const userId = user?.id || user?._id || null

  // Load cart from localStorage or backend on mount
  useEffect(() => {
    const loadCart = async () => {
      if (isAuthenticated && userId) {
        // User is logged in - load from backend
        try {
          setSyncing(true)
          const savedCart = localStorage.getItem('cart')
          const localCartItems = savedCart ? JSON.parse(savedCart) : []
          
          // If there's a local cart, sync it with server
          if (localCartItems.length > 0 && !hasSyncedRef.current) {
            const syncedItems = await cartService.syncCart(userId, localCartItems, token || null)
            setCartItems(syncedItems)
            localStorage.setItem('cart', JSON.stringify(syncedItems))
            hasSyncedRef.current = true
          } else {
            // Just load from server
            const cartData = await cartService.getCart(userId, token || null)
            setCartItems(cartData.items || [])
            localStorage.setItem('cart', JSON.stringify(cartData.items || []))
          }
        } catch (error) {
          console.error('Error loading cart from server:', error)
          // Fallback to local storage
          const savedCart = localStorage.getItem('cart')
          if (savedCart) {
            try {
              setCartItems(JSON.parse(savedCart))
            } catch (e) {
              console.error('Error loading local cart:', e)
            }
          }
        } finally {
          setSyncing(false)
        }
      } else {
        // User is not logged in - load from localStorage only
        const savedCart = localStorage.getItem('cart')
        if (savedCart) {
          try {
            setCartItems(JSON.parse(savedCart))
          } catch (error) {
            console.error('Error loading cart:', error)
          }
        }
      }
    }

    loadCart()
  }, [isAuthenticated, token, userId])

  // Save cart to localStorage and backend whenever it changes
  useEffect(() => {
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cartItems))

    // Sync to backend if user is authenticated (debounced) - token optional
    if (isAuthenticated && userId && !syncing && hasSyncedRef.current) {
      const syncTimeout = setTimeout(async () => {
        try {
          // Sync each item individually (or batch if backend supports it)
          // For now, we'll sync the entire cart
          const currentServerCart = await cartService.getCart(userId, token)
          const serverProductIds = new Set((currentServerCart.items || []).map(item => item.id || item.productId))
          
          // Add new items
          for (const item of cartItems) {
            const productId = item.id
            if (!serverProductIds.has(productId)) {
              await cartService.addToCart(userId, item, token || null)
            } else {
              // Update quantity if different
              const serverItem = (currentServerCart.items || []).find(i => (i.id || i.productId) === productId)
              if (serverItem && serverItem.quantity !== item.quantity) {
                await cartService.updateCartItem(userId, productId, item.quantity, token || null)
              }
            }
          }

          // Remove items that are no longer in local cart
          for (const serverItem of (currentServerCart.items || [])) {
            const productId = serverItem.id || serverItem.productId
            if (!cartItems.find(item => item.id === productId)) {
              await cartService.removeFromCart(userId, productId, token || null)
            }
          }
        } catch (error) {
          console.error('Error syncing cart to server:', error)
        }
      }, 1000) // Debounce by 1 second

      return () => clearTimeout(syncTimeout)
    }
  }, [cartItems, isAuthenticated, token, userId, syncing])

  // Add item to cart
  const addToCart = async (product, quantity = 1) => {
    const cartItem = {
      ...product,
      quantity,
    }

    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id)

      if (existingItem) {
        // Update quantity if product already in cart
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      } else {
        // Add new product to cart
        return [...prevItems, cartItem]
      }
    })

    // Sync to backend if authenticated (token optional)
    if (isAuthenticated && userId) {
      try {
        await cartService.addToCart(userId, cartItem, token || null)
      } catch (error) {
        console.error('Error syncing add to cart:', error)
        // Revert on error if it's a stock issue
        if (error.message.includes('stock') || error.message.includes('Stock')) {
          setCartItems((prevItems) => {
            const existingItem = prevItems.find((item) => item.id === product.id)
            if (existingItem) {
              return prevItems.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity - quantity }
                  : item
              )
            }
            return prevItems.filter((item) => item.id !== product.id)
          })
        }
      }
    }
  }

  // Remove item from cart
  const removeFromCart = async (productId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== productId)
    )

    // Sync to backend if authenticated (token optional)
    if (isAuthenticated && userId) {
      try {
        await cartService.removeFromCart(userId, productId, token || null)
      } catch (error) {
        console.error('Error syncing remove from cart:', error)
      }
    }
  }

  // Update item quantity
  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    )

    // Sync to backend if authenticated (token optional)
    if (isAuthenticated && userId) {
      try {
        await cartService.updateCartItem(userId, productId, quantity, token || null)
      } catch (error) {
        console.error('Error syncing update quantity:', error)
        // Revert on error if it's a stock issue
        if (error.message.includes('stock') || error.message.includes('Stock')) {
          setCartItems((prevItems) =>
            prevItems.map((item) =>
              item.id === productId ? { ...item, quantity: item.quantity } : item
            )
          )
        }
      }
    }
  }

  // Clear entire cart
  const clearCart = async () => {
    setCartItems([])

    // Sync to backend if authenticated (token optional)
    if (isAuthenticated && userId) {
      try {
        await cartService.clearCart(userId, token || null)
      } catch (error) {
        console.error('Error syncing clear cart:', error)
      }
    }
  }

  // Get total price
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  // Get total items count
  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  // Get cart item count (unique products)
  const getCartCount = () => {
    return cartItems.length
  }

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
    getCartCount,
    isCartOpen,
    setIsCartOpen,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

// Custom hook to use Cart Context
export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}
