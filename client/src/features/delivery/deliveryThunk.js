import { createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../../services/delivery.api';

// Fetch Delivery Partner Profile
export const fetchDeliveryProfile = createAsyncThunk(
    'delivery/fetchProfile',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.getPartnerProfileAPI();
            return data.partner;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch profile');
        }
    }
);

// Toggle Availability (Online/Offline)
export const toggleAvailabilityStatus = createAsyncThunk(
    'delivery/toggleAvailability',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.toggleAvailabilityAPI();
            return data.isAvailable;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to toggle availability');
        }
    }
);

// Fetch Active Order
export const fetchActiveOrderInfo = createAsyncThunk(
    'delivery/fetchActiveOrder',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.getActiveOrderAPI();
            return data.order;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch active order');
        }
    }
);

// Mark Order Picked Up (out_for_delivery)
export const markPickedUpThunk = createAsyncThunk(
    'delivery/markPickedUp',
    async (orderId, { rejectWithValue }) => {
        try {
            const { data } = await api.markPickedUpAPI(orderId);
            return data.order;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to mark as picked up');
        }
    }
);

// Mark Order Delivered
export const markOrderAsDeliveredThunk = createAsyncThunk(
    'delivery/markDelivered',
    async (orderId, { rejectWithValue }) => {
        try {
            const { data } = await api.markDeliveredAPI(orderId);
            return data.order;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to complete delivery');
        }
    }
);
