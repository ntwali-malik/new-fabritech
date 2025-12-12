import API_BASE_URL from './apiConfig';

/**
 * User Service
 * Handles all API calls related to user authentication and management
 */

/**
 * Register a new user
 * @param {Object} userData - User registration data (name, email, password, phone, address)
 * @returns {Promise<Object>} Registration response with user data
 */
export const registerUser = async (userData) => {
  try {
    const { name, email, password, phone, address } = userData;

    // Validate required fields
    if (!name || !email || !password) {
      throw new Error('Name, email, and password are required');
    }

    // Build request body matching User model schema
    // Only include fields that exist in the model: name, email, password, phone, address
    // role defaults to 'user' on backend, id is auto-generated
    const requestBody = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: password
    };

    // Only include optional fields if they have values
    if (phone && phone.trim()) {
      requestBody.phone = phone.trim();
    }
    if (address && address.trim()) {
      requestBody.address = address.trim();
    }

    const response = await fetch(`${API_BASE_URL}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to register user');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

/**
 * Login user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} Login response with user data
 */
export const loginUser = async (email, password) => {
  try {
    // Validate required fields
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Invalid email or password');
    }

    const result = await response.json();
    
    // Token is optional - not using JWT authentication
    // If backend provides a token (for future JWT support), include it
    // Otherwise, just return the user object
    const authHeader = response.headers.get('Authorization');
    const tokenFromHeader = authHeader ? authHeader.replace('Bearer ', '') : null;
    
    // Include token if found, but don't require it
    if (tokenFromHeader && !result.token) {
      result.token = tokenFromHeader;
    }
    
    return result;
  } catch (error) {
    console.error('Error logging in user:', error);
    throw error;
  }
};

/**
 * Create a new user (Admin only)
 * @param {Object} userData - User data to create
 * @returns {Promise<Object>} Created user
 */
export const createUser = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create user');
    }

    const user = await response.json();
    return user;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

/**
 * Get all users
 * @returns {Promise<Array>} Array of users (passwords excluded)
 */
export const getAllUsers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch users');
    }

    const users = await response.json();
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

/**
 * Get a single user by ID
 * @param {string|number} userId - User ID
 * @returns {Promise<Object>} User object (password excluded)
 */
export const getUserById = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('User not found');
      }
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch user');
    }

    const user = await response.json();
    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

/**
 * Update a user
 * @param {string|number} userId - User ID
 * @param {Object} userData - Updated user data
 * @returns {Promise<Object>} Updated user (password excluded)
 */
export const updateUser = async (userId, userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('User not found');
      }
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update user');
    }

    const user = await response.json();
    return user;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

/**
 * Delete a user
 * @param {string|number} userId - User ID
 * @returns {Promise<Object>} Deletion confirmation with user data (password excluded)
 */
export const deleteUser = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('User not found');
      }
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete user');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

// Export all functions as default object for convenience
export default {
  registerUser,
  loginUser,
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};

