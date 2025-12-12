import API_BASE_URL from './apiConfig'

/**
 * Wishlist Service
 * Handles all API calls related to user wishlist management
 * Matches backend API structure: /wishlist/:userId
 */

/**
 * Transform backend product to frontend wishlist item format
 * @param {Object} product - Backend product object
 * @returns {Object} Frontend wishlist item format
 */
const transformWishlistItem = (product) => {
  return {
    id: product.id || product._id,
    productId: product.id || product._id,
    name: product.title || product.name,
    title: product.title || product.name,
    price: product.priceNew || product.price || 0,
    image: product.image || '/placeholder-image.png',
    category: product.category || product.badge || 'other',
    // Keep backend reference
    _id: product._id
  }
}

/**
 * Get user's wishlist
 * @param {string} userId - User ID
 * @param {string} token - Authentication token (optional, not using JWT)
 * @returns {Promise<Array>} Array of wishlist items
 */
export const getWishlist = async (userId, token = null) => {
  try {
    const headers = {
      'Content-Type': 'application/json'
    }
    // Only add Authorization header if token exists (JWT systems)
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    const response = await fetch(`${API_BASE_URL}/wishlist/${userId}`, {
      method: 'GET',
      headers
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized. Please login.')
      }
      if (response.status === 404) {
        // User not found or wishlist doesn't exist - return empty array
        return []
      }
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to fetch wishlist')
    }

    const data = await response.json()
    // Backend returns: { wishlist: { products: [...] }, count: number }
    const products = data.wishlist?.products || []
    // Transform backend products to frontend format
    return products.map(transformWishlistItem)
  } catch (error) {
    console.error('Error fetching wishlist:', error)
    throw error
  }
}

/**
 * Add item to wishlist
 * @param {string} userId - User ID
 * @param {Object} product - Product to add (must have id property)
 * @param {string} token - Authentication token (optional, not using JWT)
 * @returns {Promise<Array>} Updated wishlist items array
 */
export const addToWishlist = async (userId, product, token = null) => {
  try {
    const headers = {
      'Content-Type': 'application/json'
    }
    // Only add Authorization header if token exists (JWT systems)
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    // Backend expects: POST /:userId/add with { productId } in body
    const response = await fetch(`${API_BASE_URL}/wishlist/${userId}/add`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        productId: product.id || product.productId
      })
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized. Please login.')
      }
      if (response.status === 400) {
        const errorData = await response.json()
        // Product already in wishlist - return current wishlist
        if (errorData.error && errorData.error.includes('already in wishlist')) {
          // Fetch current wishlist and return it
          return await getWishlist(userId, token)
        }
        throw new Error(errorData.error || 'Failed to add item to wishlist')
      }
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to add item to wishlist')
    }

    const data = await response.json()
    // Backend returns: { message, wishlist: { products: [...] }, count }
    const products = data.wishlist?.products || []
    // Transform backend products to frontend format
    return products.map(transformWishlistItem)
  } catch (error) {
    console.error('Error adding to wishlist:', error)
    throw error
  }
}

/**
 * Remove item from wishlist
 * @param {string} userId - User ID
 * @param {string} productId - Product ID to remove
 * @param {string} token - Authentication token (optional, not using JWT)
 * @returns {Promise<Array>} Updated wishlist items array
 */
export const removeFromWishlist = async (userId, productId, token = null) => {
  try {
    const headers = {
      'Content-Type': 'application/json'
    }
    // Only add Authorization header if token exists (JWT systems)
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    // Backend expects: DELETE /:userId/remove/:productId
    const response = await fetch(`${API_BASE_URL}/wishlist/${userId}/remove/${productId}`, {
      method: 'DELETE',
      headers
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized. Please login.')
      }
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to remove item from wishlist')
    }

    const data = await response.json()
    // Backend returns: { message, wishlist: { products: [...] }, count }
    const products = data.wishlist?.products || []
    // Transform backend products to frontend format
    return products.map(transformWishlistItem)
  } catch (error) {
    console.error('Error removing from wishlist:', error)
    throw error
  }
}

/**
 * Check if product is in wishlist
 * @param {string} userId - User ID
 * @param {string} productId - Product ID to check
 * @param {string} token - Authentication token (optional, not using JWT)
 * @returns {Promise<boolean>} True if product is in wishlist
 */
