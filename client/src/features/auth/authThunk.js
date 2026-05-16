import { createAsyncThunk } from '@reduxjs/toolkit';
import { loginAPI, registerAPI, logoutAPI, getMeAPI, forgotPasswordAPI } from '../../services/auth.api';


export const registerUser = createAsyncThunk(
    'auth/register',
    async (formData, { rejectWithValue }) => {
        try {
            const { data } = await registerAPI(formData);
            if (data.token) localStorage.setItem('token', data.token);
            return data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Registration failed');
        }
    }
);

export const loginUser = createAsyncThunk(
    'auth/login',
    async (formData, { rejectWithValue }) => {
        try {
            const { data } = await loginAPI(formData);
            if (data.token) localStorage.setItem('token', data.token);
            return data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Login failed');
        }
    }
);

export const logoutUser = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
    try {
        await logoutAPI();
        localStorage.removeItem('token');
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Logout failed');
    }
});

export const fetchMe = createAsyncThunk('auth/me', async (_, { rejectWithValue }) => {
    try {
        const { data } = await getMeAPI();
        return data.user;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Failed to fetch user');
    }
});

export const forgotPassword = createAsyncThunk('auth/forgotPassword', async (email, { rejectWithValue }) => {
    try {
        const { data } = await forgotPasswordAPI(email);
        return data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Failed to send reset link');
    }
});
