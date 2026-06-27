import api from './axios';

export const getVendors = (search = '') =>
  api.get('/vendors', { params: search ? { search } : {} });

export const getVendorById = (id) => api.get(`/vendors/${id}`);

export const createVendor = (data) => api.post('/vendors', data);

export const updateVendor = (id, data) => api.put(`/vendors/${id}`, data);

export const deleteVendor = (id) => api.delete(`/vendors/${id}`);