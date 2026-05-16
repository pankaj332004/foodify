import { createSlice } from '@reduxjs/toolkit';
import { fetchRestaurantReviews, createReview, deleteReview } from './reviewThunk';

const initialState = {
    reviews: [],
    total: 0,
    page: 1,
    pages: 1,
    isLoading: false,
    error: null,
};

const reviewSlice = createSlice({
    name: 'review',
    initialState,
    reducers: {
        clearReviews: (state) => {
            state.reviews = [];
        },
    },
    extraReducers: (builder) => {
        // Fetch Reviews
        builder
            .addCase(fetchRestaurantReviews.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchRestaurantReviews.fulfilled, (state, action) => {
                state.isLoading = false;
                state.reviews = action.payload.reviews;
                state.total = action.payload.total;
                state.page = action.payload.page;
                state.pages = action.payload.pages;
            })
            .addCase(fetchRestaurantReviews.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });

        // Create Review
        builder
            .addCase(createReview.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createReview.fulfilled, (state, action) => {
                state.isLoading = false;
                state.reviews.unshift(action.payload);
                state.total += 1;
            })
            .addCase(createReview.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });

        // Delete Review
        builder
            .addCase(deleteReview.fulfilled, (state, action) => {
                state.reviews = state.reviews.filter(review => review._id !== action.payload);
                state.total -= 1;
            });
    },
});

export const { clearReviews } = reviewSlice.actions;
export default reviewSlice.reducer;
