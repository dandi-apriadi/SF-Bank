// backend/scripts/setupAuditLogs.js
const Database = require("../config/Database");

async function setupAuditLogs() {
  console.log("🔍 Setting up Audit Logs table...");

  try {
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS audit_logs (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT,
        action ENUM('CREATE', 'UPDATE', 'DELETE') NOT NULL,
        target_type ENUM('user', 'alliance', 'bank', 'resource') NOT NULL,
        target_id INT NOT NULL,
        details LONGTEXT,
        ip_address VARCHAR(45),
        user_agent VARCHAR(500),
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
        INDEX idx_user (user_id),
        INDEX idx_action (action),
        INDEX idx_target (target_type, target_id),
        INDEX idx_timestamp (timestamp)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;

    await Database.query(createTableSQL);
    console.log("✅ Audit Logs table created successfully!");

    // Verify table
    const [tables] = await Database.query(
      `SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_NAME = 'audit_logs' AND TABLE_SCHEMA = ?`,
      [process.env.DB_NAME || "sfbank"]
    );

    if (tables.length > 0) {
      console.log("✅ Verified: audit_logs table exists");
      
      // Show table structure
      const [columns] = await Database.query("DESCRIBE audit_logs");
      console.log("\n📋 Table Structure:");
      console.log(columns);
    } else {
      console.error("❌ Failed to verify audit_logs table");
    }

  } catch (error) {
    console.error("❌ Error setting up Audit Logs:", error);
    throw error;
  }
}

// Run if executed directly
if (require.main === module) {
  setupAuditLogs()
    .then(() => {
      console.log("\n✅ Audit Logs setup completed!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n❌ Setup failed:", error);
      process.exit(1);
    });
}

module.exports = setupAuditLogs;
