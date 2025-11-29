import { apiClient } from './api';

export const notificationService = {
  list: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiClient.get(`/api/notifications${query ? `?${query}` : ''}`);
  },
  get: (id) => apiClient.get(`/api/notifications/${id}`),
  create: (data) => apiClient.post(`/api/notifications`, data),
  update: (id, data) => apiClient.put(`/api/notifications/${id}`, data),
  delete: (id) => apiClient.delete(`/api/notifications/${id}`),
  markRead: (id) => apiClient.patch(`/api/notifications/${id}/read`),
  // Optional bulk helpers (if future backend supports):
  // markAllRead: () => apiClient.patch(`/api/notifications/read-all`),
  // clearAll: () => apiClient.delete(`/api/notifications`)
};
