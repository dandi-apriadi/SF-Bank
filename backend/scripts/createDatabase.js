import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const createDatabase = async () => {
    let connection;
    
    try {
        console.log('🔧 Checking database setup...');
        
        // Connect to MySQL without specifying database
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASS || ''
        });
        
        console.log('✅ Connected to MySQL server.');
        
        // Create database if it doesn't exist
        const dbName = process.env.DB_NAME || 'prima';
        await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
        console.log(`✅ Database '${dbName}' created or already exists.`);
        
        // Use the database
        await connection.execute(`USE \`${dbName}\``);
        console.log(`✅ Using database '${dbName}'.`);
        
        // Check if users table exists and has too many indexes
        try {
            const [rows] = await connection.execute(`SHOW INDEX FROM users`);
            console.log(`📊 Found ${rows.length} indexes on users table.`);
            
            if (rows.length > 50) {
                console.log('⚠️  Too many indexes detected. Dropping users table...');
                await connection.execute('DROP TABLE IF EXISTS users');
                console.log('✅ Users table dropped successfully.');
            }
        } catch (error) {
            if (error.code === 'ER_NO_SUCH_TABLE') {
                console.log('ℹ️  Users table does not exist yet. This is normal for first setup.');
            } else {
                console.log('⚠️  Error checking users table:', error.message);
            }
        }
        
        console.log('🎉 Database setup check completed!');
        
    } catch (error) {
        console.error('❌ Database setup failed:', error.message);
        throw error;
    } finally {
        if (connection) {
            await connection.end();
        }
    }
};

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    createDatabase()
        .then(() => {
            console.log('Setup completed. You can now start your application.');
            process.exit(0);
        })
        .catch((error) => {
            console.error('Setup failed:', error);
            process.exit(1);
        });
}

export { createDatabase };
