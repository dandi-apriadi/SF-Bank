// backend/utils/auditLogger.js
import db from '../config/Database.js';
import { QueryTypes } from 'sequelize';

/**
 * Utility untuk mencatat semua aktivitas admin
 */
class AuditLogger {
  /**
   * Log user action
   * @param {number} userId - User ID yang melakukan aksi
   * @param {string} action - Aksi yang dilakukan (CREATE, UPDATE, DELETE)
   * @param {string} targetType - Tipe target (user, alliance, bank, resource)
   * @param {number} targetId - ID target
   * @param {string} details - Detail perubahan
   * @param {Object} req - Express request object (untuk IP dan user agent)
   */
  static async log(userId, action, targetType, targetId, details = "", req = null) {
    try {
      const ipAddress = req?.ip || req?.connection?.remoteAddress || "0.0.0.0";
      const userAgent = req?.get("user-agent") || "Unknown";

      await db.query(
        `INSERT INTO audit_logs (user_id, action, target_type, target_id, details, ip_address, user_agent, timestamp)
         VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
        {
          replacements: [userId, action, targetType, targetId, details, ipAddress, userAgent],
          type: QueryTypes.INSERT
        }
      );

      console.log(`[AUDIT LOG] User ${userId} - ${action} ${targetType} #${targetId}: ${details}`);
    } catch (error) {
      console.error("[AUDIT LOG ERROR]", error);
      // Don't throw error to avoid disrupting main operation
    }
  }

  /**
   * Log user creation
   */
  static async logUserCreate(userId, createdUserId, userData, req) {
    const details = `Created user: ${userData.name} (Email: ${userData.email}, Role: ${userData.role})`;
    await this.log(userId, "CREATE", "user", createdUserId, details, req);
  }

  /**
   * Log user update
   */
  static async logUserUpdate(userId, targetUserId, changes, req) {
    const changeDetails = Object.entries(changes)
      .map(([key, { old, new: newVal }]) => `${key}: ${old} -> ${newVal}`)
      .join("; ");
    const details = `Updated user: ${changeDetails}`;
    await this.log(userId, "UPDATE", "user", targetUserId, details, req);
  }

  /**
   * Log user deletion
   */
  static async logUserDelete(userId, deletedUserId, userData, req) {
    const details = `Deleted user: ${userData.name} (Email: ${userData.email})`;
    await this.log(userId, "DELETE", "user", deletedUserId, details, req);
  }

  /**
   * Log alliance creation
   */
  static async logAllianceCreate(userId, allianceId, allianceData, req) {
    const details = `Created alliance: ${allianceData.name} (Tag: ${allianceData.tag}, Leader: ${allianceData.leader})`;
    await this.log(userId, "CREATE", "alliance", allianceId, details, req);
  }

  /**
   * Log alliance update
   */
  static async logAllianceUpdate(userId, allianceId, changes, req) {
    const changeDetails = Object.entries(changes)
      .map(([key, { old, new: newVal }]) => `${key}: ${old} -> ${newVal}`)
      .join("; ");
    const details = `Updated alliance: ${changeDetails}`;
    await this.log(userId, "UPDATE", "alliance", allianceId, details, req);
  }

  /**
   * Log alliance deletion
   */
  static async logAllianceDelete(userId, allianceId, allianceData, req) {
    const details = `Deleted alliance: ${allianceData.name} (Tag: ${allianceData.tag})`;
    await this.log(userId, "DELETE", "alliance", allianceId, details, req);
  }

  /**
   * Log resource contribution
   */
  static async logResourceContribution(userId, memberId, allianceId, resources, action = "CREATE", req) {
    const resourceDetails = Object.entries(resources)
      .filter(([_, val]) => val)
      .map(([key, val]) => `${key}: ${val}`)
      .join(", ");
    const details = `${action === "CREATE" ? "Added" : "Updated"} contribution: ${resourceDetails}`;
    await this.log(userId, action, "resource", memberId, details, req);
  }

  /**
   * Log bank operation
   */
  static async logBankOperation(userId, bankId, operation, details, req) {
    await this.log(userId, "UPDATE", "bank", bankId, `${operation}: ${details}`, req);
  }

  /**
   * Get audit trail untuk user tertentu
   */
  static async getUserAuditTrail(userId, limit = 50) {
    try {
      const logs = await db.query(
        `SELECT * FROM audit_logs 
         WHERE user_id = ?
         ORDER BY timestamp DESC
         LIMIT ?`,
        {
          replacements: [userId, limit],
          type: QueryTypes.SELECT
        }
      );
      return logs;
    } catch (error) {
      console.error("[AUDIT TRAIL ERROR]", error);
      return [];
    }
  }

  /**
   * Get audit trail untuk resource tertentu
   */
  static async getResourceAuditTrail(targetType, targetId, limit = 50) {
    try {
      const logs = await db.query(
        `SELECT * FROM audit_logs 
         WHERE target_type = ? AND target_id = ?
         ORDER BY timestamp DESC
         LIMIT ?`,
        {
          replacements: [targetType, targetId, limit],
          type: QueryTypes.SELECT
        }
      );
      return logs;
    } catch (error) {
      console.error("[AUDIT TRAIL ERROR]", error);
      return [];
    }
  }
}

export default AuditLogger;
