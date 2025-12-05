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
 * Setup SF BANK Database Tables
 * Creates all tables in the correct order based on foreign key dependencies
 */

const setupSFBankTables = async () => {
    try {
        console.log('🚀 Starting SF BANK Database Setup...\n');

        // Test database connection
        await db.authenticate();
        console.log('✅ Database connection established successfully.\n');

        // Order matters: Create parent tables before child tables
        console.log('📋 Creating tables in dependency order...\n');

        // 1. Create alliances table (no dependencies)
        console.log('1️⃣  Creating alliances table...');
        await Alliance.sync({ alter: true });
        console.log('   ✅ alliances table created\n');

        // 2. Create alliance_resources table (depends on alliances)
        console.log('2️⃣  Creating alliance_resources table...');
        await AllianceResource.sync({ alter: true });
        console.log('   ✅ alliance_resources table created\n');

        // 3. Create alliance_bank table (depends on alliances)
        console.log('3️⃣  Creating alliance_bank table...');
        await AllianceBank.sync({ alter: true });
        console.log('   ✅ alliance_bank table created\n');

        // 4. Create users table (depends on alliances)
        console.log('4️⃣  Creating users table...');
        await User.sync({ alter: true });
        console.log('   ✅ users table created\n');

        // 5. Create member_contributions table (depends on users and alliances)
        console.log('5️⃣  Creating member_contributions table...');
        await MemberContribution.sync({ alter: true });
        console.log('   ✅ member_contributions table created\n');

        // 6. Create audit_logs table (depends on users)
        console.log('6️⃣  Creating audit_logs table...');
        await AuditLog.sync({ alter: true });
        console.log('   ✅ audit_logs table created\n');

        console.log('✅ All SF BANK tables created successfully!');
        console.log('\n📊 Database Structure:');
        console.log('   - alliances');
        console.log('   - alliance_resources');
        console.log('   - alliance_bank');
        console.log('   - users');
        console.log('   - member_contributions');
        console.log('   - audit_logs');
        
        console.log('\n🔗 Associations configured:');
        console.log('   - User ↔️ Alliance (Many-to-One)');
        console.log('   - Alliance ↔️ AllianceResource (One-to-One)');
        console.log('   - Alliance ↔️ AllianceBank (One-to-One)');
        console.log('   - MemberContribution ↔️ User (Many-to-One)');
        console.log('   - MemberContribution ↔️ Alliance (Many-to-One)');
        console.log('   - AuditLog ↔️ User (Many-to-One)');

        console.log('\n✨ Database setup completed successfully!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Error setting up database:', error);
        console.error('\nStack trace:', error.stack);
        process.exit(1);
    }
};

// Run the setup
setupSFBankTables();
