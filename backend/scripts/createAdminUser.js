import dotenv from 'dotenv';
dotenv.config();

import db from '../config/Database.js';
import { User } from '../models/index.js';

const insertAdmin = async () => {
    try {
        console.log('🔐 Creating admin user...\n');

        await db.authenticate();
        console.log('✅ Database connection established.\n');

        const admin = await User.create({
            user_id: 'ADMIN-001',
            name: 'Admin User',
            email: 'admin@gmail.com',
            password: '$argon2id$v=19$m=65536,t=3,p=4$aWY4hbrcTqRzEk1VuBHlJg$EyNj61XJIAp0n2JgpioGkmSOQfasMFN4Pzo12ZuUYG8',
            role: 'Admin',
            alliance_id: null,
            status: 'Active',
            joined_date: new Date()
        });

        console.log('✨ Admin user created successfully!\n');
        console.log('📋 Admin Details:');
        console.log(`   Email: ${admin.email}`);
        console.log(`   Role: ${admin.role}`);
        console.log(`   User ID: ${admin.user_id}`);
        console.log(`   Status: ${admin.status}`);
        console.log(`   Created At: ${admin.created_at}\n`);

        console.log('🎯 Login Credentials:');
        console.log('   Email: admin@gmail.com');
        console.log('   Password: (use the provided argon2 hash)');
        console.log('   Or use: $argon2id$v=19$m=65536,t=3,p=4$aWY4hbrcTqRzEk1VuBHlJg$EyNj61XJIAp0n2JgpioGkmSOQfasMFN4Pzo12ZuUYG8\n');

        process.exit(0);

    } catch (error) {
        console.error('❌ Error creating admin user:', error);
        console.error('\nStack trace:', error.stack);
        process.exit(1);
    }
};

insertAdmin();
