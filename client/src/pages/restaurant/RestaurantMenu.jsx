import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyRestaurant, createMenuItem, updateMenuItem, deleteMenuItem, toggleMenuItem } from '../../features/restaurant/restaurantThunk';
import { Plus, Edit2, Trash2, Loader2, Image as ImageIcon, X } from 'lucide-react';
import toast from 'react-hot-toast';

const RestaurantMenu = () => {
    const dispatch = useDispatch();
    const { currentRestaurant, menu, isLoading } = useSelector((state) => state.restaurant);
    const [isMenuLoading, setIsMenuLoading] = useState(false);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        isVegetarian: false,
    });

    useEffect(() => {
        if (!currentRestaurant && !isLoading) {
            dispatch(fetchMyRestaurant());
        }
    }, [dispatch, currentRestaurant, isLoading]);

    const openModal = (item = null) => {
        if (item) {
            setEditingItem(item);
            setFormData({
                name: item.name,
                description: item.description,
                price: item.price,
                category: item.category,
                isVegetarian: item.isVegetarian,
            });
            setImagePreview(item.image);
        } else {
            setEditingItem(null);
            setFormData({
                name: '',
                description: '',
                price: '',
                category: '',
                isVegetarian: false,
            });
            setImagePreview(null);
        }
        setImageFile(null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
        setImageFile(null);
        setImagePreview(null);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsMenuLoading(true);

        const data = new FormData();
        data.append('name', formData.name);
        data.append('description', formData.description);
        data.append('price', formData.price);
        data.append('category', formData.category);
        data.append('isVegetarian', formData.isVegetarian);
        if (imageFile) data.append('image', imageFile);

        try {
            if (editingItem) {
                await dispatch(updateMenuItem({ itemId: editingItem._id, formData: data })).unwrap();
                toast.success('Item updated');
            } else {
                await dispatch(createMenuItem({ restaurantId: currentRestaurant._id, formData: data })).unwrap();
                toast.success('Item added');
            }
            closeModal();
        } catch (err) {
            toast.error(err || 'Failed to save item');
        } finally {
            setIsMenuLoading(false);
        }
    };

    const handleDelete = async (itemId) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                await dispatch(deleteMenuItem(itemId)).unwrap();
                toast.success('Item deleted');
            } catch (err) {
                toast.error(err || 'Failed to delete');
            }
        }
    };

    const handleToggleAvailable = async (itemId) => {
        try {
            await dispatch(toggleMenuItem(itemId)).unwrap();
            toast.success('Availability changed');
        } catch (err) {
            toast.error(err || 'Failed to toggle availability');
        }
    };

    if (isLoading && !currentRestaurant) {
        return <div className="flex justify-center items-center h-[60vh]"><Loader2 className="w-8 h-8 animate-spin text-orange-500" /></div>;
    }

    if (!currentRestaurant) {
        return <div className="text-center p-10"><p className="text-gray-500">Please set up your restaurant profile first.</p></div>;
    }

    // Group menu by category
    const groupedMenu = menu.reduce((acc, item) => {
        const cat = item.category || 'Other';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(item);
        return acc;
    }, {});

    return (
        <div className="max-w-6xl mx-auto space-y-6 animate-fade-in pb-12 pt-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Menu Management</h1>
                    <p className="text-gray-500 mt-1">Add, edit, and organize your dishes</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    New Item
                </button>
            </div>

            {menu.length === 0 ? (
                <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center mt-8">
                    <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Plus className="w-8 h-8 text-orange-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Your menu is empty</h3>
                    <p className="text-gray-500 max-w-sm mx-auto mb-6">Start building your menu by adding your first delicious dish.</p>
                    <button
                        onClick={() => openModal()}
                        className="bg-orange-100 text-orange-700 hover:bg-orange-200 px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                        Add First Item
                    </button>
                </div>
            ) : (
                <div className="space-y-10 mt-8">
                    {Object.entries(groupedMenu).map(([category, items]) => (
                        <div key={category} className="space-y-4">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                                {category}
                                <span className="bg-gray-100 text-gray-500 text-sm py-0.5 px-2.5 rounded-full font-medium">
                                    {items.length}
                                </span>
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {items.map(item => (
                                    <div key={item._id} className="bg-white border text-left border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow group flex flex-col">
                                        <div className="relative h-40 w-full rounded-xl overflow-hidden bg-gray-100 mb-4 shrink-0">
                                            {item.image ? (
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <ImageIcon className="w-10 h-10 text-gray-300" />
                                                </div>
                                            )}
                                            {/* Veg/Non-veg Indicator */}
                                            <div className="absolute top-3 left-3 bg-white p-1 rounded-md shadow-sm">
                                                <div className={`w-3 h-3 rounded-full ${item.isVegetarian ? 'bg-green-500' : 'bg-red-500'}`} />
                                            </div>
                                            {/* Unavailable Overlay */}
                                            {!item.isAvailable && (
                                                <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
                                                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-bold shadow-sm">
                                                        Sold Out
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex justify-between items-start gap-2 mb-1">
                                                <h3 className="font-semibold text-gray-900 line-clamp-1">{item.name}</h3>
                                                <span className="font-bold text-emerald-600">${item.price.toFixed(2)}</span>
                                            </div>
                                            <p className="text-gray-500 text-sm line-clamp-2 mb-4">
                                                {item.description}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                                            <button
                                                onClick={() => handleToggleAvailable(item._id)}
                                                className={`text-sm font-medium transition-colors ${item.isAvailable ? 'text-gray-500 hover:text-red-500' : 'text-green-600 hover:text-green-700'}`}
                                            >
                                                {item.isAvailable ? 'Mark Sold Out' : 'Mark Available'}
                                            </button>
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => openModal(item)}
                                                    className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item._id)}
                                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create / Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in text-left">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
                            <h2 className="text-xl font-bold text-gray-900">
                                {editingItem ? 'Edit Dish' : 'Add New Dish'}
                            </h2>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Image Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Item Image</label>
                                <div className="relative group rounded-xl overflow-hidden bg-gray-50 border-2 border-dashed border-gray-200 hover:border-orange-400 transition-colors h-40 flex flex-col items-center justify-center cursor-pointer">
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="text-center">
                                            <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2 group-hover:text-orange-500" />
                                            <span className="text-sm text-gray-500">Upload photo</span>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                    <input
                                        type="text" required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all outline-none"
                                        placeholder="Margherita Pizza"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                                        <input
                                            type="number" required min="0" step="0.01"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all outline-none"
                                            placeholder="12.99"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                        <input
                                            type="text" required
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all outline-none"
                                            placeholder="Starters, Mains, etc."
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea
                                        rows="3"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all outline-none resize-none"
                                        placeholder="Fresh mozzarella, basil..."
                                    />
                                </div>
                                <div className="flex items-center gap-3">
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={formData.isVegetarian}
                                            onChange={(e) => setFormData({ ...formData, isVegetarian: e.target.checked })}
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                                        <span className="ml-3 text-sm font-medium text-gray-700 flex items-center gap-2">
                                            <div className={`w-3 h-3 rounded-full ${formData.isVegetarian ? 'bg-green-500' : 'bg-red-500'}`} />
                                            {formData.isVegetarian ? 'Vegetarian' : 'Non-Vegetarian'}
                                        </span>
                                    </label>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-gray-100 flex gap-3 justify-end">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-6 py-2.5 rounded-xl font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isMenuLoading}
                                    className="px-6 py-2.5 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-colors flex items-center gap-2 shadow-sm disabled:opacity-70"
                                >
                                    {isMenuLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                                    {editingItem ? 'Save Changes' : 'Add Item'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RestaurantMenu;
