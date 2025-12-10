import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import './Home.css';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [selectedCategory, showInStockOnly, products]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('/api/products');
      setProducts(res.data);
      
      // Extract unique categories
      const cats = ['All', ...new Set(res.data.map(p => p.category))];
      setCategories(cats);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    if (showInStockOnly) {
      filtered = filtered.filter(p => p.stockStatus);
    }

    setFilteredProducts(filtered);
  };

  const handleAddToCart = (product) => {
    if (!product.stockStatus) {
      alert('This product is out of stock');
      return;
    }
    addToCart(product);
    alert(`${product.name} added to cart!`);
  };

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  return (
    <div className="home">
      <div className="hero">
        <h1>Welcome to Fruit mStore</h1>
        <p>Fresh produce delivered to your doorstep</p>
      </div>

      <div className="filters">
        <div className="filter-group">
          <label>Category:</label>
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>
            <input
              type="checkbox"
              checked={showInStockOnly}
              onChange={(e) => setShowInStockOnly(e.target.checked)}
            />
            In Stock Only
          </label>
        </div>
      </div>

      <div className="products-grid">
        {filteredProducts.length === 0 ? (
          <p className="no-products">No products found</p>
        ) : (
          filteredProducts.map(product => (
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
                    onClick={() => handleAddToCart(product)}
                    disabled={!product.stockStatus}
                    className={product.stockStatus ? 'btn-primary' : 'btn-disabled'}
                  >
                    {product.stockStatus ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;