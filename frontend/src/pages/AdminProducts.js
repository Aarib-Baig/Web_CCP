import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminProducts.css';

const CATEGORIES = ['Fruits', 'Vegetables', 'Herbs', 'Dairy', 'Others'];
const UNITS = [{ value: 'kg', label: 'Kilogram (kg)' }, { value: 'piece', label: 'Piece' }, { value: 'dozen', label: 'Dozen' }, { value: 'bunch', label: 'Bunch' }];
const initialForm = { name: '', category: 'Fruits', price: '', unit: 'kg', stockStatus: true, imageUrl: '', description: '' };

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(true);

  const fetchProducts = () => {
    axios.get('/api/products')
      .then(res => { setProducts(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`/api/products/${editingId}`, formData);
        alert('Product updated successfully');
      } else {
        await axios.post('/api/products', formData);
        alert('Product added successfully');
      }
      resetForm();
      fetchProducts();
    } catch {
      alert('Error saving product');
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setFormData({ name: product.name, category: product.category, price: product.price, unit: product.unit, stockStatus: product.stockStatus, imageUrl: product.imageUrl, description: product.description });
    setShowForm(true);
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`/api/products/${productId}`);
        alert('Product deleted successfully');
        fetchProducts();
      } catch {
        alert('Error deleting product');
      }
    }
  };

  const resetForm = () => {
    setFormData(initialForm);
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) return <div className="loading">Loading products...</div>;

  return (
    <div className="admin-products">
      <div className="page-header">
        <h2>Manage Products</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Cancel' : '+ Add New Product'}
        </button>
      </div>

      {showForm && (
        <div className="product-form-container">
          <h3>{editingId ? 'Edit Product' : 'Add New Product'}</h3>
          <form onSubmit={handleSubmit} className="product-form">
            <div className="form-row">
              <div className="form-group">
                <label>Product Name *</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Category *</label>
                <select name="category" value={formData.category} onChange={handleChange} required>
                  {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Price (Rs) *</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} min="0" step="0.01" required />
              </div>
              <div className="form-group">
                <label>Unit *</label>
                <select name="unit" value={formData.unit} onChange={handleChange} required>
                  {UNITS.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Image URL</label>
              <input type="url" name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="https://example.com/image.jpg" />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows="3" />
            </div>
            <div className="form-group checkbox-group">
              <label><input type="checkbox" name="stockStatus" checked={formData.stockStatus} onChange={handleChange} /> In Stock</label>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-primary">{editingId ? 'Update Product' : 'Add Product'}</button>
              <button type="button" onClick={resetForm} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="products-table-container">
        <table className="products-table">
          <thead>
            <tr><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Unit</th><th>Stock</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product._id}>
                <td><img src={product.imageUrl} alt={product.name} className="product-thumb" /></td>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>Rs. {product.price}</td>
                <td>{product.unit}</td>
                <td><span className={product.stockStatus ? 'in-stock' : 'out-of-stock'}>{product.stockStatus ? 'In Stock' : 'Out of Stock'}</span></td>
                <td>
                  <button onClick={() => handleEdit(product)} className="btn-edit">Edit</button>
                  <button onClick={() => handleDelete(product._id)} className="btn-delete">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProducts;