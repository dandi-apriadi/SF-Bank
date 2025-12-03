import db from '../../config/Database.js';

// Lightweight health check using DB connection and a simple query.
export const healthController = {
  status: async (req, res, next) => {
    try {
      console.log('Health check requested');

      const results = {};

      // Check DB connection
      try {
        await db.authenticate();
        results.database = { ok: true };
      } catch (e) {
        console.error('Database authentication failed:', e.message);
        results.database = { ok: false, error: e.message };
      }

      // Simple raw query to ensure queries run
      try {
        const [rows] = await db.query('SELECT 1 + 1 AS result');
        const ok = Array.isArray(rows) && rows.length > 0;
        results.simpleQuery = { ok, result: ok ? rows[0].result : null };
      } catch (e) {
        console.error('Simple query failed:', e.message);
        results.simpleQuery = { ok: false, error: e.message };
      }

      const okOverall = Object.values(results).every(r => r.ok === true);
      res.json({ ok: okOverall, checks: results, timestamp: new Date().toISOString() });
    } catch (err) {
      next(err);
    }
  }
};

export default healthController;
