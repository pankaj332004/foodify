import { Outlet, NavLink, useLocation } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import useAuth from '../hooks/useAuth';
import { ROLES } from '../constants/roles';
import { ROUTES } from '../constants/routes';

const DashboardLayout = () => {
    const { role } = useAuth();
    const location = useLocation();

    return (
        <div className="flex flex-col min-h-screen bg-primary-50">
            <Navbar />

            {/* Dashboard Sub-navigation */}
            {role === ROLES.RESTAURANT_OWNER && (
                <div className="bg-white border-b border-gray-200 sticky top-[68px] z-40 shadow-xs">
                    <div className="max-w-6xl mx-auto px-6 flex items-center gap-8">
                        <NavLink
                            to={ROUTES.RESTAURANT_DASHBOARD}
                            className={({ isActive }) =>
                                `py-4 text-sm font-medium border-b-2 transition-colors ${isActive ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-900'} whitespace-nowrap`
                            }
                            end
                        >
                            Overview
                        </NavLink>
                        <NavLink
                            to={ROUTES.RESTAURANT_MENU}
                            className={({ isActive }) =>
                                `py-4 text-sm font-medium border-b-2 transition-colors ${isActive ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-900'} whitespace-nowrap`
                            }
                        >
                            Menu Management
                        </NavLink>
                        <NavLink
                            to={ROUTES.RESTAURANT_ORDERS}
                            className={({ isActive }) =>
                                `py-4 text-sm font-medium border-b-2 transition-colors ${isActive ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-900'} whitespace-nowrap`
                            }
                        >
                            Orders
                        </NavLink>
                    </div>
                </div>
            )}

            {role === ROLES.DELIVERY_PARTNER && (
                <div className="bg-white border-b border-gray-200 sticky top-[68px] z-40 shadow-xs">
                    <div className="max-w-6xl mx-auto px-6 flex items-center gap-8">
                        <NavLink
                            to={ROUTES.DELIVERY_DASHBOARD}
                            className={({ isActive }) =>
                                `py-4 text-sm font-medium border-b-2 transition-colors ${isActive ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-900'} whitespace-nowrap`
                            }
                            end
                        >
                            Dashboard
                        </NavLink>
                        <NavLink
                            to={ROUTES.DELIVERY_ACTIVE}
                            className={({ isActive }) =>
                                `py-4 text-sm font-medium border-b-2 transition-colors ${isActive ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-900'} whitespace-nowrap`
                            }
                        >
                            Active Deliveries
                        </NavLink>
                    </div>
                </div>
            )}

            {role === ROLES.ADMIN && (
                <div className="bg-white border-b border-gray-200 sticky top-[68px] z-40 shadow-xs">
                    <div className="max-w-6xl mx-auto px-6 flex items-center gap-8">
                        <NavLink
                            to={ROUTES.ADMIN_DASHBOARD}
                            className={({ isActive }) =>
                                `py-4 text-sm font-medium border-b-2 transition-colors ${isActive ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-900'} whitespace-nowrap`
                            }
                            end
                        >
                            Overview
                        </NavLink>
                        <NavLink
                            to={ROUTES.ADMIN_RESTAURANTS}
                            className={({ isActive }) =>
                                `py-4 text-sm font-medium border-b-2 transition-colors ${isActive ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-900'} whitespace-nowrap`
                            }
                        >
                            Restaurants
                        </NavLink>
                        <NavLink
                            to={ROUTES.ADMIN_USERS}
                            className={({ isActive }) =>
                                `py-4 text-sm font-medium border-b-2 transition-colors ${isActive ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-900'} whitespace-nowrap`
                            }
                        >
                            Users
                        </NavLink>
                    </div>
                </div>
            )}

            <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-8">
                <Outlet />
            </main>
        </div>
    );
};

export default DashboardLayout;
