import { apiClient } from './api';

const BASE_PATH = '/api/v1';

export const fetchAlliances = () => apiClient.get(`${BASE_PATH}/alliances`);

export const fetchReportsSummary = () => apiClient.get(`${BASE_PATH}/reports/summary`);

export const fetchAllianceContributions = (allianceId, params = {}) => {
  const query = new URLSearchParams(params).toString();
  const suffix = query ? `?${query}` : '';
  return apiClient.get(`${BASE_PATH}/alliances/${allianceId}/contributions${suffix}`);
};

export default {
  fetchAlliances,
  fetchReportsSummary,
  fetchAllianceContributions,
};
