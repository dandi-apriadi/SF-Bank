import { apiClient } from './api.js';

/**
 * News Service for managing news posts and attachments
 */
class NewsService {
  /**
   * Get all news posts
   * @param {object} params - Query parameters (limit, offset, q, etc.)
   * @returns {Promise} List of news posts
   */
  async getNewsPosts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/api/news-posts?${queryString}` : '/api/news-posts';
    return await apiClient.get(endpoint);
  }

  /**
   * Get a single news post by ID
   * @param {string} id - News post ID
   * @returns {Promise} News post data
   */
  async getNewsPost(id) {
    return await apiClient.get(`/api/news-posts/${id}`);
  }

  /**
   * Create a new news post
   * @param {object} newsData - News post data
   * @param {File} featuredImage - Featured image file (optional)
   * @returns {Promise} Created news post
   */
  async createNewsPost(newsData, featuredImage = null) {
    const formData = new FormData();
    
    // Append text data
    Object.keys(newsData).forEach(key => {
      if (newsData[key] !== null && newsData[key] !== undefined) {
        formData.append(key, newsData[key]);
      }
    });

    // Append image file if provided
    if (featuredImage) {
      formData.append('featured_image', featuredImage);
    }

    return await apiClient.request('/api/news-posts', {
      method: 'POST',
      body: formData,
      headers: {}, // Remove Content-Type to allow browser to set it with boundary
    });
  }

  /**
   * Update an existing news post
   * @param {string} id - News post ID
   * @param {object} newsData - Updated news post data
   * @param {File} featuredImage - Featured image file (optional)
   * @returns {Promise} Updated news post
   */
  async updateNewsPost(id, newsData, featuredImage = null) {
    const formData = new FormData();
    
    // Append text data
    Object.keys(newsData).forEach(key => {
      if (newsData[key] !== null && newsData[key] !== undefined) {
        formData.append(key, newsData[key]);
      }
    });

    // Append image file if provided
    if (featuredImage) {
      formData.append('featured_image', featuredImage);
    }

    return await apiClient.request(`/api/news-posts/${id}`, {
      method: 'PUT',
      body: formData,
      headers: {}, // Remove Content-Type to allow browser to set it with boundary
    });
  }

  /**
   * Delete a news post
   * @param {string} id - News post ID
   * @returns {Promise} Deletion result
   */
  async deleteNewsPost(id) {
    return await apiClient.delete(`/api/news-posts/${id}`);
  }

  /**
   * Publish a news post
   * @param {string} id - News post ID
   * @returns {Promise} Published news post
   */
  async publishNewsPost(id) {
    return await apiClient.post(`/api/news-posts/${id}/publish`);
  }

  /**
   * Get news attachments
   * @param {object} params - Query parameters
   * @returns {Promise} List of news attachments
   */
  async getNewsAttachments(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/api/news-attachments?${queryString}` : '/api/news-attachments';
    return await apiClient.get(endpoint);
  }

  /**
   * Upload file for news
   * @param {File} file - File to upload
   * @param {string} newsId - News post ID (optional)
   * @returns {Promise} Upload result
   */
  async uploadNewsFile(file, newsId = null) {
    const formData = new FormData();
    formData.append('file', file);
    if (newsId) {
      formData.append('news_id', newsId);
    }

    return await apiClient.request('/api/news-upload', {
      method: 'POST',
      body: formData,
      headers: {}, // Remove Content-Type to allow browser to set it with boundary
    });
  }

  /**
   * Delete a news attachment
   * @param {string} id - Attachment ID
   * @returns {Promise} Deletion result
   */
  async deleteNewsAttachment(id) {
    return await apiClient.delete(`/api/news-attachments/${id}`);
  }
}

// Create and export news service instance
export const newsService = new NewsService();
export default newsService;
