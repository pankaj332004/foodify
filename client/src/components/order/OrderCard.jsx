import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { formatCurrency } from '../../utils/formateCurrency';
import { MapPin, ArrowRight, Trash2, Star } from 'lucide-react';
import { deleteOrderHistory } from '../../features/order/orderThunk';
import toast from 'react-hot-toast';
import ReviewModal from '../restaurant/ReviewModal';

const OrderCard = ({ order }) => {
    const dispatch = useDispatch();
    const [isReviewOpen, setIsReviewOpen] = useState(false);

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'preparing': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'ready_for_pickup': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
            case 'out_for_delivery': return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
            case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusLabel = (status) => {
        return status?.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this order from your history?")) {
            try {
                await dispatch(deleteOrderHistory(order._id)).unwrap();
                toast.success("Order removed from history.");
            } catch (err) {
                toast.error(err || "Failed to remove order.");
            }
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            {/* Order Header */}
            <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-wrap gap-4 items-center justify-between bg-gray-50/50">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-xl overflow-hidden shrink-0">
                        {order.restaurant?.coverImage ? (
                            <img src={order.restaurant.coverImage} alt={order.restaurant.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xl">🍽️</div>
                        )}
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 text-lg line-clamp-1">{order.restaurant?.name || 'Unknown Restaurant'}</h3>
                        <p className="text-xs text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric', month: 'short', day: 'numeric',
                                hour: '2-digit', minute: '2-digit'
                            })}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto mt-2 sm:mt-0 justify-between sm:justify-end">
                    <div className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border ${getStatusColor(order.status)}`}>
                        {getStatusLabel(order.status)}
                    </div>
                    <p className="font-black text-gray-900 text-xl">{formatCurrency(order.totalAmount)}</p>
                </div>
            </div>

            {/* Order Details */}
            <div className="p-4 sm:p-6 border-b border-gray-100">
                <div className="space-y-3">
                    {order.items.map((item) => (
                        <div key={item._id} className="flex justify-between items-start text-sm">
                            <div className="flex gap-3">
                                <span className="font-bold text-gray-900 min-w-[30px]">{item.quantity}x</span>
                                <span className="text-gray-700">{item.name}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Delivery Partner Info — visible once assigned */}
            {order.deliveryPartner && (
                <div className="px-4 sm:px-6 py-3 bg-orange-50/60 border-b border-orange-100 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-bold shrink-0">
                            {order.deliveryPartner.user?.name?.[0]?.toUpperCase() || 'D'}
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-900">{order.deliveryPartner.user?.name || 'Delivery Partner'}</p>
                            <p className="text-xs text-gray-500 capitalize">{order.deliveryPartner.vehicleType} {order.deliveryPartner.vehicleNumber && `• ${order.deliveryPartner.vehicleNumber}`}</p>
                        </div>
                    </div>
                    {order.deliveryPartner.user?.phone && (
                        <a
                            href={`tel:${order.deliveryPartner.user.phone}`}
                            className="text-xs font-bold text-orange-600 bg-white border border-orange-200 px-3 py-1.5 rounded-full hover:bg-orange-100 transition-colors"
                        >
                            📞 Call
                        </a>
                    )}
                </div>
            )}

            {/* Order Footer */}
            <div className="p-4 sm:p-6 bg-gray-50/50 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-600 w-full sm:w-auto">
                    <MapPin className="w-4 h-4 shrink-0 text-gray-400" />
                    <span className="line-clamp-1 flex-1">{order.deliveryAddress?.street}, {order.deliveryAddress?.city}</span>
                </div>

                <div className="flex w-full sm:w-auto gap-3">
                    {order.status === 'delivered' && (
                        <button
                            onClick={() => setIsReviewOpen(true)}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-yellow-50 text-yellow-600 font-bold rounded-xl hover:bg-yellow-100 transition-colors border border-yellow-200"
                        >
                            <Star className="w-4 h-4" />
                            Review
                        </button>
                    )}

                    {(order.status === 'delivered' || order.status === 'cancelled') && (
                        <button
                            onClick={handleDelete}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    )}
                    <Link
                        to={`/orders/${order._id}/track`}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-orange-50 text-orange-600 font-bold rounded-xl hover:bg-orange-100 transition-colors"
                    >
                        Track Order
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>

            {/* Review Modal */}
            <ReviewModal
                isOpen={isReviewOpen}
                onClose={() => setIsReviewOpen(false)}
                order={order}
            />
        </div>
    );
};

export default OrderCard;
