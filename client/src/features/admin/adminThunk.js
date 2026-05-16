import { createAsyncThunk } from '@reduxjs/toolkit';
import * as adminAPI from '../../services/admin.api';

export const fetchAdminStats = createAsyncThunk(
    'admin/fetchStats',
    async (_, { rejectWithValue }) => {
        try {
            const response = await adminAPI.getAdminStatsAPI();
            return response.data.stats;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch stats');
        }
    }
);

export const fetchAllUsers = createAsyncThunk(
    'admin/fetchAllUsers',
    async (_, { rejectWithValue }) => {
        try {
            const response = await adminAPI.getAllUsersAPI();
            return response.data.users;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch users');
        }
    }
);

export const toggleUserStatus = createAsyncThunk(
    'admin/toggleUserStatus',
    async (id, { rejectWithValue }) => {
        try {
            const response = await adminAPI.toggleUserStatusAPI(id);
            return { id, isActive: response.data.isActive };
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to toggle user status');
        }
    }
);

export const fetchAllRestaurants = createAsyncThunk(
    'admin/fetchAllRestaurants',
    async (query, { rejectWithValue }) => {
        try {
            const response = await adminAPI.getAllRestaurantsAPI(query);
            return response.data.restaurants;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch restaurants');
        }
    }
);

export const updateRestaurantStatus = createAsyncThunk(
    'admin/updateRestaurantStatus',
    async ({ id, updates }, { rejectWithValue }) => {
        try {
            const response = await adminAPI.toggleRestaurantStatusAPI(id, updates);
            return response.data.restaurant;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to update restaurant');
        }
    }
);

export const deleteRestaurant = createAsyncThunk(
    'admin/deleteRestaurant',
    async (id, { rejectWithValue }) => {
        try {
            await adminAPI.deleteRestaurantAPI(id);
            return id;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to delete restaurant');
        }
    }
);
