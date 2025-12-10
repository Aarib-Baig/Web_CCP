import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import './Checkout.css';

const Checkout = () => {
  const { cart, getCartTotal, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    street: '',
    area: '',
    city: '',
    postalCode: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAddressChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate address
    if (!address.street || !address.area || !address.city || !address.postalCode) {
      setError('Please fill in all address fields');
      setLoading(false);
      return;
    }

    // Prepare order data
    const orderData = {
      items: cart.map(item => ({
        productId: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })),
      totalAmount: getCartTotal(),
      deliveryAddress: address,
      paymentMethod
    };

    try {
      const res = await axios.post('/api/orders', orderData);
      alert(`Order placed successfully! Order ID: ${res.data._id}`);
      clearCart();
      navigate('/orders');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>

      <div className="checkout-content">
        <div className="checkout-form">
          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <h3>Delivery Address</h3>
              
              <div className="form-group">
                <label>Street Address *</label>
                <input
                  type="text"
                  name="street"
                  value={address.street}
                  onChange={handleAddressChange}
                  required
                  placeholder="Enter street address"
                />
              </div>

              <div className="form-group">
                <label>Area/Neighborhood *</label>
                <input
                  type="text"
                  name="area"
                  value={address.area}
                  onChange={handleAddressChange}
                  required
                  placeholder="Enter area"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>City *</label>
                  <input
                    type="text"
                    name="city"
                    value={address.city}
                    onChange={handleAddressChange}
                    required
                    placeholder="Enter city"
                  />
                </div>

                <div className="form-group">
                  <label>Postal Code *</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={address.postalCode}
                    onChange={handleAddressChange}
                    required
                    placeholder="Enter postal code"
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Payment Method</h3>
              
              <div className="payment-options">
                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Cash on Delivery"
                    checked={paymentMethod === 'Cash on Delivery'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>Cash on Delivery</span>
                </label>

                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Online Payment"
                    checked={paymentMethod === 'Online Payment'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>Online Payment (Mock)</span>
                </label>
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </form>
        </div>

        <div className="order-summary">
          <h3>Order Summary</h3>
          
          <div className="summary-items">
            {cart.map(item => (
              <div key={item._id} className="summary-item">
                <span>{item.name} x {item.quantity}</span>
                <span>Rs. {(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="summary-total">
            <span>Total Amount:</span>
            <span>Rs. {getCartTotal().toFixed(2)}</span>
          </div>

          <div className="customer-info">
            <h4>Delivering to:</h4>
            <p>{user.name}</p>
            <p>{user.email}</p>
            <p>{user.phone}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;