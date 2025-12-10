const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Fruits', 'Vegetables', 'Herbs', 'Dairy', 'Others']
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  unit: {
    type: String,
    required: true,
    enum: ['kg', 'piece', 'dozen', 'bunch']
  },
  stockStatus: {
    type: Boolean,
    default: true
  },
  imageUrl: {
    type: String,
    default: 'https://via.placeholder.com/300x300?text=Product'
  },
  description: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', ProductSchema);