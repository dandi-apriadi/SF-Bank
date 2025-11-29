import { User } from '../models/userModel.js';
import db from '../config/Database.js';

const createTestUsers = async () => {
    try {
        // Connect to database
        await db.authenticate();
        console.log('Database connected successfully.');

        // Sync models
        await db.sync();

        // Check if test users already exist
        const existingUsers = await User.findAll();
        console.log(`Found ${existingUsers.length} existing users`);

        // Create test users if none exist
        if (existingUsers.length === 0) {
            const testUsers = [
                // Dosen test user removed
                {
                    fullname: 'Dr. Siti Aminah',
                    email: 'coordinator@gmail.com',
                    password: 'password123',
                    role: 'koordinator',
                    gender: 'female',
                    nip: '198702152011012002',
                    phone: '081234567891',
                    department: 'Teknik Informatika',
                    study_program: 'Sistem Informasi',
                    position: 'Koordinator Prodi'
                },
                {
                    fullname: 'Prof. Budi Santoso',
                    email: 'admin@gmail.com',
                    password: 'password123',
                    role: 'unit',
                    gender: 'male',
                    nip: '197801012005011001',
                    phone: '081234567892',
                    department: 'PPMPP',
                    position: 'Kepala Unit PPMPP'
                },
                {
                    fullname: 'Prof. Dr. Indira Sari',
                    email: 'director@gmail.com',
                    password: 'password123',
                    role: 'pimpinan',
                    gender: 'female',
                    nip: '197505102000032001',
                    phone: '081234567893',
                    department: 'Universitas',
                    position: 'Direktur'
                }
            ];

            for (const userData of testUsers) {
                await User.create(userData);
                console.log(`✅ Created user: ${userData.email} (${userData.role})`);
            }
        } else {
            console.log('Test users already exist. Skipping creation.');
            existingUsers.forEach(user => {
                console.log(`- ${user.email} (${user.role})`);
            });
        }

        console.log('\n🎉 Test users setup completed!');
        console.log('\nLogin credentials:');
    // Dosen credentials removed
        console.log('- coordinator@gmail.com / password123 (Koordinator)');
        console.log('- admin@gmail.com / password123 (Unit PPMPP)');
        console.log('- director@gmail.com / password123 (Pimpinan)');

    } catch (error) {
        console.error('Error creating test users:', error);
    } finally {
        process.exit(0);
    }
};

createTestUsers();
