import { Link } from 'react-router-dom';
import useCart from '../../hooks/useCart';
import { ShoppingBag, ArrowLeft } from 'lucide-react';
import CartItem from '../../components/cart/CartItem';
import CartSummary from '../../components/cart/CartSummary';
import appConfig from '../../config/appConfig';

const Cart = () => {
    const { items, total, addItem, removeItem, clearCart, cartRestaurantId, cartRestaurantName } = useCart();

    // Calculate derived amounts (assuming 5% tax and base delivery fee)
    const tax = total * 0.05;
    const deliveryFee = total > 0 ? appConfig.defaultDeliveryFee : 0;
    const finalTotal = total + tax + deliveryFee;

    const handleQuantityChange = (item, delta) => {
        const newQuantity = item.quantity + delta;
        if (newQuantity <= 0) {
            removeItem(item.menuItem);
        } else {
            // Update quantity by re-adding with the difference. 
            // In a real app the hook should ideally have an updateQuantity method, but we simulate it here.
            addItem({
                ...item,
                quantity: delta
            });
        }
    };

    if (items.length === 0) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center bg-gray-50 px-4">
                <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                    <ShoppingBag className="w-10 h-10 text-orange-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
                <p className="text-gray-500 mb-8 max-w-sm text-center">
                    Looks like you haven't added any delicious food to your cart yet.
                </p>
                <Link
                    to="/search"
                    className="flex items-center gap-2 px-8 py-3.5 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-colors shadow-md shadow-orange-500/30"
                >
                    Start Browsing Places
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <ShoppingBag className="w-8 h-8 text-orange-500" />
                        Your Cart
                    </h1>
                    <button
                        onClick={() => clearCart()}
                        className="text-sm font-medium text-red-500 hover:text-red-700 hover:underline"
                    >
                        Clear Cart
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items List */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-4">
                            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                                <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                                    <span className="text-xl">🏪</span>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Ordering From</p>
                                    <Link to={`/restaurant/${cartRestaurantId}`} className="font-bold text-gray-900 hover:text-orange-500 transition-colors">
                                        {cartRestaurantName}
                                    </Link>
                                </div>
                            </div>

                            <div className="pt-4 space-y-6">
                                {items.map((item) => (
                                    <CartItem
                                        key={item.menuItem}
                                        item={item}
                                        handleQuantityChange={handleQuantityChange}
                                        removeItem={removeItem}
                                    />
                                ))}
                            </div>
                        </div>

                        <Link to={`/restaurant/${cartRestaurantId}`} className="inline-flex items-center gap-2 text-orange-500 font-medium hover:text-orange-600 transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                            Add more items
                        </Link>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <CartSummary
                            items={items}
                            total={total}
                            tax={tax}
                            deliveryFee={deliveryFee}
                            finalTotal={finalTotal}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
