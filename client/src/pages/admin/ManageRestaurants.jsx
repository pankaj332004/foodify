import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllRestaurants, updateRestaurantStatus, deleteRestaurant } from '../../features/admin/adminThunk';
import { selectAdminRestaurants, selectAdminLoading } from '../../features/admin/adminSlice';
import { Search, Store, MapPin, Phone, Star, CheckCircle, XCircle, AlertCircle, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const ManageRestaurants = () => {
    const dispatch = useDispatch();
    const restaurants = useSelector(selectAdminRestaurants);
    const isLoading = useSelector(selectAdminLoading);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        dispatch(fetchAllRestaurants());
    }, [dispatch]);

    const handleVerifyRestaurant = async (id, currentStatus) => {
        const res = await dispatch(updateRestaurantStatus({ id, updates: { isVerified: !currentStatus } }));
        if (!res.error) {
            toast.success(currentStatus ? 'Restaurant unverified' : 'Restaurant verified successfully! 🎉');
        } else {
            toast.error(res.payload || 'Failed to update verification');
        }
    };

    const handleToggleActive = async (id, currentStatus) => {
        const res = await dispatch(updateRestaurantStatus({ id, updates: { isActive: !currentStatus } }));
        if (!res.error) {
            toast.success(currentStatus ? 'Restaurant deactivated' : 'Restaurant activated');
        } else {
            toast.error(res.payload || 'Failed to update status');
        }
    };

    const handleDeleteRestaurant = async (id) => {
        if (window.confirm('Are you sure you want to delete this restaurant? This action cannot be undone.')) {
            const res = await dispatch(deleteRestaurant(id));
            if (!res.error) {
                toast.success('Restaurant deleted successfully');
            } else {
                toast.error(res.payload || 'Failed to delete restaurant');
            }
        }
    };

    const filteredRestaurants = restaurants.filter(res => {
        const matchesSearch = res.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            res.address.city.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' ||
            (statusFilter === 'verified' && res.isVerified) ||
            (statusFilter === 'pending' && !res.isVerified);
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-6 animate-float-up">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-black text-gray-900">Manage Restaurants</h1>
                    <p className="text-gray-500 mt-1">Verify, monitor and manage all platform restaurants.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name or city..."
                            className="pl-10 pr-4 py-2 bg-white border border-gray-100 rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select
                        className="bg-white border border-gray-100 rounded-2xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 transition-all font-medium text-gray-600 outline-none"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">All Status</option>
                        <option value="verified">Verified Only</option>
                        <option value="pending">Pending Only</option>
                    </select>
                </div>
            </header>

            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-50">
                                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Restaurant</th>
                                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-center">Verification</th>
                                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-center">Rating</th>
                                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredRestaurants.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-8 py-12 text-center text-gray-400 italic font-medium">No restaurants found.</td>
                                </tr>
                            ) : (
                                filteredRestaurants.map((res) => (
                                    <tr key={res._id} className="hover:bg-gray-50/30 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl overflow-hidden bg-gray-100">
                                                    <img
                                                        src={res.coverImage || 'https://via.placeholder.com/100'}
                                                        alt={res.name}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => e.target.src = 'https://via.placeholder.com/100'}
                                                    />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 leading-tight">{res.name}</p>
                                                    <p className="text-xs text-gray-400 font-medium mt-1 flex items-center gap-1">
                                                        <MapPin className="w-3 h-3" /> {res.address.city}, {res.address.state}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex justify-center">
                                                {res.isVerified ? (
                                                    <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-lg text-[0.65rem] font-black uppercase tracking-widest ring-1 ring-green-100">
                                                        <CheckCircle className="w-3.5 h-3.5" /> Verified
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-1.5 px-3 py-1 bg-orange-50 text-orange-700 rounded-lg text-[0.65rem] font-black uppercase tracking-widest ring-1 ring-orange-100 animate-pulse">
                                                        <AlertCircle className="w-3.5 h-3.5" /> Pending
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex flex-col items-center gap-0.5">
                                                <div className="flex items-center gap-1 text-orange-500 font-black text-sm">
                                                    {res.rating.toFixed(1)} <Star className="w-3.5 h-3.5 fill-current" />
                                                </div>
                                                <span className="text-[0.6rem] text-gray-400 font-bold uppercase tracking-tighter">
                                                    {res.totalRatings} Reviews
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex justify-center">
                                                <div className={`px-2.5 py-1 rounded-full text-[0.6rem] font-black uppercase tracking-widest ${res.isActive ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                                                    {res.isActive ? 'Active' : 'Inactive'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleVerifyRestaurant(res._id, res.isVerified)}
                                                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${res.isVerified ? 'bg-orange-50 text-orange-600 hover:bg-orange-100' : 'bg-green-600 text-white hover:bg-green-700 shadow-sm shadow-green-200'}`}
                                                >
                                                    {res.isVerified ? 'Revoke' : 'Verify'}
                                                </button>
                                                <button
                                                    onClick={() => handleToggleActive(res._id, res.isActive)}
                                                    className={`p-2 rounded-xl border transition-all ${res.isActive ? 'bg-white border-gray-100 text-gray-400 hover:border-red-100 hover:text-red-500' : 'bg-blue-50 border-blue-100 text-blue-600 hover:bg-blue-100'}`}
                                                    title={res.isActive ? 'Deactivate' : 'Activate'}
                                                >
                                                    {res.isActive ? <XCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteRestaurant(res._id)}
                                                    className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all border border-red-100"
                                                    title="Delete Restaurant"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageRestaurants;
