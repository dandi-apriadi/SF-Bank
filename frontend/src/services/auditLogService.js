// services/auditLogService.js
import { apiClient } from "./apiClient";

const API_BASE = "/api/v1";

export const auditLogService = {
  /**
   * Get all audit logs dengan filter
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.limit - Records per page
   * @param {string} params.action - Filter by action (CREATE, UPDATE, DELETE)
   * @param {string} params.targetType - Filter by target type
   * @param {number} params.userId - Filter by user ID
   * @param {string} params.dateFrom - Filter from date
   * @param {string} params.dateTo - Filter to date
   * @param {string} params.search - Search query
   * @returns {Promise} Logs data
   */
  getLogs: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await apiClient.get(`${API_BASE}/audit-logs?${queryString}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching audit logs:", error);
      throw error;
    }
  },

  /**
   * Get single audit log detail
   * @param {number} logId - Audit log ID
   * @returns {Promise} Log detail
   */
  getLogDetail: async (logId) => {
    try {
      const response = await apiClient.get(`${API_BASE}/audit-logs/${logId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching audit log detail:", error);
      throw error;
    }
  },

  /**
   * Get audit log statistics
   * @returns {Promise} Statistics data
   */
  getStatistics: async () => {
    try {
      const response = await apiClient.get(`${API_BASE}/audit-logs/statistics`);
      return response.data;
    } catch (error) {
      console.error("Error fetching audit log statistics:", error);
      throw error;
    }
  },

  /**
   * Get logs by user
   * @param {number} userId - User ID
   * @param {Object} params - Query parameters
   * @returns {Promise} User's logs
   */
  getLogsByUser: async (userId, params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await apiClient.get(`${API_BASE}/audit-logs/user/${userId}?${queryString}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user audit logs:", error);
      throw error;
    }
  },

  /**
   * Get logs by target type and ID
   * @param {string} targetType - Target type (user, alliance, bank, resource)
   * @param {number} targetId - Target ID
   * @returns {Promise} Target's logs
   */
  getLogsByTarget: async (targetType, targetId) => {
    try {
      const response = await apiClient.get(`${API_BASE}/audit-logs/target/${targetType}/${targetId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching target audit logs:", error);
      throw error;
    }
  },

  /**
   * Create audit log (called by backend on action)
   * @param {Object} logData - Log data
   * @returns {Promise} Created log
   */
  createLog: async (logData) => {
    try {
      const response = await apiClient.post(`${API_BASE}/audit-logs`, logData);
      return response.data;
    } catch (error) {
      console.error("Error creating audit log:", error);
      throw error;
    }
  },

  /**
   * Export logs to CSV
   * @param {Object} params - Query parameters
   * @returns {Promise} CSV file
   */
  exportLogs: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(`${API_BASE}/audit-logs/export/csv?${queryString}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.blob();
    } catch (error) {
      console.error("Error exporting audit logs:", error);
      throw error;
    }
  },

  /**
   * Delete old logs (retention policy)
   * @param {number} daysOld - Delete logs older than X days
   * @returns {Promise} Result
   */
  deleteOldLogs: async (daysOld = 90) => {
    try {
      const response = await apiClient.post(`${API_BASE}/audit-logs/delete-old`, { daysOld });
      return response.data;
    } catch (error) {
      console.error("Error deleting old audit logs:", error);
      throw error;
    }
  },
};
