import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRestaurantById } from '../../features/restaurant/restaurantThunk';
import useCart from '../../hooks/useCart';
import { formatCurrency } from '../../utils/formateCurrency';
import { MapPin, Clock, Star, ArrowLeft, Loader2, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';
import MenuItem from '../../components/restaurant/MenuItem';
import ReviewSection from '../../components/restaurant/ReviewSection';

const RestaurantDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Using individual restaurant slice state, note: we're using currentRestaurant since that's what the thunk populates
    const { currentRestaurant, menu: currentMenu, isLoading, error } = useSelector((state) => state.restaurant);
    const { addItem, items, total, cartRestaurantId } = useCart();

    const [selectedCategory, setSelectedCategory] = useState('All');

    useEffect(() => {
        if (id) {
            dispatch(fetchRestaurantById(id));
        }
    }, [dispatch, id]);

    // Derived states
    const categories = ['All', ...new Set(currentMenu?.map(item => item.category) || [])];

    const filteredMenu = selectedCategory === 'All'
        ? currentMenu
        : currentMenu?.filter(item => item.category === selectedCategory);

    const handleAddToCart = (item) => {
        if (!currentRestaurant?.isOpen) {
            toast.error("This restaurant is currently closed.");
            return;
        }

        const success = addItem({
            restaurantId: currentRestaurant._id,
            restaurantName: currentRestaurant.name,
            menuItem: item._id,
            name: item.name,
            price: item.price,
            image: item.image,
            quantity: 1
        });

        if (success) {
            toast.success(`Added ${item.name} to cart`);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-4" />
                <p className="text-gray-500 font-medium animate-pulse">Loading restaurant details...</p>
            </div>
        );
    }

    if (error || !currentRestaurant) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 text-center">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
                    <span className="text-4xl">😕</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Restaurant Not Found</h2>
                <p className="text-gray-500 mb-8 max-w-md">We couldn't find the restaurant you're looking for. It might have been removed or is currently unavailable.</p>
                <button
                    onClick={() => navigate('/search')}
                    className="px-6 py-3 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-colors"
                >
                    Browse Other Restaurants
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-24 animate-fade-in relative">
            {/* Hero Section */}
            <div className="relative h-64 md:h-80 lg:h-96 bg-gray-900">
                {currentRestaurant.coverImage ? (
                    <img
                        src={currentRestaurant.coverImage}
                        alt={currentRestaurant.name}
                        className="w-full h-full object-cover opacity-60"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 opacity-60 flex items-center justify-center">
                        <span className="text-5xl text-gray-700">🍔</span>
                    </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>

                <div className="absolute top-4 left-4 z-10">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center justify-center w-10 h-10 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                </div>

                <div className="absolute bottom-0 left-0 w-full p-4 md:p-8 max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                {!currentRestaurant.isOpen && (
                                    <span className="px-3 py-1 bg-red-500/90 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-wider rounded-lg">
                                        Closed
                                    </span>
                                )}
                                <div className="flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm font-medium rounded-lg">
                                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                    {currentRestaurant.rating?.toFixed(1) || 'New'}
                                    <span className="text-white/70 text-xs">({currentRestaurant.totalRatings || 0})</span>
                                </div>
                            </div>
                            <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 drop-shadow-md">
                                {currentRestaurant.name}
                            </h1>
                            <p className="text-gray-300 max-w-2xl text-sm md:text-base mb-4 drop-shadow-sm line-clamp-2">
                                {currentRestaurant.description || currentRestaurant.cuisineTypes?.join(' • ')}
                            </p>

                            <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-gray-200">
                                <div className="flex items-center gap-1.5">
                                    <MapPin className="w-4 h-4 text-orange-400" />
                                    {currentRestaurant.address?.street}, {currentRestaurant.address?.city}
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Clock className="w-4 h-4 text-orange-400" />
                                    {currentRestaurant.deliveryTime || '30-45'} mins
                                </div>
                                <div className="flex items-center gap-1.5 text-orange-400 bg-orange-500/10 px-2 py-1 rounded-md">
                                    Min Order: {formatCurrency(currentRestaurant.minOrderAmount || 0)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Menu Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                {/* Categories Wrapper */}
                <div className="sticky top-[73px] z-30 bg-gray-50/95 backdrop-blur-sm pt-2 pb-6 -mx-4 px-4 sm:mx-0 sm:px-0 border-b border-gray-200 mb-8">
                    <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-2">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-medium transition-all ${selectedCategory === category
                                    ? 'bg-gray-900 text-white shadow-md'
                                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Menu Items Grid */}
                {filteredMenu && filteredMenu.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredMenu.map((item) => (
                            <MenuItem
                                key={item._id}
                                item={item}
                                currentRestaurant={currentRestaurant}
                                handleAddToCart={handleAddToCart}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                        <div className="text-6xl mb-4">🍽️</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No menu items found</h3>
                        <p className="text-gray-500">
                            {selectedCategory !== 'All'
                                ? `There are no items in the "${selectedCategory}" category.`
                                : "This restaurant hasn't added any menu items yet."}
                        </p>
                    </div>
                )}

                {/* Review Section */}
                <ReviewSection restaurant={currentRestaurant} />
            </div>

            {/* Floating Cart Button (visible only if items in cart from this restaurant) */}
            {items.length > 0 && cartRestaurantId === currentRestaurant._id && (
                <div className="fixed bottom-0 left-0 w-full p-4 bg-white/80 backdrop-blur-md border-t border-gray-200 shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.1)] z-50 transform translate-y-0 transition-transform duration-300">
                    <div className="max-w-7xl mx-auto flex items-center justify-between">
                        <div className="flex-1 hidden md:flex items-center gap-4 text-gray-600">
                            <ShoppingBag className="w-5 h-5 text-orange-500" />
                            <span className="font-medium">{items.length} {items.length === 1 ? 'item' : 'items'} in cart</span>
                        </div>

                        <div className="flex-1 flex justify-center md:hidden">
                            <div className="flex items-center gap-2 bg-orange-100 text-orange-700 px-3 py-1.5 rounded-full text-sm font-bold">
                                <ShoppingBag className="w-4 h-4" />
                                {items.length}
                            </div>
                        </div>

                        <div className="flex-1 flex items-center justify-end gap-6">
                            <div className="text-right hidden sm:block">
                                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-0.5">Total</p>
                                <p className="text-xl font-bold text-gray-900 leading-none">{formatCurrency(total)}</p>
                            </div>
                            <button
                                onClick={() => navigate('/cart')}
                                className="px-8 py-3.5 bg-orange-500 text-white rounded-xl font-bold shadow-md shadow-orange-500/30 hover:bg-orange-600 hover:-translate-y-0.5 transition-all text-sm md:text-base whitespace-nowrap"
                            >
                                View Cart
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Warning if items are from a different restaurant */}
            {items.length > 0 && cartRestaurantId !== currentRestaurant._id && (
                <div className="fixed bottom-0 left-0 w-full p-3 bg-gray-900 text-white text-center text-sm z-50">
                    You have items in your cart from another restaurant. Adding items here will clear your existing cart.
                    <button onClick={() => navigate('/cart')} className="ml-3 font-bold text-orange-400 hover:text-orange-300 underline">View Cart</button>
                </div>
            )}
        </div>
    );
};

export default RestaurantDetails;
