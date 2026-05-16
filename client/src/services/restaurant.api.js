import axiosInstance from './axios';

// ─── Public ───────────────────────────────────────────────────────────────────
export const getRestaurantsAPI = (params) => axiosInstance.get('/restaurants', { params });
export const getRestaurantByIdAPI = (id) => axiosInstance.get(`/restaurants/${id}`);
export const getMenuAPI = (restaurantId) => axiosInstance.get(`/menu/${restaurantId}`);
export const searchRestaurantsAPI = (query) =>
    axiosInstance.get('/restaurants', { params: { search: query } });

// ─── Owner Management ─────────────────────────────────────────────────────────

// Restaurant Profile
export const getMyRestaurantAPI = () => axiosInstance.get('/restaurants/my');
export const createRestaurantAPI = (data) => axiosInstance.post('/restaurants', data);
export const updateRestaurantAPI = (id, data) => axiosInstance.put(`/restaurants/${id}`, data);
export const toggleRestaurantOpenAPI = (id) => axiosInstance.put(`/restaurants/${id}/toggle-open`);

// Menu Management
export const createMenuItemAPI = (restaurantId, data) => axiosInstance.post(`/menu/${restaurantId}`, data);
export const updateMenuItemAPI = (itemId, data) => axiosInstance.put(`/menu/item/${itemId}`, data);
export const deleteMenuItemAPI = (itemId) => axiosInstance.delete(`/menu/item/${itemId}`);
export const toggleMenuItemAPI = (itemId) => axiosInstance.put(`/menu/item/${itemId}/toggle`);
