import { apiClient } from './api';

// Service untuk PPEPP Cycle (siklus mutu) agar Action Tracking bisa memilih ppepp_id yang valid
const base = '/api/ppepp-cycles';

export const ppeppService = {
  list(params = {}) {
    const query = new URLSearchParams(params).toString();
    return apiClient.get(`${base}${query ? `?${query}` : ''}`);
  },
  get(id) { return apiClient.get(`${base}/${id}`); },
  create(data) { return apiClient.post(base, data); },
  update(id, data) { return apiClient.put(`${base}/${id}`, data); },
  delete(id) { return apiClient.delete(`${base}/${id}`); },
  // Actions endpoints
  actions: {
    list(params = {}) {
      const query = new URLSearchParams(params).toString();
      return apiClient.get(`/api/ppepp-actions${query ? `?${query}` : ''}`);
    },
    get(id) { return apiClient.get(`/api/ppepp-actions/${id}`); },
    create(data) { return apiClient.post('/api/ppepp-actions', data); },
    update(id, data) { return apiClient.put(`/api/ppepp-actions/${id}`, data); },
    delete(id) { return apiClient.delete(`/api/ppepp-actions/${id}`); }
  }
};

export default ppeppService;