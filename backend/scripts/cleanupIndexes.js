import db from '../config/Database.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Script to clean up problematic indexes and reset the users table
 * Run this script if you encounter "Too many keys specified" error
 */
const cleanupIndexes = async () => {
    try {
        console.log('🧹 Starting index cleanup...');
        console.log(`📊 Database: ${process.env.DB_NAME} on ${process.env.DB_HOST}`);
        
        // Test connection
        await db.authenticate();
        console.log('✅ Database connected.');

        // Check if users table exists
        const tables = await db.getQueryInterface().showAllTables();
        
        if (!tables.includes('users')) {
            console.log('ℹ️  Users table does not exist. Nothing to clean up.');
            return;
        }

        // Get all indexes on users table
        const indexes = await db.getQueryInterface().showIndex('users');
        console.log(`📊 Found ${indexes.length} indexes on users table.`);

        // List all indexes
        console.log('📋 Current indexes:');
        indexes.forEach((index, i) => {
            console.log(`   ${i + 1}. ${index.name} (${index.unique ? 'UNIQUE' : 'INDEX'}) on [${index.fields.join(', ')}]`);
        });

        // Drop the users table completely to reset all indexes
        console.log('🗑️  Dropping users table to reset indexes...');
        await db.query('DROP TABLE IF EXISTS users');
        console.log('✅ Users table dropped successfully.');

        console.log('🎉 Index cleanup completed! You can now restart your application.');
        
    } catch (error) {
        console.error('❌ Index cleanup failed:', error);
        
        // Try alternative cleanup method
        try {
            console.log('🔄 Trying alternative cleanup method...');
            await db.query('SET foreign_key_checks = 0');
            await db.query('DROP TABLE IF EXISTS users');
            await db.query('SET foreign_key_checks = 1');
            console.log('✅ Alternative cleanup successful.');
        } catch (altError) {
            console.error('❌ Alternative cleanup also failed:', altError);
            console.log('⚠️  Manual database cleanup may be required.');
        }
    }
};

// Run cleanup if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    cleanupIndexes()
        .then(() => {
            console.log('Cleanup completed. You can now restart your application.');
            process.exit(0);
        })
        .catch((error) => {
            console.error('Cleanup failed:', error);
            process.exit(1);
        });
}

export { cleanupIndexes };
