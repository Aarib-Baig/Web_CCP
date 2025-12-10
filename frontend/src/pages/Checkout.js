import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import './Checkout.css';

function Checkout() {
  const { cart, getCartTotal, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [street, setStreet] = useState('');
  const [area, setArea] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const orderItems = [];
    for (let i = 0; i < cart.length; i++) {
      orderItems.push({
        productId: cart[i]._id,
        name: cart[i].name,
        price: cart[i].price,
        quantity: cart[i].quantity
      });
    }

    const orderData = {
      items: orderItems,
      totalAmount: getCartTotal(),
      deliveryAddress: {
        street: street,
        area: area,
        city: city,
        postalCode: postalCode
      },
      paymentMethod: paymentMethod
    };

    try {
      const response = await axios.post('/api/orders', orderData);
      alert('Order placed successfully! Order ID: ' + response.data._id);
      clearCart();
      navigate('/orders');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
      setLoading(false);
    }
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
                  value={street}
                  onChange={function (e) { setStreet(e.target.value); }}
                  required
                  placeholder="Enter street address"
                />
              </div>

              <div className="form-group">
                <label>Area/Neighborhood *</label>
                <input
                  type="text"
                  value={area}
                  onChange={function (e) { setArea(e.target.value); }}
                  required
                  placeholder="Enter area"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>City *</label>
                  <input
                    type="text"
                    value={city}
                    onChange={function (e) { setCity(e.target.value); }}
                    required
                    placeholder="Enter city"
                  />
                </div>
                <div className="form-group">
                  <label>Postal Code *</label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={function (e) { setPostalCode(e.target.value); }}
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
                    onChange={function (e) { setPaymentMethod(e.target.value); }}
                  />
                  <span>Cash on Delivery</span>
                </label>
                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Online Payment"
                    checked={paymentMethod === 'Online Payment'}
                    onChange={function (e) { setPaymentMethod(e.target.value); }}
                  />
                  <span>Online Payment (Test)</span>
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
            {cart.map(function (item) {
              return (
                <div key={item._id} className="summary-item">
                  <span>{item.name} x {item.quantity}</span>
                  <span>Rs. {(item.price * item.quantity).toFixed(2)}</span>
                </div>
              );
            })}
          </div>
          <div className="summary-total">
            <span>Total Amount:</span>
            <span>Rs. {getCartTotal().toFixed(2)}</span>
          </div>
          <div className="customer-info">
            <h4>Delivering to:</h4>
            <p>{user.name}</p>
            <p>{user.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;