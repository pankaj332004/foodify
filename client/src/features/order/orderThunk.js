import { createAsyncThunk } from '@reduxjs/toolkit';
import {
    placeOrderAPI,
    getMyOrdersAPI,
    getOrderByIdAPI,
    cancelOrderAPI,
    getRestaurantOrdersAPI,
    updateOrderStatusAPI,
    deleteOrderHistoryAPI
} from '../../services/order.api';

export const fetchMyOrders = createAsyncThunk(
    'order/fetchMyOrders',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await getMyOrdersAPI();
            return data.orders;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch orders');
        }
    }
);

export const placeOrder = createAsyncThunk(
    'order/placeOrder',
    async (orderData, { rejectWithValue }) => {
        try {
            const { data } = await placeOrderAPI(orderData);
            return { order: data.order, payment: data.payment };
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to place order');
        }
    }
);

export const fetchOrderById = createAsyncThunk(
    'order/fetchById',
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await getOrderByIdAPI(id);
            return data.order;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch order');
        }
    }
);

export const cancelOrder = createAsyncThunk(
    'order/cancel',
    async ({ id, reason }, { rejectWithValue }) => {
        try {
            const { data } = await cancelOrderAPI(id, reason);
            return data.order;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to cancel order');
        }
    }
);

export const deleteOrderHistory = createAsyncThunk(
    'order/deleteHistory',
    async (id, { rejectWithValue }) => {
        try {
            await deleteOrderHistoryAPI(id);
            return id;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to delete order history');
        }
    }
);

// ─── Restaurant Owner Actions ─────────────────────────────────────────────────

export const fetchRestaurantOrders = createAsyncThunk(
    'order/fetchRestaurantOrders',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await getRestaurantOrdersAPI();
            return data.orders;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch your orders');
        }
    }
);

export const updateOrderStatusThunk = createAsyncThunk(
    'order/updateStatus',
    async ({ id, status }, { rejectWithValue }) => {
        try {
            const { data } = await updateOrderStatusAPI(id, status);
            return data.order;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to update order status');
        }
    }
);
