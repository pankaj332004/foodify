import axiosInstance from './axios';

export const createPaymentIntentAPI = (orderId) =>
    axiosInstance.post('/payments/create-intent', { orderId });

export const confirmPaymentAPI = (paymentIntentId) =>
    axiosInstance.post('/payments/confirm', { paymentIntentId });
