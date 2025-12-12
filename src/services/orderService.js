import API_BASE_URL from './apiConfig'

/**
 * Order Service
 * Handles all API calls related to order management
 */

/**
 * Transform backend order item to frontend format
 * @param {Object} item - Backend order item with populated product
 * @returns {Object} Frontend order item format
 */
const transformOrderItem = (item) => {
  const product = item.product || {}
  return {
    id: product.id || product._id,
    productId: product.id || product._id,
    name: item.title || product.title || product.name,
    title: item.title || product.title || product.name,
    price: item.price || product.priceNew || product.price || 0,
    image: product.image || '/placeholder-image.png',
    category: product.category || product.badge || 'other',
    quantity: item.quantity || 1,
    // Keep backend IDs for reference
    _id: item._id,
    productRef: product._id || item.product
  }
}

/**
 * Transform backend order to frontend format
 * @param {Object} order - Backend order object
 * @returns {Object} Frontend order format
 */
const transformOrder = (order) => {
  const user = order.user || {}
  return {
    id: order.id || order._id,
    _id: order._id,
    orderNumber: order.orderNumber || order.id,
    items: (order.items || []).map(transformOrderItem),
    total: order.total || 0,
    subtotal: order.subtotal || order.total || 0,
    tax: order.tax || 0,
    shippingFee: order.shippingFee || 0,
    discount: order.discount || 0,
    shippingAddress: order.shippingAddress || {},
    phone: order.phone || '',
    paymentMethod: order.paymentMethod || '',
    paymentStatus: order.paymentStatus || 'pending',
    dpoTransactionId: order.dpoTransactionId || null,
    status: order.status || 'pending',
    trackingNumber: order.trackingNumber || '',
    notes: order.notes || '',
    user: {
      id: user.id || user._id,
      name: user.name || '',
      email: user.email || ''
    },
    createdAt: order.createdAt || new Date(),
    updatedAt: order.updatedAt || new Date(),
    deliveredAt: order.deliveredAt || null,
    cancelledAt: order.cancelledAt || null
  }
}

/**
 * Create order from cart
 * @param {string} userId - User ID
 * @param {Object} orderData - Order data (shippingAddress, phone, dpoTransactionId?)
 * @param {string} token - Authentication token (optional)
 * @returns {Promise<Object>} Created order
 */
export const createOrder = async (userId, orderData, token = null) => {
  try {
    const { shippingAddress, phone, dpoTransactionId } = orderData

    if (!shippingAddress || !phone) {
      throw new Error('Shipping address and phone are required')
    }

    const headers = {
      'Content-Type': 'application/json'
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(`${API_BASE_URL}/orders/${userId}/create`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        shippingAddress,
        phone,
        dpoTransactionId: dpoTransactionId || undefined
      })
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized. Please login.')
      }
      if (response.status === 400) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create order')
      }
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to create order')
    }

    const data = await response.json()
    return transformOrder(data.order || data)
  } catch (error) {
    console.error('Error creating order:', error)
    throw error
  }
}

/**
 * Get all orders (admin only)
 * @param {string} token - Authentication token
 * @returns {Promise<Array>} Array of orders
 */
export const getAllOrders = async (token) => {
  try {
    const headers = {
      'Content-Type': 'application/json'
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'GET',
      headers
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized. Please login.')
      }
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to fetch orders')
    }

    const orders = await response.json()
    return (orders || []).map(transformOrder)
  } catch (error) {
    console.error('Error fetching orders:', error)
    throw error
  }
}

/**
 * Get user's orders
 * @param {string} userId - User ID
 * @param {string} token - Authentication token (optional)
 * @returns {Promise<Array>} Array of user's orders
 */
export const getUserOrders = async (userId, token = null) => {
  try {
    const headers = {
      'Content-Type': 'application/json'
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(`${API_BASE_URL}/orders/${userId}`, {
      method: 'GET',
      headers
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized. Please login.')
      }
      if (response.status === 404) {
        return [] // Return empty array if user not found
      }
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to fetch user orders')
    }

    const orders = await response.json()
    return (orders || []).map(transformOrder)
  } catch (error) {
    console.error('Error fetching user orders:', error)
    throw error
  }
}

/**
 * Get single order by ID
 * @param {string} orderId - Order ID
 * @param {string} token - Authentication token (optional)
 * @returns {Promise<Object>} Order object
 */
export const getOrderById = async (orderId, token = null) => {
  try {
    const headers = {
      'Content-Type': 'application/json'
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(`${API_BASE_URL}/orders/order/${orderId}`, {
      method: 'GET',
      headers
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized. Please login.')
      }
      if (response.status === 404) {
        throw new Error('Order not found')
      }
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to fetch order')
    }

    const order = await response.json()
    return transformOrder(order)
  } catch (error) {
    console.error('Error fetching order:', error)
    throw error
  }
}

/**
 * Update order status
 * @param {string} orderId - Order ID
 * @param {string} status - New status (pending, processing, shipped, delivered, cancelled)
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} Updated order
 */
export const updateOrderStatus = async (orderId, status, token) => {
  try {
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid status. Must be one of: ' + validStatuses.join(', '))
    }

    const headers = {
      'Content-Type': 'application/json'
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ status })
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized. Please login.')
      }
      if (response.status === 404) {
        throw new Error('Order not found')
      }
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to update order status')
    }

    const data = await response.json()
    return transformOrder(data.order || data)
  } catch (error) {
    console.error('Error updating order status:', error)
    throw error
  }
}

/**
 * Update payment status
 * @param {string} orderId - Order ID
 * @param {string} paymentStatus - New payment status (pending, paid, failed)
 * @param {string} dpoTransactionId - DPO transaction ID (optional)
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} Updated order
 */
export const updatePaymentStatus = async (orderId, paymentStatus, token, dpoTransactionId = null) => {
  try {
    const validStatuses = ['pending', 'paid', 'failed']
    if (!validStatuses.includes(paymentStatus)) {
      throw new Error('Invalid payment status. Must be one of: ' + validStatuses.join(', '))
    }

    const headers = {
      'Content-Type': 'application/json'
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const body = { paymentStatus }
    if (dpoTransactionId) {
      body.dpoTransactionId = dpoTransactionId
    }

    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/payment`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body)
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized. Please login.')
      }
      if (response.status === 404) {
        throw new Error('Order not found')
      }
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to update payment status')
    }

    const data = await response.json()
    return transformOrder(data.order || data)
  } catch (error) {
    console.error('Error updating payment status:', error)
    throw error
  }
}

export default {
  createOrder,
  getAllOrders,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  updatePaymentStatus
}

