import db from '../config/Database.js';

const cleanup = async () => {
    try {
        await db.authenticate();
        console.log('✅ Connected to database\n');
        
        const tables = [
            'audit_logs',
            'member_contributions',
            'users',
            'alliance_bank',
            'alliance_resources',
            'alliances',
            'users_backup'
        ];
        
        for (const table of tables) {
            try {
                await db.query(`DROP TABLE IF EXISTS \`${table}\``);
                console.log(`✅ Dropped: ${table}`);
            } catch (err) {
                console.log(`⏭️  Skipped: ${table} - ${err.message}`);
            }
        }
        
        console.log('\n✨ Database cleanup complete!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
};

cleanup();
