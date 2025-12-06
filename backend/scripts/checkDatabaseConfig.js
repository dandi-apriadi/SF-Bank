import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config();

/**
 * Check Database Configuration and Connection
 * Run this before seeding to ensure everything is properly configured
 */
const checkDatabaseConfig = async () => {
    console.log('🔍 Checking SF BANK Database Configuration...\n');

    // 1. Check Environment Variables
    console.log('1️⃣  Environment Variables:');
    const requiredVars = ['DB_HOST', 'DB_USER', 'DB_PASS', 'DB_NAME'];
    const missingVars = [];

    requiredVars.forEach(varName => {
        const value = process.env[varName];
        if (!value) {
            console.log(`   ❌ ${varName}: NOT SET`);
            missingVars.push(varName);
        } else {
            // Mask password
            const displayValue = varName === 'DB_PASS' ? '***' : value;
            console.log(`   ✅ ${varName}: ${displayValue}`);
        }
    });

    if (missingVars.length > 0) {
        console.error('\n❌ Missing required environment variables!');
        console.error('   Please set these in your .env file:');
        missingVars.forEach(v => console.error(`   - ${v}`));
        process.exit(1);
    }

    console.log();

    // 2. Test MySQL Connection (without database)
    console.log('2️⃣  Testing MySQL Server Connection...');
    let connection;
    
    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS
        });
        console.log(`   ✅ Connected to MySQL server at ${process.env.DB_HOST}\n`);
    } catch (error) {
        console.error('   ❌ Failed to connect to MySQL server!');
        console.error(`   Error: ${error.message}`);
        console.error('\n   Possible issues:');
        console.error('   - MySQL server is not running');
        console.error('   - Wrong host/port');
        console.error('   - Wrong username/password');
        console.error('   - Firewall blocking connection');
        process.exit(1);
    }

    // 3. Check if Database Exists
    console.log('3️⃣  Checking Database...');
    const dbName = process.env.DB_NAME;
    
    try {
        const [databases] = await connection.query('SHOW DATABASES');
        const dbExists = databases.some(db => db.Database === dbName);
        
        if (dbExists) {
            console.log(`   ✅ Database '${dbName}' exists`);
            
            // Use the database and check tables
            await connection.query(`USE \`${dbName}\``);
            const [tables] = await connection.query('SHOW TABLES');
            console.log(`   📊 Found ${tables.length} tables in database\n`);
            
            if (tables.length > 0) {
                console.log('   Existing tables:');
                tables.forEach((table, idx) => {
                    const tableName = Object.values(table)[0];
                    console.log(`   ${idx + 1}. ${tableName}`);
                });
            }
        } else {
            console.log(`   ⚠️  Database '${dbName}' does NOT exist`);
            console.log(`   💡 Creating database...`);
            
            await connection.query(`CREATE DATABASE \`${dbName}\``);
            console.log(`   ✅ Database '${dbName}' created successfully`);
        }
    } catch (error) {
        console.error(`   ❌ Error checking database: ${error.message}`);
        await connection.end();
        process.exit(1);
    }

    console.log();

    // 4. Test Connection with Database Selected
    console.log('4️⃣  Testing Connection with Database Selected...');
    try {
        const testConnection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME
        });
        
        await testConnection.query('SELECT 1');
        console.log(`   ✅ Successfully connected to database '${dbName}'\n`);
        await testConnection.end();
    } catch (error) {
        console.error(`   ❌ Failed to connect with database selected!`);
        console.error(`   Error: ${error.message}`);
        await connection.end();
        process.exit(1);
    }

    // 5. Check Required Tables
    console.log('5️⃣  Checking Required Tables for Seeding...');
    const requiredTables = ['alliances', 'users', 'member_contributions'];
    
    try {
        await connection.query(`USE \`${dbName}\``);
        const [tables] = await connection.query('SHOW TABLES');
        const tableNames = tables.map(t => Object.values(t)[0]);
        
        const missingTables = [];
        requiredTables.forEach(tableName => {
            if (tableNames.includes(tableName)) {
                console.log(`   ✅ Table '${tableName}' exists`);
            } else {
                console.log(`   ⚠️  Table '${tableName}' NOT found`);
                missingTables.push(tableName);
            }
        });
        
        if (missingTables.length > 0) {
            console.log('\n   ⚠️  Some required tables are missing!');
            console.log('   💡 Run database setup first:');
            console.log('      node scripts/databaseSetup.js');
        }
    } catch (error) {
        console.error(`   ❌ Error checking tables: ${error.message}`);
    }

    await connection.end();

    console.log('\n✨ Database configuration check completed!\n');
    console.log('🎯 Next Steps:');
    console.log('   1. If tables are missing, run: node scripts/databaseSetup.js');
    console.log('   2. Then run seeding: node scripts/seedFullBankData.js');
    console.log('   or use robust version: node scripts/seedFullBankDataRobust.js\n');
    
    process.exit(0);
};

checkDatabaseConfig();
