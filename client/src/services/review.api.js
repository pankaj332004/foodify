import axiosInstance from './axios';

export const getRestaurantReviewsAPI = (restaurantId) => axiosInstance.get(`/reviews/restaurant/${restaurantId}`);
export const createReviewAPI = (data) => axiosInstance.post('/reviews', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
});
export const deleteReviewAPI = (id) => axiosInstance.delete(`/reviews/${id}`);
