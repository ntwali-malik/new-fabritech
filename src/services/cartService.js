import API_BASE_URL from './apiConfig'

/**
 * Cart Service
 * Handles all API calls related to user cart management
 */

/**
 * Transform backend cart item to frontend format
 * @param {Object} item - Backend cart item with populated product
 * @returns {Object} Frontend cart item format
 */
const transformCartItem = (item) => {
  const product = item.product || {}
  return {
    id: product.id || product._id,
    productId: product.id || product._id,
    name: product.title || product.name,
    title: product.title || product.name,
    price: item.price || product.priceNew || product.price || 0,
    image: product.image || '/placeholder-image.png',
    category: product.category || product.badge || 'other',
    quantity: item.quantity || 1,
    stock: product.stock || 0,
    // Keep backend IDs for reference
    _id: item._id,
    productRef: product._id
  }
}

/**
 * Get user's cart
 * @param {string} userId - User ID
 * @param {string} token - Authentication token (optional, for future use)
 * @param {Object} options - Options like autoRemoveOutOfStock
 * @returns {Promise<Object>} Cart data with items, stockWarnings, etc.
 */
export const getCart = async (userId, token = null, options = {}) => {
  try {
    const queryParams = new URLSearchParams()
    if (options.autoRemoveOutOfStock) {
      queryParams.append('autoRemoveOutOfStock', 'true')
    }

    const url = `${API_BASE_URL}/cart/${userId}${queryParams.toString() ? '?' + queryParams.toString() : ''}`
    
    const headers = {
      'Content-Type': 'application/json'
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(url, {
      method: 'GET',
      headers
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized. Please login.')
      }
      if (response.status === 404) {
        // Return empty cart if user not found (will be created on first add)
        return { items: [], stockWarnings: [], outOfStockItems: [], hasStockIssues: false }
      }
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to fetch cart')
    }

    const data = await response.json()
    const cart = data.cart || data
    
    // Transform items to frontend format
    const items = (cart.items || []).map(transformCartItem)

    return {
      items,
      stockWarnings: data.stockWarnings || [],
      outOfStockItems: data.outOfStockItems || [],
      hasStockIssues: data.hasStockIssues || false,
      cart: cart
    }
  } catch (error) {
    console.error('Error fetching cart:', error)
    throw error
  }
}

/**
 * Add item to cart
 * @param {string} userId - User ID
 * @param {Object} item - Cart item (product with quantity)
 * @param {string} token - Authentication token (optional)
 * @returns {Promise<Object>} Updated cart
 */
export const addToCart = async (userId, item, token = null) => {
  try {
    const headers = {
      'Content-Type': 'application/json'
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(`${API_BASE_URL}/cart/${userId}/add`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        productId: item.id || item.productId,
        quantity: item.quantity || 1
      })
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized. Please login.')
      }
      const errorData = await response.json()
      
      // Handle stock-related errors with more detail
      if (errorData.product) {
        throw new Error(errorData.error || 'Stock issue: ' + JSON.stringify(errorData.product))
      }
      
      throw new Error(errorData.error || 'Failed to add item to cart')
    }

    const cart = await response.json()
    
    // Transform items to frontend format
    const items = (cart.items || []).map(transformCartItem)

    return items
  } catch (error) {
    console.error('Error adding to cart:', error)
    throw error
  }
}

/**
 * Update cart item quantity
 * @param {string} userId - User ID
 * @param {string} productId - Product ID
 * @param {number} quantity - New quantity
 * @param {string} token - Authentication token (optional)
 * @returns {Promise<Array>} Updated cart items
 */
export const updateCartItem = async (userId, productId, quantity, token = null) => {
  try {
    const headers = {
      'Content-Type': 'application/json'
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(`${API_BASE_URL}/cart/${userId}/update`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        productId: productId,
        quantity: quantity
      })
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized. Please login.')
      }
      const errorData = await response.json()
      
      // Handle stock-related errors
      if (errorData.product) {
        throw new Error(errorData.error || 'Stock issue: ' + JSON.stringify(errorData.product))
      }
      
      throw new Error(errorData.error || 'Failed to update cart item')
    }

    const cart = await response.json()
    
    // Transform items to frontend format
    const items = (cart.items || []).map(transformCartItem)

    return items
  } catch (error) {
    console.error('Error updating cart item:', error)
    throw error
  }
}

/**
 * Remove item from cart
 * @param {string} userId - User ID
 * @param {string} productId - Product ID
 * @param {string} token - Authentication token (optional)
 * @returns {Promise<Array>} Updated cart items
 */
export const removeFromCart = async (userId, productId, token = null) => {
  try {
    const headers = {
      'Content-Type': 'application/json'
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(`${API_BASE_URL}/cart/${userId}/remove/${productId}`, {
      method: 'DELETE',
      headers
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized. Please login.')
      }
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to remove item from cart')
    }

    const cart = await response.json()
    
    // Transform items to frontend format
    const items = (cart.items || []).map(transformCartItem)

    return items
  } catch (error) {
    console.error('Error removing from cart:', error)
    throw error
  }
}

/**
 * Clear entire cart
 * @param {string} userId - User ID
 * @param {string} token - Authentication token (optional)
 * @returns {Promise<Array>} Empty cart items array
 */
export const clearCart = async (userId, token = null) => {
  try {
    const headers = {
      'Content-Type': 'application/json'
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(`${API_BASE_URL}/cart/${userId}/clear`, {
      method: 'DELETE',
      headers
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized. Please login.')
      }
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to clear cart')
    }

    return []
  } catch (error) {
    console.error('Error clearing cart:', error)
    throw error
  }
}

/**
 * Sync local cart to server (merge guest cart with user cart)
 * Adds all local items to the server cart one by one
 * @param {string} userId - User ID
 * @param {Array} localCartItems - Items from localStorage
 * @param {string} token - Authentication token (optional)
 * @returns {Promise<Array>} Synced cart items
 */
export const syncCart = async (userId, localCartItems, token = null) => {
  try {
    // First, get the current server cart
    const serverCart = await getCart(userId, token)
    const serverProductIds = new Set(serverCart.items.map(item => item.id || item.productId))

    // Add each local item that's not already in server cart
    for (const item of localCartItems) {
      if (!serverProductIds.has(item.id)) {
        try {
          await addToCart(userId, item, token)
        } catch (error) {
          // If item can't be added (e.g., out of stock), skip it
          console.warn(`Could not add item ${item.id} to cart:`, error.message)
        }
      }
    }

    // Return the updated cart
    const updatedCart = await getCart(userId, token)
    return updatedCart.items
  } catch (error) {
    console.error('Error syncing cart:', error)
    throw error
  }
}

/**
 * Validate cart stock before checkout
 * @param {string} userId - User ID
 * @param {string} token - Authentication token (optional)
 * @returns {Promise<Object>} Validation result with stock issues
 */
export const validateCart = async (userId, token = null) => {
  try {
    const headers = {
      'Content-Type': 'application/json'
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(`${API_BASE_URL}/cart/${userId}/validate`, {
      method: 'GET',
      headers
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized. Please login.')
      }
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to validate cart')
    }

    const data = await response.json()
    return {
      valid: data.valid || false,
      canProceedToCheckout: data.canProceedToCheckout || false,
      stockIssues: data.stockIssues || [],
      outOfStockItems: data.outOfStockItems || [],
      totalIssues: data.totalIssues || 0,
      message: data.message || ''
    }
  } catch (error) {
    console.error('Error validating cart:', error)
    throw error
  }
}

export default {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  syncCart,
  validateCart
}

