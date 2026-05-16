import { createAsyncThunk } from '@reduxjs/toolkit';
import {
    getRestaurantsAPI,
    getRestaurantByIdAPI,
    getMenuAPI,
    getMyRestaurantAPI,
    createRestaurantAPI,
    updateRestaurantAPI,
    toggleRestaurantOpenAPI,
    createMenuItemAPI,
    updateMenuItemAPI,
    deleteMenuItemAPI,
    toggleMenuItemAPI,
} from '../../services/restaurant.api';

export const fetchRestaurants = createAsyncThunk(
    'restaurant/fetchAll',
    async (params, { rejectWithValue }) => {
        try {
            const { data } = await getRestaurantsAPI(params);
            return data.restaurants;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch restaurants');
        }
    }
);

export const fetchRestaurantById = createAsyncThunk(
    'restaurant/fetchById',
    async (id, { rejectWithValue }) => {
        try {
            const [restaurantRes, menuRes] = await Promise.all([
                getRestaurantByIdAPI(id),
                getMenuAPI(id),
            ]);
            return {
                restaurant: restaurantRes.data.restaurant,
                menu: menuRes.data.menuItems || menuRes.data.items || [],
            };
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch restaurant');
        }
    }
);

// ─── Owner Actions ────────────────────────────────────────────────────────────

export const fetchMyRestaurant = createAsyncThunk(
    'restaurant/fetchMy',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await getMyRestaurantAPI();
            // data.restaurants is an array for the owner (even if just 1)
            const myRestaurant = data.restaurants[0];
            if (!myRestaurant) return null;

            const menuRes = await getMenuAPI(myRestaurant._id);
            return {
                restaurant: myRestaurant,
                menu: menuRes.data.menuItems || menuRes.data.items || [],
            };
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch your restaurant');
        }
    }
);

export const createRestaurant = createAsyncThunk(
    'restaurant/create',
    async (formData, { rejectWithValue }) => {
        try {
            const { data } = await createRestaurantAPI(formData);
            return data.restaurant;
        } catch (err) {
            console.log('[DEBUG] createRestaurant Error Payload:', err.response?.data);
            return rejectWithValue(err.response?.data?.errors || err.response?.data?.message || 'Failed to create restaurant');
        }
    }
);

export const updateRestaurant = createAsyncThunk(
    'restaurant/update',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const { data } = await updateRestaurantAPI(id, formData);
            return data.restaurant;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to update restaurant');
        }
    }
);

export const toggleRestaurantOpen = createAsyncThunk(
    'restaurant/toggleOpen',
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await toggleRestaurantOpenAPI(id);
            return data.isOpen;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to toggle status');
        }
    }
);

// ─── Menu Actions ─────────────────────────────────────────────────────────────

export const createMenuItem = createAsyncThunk(
    'restaurant/createMenuItem',
    async ({ restaurantId, formData }, { rejectWithValue }) => {
        try {
            const { data } = await createMenuItemAPI(restaurantId, formData);
            return data.item;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to create menu item');
        }
    }
);

export const updateMenuItem = createAsyncThunk(
    'restaurant/updateMenuItem',
    async ({ itemId, formData }, { rejectWithValue }) => {
        try {
            const { data } = await updateMenuItemAPI(itemId, formData);
            return data.item;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to update menu item');
        }
    }
);

export const deleteMenuItem = createAsyncThunk(
    'restaurant/deleteMenuItem',
    async (itemId, { rejectWithValue }) => {
        try {
            await deleteMenuItemAPI(itemId);
            return itemId;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to delete menu item');
        }
    }
);

export const toggleMenuItem = createAsyncThunk(
    'restaurant/toggleMenuItem',
    async (itemId, { rejectWithValue }) => {
        try {
            const { data } = await toggleMenuItemAPI(itemId);
            return { itemId, isAvailable: data.isAvailable };
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to toggle menu item');
        }
    }
);
