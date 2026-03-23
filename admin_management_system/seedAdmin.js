require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./app/model/admin.model');

async function seed() {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('DB connected');

        const existing = await Admin.findOne({ email: 'admin@company.com' });
        if (existing) {
            console.log('Admin already exists. Skipping seed.');
            process.exit(0);
        }

        const password = await bcrypt.hash('Admin@12345', 10);
        await Admin.create({ name: 'Super Admin', email: 'admin@company.com', password });

        console.log('✅ Admin seeded successfully');
        console.log('   Email   : admin@company.com');
        console.log('   Password: Admin@12345');
        process.exit(0);
    } catch (err) {
        console.error('Seed failed:', err.message);
        process.exit(1);
    }
}

seed();
