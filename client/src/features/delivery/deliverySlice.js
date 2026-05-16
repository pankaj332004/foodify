import { createSlice } from '@reduxjs/toolkit';
import {
    fetchDeliveryProfile,
    toggleAvailabilityStatus,
    fetchActiveOrderInfo,
    markOrderAsDeliveredThunk,
} from './deliveryThunk';

const initialState = {
    profile: null,
    isAvailable: false,
    activeOrder: null,
    isLoading: false,
    error: null,
};

const deliverySlice = createSlice({
    name: 'delivery',
    initialState,
    reducers: {
        clearDeliveryError: (state) => {
            state.error = null;
        },
        // Action to receive new assigned order from socket
        setAssignedOrder: (state, action) => {
            state.activeOrder = action.payload;
            state.isAvailable = false; // Going on delivery means unavailable
        },
    },
    extraReducers: (builder) => {
        builder
            // Profile Fetch
            .addCase(fetchDeliveryProfile.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchDeliveryProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.profile = action.payload;
                state.isAvailable = action.payload.isAvailable || false;

                // Active order might be nested directly in profile, but we prefer checking fetchActiveOrderInfo
                if (action.payload.activeOrder) {
                    // It only populates ID or light details sometimes from profile route
                    state.activeOrder = action.payload.activeOrder;
                }
            })
            .addCase(fetchDeliveryProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // Toggle Availability
            .addCase(toggleAvailabilityStatus.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(toggleAvailabilityStatus.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAvailable = action.payload;
            })
            .addCase(toggleAvailabilityStatus.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // Active Order Fetch
            .addCase(fetchActiveOrderInfo.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchActiveOrderInfo.fulfilled, (state, action) => {
                state.isLoading = false;
                state.activeOrder = action.payload;
            })
            .addCase(fetchActiveOrderInfo.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // Mark Delivered
            .addCase(markOrderAsDeliveredThunk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(markOrderAsDeliveredThunk.fulfilled, (state) => {
                state.isLoading = false;
                state.activeOrder = null;
                // Backend usually sets partner back to true/available, so update our state
                state.isAvailable = true;
            })
            .addCase(markOrderAsDeliveredThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export const { clearDeliveryError, setAssignedOrder } = deliverySlice.actions;

// Selectors
export const selectDeliveryProfile = (state) => state.delivery.profile;
export const selectDeliveryIsAvailable = (state) => state.delivery.isAvailable;
export const selectDeliveryActiveOrder = (state) => state.delivery.activeOrder;
export const selectDeliveryLoading = (state) => state.delivery.isLoading;
export const selectDeliveryError = (state) => state.delivery.error;

export default deliverySlice.reducer;
