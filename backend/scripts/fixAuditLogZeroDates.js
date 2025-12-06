import db from '../config/Database.js';

async function run() {
  try {
    console.log('🔧 Fixing audit_logs zero dates...');
    const [result] = await db.query(`
      UPDATE audit_logs
      SET
        created_at = NOW(),
        updated_at = NOW(),
        timestamp = NOW()
      WHERE
        created_at = '0000-00-00 00:00:00'
        OR updated_at = '0000-00-00 00:00:00'
        OR timestamp   = '0000-00-00 00:00:00';
    `);
    console.log('✅ Rows updated:', result?.affectedRows ?? result?.affected_rows ?? result);
  } catch (err) {
    console.error('❌ Failed to fix audit_logs:', err.message);
    process.exitCode = 1;
  } finally {
    await db.close();
  }
}

run();
