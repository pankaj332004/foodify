import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    fetchDeliveryProfile,
    toggleAvailabilityStatus,
} from '../../features/delivery/deliveryThunk';
import {
    selectDeliveryProfile,
    selectDeliveryIsAvailable,
    selectDeliveryActiveOrder,
    selectDeliveryLoading,
} from '../../features/delivery/deliverySlice';
import { ROUTES } from '../../constants/routes';
import { MapPin, Package, Star, Clock } from 'lucide-react';

const DeliveryDashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const profile = useSelector(selectDeliveryProfile);
    const isAvailable = useSelector(selectDeliveryIsAvailable);
    const activeOrder = useSelector(selectDeliveryActiveOrder);
    const isLoading = useSelector(selectDeliveryLoading);

    useEffect(() => {
        dispatch(fetchDeliveryProfile());
    }, [dispatch]);

    // If an active order was fetched (or pushed via sockets), redirect to the active tracking page
    useEffect(() => {
        if (activeOrder) {
            navigate(ROUTES.DELIVERY_ACTIVE);
        }
    }, [activeOrder, navigate]);

    const handleToggleStatus = () => {
        dispatch(toggleAvailabilityStatus());
    };

    if (isLoading && !profile) {
        return <div className="p-8 text-center text-gray-500">Loading profile...</div>;
    }

    if (!profile) {
        return <div className="p-8 text-center text-red-500">Failed to load profile.</div>;
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            {/* Header section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-2xl font-bold font-heading text-gray-900">
                        Welcome back, {profile.user?.name?.split(' ')[0]} 🛵
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Vehicle: {profile.vehicleType} • {profile.vehicleNumber || 'No plate added'}
                    </p>
                </div>

                <button
                    onClick={handleToggleStatus}
                    disabled={isLoading}
                    className={`px-6 py-2.5 rounded-full font-bold shadow-sm transition-all duration-200 flex items-center gap-2 ${isAvailable
                        ? 'bg-green-100 text-green-700 hover:bg-green-200 border border-green-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                        }`}
                >
                    <span className={`w-2.5 h-2.5 rounded-full ${isAvailable ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></span>
                    {isAvailable ? 'You are Online' : 'You are Offline'}
                </button>
            </div>

            {/* Warning block if online */}
            {isAvailable && (
                <div className="bg-orange-50 border border-orange-200 p-4 rounded-xl flex items-start gap-3">
                    <span className="text-xl">📡</span>
                    <div>
                        <h4 className="font-bold text-orange-900">Waiting for orders...</h4>
                        <p className="text-orange-700 text-sm mt-0.5">
                            Keep this page open. You will be automatically assigned nearby deliveries when restaurants mark them as ready for pickup.
                        </p>
                    </div>
                </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <Package className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-semibold text-gray-500">Deliveries</span>
                    </div>
                    <span className="text-2xl font-bold text-gray-900">{profile.totalDeliveries || 0}</span>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-yellow-50 text-yellow-600 rounded-lg">
                            <Star className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-semibold text-gray-500">Rating</span>
                    </div>
                    <span className="text-2xl font-bold text-gray-900">{profile.rating ? profile.rating.toFixed(1) : 'New'}</span>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                            <Clock className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-semibold text-gray-500">Shift Time</span>
                    </div>
                    <span className="text-2xl font-bold text-gray-900">0h 0m</span>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                            <MapPin className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-semibold text-gray-500">Distance</span>
                    </div>
                    <span className="text-2xl font-bold text-gray-900">0 km</span>
                </div>
            </div>

        </div>
    );
};

export default DeliveryDashboard;
