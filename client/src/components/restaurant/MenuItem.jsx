import { formatCurrency } from '../../utils/formateCurrency';
import { Plus } from 'lucide-react';

const MenuItem = ({ item, currentRestaurant, handleAddToCart }) => {
    return (
        <div
            className={`bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col transition-all duration-300 hover:shadow-md ${!item.isAvailable || !currentRestaurant.isOpen ? 'opacity-60 grayscale-[0.3]' : ''}`}
        >
            <div className="mb-4 aspect-4/3 rounded-xl overflow-hidden bg-gray-100 relative group">
                {item.image ? (
                    <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No image
                    </div>
                )}

                {!item.isAvailable && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm">
                        Sold Out
                    </div>
                )}
            </div>

            <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-gray-900 line-clamp-1" title={item.name}>{item.name}</h3>
                    <span className="font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md text-sm whitespace-nowrap ml-2">
                        {formatCurrency(item.price)}
                    </span>
                </div>
                <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-1">{item.description}</p>

                <button
                    onClick={() => handleAddToCart(item)}
                    disabled={!item.isAvailable || !currentRestaurant.isOpen}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-colors border-2 disabled:cursor-not-allowed
                        border-gray-200 bg-white text-gray-800 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50"
                >
                    <Plus className="w-4 h-4" />
                    Add to Cart
                </button>
            </div>
        </div>
    );
};

export default MenuItem;
