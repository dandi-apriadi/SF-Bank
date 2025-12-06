import db from '../config/Database.js';

const fixAllianceBankTable = async () => {
    try {
        console.log('Attempting to drop alliance_bank table...');
        
        // Drop the problematic table
        await db.query('DROP TABLE IF EXISTS alliance_bank');
        console.log('✅ alliance_bank table dropped successfully');
        
        // Also drop alliance_resources and alliance to start fresh
        await db.query('DROP TABLE IF EXISTS alliance_resources');
        await db.query('DROP TABLE IF EXISTS alliances');
        console.log('✅ Related tables dropped');
        
    } catch (error) {
        console.error('Error fixing alliance_bank table:', error.message);
    } finally {
        process.exit(0);
    }
};

fixAllianceBankTable();
