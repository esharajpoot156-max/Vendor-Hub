import api from './axios';

export const getQuotations = (filters = {}) => api.get('/quotations', { params: filters });

export const getQuotationById = (id) => api.get(`/quotations/${id}`);

export const createQuotationRequest = (data) => api.post('/quotations', data);

export const submitQuotationResponse = (id, data) => api.put(`/quotations/${id}/respond`, data);

export const updateQuotationStatus = (id, status) =>
  api.put(`/quotations/${id}/status`, { status });

export const deleteQuotation = (id) => api.delete(`/quotations/${id}`);

export const getQuotationRequests = () => api.get('/quotations/requests');

export const compareQuotations = (requestGroup) => api.get(`/quotations/compare/${requestGroup}`);

export const getDashboardStats = () => api.get('/dashboard');