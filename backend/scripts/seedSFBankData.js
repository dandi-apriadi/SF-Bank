import dotenv from 'dotenv';
dotenv.config();

import db from '../config/Database.js';
import { 
    User, 
    Alliance, 
    AllianceResource, 
    AllianceBank, 
    MemberContribution, 
    AuditLog 
} from '../models/index.js';

/**
 * Seed SF BANK Database with Sample Data
 */

const seedSFBankData = async () => {
    try {
        console.log('🌱 Starting SF BANK Database Seeding...\n');

        await db.authenticate();
        console.log('✅ Database connection established.\n');

        // 1. Create sample alliances
        console.log('1️⃣  Creating sample alliances...');
        const alliance1 = await Alliance.create({
            name: 'Kingdom 3946',
            tag: 'K3946',
            leader: 'King Arthur',
            members_count: 0,
            description: 'The legendary kingdom of brave warriors',
            bank_id: 'BANK001',
            bank_name: 'Kingdom Treasury'
        });

        const alliance2 = await Alliance.create({
            name: 'Dragon Riders',
            tag: 'DRAG',
            leader: 'Daenerys',
            members_count: 0,
            description: 'Elite alliance of dragon masters',
            bank_id: 'BANK002',
            bank_name: 'Dragon Vault'
        });
        console.log('   ✅ Created 2 alliances\n');

        // 2. Create alliance resources
        console.log('2️⃣  Creating alliance resources...');
        await AllianceResource.create({
            alliance_id: alliance1.id,
            food: 50000000,
            wood: 40000000,
            stone: 35000000,
            gold: 25000000,
            total_rss: 150000000,
            weeks_donated: 12
        });

        await AllianceResource.create({
            alliance_id: alliance2.id,
            food: 30000000,
            wood: 28000000,
            stone: 25000000,
            gold: 20000000,
            total_rss: 103000000,
            weeks_donated: 8
        });
        console.log('   ✅ Created alliance resources\n');

        // 3. Create alliance banks
        console.log('3️⃣  Creating alliance banks...');
        await AllianceBank.create({
            alliance_id: alliance1.id,
            bank_id: 'BANK001',
            bank_name: 'Kingdom Treasury'
        });

        await AllianceBank.create({
            alliance_id: alliance2.id,
            bank_id: 'BANK002',
            bank_name: 'Dragon Vault'
        });
        console.log('   ✅ Created alliance banks\n');

        // 4. Create sample users
        console.log('4️⃣  Creating sample users...');
        const admin = await User.create({
            user_id: 'ADM001',
            name: 'Admin User',
            email: 'admin@kingdom3946.com',
            password: 'admin123',
            role: 'Admin',
            alliance_id: alliance1.id,
            status: 'Active',
            joined_date: new Date('2024-01-01')
        });

        const r1User = await User.create({
            user_id: 'R1001',
            name: 'Commander R1',
            email: 'r1@kingdom3946.com',
            password: 'r1pass123',
            role: 'R1',
            alliance_id: alliance1.id,
            status: 'Active',
            joined_date: new Date('2024-01-15')
        });

        const r2User = await User.create({
            user_id: 'R2001',
            name: 'Officer R2',
            email: 'r2@kingdom3946.com',
            password: 'r2pass123',
            role: 'R2',
            alliance_id: alliance1.id,
            status: 'Active',
            joined_date: new Date('2024-02-01')
        });

        const member1 = await User.create({
            user_id: 'USR001',
            name: 'Member One',
            email: 'member1@kingdom3946.com',
            password: 'member123',
            role: 'R5',
            alliance_id: alliance1.id,
            status: 'Active',
            joined_date: new Date('2024-03-01')
        });

        const member2 = await User.create({
            user_id: 'USR002',
            name: 'Member Two',
            email: 'member2@dragon.com',
            password: 'member123',
            role: 'R5',
            alliance_id: alliance2.id,
            status: 'Active',
            joined_date: new Date('2024-03-15')
        });
        console.log('   ✅ Created 5 users (1 Admin, 1 R1, 1 R2, 2 R5)\n');

        // Update alliance member counts
        await alliance1.update({ members_count: 4 });
        await alliance2.update({ members_count: 1 });

        // 5. Create member contributions
        console.log('5️⃣  Creating member contributions...');
        const currentWeek = new Date().getWeek();
        
        await MemberContribution.create({
            member_id: admin.id,
            alliance_id: alliance1.id,
            week: currentWeek,
            date: new Date(),
            food: 5000000,
            wood: 4000000,
            stone: 3000000,
            gold: 2000000,
            total_rss: 14000000,
            last_contribution: new Date()
        });

        await MemberContribution.create({
            member_id: r1User.id,
            alliance_id: alliance1.id,
            week: currentWeek,
            date: new Date(),
            food: 4000000,
            wood: 3500000,
            stone: 3000000,
            gold: 1800000,
            total_rss: 12300000,
            last_contribution: new Date()
        });

        await MemberContribution.create({
            member_id: r2User.id,
            alliance_id: alliance1.id,
            week: currentWeek,
            date: new Date(),
            food: 3000000,
            wood: 2500000,
            stone: 2000000,
            gold: 1500000,
            total_rss: 9000000,
            last_contribution: new Date()
        });

        await MemberContribution.create({
            member_id: member1.id,
            alliance_id: alliance1.id,
            week: currentWeek,
            date: new Date(),
            food: 2000000,
            wood: 1800000,
            stone: 1500000,
            gold: 1000000,
            total_rss: 6300000,
            last_contribution: new Date()
        });
        console.log('   ✅ Created 4 member contributions\n');

        // 6. Create sample audit logs
        console.log('6️⃣  Creating sample audit logs...');
        await AuditLog.create({
            user_id: admin.id,
            action: 'CREATE',
            target_type: 'alliance',
            target_id: alliance1.id,
            details: JSON.stringify({
                action: 'Created alliance',
                alliance_name: 'Kingdom 3946',
                timestamp: new Date()
            }),
            ip_address: '127.0.0.1',
            user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
            timestamp: new Date()
        });

        await AuditLog.create({
            user_id: admin.id,
            action: 'CREATE',
            target_type: 'user',
            target_id: r1User.id,
            details: JSON.stringify({
                action: 'Created user',
                user_name: 'Commander R1',
                role: 'R1',
                timestamp: new Date()
            }),
            ip_address: '127.0.0.1',
            user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
            timestamp: new Date()
        });
        console.log('   ✅ Created 2 audit log entries\n');

        console.log('✨ Database seeding completed successfully!\n');
        console.log('📊 Summary:');
        console.log('   - Alliances: 2');
        console.log('   - Alliance Resources: 2');
        console.log('   - Alliance Banks: 2');
        console.log('   - Users: 5 (Admin, R1, R2, 2xR5)');
        console.log('   - Member Contributions: 4');
        console.log('   - Audit Logs: 2');
        
        console.log('\n🔑 Test Credentials:');
        console.log('   Admin: admin@kingdom3946.com / admin123');
        console.log('   R1: r1@kingdom3946.com / r1pass123');
        console.log('   R2: r2@kingdom3946.com / r2pass123');
        console.log('   Member: member1@kingdom3946.com / member123');

        process.exit(0);

    } catch (error) {
        console.error('❌ Error seeding database:', error);
        console.error('\nStack trace:', error.stack);
        process.exit(1);
    }
};

// Helper function to get week number
Date.prototype.getWeek = function() {
    const onejan = new Date(this.getFullYear(), 0, 1);
    return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 1) / 7);
};

// Run the seeding
seedSFBankData();
