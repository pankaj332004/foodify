import { createAsyncThunk } from '@reduxjs/toolkit';
import { getRestaurantReviewsAPI, createReviewAPI, deleteReviewAPI } from '../../services/review.api';

export const fetchRestaurantReviews = createAsyncThunk(
    'review/fetchRestaurantReviews',
    async ({ restaurantId, page, limit }, { rejectWithValue }) => {
        try {
            const { data } = await getRestaurantReviewsAPI(restaurantId);
            return data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch reviews');
        }
    }
);

export const createReview = createAsyncThunk(
    'review/createReview',
    async (reviewData, { rejectWithValue }) => {
        try {
            const { data } = await createReviewAPI(reviewData);
            return data.review;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to submit review');
        }
    }
);

export const deleteReview = createAsyncThunk(
    'review/deleteReview',
    async (id, { rejectWithValue }) => {
        try {
            await deleteReviewAPI(id);
            return id;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to delete review');
        }
    }
);
