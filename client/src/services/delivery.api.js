import axiosInstance from './axios';

export const registerPartnerAPI = (data) => axiosInstance.post('/delivery/register', data);
export const getPartnerProfileAPI = () => axiosInstance.get('/delivery/profile');
export const toggleAvailabilityAPI = () => axiosInstance.put('/delivery/toggle-availability');
export const getActiveOrderAPI = () => axiosInstance.get('/delivery/active-order');
export const markPickedUpAPI = (orderId) => axiosInstance.put(`/orders/${orderId}/status`, { status: 'out_for_delivery' });
export const markDeliveredAPI = (orderId) => axiosInstance.put(`/delivery/complete/${orderId}`);
