import API from './axios';

export const getAdminStatsAPI = () => API.get('/admin/stats');
export const getAllUsersAPI = () => API.get('/users');
export const toggleUserStatusAPI = (id) => API.put(`/users/${id}/toggle`);
export const getAllRestaurantsAPI = () => API.get('/admin/restaurants');

export const toggleRestaurantStatusAPI = (id, data) => API.put(`/restaurants/${id}`, data);
export const deleteRestaurantAPI = (id) => API.delete(`/restaurants/${id}`);
