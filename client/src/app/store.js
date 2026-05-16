import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import cartReducer from '../features/cart/cartSlice';
import orderReducer from '../features/order/orderSlice';
import restaurantReducer from '../features/restaurant/restaurantSlice';
import reviewReducer from '../features/review/reviewSlice';
import deliveryReducer from '../features/delivery/deliverySlice';
import adminReducer from '../features/admin/adminSlice';


export const store = configureStore({
    reducer: {
        auth: authReducer,
        cart: cartReducer,
        order: orderReducer,
        restaurant: restaurantReducer,
        review: reviewReducer,
        delivery: deliveryReducer,
        admin: adminReducer,
    },
});
