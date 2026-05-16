import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { fetchRestaurants } from '../../features/restaurant/restaurantThunk';
import RestaurantCard from '../../components/restaurant/RestaurantCard';
import { Search, MapPin, Filter, Loader2, UtensilsCrossed } from 'lucide-react';

const POPULAR_CUISINES = ['Italian', 'American', 'Mexican', 'Indian', 'Asian', 'Healthy', 'Pizza', 'Desserts', 'Fast Food'];

const SearchResults = () => {
    const dispatch = useDispatch();
    const [searchParams, setSearchParams] = useSearchParams();

    const { restaurants, isLoading } = useSelector((state) => state.restaurant);

    // Internal State for immediate UI updates
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
    const [selectedCuisine, setSelectedCuisine] = useState(searchParams.get('cuisine') || 'All');
    const [locationTerm, setLocationTerm] = useState(searchParams.get('city') || '');

    useEffect(() => {
        const queryParams = {};
        if (searchParams.get('search')) queryParams.search = searchParams.get('search');
        if (searchParams.get('cuisine') && searchParams.get('cuisine') !== 'All') {
            queryParams.cuisine = searchParams.get('cuisine');
        }
        if (searchParams.get('city')) queryParams.city = searchParams.get('city');

        dispatch(fetchRestaurants(queryParams));
    }, [dispatch, searchParams]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        updateURLParams(searchTerm, selectedCuisine, locationTerm);
    };

    const handleCuisineSelect = (cuisine) => {
        setSelectedCuisine(cuisine);
        updateURLParams(searchTerm, cuisine, locationTerm);
    };

    const updateURLParams = (search, cuisine, city) => {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (cuisine && cuisine !== 'All') params.set('cuisine', cuisine);
        if (city) params.set('city', city);
        setSearchParams(params);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col animate-fade-in relative z-0">
            {/* Search Hero Section */}
            <div className="bg-white border-b border-gray-100 sticky top-0 z-20 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="flex-1 relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-150 ease-in-out sm:text-sm text-gray-900 shadow-inner"
                                placeholder="Search for restaurants, cuisines, or dishes..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="md:w-64 relative shrink-0">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <MapPin className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-150 ease-in-out sm:text-sm text-gray-900 shadow-inner"
                                placeholder="Enter city (e.g. New York)"
                                value={locationTerm}
                                onChange={(e) => setLocationTerm(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full md:w-auto px-8 py-3.5 border border-transparent text-sm font-bold rounded-xl text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors shadow-md shadow-orange-500/30"
                        >
                            Search
                        </button>
                    </form>

                    {/* Filter Chips */}
                    <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
                        <div className="flex items-center gap-2 pr-4 border-r border-gray-200 text-gray-500 shrink-0">
                            <Filter className="w-5 h-5" />
                            <span className="text-sm font-medium">Categories</span>
                        </div>

                        <button
                            onClick={() => handleCuisineSelect('All')}
                            className={`shrink-0 px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${selectedCuisine === 'All'
                                ? 'bg-gray-900 text-white border-gray-900 shadow-sm'
                                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                }`}
                        >
                            All Places
                        </button>

                        {POPULAR_CUISINES.map((cuisine) => (
                            <button
                                key={cuisine}
                                onClick={() => handleCuisineSelect(cuisine)}
                                className={`shrink-0 px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${selectedCuisine === cuisine
                                    ? 'bg-orange-500 text-white border-orange-500 shadow-sm shadow-orange-500/20'
                                    : 'bg-white text-gray-600 border-gray-200 hover:border-orange-200 hover:text-orange-600'
                                    }`}
                            >
                                {cuisine}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Results Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 w-full flex-1">
                <div className="mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {selectedCuisine !== 'All' ? `${selectedCuisine} Restaurants` : 'Popular Near You'}
                        </h1>
                        <p className="mt-1 text-gray-500">
                            {restaurants?.length || 0} places found {searchTerm && `matching "${searchTerm}"`}
                        </p>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-10 h-10 animate-spin text-orange-500 mb-4" />
                        <p className="text-gray-500 font-medium animate-pulse">Finding the best spots...</p>
                    </div>
                ) : restaurants?.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {restaurants.map((restaurant) => (
                            <RestaurantCard key={restaurant._id} restaurant={restaurant} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <UtensilsCrossed className="w-10 h-10 text-gray-300" />
                        </div>
                        <h3 className="mt-2 text-xl font-bold text-gray-900">No restaurants found</h3>
                        <p className="mt-2 text-gray-500 max-w-sm mx-auto">
                            We couldn't find any places matching your current filters. Try changing your search or cuisine category.
                        </p>
                        <button
                            onClick={() => handleCuisineSelect('All')}
                            className="mt-6 px-6 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Clear Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchResults;
