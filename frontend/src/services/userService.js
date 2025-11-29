import { apiClient } from './api.js';

/**
 * User Management Service
 * Handles all user-related API calls
 */
export class UserService {
  /**
   * Get all users
   * @param {AbortSignal} signal - AbortController signal for cancelling requests
   * @returns {Promise} List of users
   */
  static async getUsers(signal) {
    try {
      const response = await apiClient.get('/api/administrator/users', { signal });
      return response.data || [];
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  /**
   * Get user by ID
   * @param {string} id - User ID
   * @param {AbortSignal} signal - AbortController signal for cancelling requests
   * @returns {Promise} User data
   */
  static async getUserById(id, signal) {
    try {
      const response = await apiClient.get(`/api/administrator/users/${id}`, { signal });
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  /**
   * Create new user
   * @param {object} userData - User data
   * @returns {Promise} Created user data
   */
  static async createUser(userData) {
    try {
      const response = await apiClient.post('/api/administrator/users', userData);
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  /**
   * Update user
   * @param {string} id - User ID
   * @param {object} userData - Updated user data
   * @returns {Promise} Updated user data
   */
  static async updateUser(id, userData) {
    try {
      const response = await apiClient.put(`/api/administrator/users/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  /**
   * Delete user
   * @param {string} id - User ID
   * @returns {Promise} Success message
   */
  static async deleteUser(id) {
    try {
      const response = await apiClient.delete(`/api/administrator/users/${id}`);
      return response;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  /**
   * Change password
   * @param {object} passwordData - Old and new password
   * @returns {Promise} Success message
   */
  static async changePassword(passwordData) {
    try {
      const response = await apiClient.patch('/api/user/change-password', passwordData);
      return response;
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  }
}

export default UserService;
