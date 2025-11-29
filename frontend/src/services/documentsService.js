import { apiClient } from './api';

export const documentsService = {
  // Templates
  listTemplates: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return apiClient.get(`/api/document-templates${qs ? `?${qs}` : ''}`);
  },
  getTemplate: (id) => apiClient.get(`/api/document-templates/${id}`),
  createTemplate: (data) => apiClient.post(`/api/document-templates`, data),
  deleteTemplate: (id) => apiClient.delete(`/api/document-templates/${id}`),
  // Documents
  listDocuments: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return apiClient.get(`/api/documents${qs ? `?${qs}` : ''}`);
  },
  getDocument: (id) => apiClient.get(`/api/documents/${id}`),
  createDocument: (data) => apiClient.post(`/api/documents`, data),
  updateDocument: (id, data) => apiClient.put(`/api/documents/${id}`, data),
  deleteDocument: (id) => apiClient.delete(`/api/documents/${id}`),
  // Versions
  listVersions: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return apiClient.get(`/api/document-versions${qs ? `?${qs}` : ''}`);
  },
  createVersion: (data) => apiClient.post(`/api/document-versions`, data),
  getVersion: (id) => apiClient.get(`/api/document-versions/${id}`),
  updateVersion: (id, data) => apiClient.put(`/api/document-versions/${id}`, data),
  deleteVersion: (id) => apiClient.delete(`/api/document-versions/${id}`)
};

export default documentsService;