import { useDispatch, useSelector } from 'react-redux';
import {
    selectCartItems,
    selectCartItemCount,
    selectCartSubtotal,
    selectCartTotal,
    selectCartRestaurantId,
} from '../features/cart/cartSelectors';
import {
    addItem,
    removeItem,
    incrementItem,
    decrementItem,
    clearCart,
} from '../features/cart/cartSlice';

const useCart = () => {
    const dispatch = useDispatch();
    const items = useSelector(selectCartItems);
    const itemCount = useSelector(selectCartItemCount);
    const subtotal = useSelector(selectCartSubtotal);
    const total = useSelector(selectCartTotal);
    const restaurantId = useSelector(selectCartRestaurantId);

    return {
        items,
        itemCount,
        subtotal,
        total,
        cartRestaurantId: restaurantId,
        addItem: (item) => dispatch(addItem(item)),
        removeItem: (menuItemId) => dispatch(removeItem(menuItemId)),
        incrementItem: (menuItemId) => dispatch(incrementItem(menuItemId)),
        decrementItem: (menuItemId) => dispatch(decrementItem(menuItemId)),
        clearCart: () => dispatch(clearCart()),
    };
};

export default useCart;
