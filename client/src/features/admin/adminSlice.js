import { createSlice } from '@reduxjs/toolkit';
import {
    fetchAdminStats,
    fetchAllUsers,
    toggleUserStatus,
    fetchAllRestaurants,
    updateRestaurantStatus,
    deleteRestaurant
} from './adminThunk';

const initialState = {
    stats: {
        totalUsers: 0,
        totalRestaurants: 0,
        totalOrders: 0,
        totalRevenue: 0
    },
    users: [],
    restaurants: [],
    loading: false,
    error: null,
};

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        clearAdminError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Stats
            .addCase(fetchAdminStats.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAdminStats.fulfilled, (state, action) => {
                state.loading = false;
                state.stats = action.payload;
            })
            .addCase(fetchAdminStats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch Users
            .addCase(fetchAllUsers.fulfilled, (state, action) => {
                state.users = action.payload;
            })
            // Toggle User Status
            .addCase(toggleUserStatus.fulfilled, (state, action) => {
                const user = state.users.find(u => u._id === action.payload.id);
                if (user) {
                    user.isActive = action.payload.isActive;
                }
            })
            // Fetch Restaurants
            .addCase(fetchAllRestaurants.fulfilled, (state, action) => {
                state.restaurants = action.payload;
            })
            // Update Restaurant Status
            .addCase(updateRestaurantStatus.fulfilled, (state, action) => {
                const index = state.restaurants.findIndex(r => r._id === action.payload._id);
                if (index !== -1) {
                    state.restaurants[index] = action.payload;
                }
            })
            // Delete Restaurant
            .addCase(deleteRestaurant.fulfilled, (state, action) => {
                state.restaurants = state.restaurants.filter(r => r._id !== action.payload);
            });
    },
});

export const { clearAdminError } = adminSlice.actions;

export const selectAdminStats = (state) => state.admin.stats;
export const selectAdminUsers = (state) => state.admin.users;
export const selectAdminRestaurants = (state) => state.admin.restaurants;
export const selectAdminLoading = (state) => state.admin.loading;
export const selectAdminError = (state) => state.admin.error;

export default adminSlice.reducer;
