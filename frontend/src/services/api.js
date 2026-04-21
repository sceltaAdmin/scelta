import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
  withCredentials: true,
  timeout: 30000,
});

// Slow request warning
let slowTimer;
API.interceptors.request.use(config => {
  slowTimer = setTimeout(() => {
    console.warn('Request is taking longer than usual...');
  }, 8000);
  return config;
});

API.interceptors.response.use(
  response => { clearTimeout(slowTimer); return response; },
  error => { clearTimeout(slowTimer); return Promise.reject(error); }
);

// Retry failed requests once
API.interceptors.response.use(
  response => response,
  async error => {
    const config = error.config;
    if (!config || config._retry) return Promise.reject(error);
    if (error.code === 'ECONNABORTED' || !error.response) {
      config._retry = true;
      await new Promise(r => setTimeout(r, 2000));
      return API(config);
    }
    return Promise.reject(error);
  }
);

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('scelta_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const register = (data) => API.post('/api/auth/register', data);
export const login    = (data) => API.post('/api/auth/login', data);
export const logout   = ()     => API.post('/api/auth/logout');
export const getMe    = ()     => API.get('/api/auth/me');

export const getProducts   = (params) => API.get('/api/products', { params });
export const getProduct    = (id)     => API.get(`/api/products/${id}`);
export const getCategories = ()       => API.get('/api/categories');

export const getCart        = ()             => API.get('/api/cart');
export const addToCart      = (data)         => API.post('/api/cart', data);
export const updateCartItem = (itemId, data) => API.patch(`/api/cart/${itemId}`, data);
export const removeCartItem = (itemId)       => API.delete(`/api/cart/${itemId}`);

export const getWishlist        = ()     => API.get('/api/wishlist');
export const toggleWishlist     = (data) => API.post('/api/wishlist', data);
export const removeFromWishlist = (id)   => API.delete(`/api/wishlist/${id}`);

export const getOrders   = ()     => API.get('/api/orders');
export const placeOrder  = (data) => API.post('/api/orders', data);
export const cancelOrder = (id)   => API.patch(`/api/orders/${id}`);

export const getReviews = (productId) => API.get('/api/reviews', { params: { productId } });
export const postReview = (data)      => API.post('/api/reviews', data);

export const validateCoupon = (code, total) => API.get('/api/coupons/validate', { params: { code, total } });

export const getProfile    = ()     => API.get('/api/profile');
export const updateProfile = (data) => API.put('/api/profile', data);

export default API;
