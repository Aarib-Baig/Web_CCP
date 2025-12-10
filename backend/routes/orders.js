const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { auth, adminOnly } = require('../middleware/auth');

// POST /api/orders - Place new order
router.post('/', auth, async (req, res) => {
  try {
    const { items, totalAmount, deliveryAddress, paymentMethod } = req.body;

    // Simple validation
    if (!items?.length || !totalAmount || !deliveryAddress || !paymentMethod) {
      return res.status(400).json({ message: 'All order fields are required' });
    }

    const order = await Order.create({
      userId: req.user.userId,
      items,
      totalAmount,
      deliveryAddress,
      paymentMethod,
      orderStatus: 'pending'
    });

    await order.populate('userId', 'name email phone');
    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/orders/my-orders - Get user's orders
router.get('/my-orders', auth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.userId })
      .sort({ createdAt: -1 })
      .populate('items.productId', 'name');
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/orders - Get all orders (Admin only)
router.get('/', [auth, adminOnly], async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate('userId', 'name email phone')
      .populate('items.productId', 'name');
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/orders/:id - Get single order
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('userId', 'name email phone')
      .populate('items.productId', 'name');

    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Check authorization
    if (order.userId._id.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/orders/:id/status - Update order status (Admin only)
router.put('/:id/status', [auth, adminOnly], async (req, res) => {
  try {
    const { orderStatus } = req.body;
    const validStatuses = ['pending', 'confirmed', 'delivered', 'cancelled'];

    if (!validStatuses.includes(orderStatus)) {
      return res.status(400).json({ message: 'Invalid order status' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
