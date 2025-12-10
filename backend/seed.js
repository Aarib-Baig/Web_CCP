const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Product = require('./models/Product');

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const users = [
            { name: 'Admin User', email: 'admin@fruitvegetablestore.com', password: await bcrypt.hash('admin123', 10), phone: '03001234567', role: 'admin' },
            { name: 'Test Customer', email: 'customer@test.com', password: await bcrypt.hash('customer123', 10), phone: '03009876543', role: 'customer' }
        ];

        for (const user of users) {
            if (!(await User.findOne({ email: user.email }))) {
                await User.create(user);
                console.log(`Created user: ${user.email}`);
            }
        }

        const products = [
            { name: 'Fresh Apples', category: 'Fruits', price: 250, unit: 'kg', stockStatus: true, imageUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300', description: 'Crispy red apples' },
            { name: 'Bananas', category: 'Fruits', price: 120, unit: 'dozen', stockStatus: true, imageUrl: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300', description: 'Fresh yellow bananas' },
            { name: 'Oranges', category: 'Fruits', price: 180, unit: 'kg', stockStatus: true, imageUrl: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=300', description: 'Juicy oranges' },
            { name: 'Mangoes', category: 'Fruits', price: 350, unit: 'kg', stockStatus: true, imageUrl: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=300', description: 'Sweet mangoes' },
            { name: 'Onions', category: 'Vegetables', price: 70, unit: 'kg', stockStatus: true, imageUrl: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=300', description: 'Fresh onions' },
        ];

        for (const product of products) {
            if (!(await Product.findOne({ name: product.name }))) {
                await Product.create(product);
                console.log(`Created product: ${product.name}`);
            }
        }

        console.log('Admin: admin@fruitvegetablestore.com / admin123');
        console.log('Customer: customer@test.com / customer123');

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

seedDatabase();