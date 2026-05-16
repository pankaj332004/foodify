import appConfig from '../../config/appConfig';

export const selectCartItems = (state) => state.cart.items;
export const selectCartRestaurantId = (state) => state.cart.restaurantId;

export const selectCartItemCount = (state) =>
    state.cart.items.reduce((sum, i) => sum + i.quantity, 0);

export const selectCartSubtotal = (state) =>
    state.cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

export const selectCartTotal = (state) => {
    const subtotal = selectCartSubtotal(state);
    const tax = subtotal * appConfig.taxRate;
    return subtotal + tax + appConfig.defaultDeliveryFee;
};

export const selectIsItemInCart = (menuItemId) => (state) =>
    state.cart.items.some((i) => i.menuItem === menuItemId);

export const selectItemQuantity = (menuItemId) => (state) => {
    const item = state.cart.items.find((i) => i.menuItem === menuItemId);
    return item ? item.quantity : 0;
};
