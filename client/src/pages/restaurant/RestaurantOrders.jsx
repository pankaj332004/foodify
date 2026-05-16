import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRestaurantOrders, updateOrderStatusThunk } from '../../features/order/orderThunk';
import { Loader2, Package, Clock, CheckCircle, TrendingUp, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
    preparing: 'bg-purple-100 text-purple-800 border-purple-200',
    ready_for_pickup: 'bg-orange-100 text-orange-800 border-orange-200',
    out_for_delivery: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    delivered: 'bg-green-100 text-green-800 border-green-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200',
};

const RestaurantOrders = () => {
    const dispatch = useDispatch();
    const { orders, isLoading } = useSelector((state) => state.order);

    useEffect(() => {
        dispatch(fetchRestaurantOrders());
        // Setup polling for new orders (every 30 seconds)
        const interval = setInterval(() => {
            dispatch(fetchRestaurantOrders());
        }, 30000);
        return () => clearInterval(interval);
    }, [dispatch]);

    const handleUpdateStatus = async (orderId, newStatus) => {
        try {
            await dispatch(updateOrderStatusThunk({ id: orderId, status: newStatus })).unwrap();
            toast.success(`Order marked as ${newStatus.replace('_', ' ')}`);
        } catch (err) {
            toast.error(err || 'Failed to update order status');
        }
    };

    if (isLoading && orders.length === 0) {
        return <div className="flex justify-center items-center h-[60vh]"><Loader2 className="w-8 h-8 animate-spin text-orange-500" /></div>;
    }

    // Sort by newest first
    const sortedOrders = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Quick stats
    const newOrdersCount = sortedOrders.filter(o => o.status === 'pending').length;
    const preparingCount = sortedOrders.filter(o => o.status === 'confirmed' || o.status === 'preparing').length;
    const completedCount = sortedOrders.filter(o => o.status === 'delivered').length;

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-12 pt-4">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Live Orders</h1>
                <p className="text-gray-500 mt-1">Manage and track your incoming orders in real-time</p>
            </div>

            {/* Quick Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl p-6 border border-yellow-200 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center shrink-0 text-yellow-600">
                        <Package className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">New Orders</p>
                        <h3 className="text-2xl font-bold text-gray-900">{newOrdersCount}</h3>
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-purple-200 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center shrink-0 text-purple-600">
                        <Clock className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">In Kitchen</p>
                        <h3 className="text-2xl font-bold text-gray-900">{preparingCount}</h3>
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-green-200 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center shrink-0 text-green-600">
                        <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Completed Today</p>
                        <h3 className="text-2xl font-bold text-gray-900">{completedCount}</h3>
                    </div>
                </div>
            </div>

            {/* Orders List */}
            <div className="bg-white border text-left border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                {sortedOrders.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <h3 className="text-xl font-medium text-gray-900 mb-2">No orders yet</h3>
                        <p>When customers place orders, they will appear here automatically.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {sortedOrders.map((order) => (
                            <div key={order._id} className="p-6 sm:p-8 hover:bg-gray-50/50 transition-colors">
                                <div className="flex flex-col lg:flex-row justify-between gap-6">
                                    {/* Order Info */}
                                    <div className="flex-1 space-y-4">
                                        <div className="flex items-center gap-3">
                                            <span className="font-mono text-sm font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-lg">
                                                #{order._id.slice(-6).toUpperCase()}
                                            </span>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${STATUS_COLORS[order.status]}`}>
                                                {order.status.replace('_', ' ')}
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Customer</h4>
                                                <p className="font-medium text-gray-900">{order.user?.name || 'Guest'}</p>
                                                <p className="text-sm text-gray-600 max-w-[200px] truncate">{order.deliveryAddress?.street}</p>
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Order Details</h4>
                                                <ul className="text-sm text-gray-700 space-y-1">
                                                    {order.items.map((item, i) => (
                                                        <li key={i} className="flex justify-between max-w-[200px]">
                                                            <span>{item.quantity}x {item.menuItem?.name || 'Item'}</span>
                                                            <span className="text-gray-500">${(item.price * item.quantity).toFixed(2)}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                                <div className="mt-2 pt-2 border-t border-gray-100 flex justify-between max-w-[200px] font-bold text-gray-900">
                                                    <span>Total:</span>
                                                    <span className="text-emerald-600">${order.totalAmount.toFixed(2)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex lg:flex-col justify-end gap-3 min-w-[200px]">
                                        {/* Status progression logic */}
                                        {order.status === 'pending' && (
                                            <>
                                                <button
                                                    onClick={() => handleUpdateStatus(order._id, 'confirmed')}
                                                    className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition"
                                                >
                                                    Accept Order
                                                </button>
                                                <button
                                                    onClick={() => handleUpdateStatus(order._id, 'cancelled')}
                                                    className="flex-1 py-2.5 bg-red-50 text-red-600 border border-red-200 rounded-xl font-medium hover:bg-red-100 transition"
                                                >
                                                    Reject
                                                </button>
                                            </>
                                        )}
                                        {order.status === 'confirmed' && (
                                            <button
                                                onClick={() => handleUpdateStatus(order._id, 'preparing')}
                                                className="w-full py-2.5 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition"
                                            >
                                                Start Preparing
                                            </button>
                                        )}
                                        {order.status === 'preparing' && (
                                            <button
                                                onClick={() => handleUpdateStatus(order._id, 'ready_for_pickup')}
                                                className="w-full py-2.5 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition"
                                            >
                                                Mark as Ready
                                            </button>
                                        )}
                                        {['ready_for_pickup', 'out_for_delivery'].includes(order.status) && (
                                            <div className="text-center p-4 bg-gray-50 rounded-xl border border-gray-100 flex flex-col items-center justify-center">
                                                <CheckCircle className="w-8 h-8 text-green-500 mb-2" />
                                                <span className="text-sm font-medium text-gray-600">Waiting for Delivery Partner</span>
                                            </div>
                                        )}
                                        {order.status === 'delivered' && (
                                            <div className="text-center py-2 text-green-600 font-medium flex items-center justify-center gap-2">
                                                <CheckCircle className="w-5 h-5" /> Order Complete
                                            </div>
                                        )}
                                        {order.status === 'cancelled' && (
                                            <div className="text-center py-2 text-red-600 font-medium">
                                                Order Cancelled
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RestaurantOrders;
