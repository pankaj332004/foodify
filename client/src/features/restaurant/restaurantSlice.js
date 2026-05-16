import { createSlice } from '@reduxjs/toolkit';
import {
    fetchRestaurants,
    fetchRestaurantById,
    fetchMyRestaurant,
    createRestaurant,
    updateRestaurant,
    toggleRestaurantOpen,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
    toggleMenuItem
} from './restaurantThunk';

const initialState = {
    restaurants: [],
    currentRestaurant: null,
    menu: [],
    isLoading: false,
    error: null,
};

const restaurantSlice = createSlice({
    name: 'restaurant',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchRestaurants.pending, (state) => { state.isLoading = true; state.error = null; })
            .addCase(fetchRestaurants.fulfilled, (state, action) => {
                state.isLoading = false;
                state.restaurants = action.payload;
            })
            .addCase(fetchRestaurants.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });

        builder
            .addCase(fetchRestaurantById.pending, (state) => { state.isLoading = true; })
            .addCase(fetchRestaurantById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentRestaurant = action.payload.restaurant;
                state.menu = action.payload.menu;
            })
            .addCase(fetchRestaurantById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });

        // ─── Owner Specific ───
        builder
            .addCase(fetchMyRestaurant.pending, (state) => { state.isLoading = true; })
            .addCase(fetchMyRestaurant.fulfilled, (state, action) => {
                state.isLoading = false;
                if (action.payload) {
                    state.currentRestaurant = action.payload.restaurant;
                    state.menu = action.payload.menu;
                }
            })
            .addCase(fetchMyRestaurant.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });

        builder
            .addCase(createRestaurant.fulfilled, (state, action) => {
                state.currentRestaurant = action.payload;
            })
            .addCase(updateRestaurant.fulfilled, (state, action) => {
                state.currentRestaurant = action.payload;
            })
            .addCase(toggleRestaurantOpen.fulfilled, (state, action) => {
                if (state.currentRestaurant) {
                    state.currentRestaurant.isOpen = action.payload;
                }
            });

        // ─── Menu Updates ───
        builder
            .addCase(createMenuItem.fulfilled, (state, action) => {
                state.menu.push(action.payload);
            })
            .addCase(updateMenuItem.fulfilled, (state, action) => {
                const index = state.menu.findIndex((item) => item._id === action.payload._id);
                if (index !== -1) state.menu[index] = action.payload;
            })
            .addCase(deleteMenuItem.fulfilled, (state, action) => {
                state.menu = state.menu.filter((item) => item._id !== action.payload);
            })
            .addCase(toggleMenuItem.fulfilled, (state, action) => {
                const item = state.menu.find((i) => i._id === action.payload.itemId);
                if (item) item.isAvailable = action.payload.isAvailable;
            });
    },
});

export default restaurantSlice.reducer;
