import { formatCurrency } from '../../utils/formateCurrency';
import { Minus, Plus, Trash2 } from 'lucide-react';

const CartItem = ({ item, handleQuantityChange, removeItem }) => {
    return (
        <div className="flex gap-4">
            {/* Item Image */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                        🍽️
                    </div>
                )}
            </div>

            {/* Item Details */}
            <div className="flex-1 flex flex-col justify-between py-1">
                <div className="flex justify-between items-start gap-2">
                    <h3 className="font-bold text-gray-900 line-clamp-2">{item.name}</h3>
                    <span className="font-bold text-gray-900">
                        {formatCurrency(item.price * item.quantity)}
                    </span>
                </div>

                <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1 border border-gray-100">
                        <button
                            onClick={() => handleQuantityChange(item, -1)}
                            className="w-8 h-8 flex items-center justify-center bg-white rounded-md shadow-sm text-gray-600 hover:text-orange-500 transition-colors border border-gray-200"
                        >
                            <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-bold text-gray-900 w-4 text-center">
                            {item.quantity}
                        </span>
                        <button
                            onClick={() => handleQuantityChange(item, 1)}
                            className="w-8 h-8 flex items-center justify-center bg-white rounded-md shadow-sm text-gray-600 hover:text-orange-500 transition-colors border border-gray-200"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>

                    <button
                        onClick={() => removeItem(item.menuItem)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-2"
                        title="Remove item"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartItem;
