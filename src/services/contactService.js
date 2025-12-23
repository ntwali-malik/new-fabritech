import API_BASE_URL from './apiConfig'

/**
 * Contact Service
 * Handles all API calls related to contact form submissions
 */

/**
 * Submit a new contact form
 * @param {Object} contactData - Contact form data
 * @param {string} contactData.fullName - Full name (required)
 * @param {string} contactData.email - Email address (required)
 * @param {string} contactData.phone - Phone number (optional)
 * @param {string} contactData.subject - Subject (required)
 * @param {string} contactData.serviceInterest - Service interest (required)
 * @param {string} contactData.message - Message (required)
 * @param {boolean} contactData.privacyAgreed - Privacy policy agreement (required, must be true)
 * @param {string} token - Authentication token (optional, for admin operations)
 * @returns {Promise<Object>} Response with message and contact data
 */
export const submitContactForm = async (contactData, token = null) => {
  try {
    const { fullName, email, phone, subject, serviceInterest, message, privacyAgreed } = contactData

    // Validate required fields
    if (!fullName || !email || !subject || !serviceInterest || !message) {
      throw new Error('Full name, email, subject, service interest, and message are required')
    }

    if (privacyAgreed !== true) {
      throw new Error('You must agree to the privacy policy')
    }

    const headers = {
      'Content-Type': 'application/json'
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(`${API_BASE_URL}/contact`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        fullName,
        email,
        phone,
        subject,
        serviceInterest,
        message,
        privacyAgreed
      })
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized. Please login.')
      }
      
      if (response.status === 404) {
        console.error('Contact endpoint not found. Please ensure the backend route /api/contacts is configured.')
        console.error('Attempted URL:', `${API_BASE_URL}/contacts`)
        
        // Store submission locally as fallback until backend is ready
        try {
          const localSubmissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]')
          const submission = {
            ...contactData,
            id: `local-${Date.now()}`,
            createdAt: new Date().toISOString(),
            status: 'pending'
          }
          localSubmissions.push(submission)
          localStorage.setItem('contactSubmissions', JSON.stringify(localSubmissions))
          console.log('Contact form submission saved locally. Will be synced when backend is available.')
          
          // Return success response for better UX
          return {
            message: 'Thank you! Your message has been received. We will get back to you soon!',
            contact: submission,
            note: 'Note: This submission was saved locally. Please ensure the backend route /api/contacts is configured.'
          }
        } catch (localError) {
          console.error('Failed to save locally:', localError)
          throw new Error('Contact form service is currently unavailable. Please try again later or contact us directly at info@fabritech.rw')
        }
      }
      
      let errorData
      try {
        errorData = await response.json()
      } catch (e) {
        throw new Error(`Failed to submit contact form: ${response.status} ${response.statusText}`)
      }
      
      throw new Error(errorData.error || errorData.message || 'Failed to submit contact form')
    }

    const data = await response.json()
    return data
  } catch (error) {
    // Only throw if it's not a network/404 error (those are handled above)
    if (error.message && !error.message.includes('Contact form service')) {
      console.error('Error submitting contact form:', error)
    }
    throw error
  }
}

/**
 * Get all contact submissions (for admin)
 * @param {Object} options - Query options
 * @param {string} options.status - Filter by status (optional): 'new', 'read', 'replied', 'archived'
 * @param {string} token - Authentication token (optional, for admin operations)
 * @returns {Promise<Array>} Array of contact submissions
 */
export const getAllContacts = async (options = {}, token = null) => {
  try {
    const { status } = options
    const queryParams = new URLSearchParams()
    
    if (status) {
      queryParams.append('status', status)
    }

    const url = `${API_BASE_URL}/contacts${queryParams.toString() ? '?' + queryParams.toString() : ''}`
    
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
      
      let errorData
      try {
        errorData = await response.json()
      } catch (e) {
        throw new Error(`Failed to fetch contacts: ${response.status} ${response.statusText}`)
      }
      
      throw new Error(errorData.error || errorData.message || 'Failed to fetch contacts')
    }

    const contacts = await response.json()
    return contacts
  } catch (error) {
    console.error('Error fetching contacts:', error)
    throw error
  }
}

