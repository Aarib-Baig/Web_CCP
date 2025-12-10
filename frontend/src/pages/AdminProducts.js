import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminProducts.css';

const CATEGORIES = ['Fruits', 'Vegetables'];
const UNITS = [
  { value: 'kg', label: 'Kilogram (kg)' },
  { value: 'bunch', label: 'Bunch' }
];

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [name, setName] = useState('');
  const [category, setCategory] = useState('Fruits');
  const [price, setPrice] = useState('');
  const [unit, setUnit] = useState('kg');
  const [stockStatus, setStockStatus] = useState(true);
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');

  function fetchProducts() {
    axios.get('/api/products')
      .then(function (response) {
        setProducts(response.data);
        setLoading(false);
      })
      .catch(function (err) {
        console.error('Error fetching products:', err);
        setLoading(false);
      });
  }

  useEffect(function () {
    fetchProducts();
  }, []);

  function resetForm() {
    setName('');
    setCategory('Fruits');
    setPrice('');
    setUnit('kg');
    setStockStatus(true);
    setImageUrl('');
    setDescription('');
    setEditingId(null);
    setShowForm(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const productData = {
      name: name,
      category: category,
      price: parseFloat(price),
      unit: unit,
      stockStatus: stockStatus,
      imageUrl: imageUrl || 'https://via.placeholder.com/300x300?text=Product',
      description: description
    };

    try {
      if (editingId) {
        await axios.put('/api/products/' + editingId, productData);
        alert('Product updated successfully');
      } else {
        await axios.post('/api/products', productData);
        alert('Product added successfully');
      }
      resetForm();
      fetchProducts();
    } catch (err) {
      alert('Error saving product');
    }
  }

  function handleEdit(product) {
    setEditingId(product._id);
    setName(product.name);
    setCategory(product.category);
    setPrice(product.price.toString());
    setUnit(product.unit);
    setStockStatus(product.stockStatus);
    setImageUrl(product.imageUrl || '');
    setDescription(product.description || '');
    setShowForm(true);
  }

  async function handleDelete(productId) {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete('/api/products/' + productId);
        alert('Product deleted successfully');
        fetchProducts();
      } catch (err) {
        alert('Error deleting product');
      }
    }
  }

  function toggleForm() {
    if (showForm) {
      resetForm();
    } else {
      setShowForm(true);
    }
  }

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  return (
    <div className="admin-products">
      <div className="page-header">
        <h2>Manage Products</h2>
        <button onClick={toggleForm} className="btn-primary">
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
                <input
                  type="text"
                  value={name}
                  onChange={function (e) { setName(e.target.value); }}
                  required
                />
              </div>
              <div className="form-group">
                <label>Category *</label>
                <select
                  value={category}
                  onChange={function (e) { setCategory(e.target.value); }}
                  required
                >
                  {CATEGORIES.map(function (cat) {
                    return <option key={cat} value={cat}>{cat}</option>;
                  })}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Price (Rs) *</label>
                <input
                  type="number"
                  value={price}
                  onChange={function (e) { setPrice(e.target.value); }}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div className="form-group">
                <label>Unit *</label>
                <select
                  value={unit}
                  onChange={function (e) { setUnit(e.target.value); }}
                  required
                >
                  {UNITS.map(function (u) {
                    return <option key={u.value} value={u.value}>{u.label}</option>;
                  })}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Image URL</label>
              <input
                type="url"
                value={imageUrl}
                onChange={function (e) { setImageUrl(e.target.value); }}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={description}
                onChange={function (e) { setDescription(e.target.value); }}
                rows="3"
              />
            </div>

            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={stockStatus}
                  onChange={function (e) { setStockStatus(e.target.checked); }}
                />
                In Stock
              </label>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                {editingId ? 'Update Product' : 'Add Product'}
              </button>
              <button type="button" onClick={resetForm} className="btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="products-table-container">
        <table className="products-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Unit</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(function (product) {
              return (
                <tr key={product._id}>
                  <td>
                    <img src={product.imageUrl} alt={product.name} className="product-thumb" />
                  </td>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>Rs. {product.price}</td>
                  <td>{product.unit}</td>
                  <td>
                    <span className={product.stockStatus ? 'in-stock' : 'out-of-stock'}>
                      {product.stockStatus ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td>
                    <button onClick={function () { handleEdit(product); }} className="btn-edit">
                      Edit
                    </button>
                    <button onClick={function () { handleDelete(product._id); }} className="btn-delete">
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminProducts;