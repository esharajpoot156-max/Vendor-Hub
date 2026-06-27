import axios from 'axios';

const vendorApi = axios.create({
  baseURL: 'http://localhost:5000/api',
});

vendorApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('vendorToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

vendorApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('vendorToken');
      localStorage.removeItem('vendorData');
      window.location.href = '/vendor-login';
    }
    return Promise.reject(error);
  }
);

export const getMyQuotations = () => vendorApi.get('/quotations/vendor/mine');

export const vendorSubmitResponse = (id, data) =>
  vendorApi.put(`/quotations/vendor/${id}/respond`, data);