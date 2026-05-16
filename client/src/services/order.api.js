import axiosInstance from './axios';

// ─── Customer ─────────────────────────────────────────────────────────────────
export const placeOrderAPI = (data) => axiosInstance.post('/orders', data);
export const getMyOrdersAPI = () => axiosInstance.get('/orders/my');
export const getOrderByIdAPI = (id) => axiosInstance.get(`/orders/${id}`);
export const cancelOrderAPI = (id, reason) =>
    axiosInstance.put(`/orders/${id}/cancel`, { reason });
export const verifyPaymentAPI = (data) => axiosInstance.post('/orders/verify-payment', data);
export const deleteOrderHistoryAPI = (id) => axiosInstance.delete(`/orders/${id}/history`);

// ─── Restaurant Owner ─────────────────────────────────────────────────────────
export const getRestaurantOrdersAPI = () => axiosInstance.get('/orders/restaurant');
export const updateOrderStatusAPI = (id, status) =>
    axiosInstance.put(`/orders/${id}/status`, { status });
