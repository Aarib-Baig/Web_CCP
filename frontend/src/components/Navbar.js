import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import './Navbar.css';

function Navbar() {
  const { user, logout, isAdmin } = useContext(AuthContext);
  const { getCartCount } = useContext(CartContext);
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          🍎 Fruit mStore
        </Link>

        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-link">Home</Link>
          </li>

          {user ? (
            <>
              <li className="nav-item">
                <Link to="/orders" className="nav-link">My Orders</Link>
              </li>

              {isAdmin() && (
                <>
                  <li className="nav-item">
                    <Link to="/admin/dashboard" className="nav-link">Dashboard</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/admin/products" className="nav-link">Manage Products</Link>
                  </li>
                </>
              )}

              <li className="nav-item">
                <span className="nav-link user-name">Hi, {user.name}</span>
              </li>

              <li className="nav-item">
                <button onClick={handleLogout} className="nav-link logout-btn">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-link">Login</Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-link">Register</Link>
              </li>
            </>
          )}

          <li className="nav-item">
            <Link to="/cart" className="nav-link cart-link">
              🛒 Cart ({getCartCount()})
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;