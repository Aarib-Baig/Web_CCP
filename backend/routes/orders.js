const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { auth, adminOnly } = require('../middleware/auth');

router.post('/', auth, async function (req, res) {
  try {
    const { items, totalAmount, deliveryAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Order items are required' });
    }
    if (!totalAmount || !deliveryAddress || !paymentMethod) {
      return res.status(400).json({ message: 'All order fields are required' });
    }

    const order = await Order.create({
      userId: req.user.userId,
      items: items,
      totalAmount: totalAmount,
      deliveryAddress: deliveryAddress,
      paymentMethod: paymentMethod,
      orderStatus: 'pending'
    });

    await order.populate('userId', 'name email phone');
    res.status(201).json(order);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/my-orders', auth, async function (req, res) {
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

router.get('/', auth, adminOnly, async function (req, res) {
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

router.get('/:id', auth, async function (req, res) {
  try {
    const order = await Order.findById(req.params.id)
      .populate('userId', 'name email phone')
      .populate('items.productId', 'name');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const isOwner = order.userId._id.toString() === req.user.userId;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(order);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id/status', auth, adminOnly, async function (req, res) {
  try {
    const { orderStatus } = req.body;
    const validStatuses = ['pending', 'confirmed', 'delivered', 'cancelled'];

    if (!validStatuses.includes(orderStatus)) {
      return res.status(400).json({ message: 'Invalid order status' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus: orderStatus },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
