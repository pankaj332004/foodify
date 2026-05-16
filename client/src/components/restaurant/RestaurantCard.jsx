import { Link } from 'react-router-dom';
import { Star, Clock, MapPin, AlertCircle } from 'lucide-react';
import { ROUTES } from '../../constants/routes';

const RestaurantCard = ({ restaurant }) => {
    // Determine the route to navigate to
    const detailRoute = ROUTES.RESTAURANT_DETAILS.replace(':id', restaurant._id);

    return (
        <Link
            to={detailRoute}
            className="group relative block bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
        >
            {/* Close Overlay */}
            {!restaurant.isOpen && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center transition-opacity">
                    <div className="bg-gray-900/90 text-white px-6 py-3 rounded-2xl shadow-lg flex items-center gap-3 backdrop-blur-md border border-white/10">
                        <AlertCircle className="w-5 h-5 text-orange-400" />
                        <span className="font-semibold tracking-wide">Currently Closed</span>
                    </div>
                </div>
            )}

            {/* Image Container */}
            <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
                <img
                    src={restaurant.coverImage || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80'}
                    alt={restaurant.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />

                {/* Rating Badge */}
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-2.5 py-1.5 rounded-lg shadow-sm flex items-center gap-1.5 border border-white/20">
                    <Star className="w-4 h-4 text-orange-400 fill-orange-400" />
                    <span className="text-sm font-bold text-gray-900">{restaurant.rating?.toFixed(1) || 'New'}</span>
                    {restaurant.numReviews > 0 && (
                        <span className="text-xs font-medium text-gray-400">({restaurant.numReviews})</span>
                    )}
                </div>
            </div>

            {/* Content Area */}
            <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-orange-500 transition-colors">
                        {restaurant.name}
                    </h3>
                </div>

                {/* Categories */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {restaurant.cuisineTypes?.slice(0, 3).map((cuisine, idx) => (
                        <span key={idx} className="text-xs font-medium bg-orange-50 text-orange-700 px-2 py-1 rounded-md">
                            {cuisine}
                        </span>
                    ))}
                    {restaurant.cuisineTypes?.length > 3 && (
                        <span className="text-xs font-medium bg-gray-50 text-gray-500 px-2 py-1 rounded-md">
                            +{restaurant.cuisineTypes.length - 3}
                        </span>
                    )}
                </div>

                {/* Footer Stats / Meta */}
                <div className="flex items-center gap-4 text-sm text-gray-500 border-t border-gray-100 pt-4 mt-1">
                    <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-gray-400 group-hover:text-orange-400 transition-colors" />
                        <span className="font-medium text-gray-700">{restaurant.deliveryTime || '30-45'} min</span>
                    </div>
                    <div className="w-1 h-1 bg-gray-300 rounded-full" />
                    <div className="flex items-center gap-1.5">
                        <span className="font-medium text-gray-700">Min ${restaurant.minOrderAmount || 0}</span>
                    </div>
                </div>

            </div>
        </Link>
    );
};

export default RestaurantCard;
