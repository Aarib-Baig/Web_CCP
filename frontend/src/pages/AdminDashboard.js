import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  function fetchOrders() {
    axios.get('/api/orders')
      .then(function (response) {
        setOrders(response.data);
        setLoading(false);
      })
      .catch(function (err) {
        setError('Failed to fetch orders');
        setLoading(false);
      });
  }

  useEffect(function () {
    fetchOrders();
  }, []);

  async function updateOrderStatus(orderId, newStatus) {
    try {
      await axios.put('/api/orders/' + orderId + '/status', {
        orderStatus: newStatus
      });
      alert('Order status updated successfully');
      fetchOrders();
    } catch (err) {
      alert('Failed to update order status');
    }
  }

  function getStats() {
    let totalOrders = orders.length;
    let pendingOrders = 0;
    let totalRevenue = 0;

    for (let i = 0; i < orders.length; i++) {
      if (orders[i].orderStatus === 'pending') {
        pendingOrders++;
      }
      if (orders[i].orderStatus !== 'cancelled') {
        totalRevenue = totalRevenue + orders[i].totalAmount;
      }
    }

    return {
      total: totalOrders,
      pending: pendingOrders,
      revenue: totalRevenue
    };
  }

  function getStatusClass(status) {
    if (status === 'pending') return 'status-pending';
    if (status === 'confirmed') return 'status-confirmed';
    if (status === 'delivered') return 'status-delivered';
    if (status === 'cancelled') return 'status-cancelled';
    return '';
  }

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  const stats = getStats();

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Orders</h3>
          <p className="stat-number">{stats.total}</p>
        </div>
        <div className="stat-card">
          <h3>Pending Orders</h3>
          <p className="stat-number">{stats.pending}</p>
        </div>
        <div className="stat-card">
          <h3>Total Revenue</h3>
          <p className="stat-number">Rs. {stats.revenue.toFixed(2)}</p>
        </div>
      </div>

      <h3>Recent Orders</h3>
      <div className="orders-table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(function (order) {
              return (
                <tr key={order._id}>
                  <td>{order._id.substring(0, 8)}</td>
                  <td>
                    <div>{order.userId?.name}</div>
                    <small>{order.userId?.phone}</small>
                  </td>
                  <td>{order.items.length} items</td>
                  <td>Rs. {order.totalAmount.toFixed(2)}</td>
                  <td>
                    <span className={'order-status ' + getStatusClass(order.orderStatus)}>
                      {order.orderStatus}
                    </span>
                  </td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>
                    <select
                      value={order.orderStatus}
                      onChange={function (e) { updateOrderStatus(order._id, e.target.value); }}
                      className="status-select"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
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

export default AdminDashboard;