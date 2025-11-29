import { apiClient } from './api';

export const reportsService = {
  fetchOverview() {
    return apiClient.get('/api/reports/exec/overview');
  },
  fetchRecent() {
    return apiClient.get('/api/reports/exec/recent');
  },
  fetchTemplates() {
    return apiClient.get('/api/reports/exec/templates');
  },
  fetchSchedules() {
    return apiClient.get('/api/reports/exec/schedules');
  }
};
