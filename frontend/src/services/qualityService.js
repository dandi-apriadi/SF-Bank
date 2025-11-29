import { apiClient, API_BASE_URL } from './api';

const prefix = '/api/quality';

export const qualityService = {
  fetchOverview() {
    return apiClient.get(`/api/quality/overview`);
  },
  fetchStats() {
    return apiClient.get(`${prefix}/kpis/stats`);
  },
  fetchKpis(params = {}) {
    const query = new URLSearchParams(params).toString();
    return apiClient.get(`${prefix}/kpis${query ? `?${query}` : ''}`);
  },
  fetchRisks(params = {}) {
    const query = new URLSearchParams(params).toString();
    return apiClient.get(`${prefix}/risks${query ? `?${query}` : ''}`);
  },
  getRisk(id) {
    return apiClient.get(`${prefix}/risks/${id}`);
  },
  createRisk(data) {
    return apiClient.post(`${prefix}/risks`, data);
  },
  updateRisk(id, data) {
    return apiClient.put(`${prefix}/risks/${id}`, data);
  },
  deleteRisk(id) {
    return apiClient.delete(`${prefix}/risks/${id}`);
  },
  fetchRecommendations(params = {}) {
    const query = new URLSearchParams(params).toString();
    return apiClient.get(`${prefix}/recommendations${query ? `?${query}` : ''}`);
  },
  getRecommendation(id) {
    return apiClient.get(`${prefix}/recommendations/${id}`);
  },
  createRecommendation(data) {
    return apiClient.post(`${prefix}/recommendations`, data);
  },
  updateRecommendation(id, data) {
    return apiClient.put(`${prefix}/recommendations/${id}`, data);
  },
  deleteRecommendation(id) {
    return apiClient.delete(`${prefix}/recommendations/${id}`);
  },
  createKpi(data) {
    return apiClient.post(`${prefix}/kpis`, data);
  },
  updateKpi(id, data) {
    return apiClient.put(`${prefix}/kpis/${id}`, data);
  },
  deleteKpi(id) {
    return apiClient.delete(`${prefix}/kpis/${id}`);
  },
  exportCsv(type) {
    const map = { kpis: 'kpis', risks: 'risks', recommendations: 'recommendations' };
    const key = map[type];
    if (!key) throw new Error('Unknown export type');
    const base = API_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : '');
    return fetch(`${base}/api/quality/export/${key}.csv`, { credentials: 'include' })
      .then(r => r.blob());
  },
  exportExcel(type) {
    const map = { kpis: 'kpis.xlsx', risks: 'risks.xlsx', recommendations: 'recommendations.xlsx' };
    const key = map[type];
    if (!key) throw new Error('Unknown export type');
    const base = API_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : '');
    return fetch(`${base}/api/quality/export/${key}`, { credentials: 'include' })
      .then(r => r.blob());
  }
};
