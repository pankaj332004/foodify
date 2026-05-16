import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminStats } from '../../features/admin/adminThunk';
import { selectAdminStats, selectAdminLoading } from '../../features/admin/adminSlice';
import { Users, Store, ShoppingBag, DollarSign, TrendingUp, Activity } from 'lucide-react';

const AdminDashboard = () => {
    const dispatch = useDispatch();
    const stats = useSelector(selectAdminStats);
    const isLoading = useSelector(selectAdminLoading);

    useEffect(() => {
        dispatch(fetchAdminStats());
    }, [dispatch]);

    // Safety checks for totalRevenue
    const formattedRevenue = typeof stats?.totalRevenue === 'number' ? stats.totalRevenue.toFixed(2) : '0.00';

    const statCards = [
        { title: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
        { title: 'Total Restaurants', value: stats?.totalRestaurants || 0, icon: Store, color: 'text-orange-600', bg: 'bg-orange-50' },
        { title: 'Total Orders', value: stats?.totalOrders || 0, icon: ShoppingBag, color: 'text-green-600', bg: 'bg-green-50' },
        { title: 'Total Revenue', value: `$${formattedRevenue}`, icon: DollarSign, color: 'text-purple-600', bg: 'bg-purple-50' },
    ];

    if (isLoading && (!stats || stats.totalUsers === 0)) {
        return <div className="p-8 text-center animate-pulse text-gray-500 font-bold">Loading dashboard stats...</div>;
    }

    return (
        <div className="space-y-8 animate-float-up">
            <header>
                <h1 className="text-3xl font-heading font-black text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-500 mt-1">Monitor the pulse of your food delivery platform.</p>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-shadow group">
                        <div className={`${card.bg} p-4 rounded-2xl group-hover:scale-110 transition-transform`}>
                            <card.icon className={`w-8 h-8 ${card.color}`} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">{card.title}</p>
                            <h3 className="text-2xl font-black text-gray-900 mt-1">{card.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Platform Overview Mock Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-gray-100 italic text-gray-400 flex flex-col items-center justify-center min-h-[300px]">
                    <TrendingUp className="w-12 h-12 mb-4 opacity-20" />
                    <p className="font-medium text-lg text-center px-4">Growth analytics and performance trends visualization coming soon...</p>
                    <div className="w-full h-2 bg-gray-50 rounded-full mt-8 overflow-hidden max-w-md">
                        <div className="w-2/3 h-full bg-primary rounded-full animate-pulse shadow-sm shadow-primary/30"></div>
                    </div>
                </div>

                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-8 border-b border-gray-50 pb-4">
                        <h3 className="font-bold text-lg flex items-center gap-2">
                            <Activity className="w-5 h-5 text-primary" /> System Status
                        </h3>
                    </div>
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-500 font-medium tracking-tight">Server API</span>
                            <span className="px-2.5 py-1 bg-green-100 text-green-700 text-[0.65rem] font-black rounded-lg uppercase tracking-widest ring-1 ring-green-200">Stable</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-500 font-medium tracking-tight">Database</span>
                            <span className="px-2.5 py-1 bg-green-100 text-green-700 text-[0.65rem] font-black rounded-lg uppercase tracking-widest ring-1 ring-green-200">Healthy</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-500 font-medium tracking-tight">Socket.io</span>
                            <span className="px-2.5 py-1 bg-green-100 text-green-700 text-[0.65rem] font-black rounded-lg uppercase tracking-widest ring-1 ring-green-200">Connected</span>
                        </div>
                        <div className="pt-6 mt-6 border-t border-gray-50 text-center">
                            <p className="text-[0.65rem] font-bold text-gray-300 uppercase tracking-widest leading-relaxed">
                                All systems operational. Checked: Just now.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
