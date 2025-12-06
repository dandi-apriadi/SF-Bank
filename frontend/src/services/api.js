// Base API configuration - normalize by removing any trailing slash
const API_BASE_URL = (process.env.REACT_APP_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '');

/**
 * API client for making HTTP requests
 */
class ApiClient {
  constructor(baseURL = API_BASE_URL) {
    // Ensure baseURL never ends with a trailing slash to avoid double-slash when
    // concatenating with endpoint strings that begin with '/'
    this.baseURL = (baseURL || '').toString().replace(/\/$/, '');
  }

  /**
   * Make a request to the API
   * @param {string} endpoint - API endpoint
   * @param {object} options - Fetch options
   * @returns {Promise} API response
   */
  async request(endpoint, options = {}) {
    // Normalize endpoint so it always starts with exactly one leading slash
    // and has no duplicate leading slashes. This ensures callers that
    // incorrectly pass `//api/...` won't create `http://host//api/...`.
    const ep = (endpoint || '').toString();
    const cleanEndpoint = '/' + ep.replace(/^\/+/, '');
    const url = `${this.baseURL}${cleanEndpoint}`;
    
    const config = {
      credentials: 'include', // Include cookies for session-based auth
      ...options,
    };

    // Only set Content-Type for non-FormData requests
    if (!options.headers || !options.headers.hasOwnProperty('Content-Type')) {
      if (!(options.body instanceof FormData)) {
        config.headers = {
          'Content-Type': 'application/json',
          ...options.headers,
        };
      } else {
        // For FormData, let browser set Content-Type with boundary
        config.headers = {
          ...options.headers,
        };
      }
    } else {
      config.headers = {
        ...options.headers,
      };
    }

    try {
      console.log('Making API request to:', url);
      console.log('Request config:', { 
        method: config.method, 
        credentials: config.credentials,
        headers: config.headers 
      });
      
      const response = await fetch(url, config);
      
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      // Handle non-JSON responses
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response;
      }

      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        let errorMessage = data.msg || data.message || `HTTP error! status: ${response.status}`;
        if (response.status === 401) {
          errorMessage = 'Please login to your Account!';
        }
        console.error('API Error:', errorMessage, data);
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  /**
   * GET request
   * @param {string} endpoint - API endpoint
   * @param {object} options - Additional fetch options
   * @returns {Promise} API response
   */
  get(endpoint, options = {}) {
    return this.request(endpoint, {
      method: 'GET',
      ...options,
    });
  }

  /**
   * POST request
   * @param {string} endpoint - API endpoint
   * @param {object} data - Request body data
   * @param {object} options - Additional fetch options
   * @returns {Promise} API response
   */
  post(endpoint, data = null, options = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : null,
      ...options,
    });
  }

  /**
   * PUT request
   * @param {string} endpoint - API endpoint
   * @param {object} data - Request body data
   * @param {object} options - Additional fetch options
   * @returns {Promise} API response
   */
  put(endpoint, data = null, options = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : null,
      ...options,
    });
  }

  /**
   * DELETE request
   * @param {string} endpoint - API endpoint
   * @param {object} options - Additional fetch options
   * @returns {Promise} API response
   */
  delete(endpoint, options = {}) {
    return this.request(endpoint, {
      method: 'DELETE',
      ...options,
    });
  }

  /**
   * PATCH request
   * @param {string} endpoint - API endpoint
   * @param {object} data - Request body data
   * @param {object} options - Additional fetch options
   * @returns {Promise} API response
   */
  patch(endpoint, data = null, options = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : null,
      ...options,
    });
  }
}

// Create and export API client instance
export const apiClient = new ApiClient();

// Export base URL for use in other files
export { API_BASE_URL };
