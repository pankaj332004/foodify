import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    fetchActiveOrderInfo,
    markPickedUpThunk,
    markOrderAsDeliveredThunk,
} from '../../features/delivery/deliveryThunk';
import {
    selectDeliveryActiveOrder,
    selectDeliveryLoading,
} from '../../features/delivery/deliverySlice';
import { ROUTES } from '../../constants/routes';
import { MapPin, Navigation, PackageCheck, Phone, Info } from 'lucide-react';
import toast from 'react-hot-toast';

const ActiveDelivery = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const activeOrder = useSelector(selectDeliveryActiveOrder);
    const isLoading = useSelector(selectDeliveryLoading);

    // Polling mock distance logic
    const [distanceLeft, setDistanceLeft] = useState(2.4);

    useEffect(() => {
        // Fetch full order details since socket/profile only gives ID
        if (!activeOrder || !activeOrder.restaurant) {
            dispatch(fetchActiveOrderInfo());
        }
    }, [dispatch, activeOrder]);

    const handlePickedUp = async () => {
        const res = await dispatch(markPickedUpThunk(activeOrder._id));
        if (!res.error) {
            toast.success('📦 Order picked up! Head to the customer.');
        } else {
            toast.error(res.payload || 'Failed to update status');
        }
    };

    const handleDelivered = async () => {
        const res = await dispatch(markOrderAsDeliveredThunk(activeOrder._id));
        if (!res.error) {
            toast.success('🎉 Delivery completed!');
            navigate(ROUTES.DELIVERY_DASHBOARD);
        } else {
            toast.error(res.payload || 'Failed to complete delivery');
        }
    };

    if (isLoading && !activeOrder) {
        return <div className="p-8 text-center text-gray-500 font-semibold animate-pulse">Loading active delivery...</div>;
    }

    if (!activeOrder) {
        return (
            <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl shadow-sm border border-gray-100 max-w-2xl mx-auto text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <Navigation className="w-8 h-8 text-gray-400" />
                </div>
                <h2 className="text-xl font-bold font-heading mb-2">No Active Delivery</h2>
                <p className="text-gray-500 mb-6">You are not currently assigned to any order.</p>
                <button
                    onClick={() => navigate(ROUTES.DELIVERY_DASHBOARD)}
                    className="btn-brand"
                >
                    Go to Dashboard
                </button>
            </div>
        );
    }

    const { restaurant, customer, deliveryAddress, totalAmount, payment } = activeOrder;

    return (
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Left side: Order tracking details */}
            <div className="lg:col-span-2 space-y-6">

                {/* Map/Tracker Simulator */}
                <div className="bg-gray-900 rounded-3xl overflow-hidden aspect-video relative flex items-center justify-center shadow-lg">
                    {/* Fake map background */}
                    <div className="absolute inset-0 opacity-20" style={{
                        backgroundImage: 'url("https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}></div>

                    <div className="relative z-10 flex flex-col items-center">
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-full mb-3 shadow-2xl">
                            <Navigation className="w-10 h-10 text-white animate-pulse" />
                        </div>
                        <h2 className="text-3xl font-black text-white font-heading tracking-tight drop-shadow-lg">
                            {distanceLeft} km away
                        </h2>
                        <p className="text-gray-300 font-medium mt-1">Estimated arrival in {Math.round(distanceLeft * 5)} mins</p>
                    </div>
                </div>

                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold font-heading border-b border-gray-100 pb-4 mb-4">Route Details</h3>

                    <div className="relative pl-8 space-y-8">
                        {/* Timeline line */}
                        <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-gray-200"></div>

                        {/* Pickup */}
                        <div className="relative">
                            <div className="absolute -left-[37px] w-6 h-6 bg-white border-4 border-orange-500 rounded-full z-10"></div>
                            <h4 className="font-bold uppercase tracking-wider text-xs text-orange-600 mb-1">Pickup From</h4>
                            <p className="font-bold text-[1.05rem]">{restaurant?.name || 'Restaurant'}</p>
                            <p className="text-sm text-gray-500 mt-0.5">{restaurant?.address?.street || 'No address provided'}</p>
                        </div>

                        {/* Dropoff */}
                        <div className="relative">
                            <div className="absolute -left-[37px] w-6 h-6 bg-white border-4 border-green-500 rounded-full z-10"></div>
                            <h4 className="font-bold uppercase tracking-wider text-xs text-green-600 mb-1">Deliver To</h4>
                            <p className="font-bold text-[1.05rem]">{customer?.name || 'Customer'}</p>
                            <p className="text-sm text-gray-500 mt-0.5">{deliveryAddress?.street}, {deliveryAddress?.city}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right side: Action Panel */}
            <div className="space-y-6">

                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-4 border-b border-gray-100 pb-3">Order Info</h3>

                    <div className="flex justify-between items-center mb-4">
                        <span className="text-gray-500 text-sm">Order ID</span>
                        <span className="font-mono text-sm font-semibold">{activeOrder._id.slice(-6).toUpperCase()}</span>
                    </div>

                    <div className="flex justify-between items-center mb-4">
                        <span className="text-gray-500 text-sm">To Collect</span>
                        <span className="font-bold text-green-600">${totalAmount.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between items-center mb-4">
                        <span className="text-gray-500 text-sm">Payment</span>
                        <span className="text-sm font-semibold capitalize bg-gray-100 px-2 py-0.5 rounded-md">
                            {payment?.method || 'Cash'}
                        </span>
                    </div>

                    <div className="pt-4 mt-2 border-t border-gray-100 flex gap-2">
                        <button className="flex-1 py-2.5 bg-blue-50 text-blue-600 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-blue-100 transition-colors">
                            <Phone className="w-4 h-4" /> Call
                        </button>
                        <button className="flex-1 py-2.5 bg-gray-50 text-gray-600 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors">
                            <Info className="w-4 h-4" /> Details
                        </button>
                    </div>
                </div>

                {/* Pickup Button - show when status is ready_for_pickup */}
                {activeOrder.status === 'ready_for_pickup' && (
                    <button
                        onClick={handlePickedUp}
                        disabled={isLoading}
                        className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-orange-500/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                        <Navigation className="w-6 h-6" />
                        {isLoading ? 'Updating...' : 'Mark as Picked Up'}
                    </button>
                )}

                {/* Delivered Button - show when already out for delivery */}
                {activeOrder.status === 'out_for_delivery' && (
                    <button
                        onClick={handleDelivered}
                        disabled={isLoading}
                        className="w-full py-4 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-green-500/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                        <PackageCheck className="w-6 h-6" />
                        {isLoading ? 'Completing...' : 'Mark as Delivered'}
                    </button>
                )}

            </div>
        </div>
    );
};

export default ActiveDelivery;
