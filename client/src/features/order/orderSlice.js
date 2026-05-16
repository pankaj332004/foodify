import { createSlice } from '@reduxjs/toolkit';
import { fetchMyOrders, placeOrder, fetchOrderById, fetchRestaurantOrders, updateOrderStatusThunk, deleteOrderHistory } from './orderThunk';

const initialState = {
    orders: [],
    currentOrder: null,
    isLoading: false,
    error: null,
};

const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        updateOrderStatus(state, action) {
            const { orderId, status } = action.payload;
            // Update in list
            const order = state.orders.find((o) => o._id === orderId);
            if (order) order.status = status;
            // Update current order if it's being tracked
            if (state.currentOrder?._id === orderId) {
                state.currentOrder.status = status;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMyOrders.pending, (state) => { state.isLoading = true; state.error = null; })
            .addCase(fetchMyOrders.fulfilled, (state, action) => {
                state.isLoading = false;
                state.orders = action.payload;
            })
            .addCase(fetchMyOrders.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });

        builder
            .addCase(placeOrder.pending, (state) => { state.isLoading = true; state.error = null; })
            .addCase(placeOrder.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentOrder = action.payload.order;
                state.orders.unshift(action.payload.order);
            })
            .addCase(placeOrder.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });

        builder
            .addCase(fetchOrderById.pending, (state) => { state.isLoading = true; })
            .addCase(fetchOrderById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentOrder = action.payload;
            })
            .addCase(fetchOrderById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });

        builder
            .addCase(deleteOrderHistory.fulfilled, (state, action) => {
                state.orders = state.orders.filter(order => order._id !== action.payload);
            });

        // ─── Owner Specific ───
        builder
            .addCase(fetchRestaurantOrders.pending, (state) => { state.isLoading = true; state.error = null; })
            .addCase(fetchRestaurantOrders.fulfilled, (state, action) => {
                state.isLoading = false;
                state.orders = action.payload;
            })
            .addCase(fetchRestaurantOrders.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });

        builder
            .addCase(updateOrderStatusThunk.fulfilled, (state, action) => {
                const updatedOrder = action.payload;
                const index = state.orders.findIndex((o) => o._id === updatedOrder._id);
                if (index !== -1) Object.assign(state.orders[index], updatedOrder);
                if (state.currentOrder?._id === updatedOrder._id) {
                    state.currentOrder = updatedOrder;
                }
            });
    },
});

export const { updateOrderStatus } = orderSlice.actions;
export default orderSlice.reducer;
