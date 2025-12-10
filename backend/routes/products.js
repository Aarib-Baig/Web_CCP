const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { auth, adminOnly } = require('../middleware/auth');

router.get('/', async function (req, res) {
  try {
    const filter = {};

    if (req.query.category) {
      filter.category = req.query.category;
    }

    if (req.query.inStock === 'true') {
      filter.stockStatus = true;
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', async function (req, res) {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', auth, adminOnly, async function (req, res) {
  try {
    const { name, category, price, unit, stockStatus, imageUrl, description } = req.body;

    if (!name || !category || price === undefined || !unit) {
      return res.status(400).json({ message: 'Name, category, price, and unit are required' });
    }

    const product = await Product.create({
      name: name,
      category: category,
      price: price,
      unit: unit,
      stockStatus: stockStatus !== undefined ? stockStatus : true,
      imageUrl: imageUrl || 'https://via.placeholder.com/300x300?text=Product',
      description: description || ''
    });

    res.status(201).json(product);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', auth, adminOnly, async function (req, res) {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', auth, adminOnly, async function (req, res) {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;