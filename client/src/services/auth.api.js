import axiosInstance from './axios';

export const registerAPI = (data) => axiosInstance.post('/auth/register', data);
export const loginAPI = (data) => axiosInstance.post('/auth/login', data);
export const logoutAPI = () => axiosInstance.post('/auth/logout');
export const getMeAPI = () => axiosInstance.get('/auth/me');
export const forgotPasswordAPI = (email) => axiosInstance.post('/auth/forgot-password', { email });
