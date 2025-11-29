import { apiClient } from './api';

export const accreditationInstrumentsService = {
  list: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const qs = query ? `?${query}` : '';
    return apiClient.get(`/api/accreditation-instruments${qs}`);
  },
  stats: () => apiClient.get('/api/accreditation-instruments/stats'),
  export: (type) => apiClient.get(`/api/accreditation-instruments/${encodeURIComponent(type)}/export`, {
    headers: { 'Accept': 'application/json' }
  })
};
