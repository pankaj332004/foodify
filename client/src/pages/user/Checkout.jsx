import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { placeOrder } from '../../features/order/orderThunk';
import { verifyPaymentAPI } from '../../services/order.api';
import useCart from '../../hooks/useCart';
import useAuth from '../../hooks/useAuth';
import { formatCurrency } from '../../utils/formateCurrency';
import { CreditCard, Banknote, MapPin, Truck, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import appConfig from '../../config/appConfig';

const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

const Checkout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { items, total, cartRestaurantId, clearCart } = useCart();

    // Auth state to check if user is logged in
    const { isAuthenticated } = useAuth();

    // Order calculation (base fee, final calculated by server based on distance)
    const tax = total * 0.05;
    const deliveryFee = total > 0 ? appConfig.defaultDeliveryFee : 0;
    const finalTotal = total + tax + deliveryFee;

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('cod'); // 'cod' or 'card'
    const [formData, setFormData] = useState({
        street: '',
        city: '',
        state: '',
        pincode: '',
        notes: ''
    });

    useEffect(() => {
        // Redirect if cart is empty or not logged in
        if (items.length === 0) {
            toast.error("Your cart is empty. Please add items to checkout.");
            navigate('/cart');
        } else if (!isAuthenticated) {
            toast.error("Please log in to place an order.");
            navigate('/login', { state: { from: '/checkout' } });
        }
    }, [items.length, isAuthenticated, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.street || !formData.city || !formData.state || !formData.pincode) {
            toast.error("Please fill in all address fields.");
            return;
        }

        setIsSubmitting(true);

        const orderData = {
            restaurantId: cartRestaurantId,
            items: items.map(item => ({
                menuItem: item.menuItem,
                name: item.name,
                price: item.price,
                quantity: item.quantity
            })),
            deliveryAddress: {
                street: formData.street,
                city: formData.city,
                state: formData.state,
                pincode: formData.pincode
            },
            notes: formData.notes,
            paymentMethod: paymentMethod,
            subtotal: total,
            taxAmount: tax,
            deliveryFee: deliveryFee,
            totalAmount: finalTotal
        };

        try {
            const { order, payment } = await dispatch(placeOrder(orderData)).unwrap();

            if (paymentMethod === 'razorpay' && payment) {
                const res = await loadRazorpayScript();
                if (!res) {
                    toast.error("Razorpay SDK failed to load. Are you online?");
                    setIsSubmitting(false);
                    return;
                }

                const options = {
                    key: "rzp_test_placeholder", // Would normally be process.env.VITE_RAZORPAY_KEY
                    amount: payment.amount.toString(),
                    currency: payment.currency,
                    name: "Foodify",
                    description: "Food Delivery Order",
                    order_id: payment.razorpayOrderId,
                    handler: async function (response) {
                        try {
                            setIsSubmitting(true);
                            await verifyPaymentAPI({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                            });
                            toast.success("Payment successful! Order placed! 🎉");
                            clearCart();
                            navigate('/user/orders', { state: { orderSuccess: true } });
                        } catch (err) {
                            toast.error("Payment verification failed.");
                            setIsSubmitting(false);
                        }
                    },
                    prefill: {
                        name: "Customer",
                        email: "customer@example.com",
                        contact: "9999999999",
                    },
                    theme: {
                        color: "#f97316", // orange-500
                    },
                };

                const rzp = new window.Razorpay(options);
                rzp.on('payment.failed', function (response) {
                    toast.error("Payment failed. Please try again.");
                    setIsSubmitting(false);
                });
                rzp.open();

            } else {
                toast.success("Order placed successfully! 🎉");
                clearCart();
                // Redirect to tracking or history immediately
                navigate('/user/orders', { state: { orderSuccess: true } });
            }
        } catch (err) {
            // err from unwrap() is the rejectWithValue string, or could be an Error object
            const msg = typeof err === 'string'
                ? err
                : err?.message || err?.data?.message || 'Failed to place order. Please try again.';
            toast.error(msg, { duration: 5000, icon: '🚫' });
            setIsSubmitting(false);
        }
    };

    if (items.length === 0) return null; // Prevent flash before redirect

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
            <div className="max-w-5xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <CheckCircle2 className="w-8 h-8 text-orange-500" />
                        Checkout
                    </h1>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Column: Forms */}
                    <div className="flex-1 space-y-6">
                        {/* Delivery Address */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-orange-500" />
                                Delivery Address
                            </h2>
                            <form className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                                    <input
                                        type="text"
                                        name="street"
                                        value={formData.street}
                                        onChange={handleInputChange}
                                        placeholder="123 Main St, Apt 4B"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                                        <input
                                            type="text"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">ZIP / Pincode</label>
                                        <input
                                            type="text"
                                            name="pincode"
                                            value={formData.pincode}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="pt-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Notes (Optional)</label>
                                    <textarea
                                        name="notes"
                                        value={formData.notes}
                                        onChange={handleInputChange}
                                        placeholder="e.g. Leave at the front door, ring doorbell..."
                                        rows="2"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all resize-none"
                                    />
                                </div>
                            </form>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-orange-500" />
                                Payment Method
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod('cod')}
                                    className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${paymentMethod === 'cod'
                                        ? 'border-orange-500 bg-orange-50'
                                        : 'border-gray-200 hover:border-orange-200 hover:bg-orange-50/50'
                                        }`}
                                >
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${paymentMethod === 'cod' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                                        <Banknote className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">Cash on Delivery</h3>
                                        <p className="text-xs text-gray-500">Pay when you receive the food</p>
                                    </div>
                                </button>

                                {/* Card Payment — Coming Soon */}
                                <div className="relative flex items-center gap-3 p-4 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 cursor-not-allowed opacity-60">
                                    <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center shrink-0">
                                        <CreditCard className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-500">Credit Card / Pay Online</h3>
                                        <p className="text-xs text-gray-400">Cards, UPI, Netbanking</p>
                                    </div>
                                    <span className="absolute top-2 right-2 bg-orange-100 text-orange-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                                        Coming Soon
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Order Summary & Place Order */}
                    <div className="lg:w-96 shrink-0">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
                            <h2 className="text-lg font-bold text-gray-900 mb-6">Final Order Summary</h2>

                            <div className="max-h-60 overflow-y-auto pr-2 mb-6 space-y-3 custom-scrollbar">
                                {items.map((item) => (
                                    <div key={item.menuItem} className="flex justify-between text-sm">
                                        <div className="flex gap-2">
                                            <span className="font-bold text-gray-900">{item.quantity}x</span>
                                            <span className="text-gray-600 line-clamp-1" title={item.name}>{item.name}</span>
                                        </div>
                                        <span className="font-medium text-gray-900 text-right shrink-0">
                                            {formatCurrency(item.price * item.quantity)}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3 text-sm text-gray-600 mb-6 pt-6 border-t border-gray-100">
                                <div className="flex justify-between items-center">
                                    <span>Subtotal</span>
                                    <span className="font-medium text-gray-900">{formatCurrency(total)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>Tax (5%)</span>
                                    <span className="font-medium text-gray-900">{formatCurrency(tax)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>Delivery Fee</span>
                                    <span className="font-medium text-gray-900">{formatCurrency(deliveryFee)}</span>
                                </div>
                            </div>

                            <div className="border-t border-gray-100 pt-4 mb-8">
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-gray-900">Total to Pay</span>
                                    <span className="text-2xl font-black text-orange-600">{formatCurrency(finalTotal)}</span>
                                </div>
                            </div>

                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="w-full flex items-center justify-center gap-2 py-4 bg-orange-500 text-white rounded-xl font-bold shadow-md shadow-orange-500/30 hover:bg-orange-600 hover:-translate-y-0.5 transition-all text-lg disabled:opacity-70 disabled:hover:translate-y-0 disabled:shadow-none"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        Place Order
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>

                            <p className="text-center text-xs text-gray-500 mt-4 leading-relaxed">
                                By placing this order, you agree to our Terms of Service and Privacy Policy.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
