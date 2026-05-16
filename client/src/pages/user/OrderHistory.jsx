import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { fetchMyOrders } from '../../features/order/orderThunk';
import { formatCurrency } from '../../utils/formateCurrency';
import { Clock, MapPin, Package, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import OrderCard from '../../components/order/OrderCard';

const OrderHistory = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const { orders, isLoading, error } = useSelector((state) => state.order);

    useEffect(() => {
        dispatch(fetchMyOrders());
    }, [dispatch]);

    useEffect(() => {
        // Check if we came from a successful checkout redirect
        if (location.state?.orderSuccess) {
            toast.success("Order placed successfully! 🎉", {
                duration: 5000,
                position: 'top-center'
            });
            // Clear state so refresh doesn't trigger toast again
            window.history.replaceState({}, document.title);
        }
    }, [location]);
    useEffect(() => {
        // Check if we came from a successful checkout redirect
        if (location.state?.orderSuccess) {
            toast.success("Order placed successfully! 🎉", {
                duration: 5000,
                position: 'top-center'
            });
            // Clear state so refresh doesn't trigger toast again
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    if (isLoading) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center bg-gray-50">
                <Loader2 className="w-10 h-10 text-orange-500 animate-spin mb-4" />
                <p className="text-gray-500 font-medium animate-pulse">Loading your orders...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center bg-gray-50 p-4">
                <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-4">
                    <AlertCircle className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong.</h2>
                <p className="text-gray-500 text-center max-w-md">{error}</p>
                <button
                    onClick={() => dispatch(fetchMyOrders())}
                    className="mt-6 px-6 py-2.5 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-colors"
                >
                    Try Again
                </button>
            </div>
        );
    }

    if (!orders || orders.length === 0) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center bg-gray-50 p-4 text-center">
                <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                    <Package className="w-12 h-12 text-orange-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h2>
                <p className="text-gray-500 mb-8 max-w-md">Looks like you haven't made any delicious discoveries recently.</p>
                <Link
                    to="/search"
                    className="px-8 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-colors shadow-md shadow-orange-500/30"
                >
                    Start Browsing Places
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <Clock className="w-8 h-8 text-orange-500" />
                        Order History
                    </h1>
                    <p className="text-gray-500 mt-2">View your past orders and track their status.</p>
                </div>

                <div className="space-y-6">
                    {orders.map((order) => (
                        <OrderCard key={order._id} order={order} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OrderHistory;
