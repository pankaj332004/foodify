import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: [],           // [{ menuItem, name, price, quantity, restaurantId }]
    restaurantId: null,  // track which restaurant the cart belongs to
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addItem(state, action) {
            const { menuItem, name, price, restaurantId } = action.payload;
            // If adding from a different restaurant, clear the cart first
            if (state.restaurantId && state.restaurantId !== restaurantId) {
                state.items = [];
            }
            state.restaurantId = restaurantId;
            const existing = state.items.find((i) => i.menuItem === menuItem);
            if (existing) {
                existing.quantity += 1;
            } else {
                state.items.push({ menuItem, name, price, quantity: 1 });
            }
        },
        removeItem(state, action) {
            state.items = state.items.filter((i) => i.menuItem !== action.payload);
            if (state.items.length === 0) state.restaurantId = null;
        },
        incrementItem(state, action) {
            const item = state.items.find((i) => i.menuItem === action.payload);
            if (item) item.quantity += 1;
        },
        decrementItem(state, action) {
            const item = state.items.find((i) => i.menuItem === action.payload);
            if (item) {
                if (item.quantity <= 1) {
                    state.items = state.items.filter((i) => i.menuItem !== action.payload);
                } else {
                    item.quantity -= 1;
                }
            }
            if (state.items.length === 0) state.restaurantId = null;
        },
        clearCart(state) {
            state.items = [];
            state.restaurantId = null;
        },
    },
});

export const { addItem, removeItem, incrementItem, decrementItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
