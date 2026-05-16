import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyRestaurant, updateRestaurant, createRestaurant, toggleRestaurantOpen } from '../../features/restaurant/restaurantThunk';
import { Camera, MapPin, Clock, Edit2, Loader2, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';

const RestaurantDashboard = () => {
    const dispatch = useDispatch();
    const { currentRestaurant, isLoading } = useSelector((state) => state.restaurant);

    const [isEditing, setIsEditing] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        address: '',
        cuisineTypes: '',
        deliveryRadius: '',
        minOrderAmount: '',
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    // Initial Fetch
    useEffect(() => {
        dispatch(fetchMyRestaurant());
    }, [dispatch]);

    // Populate form when restaurant data loads
    useEffect(() => {
        if (currentRestaurant && !isCreating) {
            setFormData({
                name: currentRestaurant.name || '',
                description: currentRestaurant.description || '',
                address: currentRestaurant.address ? `${currentRestaurant.address.street}, ${currentRestaurant.address.city}, ${currentRestaurant.address.state}, ${currentRestaurant.address.pincode}` : '',
                cuisineTypes: currentRestaurant.cuisineTypes?.join(', ') || '',
                deliveryRadius: currentRestaurant.deliveryRadius || '',
                minOrderAmount: currentRestaurant.minOrderAmount || '',
            });
            setImagePreview(currentRestaurant.coverImage);
        }
    }, [currentRestaurant, isCreating]);

    const handleToggleOpen = () => {
        dispatch(toggleRestaurantOpen(currentRestaurant._id))
            .unwrap()
            .then((isOpen) => {
                toast.success(isOpen ? 'Restaurant is now Open' : 'Restaurant is now Closed');
            })
            .catch((err) => toast.error(err));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append('name', formData.name);
        data.append('description', formData.description);
        // Cuisine Types parsing
        const cuisines = formData.cuisineTypes.split(',').map(c => c.trim()).filter(Boolean);
        data.append('cuisineTypes', JSON.stringify(cuisines));
        data.append('deliveryRadius', formData.deliveryRadius);
        data.append('minOrderAmount', formData.minOrderAmount);

        // Basic address parsing
        const addressParts = formData.address.split(',').map(part => part.trim());
        const addressObj = {
            street: addressParts[0] || '',
            city: addressParts[1] || 'City',
            state: addressParts[2] || 'State',
            pincode: addressParts[3] || '000000'
        };
        data.append('address', JSON.stringify(addressObj));

        if (imageFile) {
            data.append('coverImage', imageFile);
        }

        try {
            if (isCreating) {
                await dispatch(createRestaurant(data)).unwrap();
                toast.success('Restaurant profile created successfully!');
                setIsCreating(false);
            } else {
                await dispatch(updateRestaurant({ id: currentRestaurant._id, formData: data })).unwrap();
                toast.success('Restaurant profile updated!');
                setIsEditing(false);
            }
            setImageFile(null);
        } catch (err) {
            // Check for array of validation errors from backend
            if (Array.isArray(err)) {
                err.forEach(e => toast.error(e));
            } else {
                toast.error(err || 'Failed to save profile');
            }
        }
    };

    if (isLoading && !currentRestaurant) {
        return (
            <div className="flex justify-center items-center h-full min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            </div>
        );
    }

    if (!currentRestaurant && !isLoading && !isCreating) {
        return (
            <div className="max-w-3xl mx-auto p-6 text-center mt-12 bg-white rounded-2xl shadow-sm border border-gray-100 py-16">
                <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Edit2 className="w-10 h-10 text-orange-400" />
                </div>
                <h2 className="text-3xl font-bold mb-4 text-gray-900">Welcome, Partner!</h2>
                <p className="text-gray-600 mb-8 max-w-lg mx-auto text-lg">It looks like you haven't set up your restaurant profile yet. Let's get your store online and ready for orders.</p>
                <button
                    onClick={() => setIsCreating(true)}
                    className="bg-orange-500 text-white px-8 py-3.5 rounded-xl font-medium hover:bg-orange-600 transition-colors shadow-md shadow-orange-500/30 text-lg"
                >
                    Setup Restaurant Profile
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-12 pt-4">
            {/* Header Section (Only show if not creating for first time) */}
            {!isCreating && (
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Restaurant Overview</h1>
                        <p className="text-gray-500 mt-1">Manage your profile and visibility</p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={handleToggleOpen}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium shadow-sm transition-all duration-300 ${currentRestaurant?.isOpen
                                ? 'bg-green-100 text-green-700 hover:bg-green-200 border border-green-200'
                                : 'bg-red-100 text-red-700 hover:bg-red-200 border border-red-200'
                                }`}
                        >
                            <div className={`w-2.5 h-2.5 rounded-full ${currentRestaurant?.isOpen ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                            {currentRestaurant?.isOpen ? 'Accepting Orders' : 'Currently Closed'}
                        </button>

                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 shadow-sm transition-colors"
                            >
                                <Edit2 className="w-4 h-4" />
                                Edit Profile
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {isEditing || isCreating ? (
                    <form onSubmit={handleSubmit} className="p-6 sm:p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">
                                {isCreating ? 'Create Restaurant Profile' : 'Edit Details'}
                            </h2>
                            {!isCreating && (
                                <button type="button" onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-gray-600">
                                    <X className="w-6 h-6" />
                                </button>
                            )}
                        </div>

                        <div className="space-y-6">
                            {/* Cover Image Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image</label>
                                <div className="relative group rounded-xl overflow-hidden bg-gray-50 border-2 border-dashed border-gray-200 hover:border-orange-400 transition-colors h-48 sm:h-64 flex flex-col items-center justify-center cursor-pointer">
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Cover Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="text-center p-6">
                                            <Camera className="w-10 h-10 text-gray-400 mx-auto mb-2 group-hover:text-orange-500 transition-colors" />
                                            <p className="text-sm text-gray-500">Click to upload a high-quality cover photo</p>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    {imagePreview && (
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span className="text-white font-medium flex items-center gap-2">
                                                <Camera className="w-5 h-5" /> Change Photo
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Restaurant Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            placeholder="e.g. The Rustic Oven"
                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Cuisine Types (Comma separated)</label>
                                        <input
                                            type="text"
                                            name="cuisineTypes"
                                            value={formData.cuisineTypes}
                                            onChange={handleInputChange}
                                            placeholder="e.g. Italian, Fast Food, Deserts"
                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Address (Street, City, State, ZIP)</label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            placeholder="123 Main St, New York, NY, 10001"
                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Radius (km)</label>
                                            <input
                                                type="number"
                                                name="deliveryRadius"
                                                value={formData.deliveryRadius}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Min Order ($)</label>
                                            <input
                                                type="number"
                                                name="minOrderAmount"
                                                value={formData.minOrderAmount}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows="3"
                                    placeholder="Tell customers a bit about your restaurant..."
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all resize-none"
                                ></textarea>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                                {!isCreating && (
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        className="px-6 py-2.5 rounded-xl font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="px-6 py-2.5 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-colors flex items-center gap-2 shadow-sm shadow-orange-500/30 disabled:opacity-70"
                                >
                                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                    {isCreating ? 'Create Profile' : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    </form>
                ) : (
                    <div>
                        {/* View Mode */}
                        <div className="relative h-48 sm:h-64 bg-gray-200">
                            {currentRestaurant?.coverImage ? (
                                <img
                                    src={currentRestaurant.coverImage}
                                    alt={currentRestaurant.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                    <Camera className="w-12 h-12 opacity-50" />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />
                            <div className="absolute bottom-6 left-6 right-6">
                                <h2 className="text-3xl font-bold text-white mb-2 shadow-sm">{currentRestaurant?.name}</h2>
                                <div className="flex flex-wrap items-center gap-4 text-white/90 text-sm font-medium">
                                    <span className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                                        <MapPin className="w-4 h-4" />
                                        {currentRestaurant?.address?.city || 'Location not set'}
                                    </span>
                                    <span className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                                        <Clock className="w-4 h-4" />
                                        {currentRestaurant?.deliveryTime || '30-45'} mins
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="md:col-span-2 space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">About</h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {currentRestaurant?.description || 'No description provided yet.'}
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Cuisines</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {currentRestaurant?.cuisineTypes?.map((cuisine, i) => (
                                            <span key={i} className="px-3 py-1 bg-orange-50 text-orange-700 rounded-lg text-sm font-medium border border-orange-100">
                                                {cuisine}
                                            </span>
                                        )) || <span className="text-gray-500 italic">None specified</span>}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 h-fit space-y-4">
                                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Operations</h3>
                                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                    <span className="text-gray-600">Min Order</span>
                                    <span className="font-semibold text-gray-900">${currentRestaurant?.minOrderAmount || '0'}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                    <span className="text-gray-600">Delivery Radius</span>
                                    <span className="font-semibold text-gray-900">{currentRestaurant?.deliveryRadius || '5'} km</span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-gray-600">Rating</span>
                                    <span className="font-semibold text-emerald-600 flex items-center gap-1">
                                        ★ {currentRestaurant?.rating?.toFixed(1) || 'New'}
                                        <span className="text-gray-400 text-xs font-normal">({currentRestaurant?.numReviews || 0})</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RestaurantDashboard;
