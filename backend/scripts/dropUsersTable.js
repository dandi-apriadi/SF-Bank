import db from '../config/Database.js';

async function cleanupDatabase() {
  try {
    console.log('🔄 Cleaning up database...');
    
    // Drop tables in order to respect foreign key constraints
    const tablesToDrop = [
      'audit_logs',
      'member_contributions',
      'alliance_resources',
      'alliance_banks',
      'alliances',
      'users'
    ];

    for (const table of tablesToDrop) {
      try {
        console.log(`  Dropping ${table}...`);
        await db.query(`DROP TABLE IF EXISTS \`${table}\``);
        console.log(`  ✅ ${table} dropped`);
      } catch (error) {
        console.error(`  ⚠️ Error dropping ${table}:`, error.message);
      }
    }

    console.log('✅ Database cleanup complete');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during cleanup:', error.message);
    process.exit(1);
  }
}

cleanupDatabase();
