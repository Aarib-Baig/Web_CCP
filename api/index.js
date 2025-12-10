const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
let isConnected = false;
const connectDB = async () => {
    if (isConnected) return;
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
};

// User Schema
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
    createdAt: { type: Date, default: Date.now }
});
const User = mongoose.models.User || mongoose.model('User', UserSchema);

// Product Schema
const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    unit: { type: String, required: true },
    stockStatus: { type: Boolean, default: true },
    imageUrl: { type: String, default: 'https://via.placeholder.com/300' },
    description: String,
    createdAt: { type: Date, default: Date.now }
});
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

// Order Schema
const OrderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{ productId: mongoose.Schema.Types.ObjectId, name: String, price: Number, quantity: Number }],
    totalAmount: { type: Number, required: true },
    deliveryAddress: { street: String, area: String, city: String, postalCode: String },
    paymentMethod: String,
    orderStatus: { type: String, default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});
const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);

// Auth middleware
const auth = (req, res, next) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) return res.status(401).json({ message: 'No token' });
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch { res.status(401).json({ message: 'Invalid token' }); }
};

const adminOnly = (req, res, next) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
    next();
};

// AUTH ROUTES
app.post('/api/auth/register', async (req, res) => {
    await connectDB();
    try {
        const { name, email, password, phone, role } = req.body;
        if (await User.findOne({ email })) return res.status(400).json({ message: 'User exists' });
        const user = await User.create({ name, email, password: await bcrypt.hash(password, 10), phone, role: role || 'customer' });
        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (e) { res.status(500).json({ message: 'Server error' }); }
});

app.post('/api/auth/login', async (req, res) => {
    await connectDB();
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) return res.status(400).json({ message: 'Invalid credentials' });
        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (e) { res.status(500).json({ message: 'Server error' }); }
});

// PRODUCT ROUTES
app.get('/api/products', async (req, res) => {
    await connectDB();
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
});

app.get('/api/products/:id', async (req, res) => {
    await connectDB();
    const product = await Product.findById(req.params.id);
    product ? res.json(product) : res.status(404).json({ message: 'Not found' });
});

app.post('/api/products', auth, adminOnly, async (req, res) => {
    await connectDB();
    const product = await Product.create(req.body);
    res.status(201).json(product);
});

app.put('/api/products/:id', auth, adminOnly, async (req, res) => {
    await connectDB();
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    product ? res.json(product) : res.status(404).json({ message: 'Not found' });
});

app.delete('/api/products/:id', auth, adminOnly, async (req, res) => {
    await connectDB();
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
});

// ORDER ROUTES
app.post('/api/orders', auth, async (req, res) => {
    await connectDB();
    const order = await Order.create({ ...req.body, userId: req.user.userId });
    res.status(201).json(order);
});

app.get('/api/orders/my-orders', auth, async (req, res) => {
    await connectDB();
    const orders = await Order.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.json(orders);
});

app.get('/api/orders', auth, adminOnly, async (req, res) => {
    await connectDB();
    const orders = await Order.find().sort({ createdAt: -1 }).populate('userId', 'name email phone');
    res.json(orders);
});

app.put('/api/orders/:id/status', auth, adminOnly, async (req, res) => {
    await connectDB();
    const order = await Order.findByIdAndUpdate(req.params.id, { orderStatus: req.body.orderStatus }, { new: true });
    order ? res.json(order) : res.status(404).json({ message: 'Not found' });
});

app.get('/api', (req, res) => res.json({ message: 'Fruit mStore API' }));

module.exports = app;
