require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./app/models/adminModel');

async function createAdmin() {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('Data Base connected');

        const existing = await Admin.findOne({ email: 'admin12@gmail.com' });
        if (existing) {
            console.log('Admin already exists. Skipping seed.');
            process.exit(0);
        }

        const password = await bcrypt.hash('@Admin123', 10);
        await Admin.create({ name: 'Super Admin', email: 'admin12@gmail.com', password });

        console.log('Admin created successfully');
        console.log('   Email   : admin12@gmail.com');
        console.log('   Password: @Admin123');
        process.exit(0);
    } catch (err) {
        console.error('admin creation failed:', err.message);
        process.exit(1);
    }
}

createAdmin();