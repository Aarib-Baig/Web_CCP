// Run this once to create demo data: node seed.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Product = require('./models/Product');

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Create demo users
        const users = [
            { name: 'Admin User', email: 'admin@fruitmstore.com', password: await bcrypt.hash('admin123', 10), phone: '03001234567', role: 'admin' },
            { name: 'Test Customer', email: 'customer@test.com', password: await bcrypt.hash('customer123', 10), phone: '03009876543', role: 'customer' }
        ];

        for (const user of users) {
            if (!(await User.findOne({ email: user.email }))) {
                await User.create(user);
                console.log(`Created user: ${user.email}`);
            }
        }

        // Create sample products
        const products = [
            { name: 'Fresh Apples', category: 'Fruits', price: 250, unit: 'kg', stockStatus: true, imageUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300', description: 'Crispy red apples' },
            { name: 'Bananas', category: 'Fruits', price: 120, unit: 'dozen', stockStatus: true, imageUrl: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300', description: 'Fresh yellow bananas' },
            { name: 'Oranges', category: 'Fruits', price: 180, unit: 'kg', stockStatus: true, imageUrl: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=300', description: 'Juicy oranges' },
            { name: 'Mangoes', category: 'Fruits', price: 350, unit: 'kg', stockStatus: true, imageUrl: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=300', description: 'Sweet mangoes' },
            { name: 'Tomatoes', category: 'Vegetables', price: 80, unit: 'kg', stockStatus: true, imageUrl: 'https://images.unsplash.com/photo-1546470427-227c7369a9b0?w=300', description: 'Fresh red tomatoes' },
            { name: 'Potatoes', category: 'Vegetables', price: 60, unit: 'kg', stockStatus: true, imageUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82ber51?w=300', description: 'Quality potatoes' },
            { name: 'Onions', category: 'Vegetables', price: 70, unit: 'kg', stockStatus: true, imageUrl: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=300', description: 'Fresh onions' },
            { name: 'Fresh Milk', category: 'Dairy', price: 180, unit: 'piece', stockStatus: true, imageUrl: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300', description: '1 Liter fresh milk' },
        ];

        for (const product of products) {
            if (!(await Product.findOne({ name: product.name }))) {
                await Product.create(product);
                console.log(`Created product: ${product.name}`);
            }
        }

        console.log('\n✅ Database seeded successfully!');
        console.log('\nDemo credentials:');
        console.log('Admin: admin@fruitmstore.com / admin123');
        console.log('Customer: customer@test.com / customer123');

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

seedDatabase();
