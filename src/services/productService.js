import API_BASE_URL from './apiConfig';

/**
 * Product Service
 * Handles all API calls related to products
 */

/**
 * Create a new product
 * @param {Object} productData - Product data to create
 * @returns {Promise<Object>} Created product
 */
export const createProduct = async (productData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create product');
    }

    const product = await response.json();
    return product;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

/**
 * Get all products
 * @returns {Promise<Array>} Array of products
 */
export const getAllProducts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch products');
    }

    const products = await response.json();
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

/**
 * Get a single product by ID
 * @param {string|number} productId - Product ID
 * @returns {Promise<Object>} Product object
 */
export const getProductById = async (productId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Product not found');
      }
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch product');
    }

    const product = await response.json();
    return product;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

/**
 * Update a product
 * @param {string|number} productId - Product ID
 * @param {Object} productData - Updated product data
 * @returns {Promise<Object>} Updated product
 */
export const updateProduct = async (productId, productData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Product not found');
      }
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update product');
    }

    const product = await response.json();
    return product;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

/**
 * Delete a product
 * @param {string|number} productId - Product ID
 * @returns {Promise<Object>} Deletion confirmation
 */
export const deleteProduct = async (productId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Product not found');
      }
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete product');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// Export all functions as default object for convenience
export default {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};

