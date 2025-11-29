import { apiClient, API_BASE_URL } from './api';

// Service wrapper for PPEPP Actions (action tracking)
// Backend endpoints: /api/ppepp-actions
// Supports list (with query), get, create, update, delete.

const base = '/api/ppepp-actions';

export const actionTrackingService = {
  list(params = {}) {
    const query = new URLSearchParams(params).toString();
    return apiClient.get(`${base}${query ? `?${query}` : ''}`);
  },
  get(id) {
    return apiClient.get(`${base}/${id}`);
  },
  create(data) {
    return apiClient.post(base, data);
  },
  update(id, data) {
    return apiClient.put(`${base}/${id}`, data);
  },
  delete(id) {
    return apiClient.delete(`${base}/${id}`);
  },
  exportCsv(params = {}) {
    const query = new URLSearchParams(params).toString();
    const url = `${API_BASE_URL}/api/ppepp-actions-export${query ? `?${query}` : ''}`;
    return fetch(url, { credentials: 'include' });
  }
};

export default actionTrackingService;