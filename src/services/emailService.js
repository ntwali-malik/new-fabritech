import API_BASE_URL from './apiConfig'

/**
 * Email Service
 * Handles email notifications
 */

/**
 * Seller/Store email configuration
 * To change the seller email, set REACT_APP_SELLER_EMAIL in your .env file
 * Example: REACT_APP_SELLER_EMAIL=your-email@fabritech.com
 * If not set, defaults to 'info@fabritech.com'
 */
const SELLER_EMAIL = process.env.REACT_APP_SELLER_EMAIL || 'info@fabritech.com'

/**
 * Send order confirmation email to buyer and notification to seller
 * @param {Object} emailData - Email data (to, customerName, orderItems, total, transactionId, deliveryAddress, phone)
 * @returns {Promise<Object>} Email response
 */
export const sendOrderConfirmationEmail = async (emailData) => {
  try {
    const { to, customerName, orderItems, total, transactionId, deliveryAddress, phone } = emailData

    if (!to) {
      throw new Error('Customer email address is required')
    }

    // Send email to both buyer and seller
    const response = await fetch(`${API_BASE_URL}/email/order-confirmation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        buyerEmail: to, // Email to buyer (confirmation)
        sellerEmail: SELLER_EMAIL, // Email to seller (notification)
        customerName,
        orderItems,
        total,
        transactionId,
        deliveryAddress,
        phone
      })
    })

    if (!response.ok) {
      // If email endpoint doesn't exist, log it but don't fail the order
      // This allows the order to complete even if email service is down
      console.warn('Email service unavailable, but order will proceed')
      return { success: false, message: 'Email service unavailable' }
    }

    const result = await response.json()
    return { success: true, ...result }
  } catch (error) {
    // Don't throw error - allow order to complete even if email fails
    console.error('Error sending order confirmation email:', error)
    return { success: false, message: error.message }
  }
}

export default {
  sendOrderConfirmationEmail
}

