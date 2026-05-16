import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllUsers, toggleUserStatus } from '../../features/admin/adminThunk';
import { selectAdminUsers, selectAdminLoading } from '../../features/admin/adminSlice';
import { Search, Filter, Shield, User, Mail, Calendar, MoreVertical, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const ManageUsers = () => {
    const dispatch = useDispatch();
    const users = useSelector(selectAdminUsers);
    const isLoading = useSelector(selectAdminLoading);

    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');

    useEffect(() => {
        dispatch(fetchAllUsers());
    }, [dispatch]);

    const handleToggleStatus = async (id) => {
        const res = await dispatch(toggleUserStatus(id));
        if (!res.error) {
            toast.success('User status updated');
        } else {
            toast.error(res.payload || 'Failed to update user');
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const getRoleBadge = (role) => {
        switch (role) {
            case 'admin': return 'bg-purple-100 text-purple-700';
            case 'restaurant_owner': return 'bg-orange-100 text-orange-700';
            case 'delivery_partner': return 'bg-blue-100 text-blue-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="space-y-6 animate-float-up">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-black text-gray-900">Manage Users</h1>
                    <p className="text-gray-500 mt-1">View and manage all user accounts across the platform.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            className="pl-10 pr-4 py-2 bg-white border border-gray-100 rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select
                        className="bg-white border border-gray-100 rounded-2xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 transition-all font-medium text-gray-600"
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                    >
                        <option value="all">All Roles</option>
                        <option value="customer">Customers</option>
                        <option value="restaurant_owner">Owners</option>
                        <option value="delivery_partner">Delivery</option>
                        <option value="admin">Admins</option>
                    </select>
                </div>
            </header>

            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-50">
                                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">User Details</th>
                                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Role</th>
                                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Signed Up</th>
                                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-8 py-12 text-center text-gray-400 italic font-medium">No users found matchng your criteria.</td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user._id} className="hover:bg-gray-50/30 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black shadow-sm shadow-primary/5">
                                                    {user.name[0].toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 leading-tight">{user.name}</p>
                                                    <p className="text-xs text-gray-400 font-medium mt-0.5">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className={`px-3 py-1 rounded-lg text-[0.65rem] font-black uppercase tracking-widest ${getRoleBadge(user.role)}`}>
                                                {user.role.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-sm font-bold text-gray-500">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex justify-center">
                                                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.6rem] font-black uppercase tracking-widest ${user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    <div className={`w-1.5 h-1.5 rounded-full ${user.isActive ? 'bg-green-600' : 'bg-red-600'} animate-pulse`}></div>
                                                    {user.isActive ? 'Active' : 'Suspended'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleToggleStatus(user._id)}
                                                    className={`p-2 rounded-xl transition-all ${user.isActive ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}
                                                    title={user.isActive ? 'Suspend User' : 'Activate User'}
                                                >
                                                    {user.isActive ? <XCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
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

export default ManageUsers;
