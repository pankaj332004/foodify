import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderById } from '../../features/order/orderThunk';
import useSocket from '../../hooks/useSocket';
import { formatCurrency } from '../../utils/formateCurrency';
import {
    Package, ChefHat, Bike, CheckCircle2,
    ArrowLeft, Clock, MapPin, AlertCircle, Loader2
} from 'lucide-react';
import OrderStatusTracker from '../../components/order/OrderStatusTracker';
import LiveMap from '../../components/maps/LiveMap';

const OrderTracking = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const socket = useSocket();
    const { currentOrder, isLoading, error } = useSelector((state) => state.order);

    useEffect(() => {
        if (id) {
            dispatch(fetchOrderById(id));
        }
    }, [dispatch, id]);

    // Join the order's socket room to receive real-time events
    useEffect(() => {
        if (!socket || !id) return;
        socket.emit('join:order', id);
    }, [socket, id]);

    useEffect(() => {
        if (!socket || !currentOrder) return;

        // Listen for real-time status updates from the server
        // Server emits 'order:statusUpdated' — fetch full order to get populated deliveryPartner
        const handleStatusUpdate = (data) => {
            if (data.orderId === currentOrder._id || data.orderId === id) {
                // Re-fetch the full order to get updated deliveryPartner info
                dispatch(fetchOrderById(data.orderId));
            }
        };

        socket.on('order:statusUpdated', handleStatusUpdate);

        return () => {
            socket.off('order:statusUpdated', handleStatusUpdate);
        };
    }, [socket, currentOrder, dispatch, id]);

    const getStepIndex = (status) => {
        switch (status) {
            case 'pending': return 0;
            case 'confirmed': return 1;
            case 'preparing': return 1;
            case 'ready_for_pickup': return 2;
            case 'out_for_delivery': return 2;
            case 'delivered': return 3;
            case 'cancelled': return -1;
            default: return 0;
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center bg-gray-50">
                <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-4" />
                <p className="text-gray-500 font-medium animate-pulse">Fetching order details...</p>
            </div>
        );
    }

    if (error || !currentOrder) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center bg-gray-50 p-4">
                <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-4">
                    <AlertCircle className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
                <p className="text-gray-500 text-center max-w-md mb-6">{error || "We couldn't find the requested order."}</p>
                <Link to="/user/orders" className="px-6 py-2.5 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors">
                    Back to History
                </Link>
            </div>
        );
    }

    const currentStep = getStepIndex(currentOrder.status);
    const isCancelled = currentOrder.status === 'cancelled';

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link to="/user/orders" className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-600 shadow-sm hover:bg-gray-50 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Track Order</h1>
                        <p className="text-gray-500 text-sm">Order #{currentOrder._id.substring(currentOrder._id.length - 8).toUpperCase()}</p>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Live Tracking Status Card */}
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-10 mb-6 flex flex-col gap-6">
                        {isCancelled ? (
                            <div className="text-center py-6">
                                <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Cancelled</h2>
                                <p className="text-gray-500">We're sorry, but this order has been cancelled.</p>
                            </div>
                        ) : (
                            <>
                                <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">Live Status</h2>
                                <OrderStatusTracker currentStep={currentStep} status={currentOrder.status} />

                                {/* Interactive Live Map */}
                                <div className="mt-4 h-[350px] sm:h-[400px] w-full bg-gray-50 rounded-2xl">
                                    <LiveMap order={currentOrder} currentStep={currentStep} />
                                </div>
                            </>
                        )}
                    </div>

                    {/* Order Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Items List */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col h-full">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Package className="w-5 h-5 text-orange-500" />
                                Items Ordered
                            </h3>
                            <div className="space-y-4 flex-1">
                                {currentOrder.items.map((item) => (
                                    <div key={item._id} className="flex justify-between items-start">
                                        <div className="flex gap-3">
                                            <span className="font-bold text-gray-900">{item.quantity}x</span>
                                            <div>
                                                <p className="text-gray-800 font-medium">{item.name}</p>
                                            </div>
                                        </div>
                                        <span className="font-bold text-gray-900">{formatCurrency(item.price * item.quantity)}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t border-gray-100 mt-6 pt-4 space-y-2">
                                <div className="flex justify-between text-sm text-gray-500">
                                    <span>Subtotal</span>
                                    <span>{formatCurrency(currentOrder.subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-500">
                                    <span>Tax</span>
                                    <span>{formatCurrency(currentOrder.taxAmount)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-500">
                                    <span>Delivery Fee</span>
                                    <span>{formatCurrency(currentOrder.deliveryFee)}</span>
                                </div>
                                <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-100 text-lg">
                                    <span>Total</span>
                                    <span className="text-orange-600">{formatCurrency(currentOrder.totalAmount)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Delivery Info */}
                        <div className="space-y-6">
                            {/* Restaurant Info */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <ChefHat className="w-5 h-5 text-orange-500" />
                                    Restaurant details
                                </h3>
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                                        {currentOrder.restaurant?.coverImage ? (
                                            <img src={currentOrder.restaurant.coverImage} alt={currentOrder.restaurant.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-2xl">🍔</div>
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">{currentOrder.restaurant?.name}</p>
                                        <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                                            <MapPin className="w-3.5 h-3.5" />
                                            <span className="line-clamp-1">{currentOrder.restaurant?.address?.street}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Delivery Partner Info */}
                            {currentOrder.deliveryPartner && (
                                <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-6 border-l-4 border-l-orange-500 animate-slide-in">
                                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <Bike className="w-5 h-5 text-orange-500" />
                                        Delivery Partner
                                    </h3>
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xl font-bold shrink-0">
                                            {currentOrder.deliveryPartner.user?.name?.[0].toUpperCase() || 'D'}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-gray-900 text-lg">{currentOrder.deliveryPartner.user?.name}</p>
                                            <p className="text-gray-500 text-sm flex items-center gap-1">
                                                <span className="capitalize">{currentOrder.deliveryPartner.vehicleType}</span>
                                                {currentOrder.deliveryPartner.vehicleNumber && ` • ${currentOrder.deliveryPartner.vehicleNumber}`}
                                            </p>
                                        </div>
                                        <a
                                            href={`tel:${currentOrder.deliveryPartner.user?.phone}`}
                                            className="w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors shadow-sm"
                                            title="Call Partner"
                                        >
                                            <Clock className="w-5 h-5" /> {/* Phone icon replacement if not available */}
                                        </a>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between text-xs text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                                            Verified Partner
                                        </span>
                                        <span className="flex items-center gap-1">
                                            Average Rating: {currentOrder.deliveryPartner.rating || '5.0'} ⭐
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Address Info */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-orange-500" />
                                    Delivery Address
                                </h3>
                                <p className="text-gray-800 font-medium mb-1">{currentOrder.deliveryAddress?.street}</p>
                                <p className="text-gray-500 text-sm">{currentOrder.deliveryAddress?.city}, {currentOrder.deliveryAddress?.state} {currentOrder.deliveryAddress?.pincode}</p>

                                {currentOrder.notes && (
                                    <div className="mt-4 p-3 bg-gray-50 rounded-xl text-sm italic text-gray-600 border border-gray-100">
                                        <span className="font-bold not-italic text-gray-900 block mb-1">Notes:</span>
                                        "{currentOrder.notes}"
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderTracking;
