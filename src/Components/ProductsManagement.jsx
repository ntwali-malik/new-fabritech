import React, { useState, useEffect } from 'react';
import { getAllProducts, createProduct, updateProduct, deleteProduct } from '../services/productService';
import './ProductsManagement.css';

function ProductsManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priceNew: '',
    priceOld: '',
    image: '',
    badge: '',
    category: '',
    rating: '0',
    sold: '0+',
    stock: '0',
    lowStockThreshold: '10'
  });

  // Calculate discount based on priceOld and priceNew
  const calculateDiscount = (priceOld, priceNew) => {
    if (!priceOld || !priceNew || parseFloat(priceOld) <= 0 || parseFloat(priceNew) <= 0) {
      return null;
    }
    const oldPrice = parseFloat(priceOld);
    const newPrice = parseFloat(priceNew);
    if (newPrice >= oldPrice) {
      return null; // No discount if new price is higher or equal
    }
    const discountPercent = ((oldPrice - newPrice) / oldPrice) * 100;
    return Math.round(discountPercent * 100) / 100; // Round to 2 decimal places
  };

  // Load products on component mount
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getAllProducts();
      setProducts(data);
    } catch (err) {
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const priceNew = parseFloat(formData.priceNew) || 0;
      const priceOld = formData.priceOld ? parseFloat(formData.priceOld) : null;
      
      // Calculate discount automatically
      const calculatedDiscount = calculateDiscount(priceOld, priceNew);

      // Convert string values to numbers where needed
      const productData = {
        title: formData.title,
        description: formData.description,
        priceNew: priceNew,
        priceOld: priceOld || undefined,
        discount: calculatedDiscount || undefined,
        image: formData.image,
        badge: formData.badge || undefined,
        category: formData.category,
        rating: parseFloat(formData.rating) || 0,
        sold: formData.sold || '0+',
        stock: parseInt(formData.stock) || 0,
        lowStockThreshold: parseInt(formData.lowStockThreshold) || 10
      };

      // Remove undefined values
      Object.keys(productData).forEach(key => {
        if (productData[key] === undefined) {
          delete productData[key];
        }
      });

      const productId = editingProduct?.id || editingProduct?._id;
      
      if (editingProduct && productId) {
        // Update existing product
        await updateProduct(productId, productData);
        setSuccess('Product updated successfully!');
      } else {
        // Create new product
        await createProduct(productData);
        setSuccess('Product created successfully!');
      }

      // Reset form and reload products
      resetForm();
      loadProducts();
      
      // Close modal after a short delay
      setTimeout(() => {
        setShowModal(false);
      }, 1000);
    } catch (err) {
      setError(err.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title || '',
      description: product.description || '',
      priceNew: product.priceNew?.toString() || '0',
      priceOld: product.priceOld?.toString() || '',
      image: product.image || '',
      badge: product.badge || '',
      category: product.category || '',
      rating: product.rating?.toString() || '0',
      sold: product.sold || '0+',
      stock: product.stock?.toString() || '0',
      lowStockThreshold: product.lowStockThreshold?.toString() || '10'
    });
    setShowModal(true);
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    setLoading(true);
    setError('');
    try {
      await deleteProduct(productId);
      setSuccess('Product deleted successfully!');
      loadProducts();
    } catch (err) {
      setError(err.message || 'Failed to delete product');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      priceNew: '',
      priceOld: '',
      image: '',
      badge: '',
      category: '',
      rating: '0',
      sold: '0+',
      stock: '0',
      lowStockThreshold: '10'
    });
    setEditingProduct(null);
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  return (
    <div className="products-management">
      <div className="products-header">
        <h2>Products Management</h2>
        <button className="btn-primary" onClick={openCreateModal}>
          <i className="fas fa-plus"></i> Add New Product
        </button>
      </div>

      {/* Messages */}
      {error && (
        <div className="alert alert-error">
          <i className="fas fa-exclamation-circle"></i> {error}
        </div>
      )}
      {success && (
        <div className="alert alert-success">
          <i className="fas fa-check-circle"></i> {success}
        </div>
      )}

      {/* Products Table */}
      {loading && !products.length ? (
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i> Loading products...
        </div>
      ) : (
        <div className="products-table-container">
          <table className="products-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan="7" className="no-products">
                    No products found. Click "Add New Product" to create one.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id || product._id}>
                    <td>
                      <img 
                        src={product.image || '/placeholder-image.png'} 
                        alt={product.title || product.name}
                        className="product-thumbnail"
                        onError={(e) => {
                          e.target.src = '/placeholder-image.png';
                        }}
                      />
                    </td>
                    <td>
                      <div className="product-title">{product.title}</div>
                      {product.badge && (
                        <span className="badge badge-product">{product.badge}</span>
                      )}
                    </td>
                    <td>
                      <span className="badge badge-category">{product.badge || product.category || 'N/A'}</span>
                    </td>
                    <td>
                      <div className="product-price">RWF {product.priceNew?.toLocaleString() || '0'}</div>
                      {product.priceOld && (
                        <div className="product-price-old">RWF {product.priceOld.toLocaleString()}</div>
                      )}
                      {product.discount && (
                        <div className="product-discount">-{product.discount}%</div>
                      )}
                    </td>
                    <td>
                      <span className={`stock-badge ${(product.stock || 0) > 0 ? 'in-stock' : 'out-of-stock'}`}>
                        {product.stock || 0} units
                      </span>
                      {(product.stock || 0) <= (product.lowStockThreshold || 10) && (product.stock || 0) > 0 && (
                        <div className="low-stock-warning">Low stock</div>
                      )}
                    </td>
                    <td>
                      <span className="status-badge active">
                        {(product.stock || 0) > 0 ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="btn-edit" 
                          onClick={() => handleEdit(product)}
                          title="Edit"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button 
                          className="btn-delete" 
                          onClick={() => handleDelete(product.id || product._id || product._id)}
                          title="Delete"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingProduct ? 'Edit Product' : 'Create New Product'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="product-form">
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  placeholder="Product title"
                />
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows="3"
                  placeholder="Product description"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Price New (RWF) *</label>
                  <input
                    type="number"
                    name="priceNew"
                    value={formData.priceNew}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    placeholder="600000"
                  />
                </div>
                <div className="form-group">
                  <label>Price Old (RWF)</label>
                  <input
                    type="number"
                    name="priceOld"
                    value={formData.priceOld}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    placeholder="750000"
                  />
                </div>
              </div>

              {/* Calculated Discount Display */}
              {(() => {
                const calculatedDiscount = calculateDiscount(formData.priceOld, formData.priceNew);
                return calculatedDiscount !== null ? (
                  <div className="calculated-discount-display">
                    <i className="fas fa-percent"></i>
                    <span>Calculated Discount: <strong>{calculatedDiscount}%</strong></span>
                  </div>
                ) : null;
              })()}

              <div className="form-row">
                <div className="form-group">
                  <label>Category *</label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    placeholder="Category name"
                  />
                </div>
                <div className="form-group">
                  <label>Badge</label>
                  <select name="badge" value={formData.badge} onChange={handleInputChange}>
                    <option value="">None</option>
                    <option value="New">New</option>
                    <option value="Featured">Featured</option>
                    <option value="Sale">Sale</option>
                    <option value="Portable">Portable</option>
                    <option value="WiFi">WiFi</option>
                    <option value="Security">Security</option>
                    <option value="Outdoor">Outdoor</option>
                    <option value="NVR">NVR</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Image URL *</label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  required
                  placeholder="assets/img/product/image.jpg"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Stock *</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    required
                    min="0"
                    placeholder="0"
                  />
                </div>
                <div className="form-group">
                  <label>Low Stock Threshold</label>
                  <input
                    type="number"
                    name="lowStockThreshold"
                    value={formData.lowStockThreshold}
                    onChange={handleInputChange}
                    min="0"
                    placeholder="10"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Rating</label>
                  <input
                    type="number"
                    name="rating"
                    value={formData.rating}
                    onChange={handleInputChange}
                    min="0"
                    max="5"
                    step="0.1"
                    placeholder="4.9"
                  />
                </div>
                <div className="form-group">
                  <label>Sold</label>
                  <input
                    type="text"
                    name="sold"
                    value={formData.sold}
                    onChange={handleInputChange}
                    placeholder="500+"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit" disabled={loading}>
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i> Saving...
                    </>
                  ) : (
                    editingProduct ? 'Update Product' : 'Create Product'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductsManagement;

