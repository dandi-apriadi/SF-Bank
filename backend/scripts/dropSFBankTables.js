import db from '../config/Database.js';
import readline from 'readline';

/**
 * Script to safely drop old SF BANK tables and recreate with new structure
 * WARNING: This will delete all data in the tables!
 */

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

const dropAndRecreateTables = async () => {
    try {
        console.log('⚠️  SF BANK TABLE RESET UTILITY');
        console.log('=' .repeat(50));
        console.log('This will DROP and RECREATE all SF BANK tables.');
        console.log('ALL DATA WILL BE LOST!\n');
        
        // Test connection
        await db.authenticate();
        console.log('✅ Database connection established.\n');
        
        // Get existing tables
        const qi = db.getQueryInterface();
        const tables = await qi.showAllTables();
        
        const sfBankTables = [
            'audit_logs',
            'member_contributions',
            'users',
            'alliance_bank',
            'alliance_resources',
            'alliances',
            'users_backup'
        ];
        
        const existingTables = sfBankTables.filter(t => tables.includes(t));
        
        if (existingTables.length === 0) {
            console.log('ℹ️  No SF BANK tables found. Nothing to drop.');
            rl.close();
            process.exit(0);
        }
        
        console.log('📋 Tables to be dropped:');
        existingTables.forEach(t => console.log(`   - ${t}`));
        console.log();
        
        const answer = await question('Are you sure you want to continue? Type "YES" to confirm: ');
        
        if (answer !== 'YES') {
            console.log('❌ Operation cancelled.');
            rl.close();
            process.exit(0);
        }
        
        console.log('\n🗑️  Dropping tables in reverse dependency order...\n');
        
        // Drop in reverse order of creation (child tables first)
        const dropOrder = [
            'audit_logs',
            'member_contributions',
            'users',
            'alliance_bank',
            'alliance_resources',
            'alliances',
            'users_backup'
        ];
        
        for (const tableName of dropOrder) {
            if (existingTables.includes(tableName)) {
                try {
                    console.log(`   Dropping ${tableName}...`);
                    await db.query(`DROP TABLE IF EXISTS \`${tableName}\``);
                    console.log(`   ✅ ${tableName} dropped`);
                } catch (err) {
                    console.warn(`   ⚠️  Could not drop ${tableName}: ${err.message}`);
                }
            }
        }
        
        console.log('\n✅ All tables dropped successfully!\n');
        console.log('Now run: node scripts/setupSFBankTables.js');
        console.log('Or restart the server to auto-create tables.\n');
        
        rl.close();
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        rl.close();
        process.exit(1);
    }
};

// Run the script
dropAndRecreateTables();
