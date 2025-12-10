const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Order = require('../models/Order');
const { auth, adminOnly } = require('../middleware/auth');

// @route   POST /api/orders
// @desc    Place new order
// @access  Private
router.post('/', [auth], [
  body('items').isArray({ min: 1 }).withMessage('Order must have at least one item'),
  body('totalAmount').isNumeric().withMessage('Total amount is required'),
  body('deliveryAddress.street').notEmpty().withMessage('Street is required'),
  body('deliveryAddress.area').notEmpty().withMessage('Area is required'),
  body('deliveryAddress.city').notEmpty().withMessage('City is required'),
  body('deliveryAddress.postalCode').notEmpty().withMessage('Postal code is required'),
  body('paymentMethod').notEmpty().withMessage('Payment method is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { items, totalAmount, deliveryAddress, paymentMethod } = req.body;

    const order = new Order({
      userId: req.user.userId,
      items,
      totalAmount,
      deliveryAddress,
      paymentMethod,
      orderStatus: 'pending'
    });

    await order.save();
    
    // Populate product details
    await order.populate('userId', 'name email phone');
    
    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/orders/my-orders
// @desc    Get user's orders
// @access  Private
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

// @route   GET /api/orders
// @desc    Get all orders (Admin)
// @access  Admin only
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

// @route   GET /api/orders/:id
// @desc    Get single order
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('userId', 'name email phone')
      .populate('items.productId', 'name');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user is authorized to view this order
    if (order.userId._id.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status
// @access  Admin only
router.put('/:id/status', [auth, adminOnly], async (req, res) => {
  try {
    const { orderStatus } = req.body;

    if (!['pending', 'confirmed', 'delivered', 'cancelled'].includes(orderStatus)) {
      return res.status(400).json({ message: 'Invalid order status' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.orderStatus = orderStatus;
    await order.save();

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
