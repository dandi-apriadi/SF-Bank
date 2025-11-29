import { apiClient, API_BASE_URL } from './api';

const prefix = '/api/evidences';

export const evidenceService = {
  list: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await apiClient.get(`${prefix}${query ? `?${query}` : ''}`);
    return res; // { total, rows }
  },
  get: (id) => apiClient.get(`${prefix}/${id}`),
  create: (data) => apiClient.post(`${prefix}`, data),
  update: (id, data) => apiClient.put(`${prefix}/${id}`, data),
  delete: (id) => apiClient.delete(`${prefix}/${id}`),
  upload: async ({ file, cycle_id, criteria_id }) => {
    const form = new FormData();
    form.append('file', file);
    form.append('cycle_id', cycle_id);
    form.append('criteria_id', criteria_id);
    // Use raw fetch to handle FormData via apiClient.request
    return apiClient.request(`/api/evidences/upload`, { method: 'POST', body: form });
  },
  buildFileUrl: (file_path) => {
    if (!file_path) return '';
    // Backend serves ./public at root, strip leading ./ and public/
    let normalized = file_path.replace(/^\.\/?/, '');
    normalized = normalized.replace(/^public\//, '');
    // Avoid modifying the protocol (http://) when normalizing slashes.
    // Normalize base (remove trailing slash) and normalized path (remove leading slashes)
    const base = (API_BASE_URL || '').toString().replace(/\/$/, '');
    const path = normalized.replace(/^\/+/, '');
    return `${base}/${path}`;
  }
};
