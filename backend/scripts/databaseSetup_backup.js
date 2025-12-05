import { Sequelize } from 'sequelize';
import db from '../config/Database.js';

/**
 * SF BANK Database Setup
 * Creates all tables in correct order to handle foreign key dependencies
 */

const setupDatabase = async () => {
    try {
        console.log('🔧 Starting SF BANK database setup...');
        
        // Test database connection
        await db.authenticate();
        console.log('✅ Database connection established successfully.\n');

        // Import models - this will register them with Sequelize
        console.log('📦 Loading SF BANK models...');
        const { 
            Alliance, 
            AllianceResource, 
            AllianceBank, 
            User, 
            MemberContribution, 
            AuditLog 
        } = await import('../models/index.js');
        console.log('✅ Models loaded successfully.\n');

        // Create tables in dependency order
        console.log('🏗️  Creating tables in dependency order...\n');

        // Step 1: Create alliances table (no dependencies)
        console.log('1️⃣  Creating alliances table...');
        await Alliance.sync({ force: false });
        console.log('   ✅ alliances table ready\n');
        
        // Step 2: Create alliance_resources table (depends on alliances)
        console.log('2️⃣  Creating alliance_resources table...');
        await AllianceResource.sync({ force: false });
        console.log('   ✅ alliance_resources table ready\n');
        
        // Step 3: Create alliance_bank table (depends on alliances)
        console.log('3️⃣  Creating alliance_bank table...');
        await AllianceBank.sync({ force: false });
        console.log('   ✅ alliance_bank table ready\n');
        
        // Step 4: Create users table (depends on alliances)
        console.log('4️⃣  Creating users table...');
        await User.sync({ force: false });
        console.log('   ✅ users table ready\n');
        
        // Step 5: Create member_contributions table (depends on users and alliances)
        console.log('5️⃣  Creating member_contributions table...');
        await MemberContribution.sync({ force: false });
        console.log('   ✅ member_contributions table ready\n');
        
        // Step 6: Create audit_logs table (depends on users)
        console.log('6️⃣  Creating audit_logs table...');
        await AuditLog.sync({ force: false });
        console.log('   ✅ audit_logs table ready\n');
        
        console.log('✨ All SF BANK tables created successfully!');
        console.log('\n📊 Tables created:');
        console.log('   - alliances');
        console.log('   - alliance_resources');
        console.log('   - alliance_bank');
        console.log('   - users');
        console.log('   - member_contributions');
        console.log('   - audit_logs');
        
        return true;
        
    } catch (error) {
        console.error('❌ Database setup failed:', error.message);
        console.error('Stack trace:', error.stack);
        throw error;
    }
};

/**
 * Check database health
 */
const checkDatabaseHealth = async () => {
    try {
        await db.authenticate();
        const tables = await db.getQueryInterface().showAllTables();
        console.log('🏥 Database Health Check:');
        console.log(`✅ Connection: OK`);
        console.log(`📋 Tables: ${tables.length} found`);
        console.log(`   Tables: ${tables.join(', ')}`);
        
        return true;
    } catch (error) {
        console.error('❌ Database health check failed:', error);
        return false;
    }
};

// For backwards compatibility
const ensureAllTables = setupDatabase;
const resetDatabase = async () => {
    console.log('⚠️  Reset not implemented for SF BANK. Use manual DROP if needed.');
};

// Export functions
export { setupDatabase, resetDatabase, checkDatabaseHealth, ensureAllTables };

// Run setup if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    setupDatabase()
        .then(() => {
            console.log('\n✅ Setup completed. Exiting...');
            process.exit(0);
        })
        .catch((error) => {
            console.error('\n❌ Setup failed:', error);
            process.exit(1);
        });
}