export const isInWishlist = async (userId, productId, token = null) => {
  try {
    const headers = {
      'Content-Type': 'application/json'
    }
    // Only add Authorization header if token exists (JWT systems)
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    // Backend has dedicated endpoint: GET /:userId/check/:productId
    const response = await fetch(`${API_BASE_URL}/wishlist/${userId}/check/${productId}`, {
      method: 'GET',
      headers
    })

    if (!response.ok) {
      if (response.status === 404) {
        // User or product not found - return false
        return false
      }
      // Fallback to checking full wishlist
      const wishlist = await getWishlist(userId, token)
      return wishlist.some(item => item.productId === productId || item.id === productId)
    }

    const data = await response.json()
    // Backend returns: { inWishlist: boolean, product: {...} }
    return data.inWishlist || false
  } catch (error) {
    console.error('Error checking wishlist:', error)
    // Fallback to checking full wishlist
    try {
      const wishlist = await getWishlist(userId, token)
      return wishlist.some(item => item.productId === productId || item.id === productId)
    } catch (e) {
      return false
    }
  }
}

/**
 * Clear entire wishlist
 * @param {string} userId - User ID
 * @param {string} token - Authentication token (optional, not using JWT)
 * @returns {Promise<Array>} Empty wishlist array
 */
export const clearWishlist = async (userId, token = null) => {
  try {
    const headers = {
      'Content-Type': 'application/json'
    }
    // Only add Authorization header if token exists (JWT systems)
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    // Backend expects: DELETE /:userId/clear
    const response = await fetch(`${API_BASE_URL}/wishlist/${userId}/clear`, {
      method: 'DELETE',
      headers
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized. Please login.')
      }
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to clear wishlist')
    }

    // Backend returns: { message, wishlist: { products: [] } }
    // Return empty array for consistency
    return []
  } catch (error) {
    console.error('Error clearing wishlist:', error)
    throw error
  }
}

/**
 * Get wishlist count
 * @param {string} userId - User ID
 * @param {string} token - Authentication token (optional, not using JWT)
 * @returns {Promise<number>} Wishlist item count
 */
export const getWishlistCount = async (userId, token = null) => {
  try {
    const headers = {
      'Content-Type': 'application/json'
    }
    // Only add Authorization header if token exists (JWT systems)
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    // Backend has dedicated endpoint: GET /:userId/count
    const response = await fetch(`${API_BASE_URL}/wishlist/${userId}/count`, {
      method: 'GET',
      headers
    })

    if (!response.ok) {
      if (response.status === 404) {
        // User not found - return 0
        return 0
      }
      // Fallback to getting full wishlist and counting
      const wishlist = await getWishlist(userId, token)
      return wishlist.length
    }

    const data = await response.json()
    // Backend returns: { count: number }
    return data.count || 0
  } catch (error) {
    console.error('Error getting wishlist count:', error)
    // Fallback to getting full wishlist and counting
    try {
      const wishlist = await getWishlist(userId, token)
      return wishlist.length
    } catch (e) {
      return 0
    }
  }
}

/**
 * Move product from wishlist to cart
 * @param {string} userId - User ID
 * @param {string} productId - Product ID to move
 * @param {number} quantity - Quantity to add to cart (default: 1)
 * @param {string} token - Authentication token (optional, not using JWT)
 * @returns {Promise<Object>} Updated cart and wishlist
 */
export const moveToCart = async (userId, productId, quantity = 1, token = null) => {
  try {
    const headers = {
      'Content-Type': 'application/json'
    }
    // Only add Authorization header if token exists (JWT systems)
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    // Backend expects: POST /:userId/move-to-cart/:productId with { quantity } in body
    const response = await fetch(`${API_BASE_URL}/wishlist/${userId}/move-to-cart/${productId}`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ quantity })
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized. Please login.')
      }
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to move product to cart')
    }

    const data = await response.json()
    // Backend returns: { message, cart: {...}, wishlist: { products: [...] } }
    return {
      cart: data.cart,
      wishlist: (data.wishlist?.products || []).map(transformWishlistItem)
    }
  } catch (error) {
    console.error('Error moving product to cart:', error)
    throw error
  }
}

export default {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  isInWishlist,
  clearWishlist,
  getWishlistCount,
  moveToCart
}

