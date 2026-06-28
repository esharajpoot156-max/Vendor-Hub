import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const vendorLogin = (credentials) =>
  axios.post(`${API_URL}/vendor-auth/login`, credentials);