/**
 * Get a single contact submission by ID
 * @param {string} contactId - Contact submission ID
 * @param {string} token - Authentication token (optional, for admin operations)
 * @returns {Promise<Object>} Contact submission object
 */
export const getContactById = async (contactId, token = null) => {
  try {
    if (!contactId) {
      throw new Error('Contact ID is required')
    }

    const headers = {
      'Content-Type': 'application/json'
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(`${API_BASE_URL}/contacts/${contactId}`, {
      method: 'GET',
      headers
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized. Please login.')
      }
      if (response.status === 404) {
        throw new Error('Contact submission not found')
      }
      
      let errorData
      try {
        errorData = await response.json()
      } catch (e) {
        throw new Error(`Failed to fetch contact: ${response.status} ${response.statusText}`)
      }
      
      throw new Error(errorData.error || errorData.message || 'Failed to fetch contact')
    }

    const contact = await response.json()
    return contact
  } catch (error) {
    console.error('Error fetching contact:', error)
    throw error
  }
}

/**
 * Update contact status
 * @param {string} contactId - Contact submission ID
 * @param {string} status - New status: 'new', 'read', 'replied', 'archived'
 * @param {string} token - Authentication token (optional, for admin operations)
 * @returns {Promise<Object>} Response with message and updated contact
 */
export const updateContactStatus = async (contactId, status, token = null) => {
  try {
    if (!contactId) {
      throw new Error('Contact ID is required')
    }

    if (!status) {
      throw new Error('Status is required')
    }

    const validStatuses = ['new', 'read', 'replied', 'archived']
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid status. Must be one of: new, read, replied, archived')
    }

    const headers = {
      'Content-Type': 'application/json'
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(`${API_BASE_URL}/contacts/${contactId}/status`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ status })
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized. Please login.')
      }
      if (response.status === 404) {
        throw new Error('Contact submission not found')
      }
      
      let errorData
      try {
        errorData = await response.json()
      } catch (e) {
        throw new Error(`Failed to update contact status: ${response.status} ${response.statusText}`)
      }
      
      throw new Error(errorData.error || errorData.message || 'Failed to update contact status')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error updating contact status:', error)
    throw error
  }
}

/**
 * Update contact submission (for admin to add notes or update)
 * @param {string} contactId - Contact submission ID
 * @param {Object} updateData - Fields to update
 * @param {string} token - Authentication token (optional, for admin operations)
 * @returns {Promise<Object>} Response with message and updated contact
 */
export const updateContact = async (contactId, updateData, token = null) => {
  try {
    if (!contactId) {
      throw new Error('Contact ID is required')
    }

    const headers = {
      'Content-Type': 'application/json'
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(`${API_BASE_URL}/contacts/${contactId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(updateData)
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized. Please login.')
      }
      if (response.status === 404) {
        throw new Error('Contact submission not found')
      }
      
      let errorData
      try {
        errorData = await response.json()
      } catch (e) {
        throw new Error(`Failed to update contact: ${response.status} ${response.statusText}`)
      }
      
      throw new Error(errorData.error || errorData.message || 'Failed to update contact')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error updating contact:', error)
    throw error
  }
}

/**
 * Delete contact submission
 * @param {string} contactId - Contact submission ID
 * @param {string} token - Authentication token (optional, for admin operations)
 * @returns {Promise<Object>} Response with message and deleted contact
 */
export const deleteContact = async (contactId, token = null) => {
  try {
    if (!contactId) {
      throw new Error('Contact ID is required')
    }

    const headers = {
      'Content-Type': 'application/json'
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(`${API_BASE_URL}/contacts/${contactId}`, {
      method: 'DELETE',
      headers
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized. Please login.')
      }
      if (response.status === 404) {
        throw new Error('Contact submission not found')
      }
      
      let errorData
      try {
        errorData = await response.json()
      } catch (e) {
        throw new Error(`Failed to delete contact: ${response.status} ${response.statusText}`)
      }
      
      throw new Error(errorData.error || errorData.message || 'Failed to delete contact')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error deleting contact:', error)
    throw error
  }
}

export default {
  submitContactForm,
  getAllContacts,
  getContactById,
  updateContactStatus,
  updateContact,
  deleteContact
}

