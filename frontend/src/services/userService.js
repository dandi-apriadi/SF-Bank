import { apiClient } from './api.js';

/**
 * User Management Service
 * Handles all user-related API calls
 */

const userService = {
  /**
   * Get all users with optional filters
   * @param {object} filters - Filter options (search, role, page, limit)
   * @returns {Promise} Users data
   */
  getAllUsers: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      if (filters.search) params.append('search', filters.search);
      if (filters.role && filters.role !== 'All') params.append('role', filters.role);
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);
      
      const queryString = params.toString();
      const endpoint = `/api/v1/users${queryString ? '?' + queryString : ''}`;
      
      const response = await apiClient.get(endpoint);
      return response;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  /**
   * Get single user by ID
   * @param {number} userId - User ID
   * @returns {Promise} User data
   */
  getUserById: async (userId) => {
    try {
      const response = await apiClient.get(`/api/v1/users/${userId}`);
      return response;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  /**
   * Create new user
   * @param {object} userData - User data (name, email, password, role, user_id, alliance_id)
   * @returns {Promise} Created user
   */
  createUser: async (userData) => {
    try {
      const response = await apiClient.post('/api/v1/users', userData);
      return response;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  /**
   * Update user
   * @param {number} userId - User ID
   * @param {object} userData - Updated user data
   * @returns {Promise} Updated user
   */
  updateUser: async (userId, userData) => {
    try {
      const response = await apiClient.put(`/api/v1/users/${userId}`, userData);
      return response;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  /**
   * Delete user
   * @param {number} userId - User ID
   * @returns {Promise} Deletion response
   */
  deleteUser: async (userId) => {
    try {
      const response = await apiClient.delete(`/api/v1/users/${userId}`);
      return response;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  /**
   * Get user statistics
   * @returns {Promise} User statistics
   */
  getUserStats: async () => {
    try {
      const response = await apiClient.get('/api/v1/users/stats/overview');
      return response;
    } catch (error) {
      console.error('Error fetching user stats:', error);
      throw error;
    }
  },

  /**
   * Search users
   * @param {string} query - Search query
   * @returns {Promise} Search results
   */
  searchUsers: async (query) => {
    try {
      const response = await apiClient.get(`/api/v1/users/search?q=${encodeURIComponent(query)}`);
      return response;
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    }
  },

  /**
   * Get users by role
   * @param {string} role - User role
   * @returns {Promise} Users with specified role
   */
  getUsersByRole: async (role) => {
    try {
      const response = await apiClient.get(`/api/v1/users/role/${role}`);
      return response;
    } catch (error) {
      console.error('Error fetching users by role:', error);
      throw error;
    }
  },

  /**
   * Update user role
   * @param {number} userId - User ID
   * @param {string} role - New role
   * @returns {Promise} Updated user
   */
  updateUserRole: async (userId, role) => {
    try {
      const response = await apiClient.put(`/api/v1/users/${userId}/role`, { role });
      return response;
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  },

  /**
   * Change user status
   * @param {number} userId - User ID
   * @param {string} status - New status (Active/Inactive)
   * @returns {Promise} Updated user
   */
  changeUserStatus: async (userId, status) => {
    try {
      const response = await apiClient.put(`/api/v1/users/${userId}/status`, { status });
      return response;
    } catch (error) {
      console.error('Error changing user status:', error);
      throw error;
    }
  },

  /**
   * Reset user password
   * @param {number} userId - User ID
   * @param {string} newPassword - New password
   * @returns {Promise} Reset response
   */
  resetUserPassword: async (userId, newPassword) => {
    try {
      const response = await apiClient.put(`/api/v1/users/${userId}/password`, { password: newPassword });
      return response;
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  },
};

export default userService;
