import db from '../config/Database.js';

(async () => {
  try {
    await db.authenticate();
    console.log('✓ Connected to database');
    
    // Disable foreign key checks to allow dropping tables with dependencies
    await db.query('SET FOREIGN_KEY_CHECKS = 0');
    console.log('✓ Disabled foreign key checks');
    
    // List of tables to drop (in order of dependencies)
    const tablesToDrop = [
      'alliance_resources',
      'alliance_banks',
      'member_contributions',
      'alliances'
    ];
    
    for (const table of tablesToDrop) {
      try {
        await db.query(`DROP TABLE IF EXISTS \`${table}\``);
        console.log(`✓ Dropped ${table} table`);
      } catch (error) {
        console.warn(`⚠ Could not drop ${table}: ${error.message}`);
      }
    }
    
    // Re-enable foreign key checks
    await db.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log('✓ Re-enabled foreign key checks');
    
    console.log('\n✓ Tables dropped successfully. They will be recreated on next startup.');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
})();
