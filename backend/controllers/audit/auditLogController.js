// backend/controllers/audit/auditLogController.js
const Database = require("../../config/Database");

class AuditLogController {
  /**
   * Get all audit logs dengan filter dan pagination
   */
  static async getAllLogs(req, res) {
    try {
      const {
        page = 1,
        limit = 15,
        action,
        targetType,
        userId,
        dateFrom,
        dateTo,
        search,
      } = req.query;

      const offset = (page - 1) * limit;
      let query = "SELECT * FROM audit_logs WHERE 1=1";
      const params = [];

      // Apply filters
      if (action) {
        query += " AND action = ?";
        params.push(action);
      }

      if (targetType) {
        query += " AND target_type = ?";
        params.push(targetType);
      }

      if (userId) {
        query += " AND user_id = ?";
        params.push(userId);
      }

      if (dateFrom) {
        query += " AND DATE(timestamp) >= ?";
        params.push(dateFrom);
      }

      if (dateTo) {
        query += " AND DATE(timestamp) <= ?";
        params.push(dateTo);
      }

      if (search) {
        query += ` AND (
          (SELECT name FROM users WHERE id = audit_logs.user_id) LIKE ? OR
          (SELECT email FROM users WHERE id = audit_logs.user_id) LIKE ? OR
          details LIKE ?
        )`;
        const searchTerm = `%${search}%`;
        params.push(searchTerm, searchTerm, searchTerm);
      }

      // Get total count
      const [countResult] = await Database.query(
        query.replace("SELECT *", "SELECT COUNT(*) as count"),
        params
      );
      const total = countResult[0]?.count || 0;

      // Get paginated data
      query += " ORDER BY timestamp DESC LIMIT ? OFFSET ?";
      params.push(parseInt(limit), offset);

      const [logs] = await Database.query(query, params);

      // Enrich logs dengan user info
      const enrichedLogs = logs.map(log => ({
        ...log,
        user_name: log.user_name || "Unknown User",
        user_email: log.user_email || "N/A",
      }));

      res.json({
        success: true,
        data: enrichedLogs,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error("Error getting audit logs:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch audit logs",
        error: error.message,
      });
    }
  }

  /**
   * Get single audit log detail
   */
  static async getLogDetail(req, res) {
    try {
      const { logId } = req.params;

      const [logs] = await Database.query(
        `SELECT al.*, u.name as user_name, u.email as user_email 
         FROM audit_logs al
         LEFT JOIN users u ON al.user_id = u.id
         WHERE al.id = ?`,
        [logId]
      );

      if (logs.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Audit log not found",
        });
      }

      res.json({
        success: true,
        data: logs[0],
      });
    } catch (error) {
      console.error("Error getting audit log detail:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch audit log detail",
        error: error.message,
      });
    }
  }

  /**
   * Get audit log statistics
   */
  static async getStatistics(req, res) {
    try {
      const [stats] = await Database.query(
        `SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN action = 'CREATE' THEN 1 ELSE 0 END) as creates,
          SUM(CASE WHEN action = 'UPDATE' THEN 1 ELSE 0 END) as updates,
          SUM(CASE WHEN action = 'DELETE' THEN 1 ELSE 0 END) as deletes,
          COUNT(DISTINCT user_id) as activeUsers,
          COUNT(DISTINCT target_type) as targetTypes,
          MAX(timestamp) as lastActivity
         FROM audit_logs`
      );

      res.json({
        success: true,
        data: stats[0],
      });
    } catch (error) {
      console.error("Error getting audit statistics:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch audit statistics",
        error: error.message,
      });
    }
  }

  /**
   * Get logs by specific user
   */
  static async getLogsByUser(req, res) {
    try {
      const { userId } = req.params;
      const { page = 1, limit = 15 } = req.query;

      const offset = (page - 1) * limit;

      const [logs] = await Database.query(
        `SELECT al.*, u.name as user_name, u.email as user_email 
         FROM audit_logs al
         LEFT JOIN users u ON al.user_id = u.id
         WHERE al.user_id = ?
         ORDER BY al.timestamp DESC
         LIMIT ? OFFSET ?`,
        [userId, parseInt(limit), offset]
      );

      const [countResult] = await Database.query(
        "SELECT COUNT(*) as count FROM audit_logs WHERE user_id = ?",
        [userId]
      );

      res.json({
        success: true,
        data: logs,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: countResult[0]?.count || 0,
        },
      });
    } catch (error) {
      console.error("Error getting user audit logs:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch user audit logs",
        error: error.message,
      });
    }
  }

  /**
   * Get logs by target (alliance, user, bank, resource)
   */
  static async getLogsByTarget(req, res) {
    try {
      const { targetType, targetId } = req.params;
      const { page = 1, limit = 15 } = req.query;

      const offset = (page - 1) * limit;

      const [logs] = await Database.query(
        `SELECT al.*, u.name as user_name, u.email as user_email 
         FROM audit_logs al
         LEFT JOIN users u ON al.user_id = u.id
         WHERE al.target_type = ? AND al.target_id = ?
         ORDER BY al.timestamp DESC
         LIMIT ? OFFSET ?`,
        [targetType, targetId, parseInt(limit), offset]
      );

      const [countResult] = await Database.query(
        "SELECT COUNT(*) as count FROM audit_logs WHERE target_type = ? AND target_id = ?",
        [targetType, targetId]
      );

      res.json({
        success: true,
        data: logs,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: countResult[0]?.count || 0,
        },
      });
    } catch (error) {
      console.error("Error getting target audit logs:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch target audit logs",
        error: error.message,
      });
    }
  }

  /**
   * Create audit log (called internally by other operations)
   */
  static async createLog(req, res) {
    try {
      const { action, targetType, targetId, details, ipAddress, userAgent } = req.body;
      const userId = req.user?.id; // From auth middleware

      if (!action || !targetType || !targetId) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields: action, targetType, targetId",
        });
      }

      const [result] = await Database.query(
        `INSERT INTO audit_logs (user_id, action, target_type, target_id, details, ip_address, user_agent, timestamp)
         VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
        [userId, action, targetType, targetId, details || null, ipAddress || null, userAgent || null]
      );

      res.status(201).json({
        success: true,
        message: "Audit log created",
        data: {
          id: result.insertId,
          action,
          targetType,
          targetId,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error("Error creating audit log:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create audit log",
        error: error.message,
      });
    }
  }

  /**
   * Export logs to CSV
   */
  static async exportLogs(req, res) {
    try {
      const { action, targetType, userId, dateFrom, dateTo, search } = req.query;

      let query = "SELECT * FROM audit_logs WHERE 1=1";
      const params = [];

      if (action) {
        query += " AND action = ?";
        params.push(action);
      }

      if (targetType) {
        query += " AND target_type = ?";
        params.push(targetType);
      }

      if (userId) {
        query += " AND user_id = ?";
        params.push(userId);
      }

      if (dateFrom) {
        query += " AND DATE(timestamp) >= ?";
        params.push(dateFrom);
      }

      if (dateTo) {
        query += " AND DATE(timestamp) <= ?";
        params.push(dateTo);
      }

      query += " ORDER BY timestamp DESC";

      const [logs] = await Database.query(query, params);

      // Generate CSV
      const csv = [
        ["ID", "User ID", "User Name", "Action", "Target Type", "Target ID", "Timestamp", "Details", "IP Address"],
        ...logs.map(log => [
          log.id,
          log.user_id,
          log.user_name || "Unknown",
          log.action,
          log.target_type,
          log.target_id,
          log.timestamp,
          log.details || "",
          log.ip_address || "",
        ]),
      ]
        .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
        .join("\n");

      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", `attachment; filename="audit_logs_${new Date().toISOString().split('T')[0]}.csv"`);
      res.send(csv);
    } catch (error) {
      console.error("Error exporting audit logs:", error);
      res.status(500).json({
        success: false,
        message: "Failed to export audit logs",
        error: error.message,
      });
    }
  }

  /**
   * Delete old audit logs (retention policy)
   */
  static async deleteOldLogs(req, res) {
    try {
      const { daysOld = 90 } = req.body;

      const [result] = await Database.query(
        `DELETE FROM audit_logs 
         WHERE timestamp < DATE_SUB(NOW(), INTERVAL ? DAY)`,
        [daysOld]
      );

      res.json({
        success: true,
        message: `Deleted ${result.affectedRows} old audit logs`,
        deletedCount: result.affectedRows,
      });
    } catch (error) {
      console.error("Error deleting old audit logs:", error);
      res.status(500).json({
        success: false,
        message: "Failed to delete old audit logs",
        error: error.message,
      });
    }
  }
}

module.exports = AuditLogController;
