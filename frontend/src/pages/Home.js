import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import './Home.css';

function Home() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const [loading, setLoading] = useState(true);

  const { addToCart } = useContext(CartContext);

  useEffect(function () {
    axios.get('/api/products')
      .then(function (response) {
        setProducts(response.data);
        setLoading(false);
      })
      .catch(function (error) {
        console.error('Error loading products:', error);
        setLoading(false);
      });
  }, []);

  function getCategories() {
    const categories = ['All'];
    for (let i = 0; i < products.length; i++) {
      if (!categories.includes(products[i].category)) {
        categories.push(products[i].category);
      }
    }
    return categories;
  }

  function getFilteredProducts() {
    const filtered = [];
    for (let i = 0; i < products.length; i++) {
      const product = products[i];

      if (selectedCategory !== 'All' && product.category !== selectedCategory) {
        continue;
      }

      if (showInStockOnly && !product.stockStatus) {
        continue;
      }

      filtered.push(product);
    }
    return filtered;
  }

  function handleAddToCart(product) {
    if (!product.stockStatus) {
      alert('This product is out of stock');
      return;
    }
    if(!user){
      alert('Please login to add to cart');
      navigate('/login');
      return
    }
    addToCart(product);
    alert(product.name + ' added to cart!');
  }

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  const categories = getCategories();
  const filteredProducts = getFilteredProducts();

  return (
    <div className="home">
      <div className="hero">
        <h1>Welcome to Fruits and Vegetables Store</h1>
        <p>Fresh produce delivered straight to your doorstep</p>
      </div>

      <div className="filters">
        <div className="filter-group">
          <label>Category:</label>
          <select
            value={selectedCategory}
            onChange={function (e) { setSelectedCategory(e.target.value); }}
          >
            {categories.map(function (category) {
              return <option key={category} value={category}>{category}</option>;
            })}
          </select>
        </div>

        <div className="filter-group">
          <label>
            <input
              type="checkbox"
              checked={showInStockOnly}
              onChange={function (e) { setShowInStockOnly(e.target.checked); }}
            />
            In Stock Only
          </label>
        </div>
      </div>

      <div className="products-grid">
        {filteredProducts.length === 0 ? (
          <p className="no-products">No products found</p>
        ) : (
          filteredProducts.map(function (product) {
            return (
              <div key={product._id} className="product-card">
                <img src={product.imageUrl} alt={product.name} />
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="category">{product.category}</p>
                  <p className="description">{product.description}</p>
                  <div className="product-footer">
                    <div className="price">
                      <span className="amount">Rs. {product.price}</span>
                      <span className="unit">/{product.unit}</span>
                    </div>
                    <button
                      onClick={function () { handleAddToCart(product); }}
                      disabled={!product.stockStatus}
                      className={product.stockStatus ? 'btn-primary' : 'btn-disabled'}
                    >
                      {product.stockStatus ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default Home;