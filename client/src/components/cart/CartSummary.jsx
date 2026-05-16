import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../../utils/formateCurrency';
import { ArrowRight } from 'lucide-react';

const CartSummary = ({ items, total, tax, deliveryFee, finalTotal }) => {
    const navigate = useNavigate();

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h2>

            <div className="space-y-4 text-sm text-gray-600 mb-6">
                <div className="flex justify-between items-center">
                    <span>Subtotal ({items.reduce((acc, i) => acc + i.quantity, 0)} items)</span>
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
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-black text-orange-600">{formatCurrency(finalTotal)}</span>
                </div>
            </div>

            <button
                onClick={() => navigate('/checkout')}
                className="w-full flex items-center justify-center gap-2 py-4 bg-orange-500 text-white rounded-xl font-bold shadow-md shadow-orange-500/30 hover:bg-orange-600 hover:-translate-y-0.5 transition-all text-lg"
            >
                Proceed to Checkout
                <ArrowRight className="w-5 h-5" />
            </button>

            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
                🔒 Secure checkout powered by Stripe
            </div>
        </div>
    );
};

export default CartSummary;
