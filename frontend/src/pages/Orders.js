import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('/api/orders/my-orders');
      setOrders(res.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch orders');
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    const classes = {
      pending: 'status-pending',
      confirmed: 'status-confirmed',
      delivered: 'status-delivered',
      cancelled: 'status-cancelled'
    };
    return classes[status] || '';
  };

  if (loading) {
    return <div className="loading">Loading orders...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="orders-empty">
        <h2>No orders yet</h2>
        <p>Your order history will appear here</p>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <h2>My Orders</h2>
      
      <div className="orders-list">
        {orders.map(order => (
          <div key={order._id} className="order-card">
            <div className="order-header">
              <div>
                <h3>Order #{order._id.substring(0, 8)}</h3>
                <p className="order-date">
                  {new Date(order.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <span className={`order-status ${getStatusClass(order.orderStatus)}`}>
                {order.orderStatus.toUpperCase()}
              </span>
            </div>

            <div className="order-items">
              <h4>Items:</h4>
              {order.items.map((item, index) => (
                <div key={index} className="order-item">
                  <span>{item.name} x {item.quantity}</span>
                  <span>Rs. {(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="order-details">
              <div className="detail-section">
                <h4>Delivery Address:</h4>
                <p>{order.deliveryAddress.street}</p>
                <p>{order.deliveryAddress.area}, {order.deliveryAddress.city}</p>
                <p>Postal Code: {order.deliveryAddress.postalCode}</p>
              </div>

              <div className="detail-section">
                <h4>Payment Method:</h4>
                <p>{order.paymentMethod}</p>
              </div>
            </div>

            <div className="order-total">
              <span>Total Amount:</span>
              <span className="total-amount">Rs. {order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;