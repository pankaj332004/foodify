import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react'; // Re-saved to trigger HMR
import { useDispatch } from 'react-redux';
import { fetchMe } from '../features/auth/authThunk';
import { ROUTES } from '../constants/routes';
import { ROLES } from '../constants/roles';
import ProtectedRoute from '../components/common/ProtectedRoute';

// Layouts
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';

// Public pages
import Home from '../pages/public/Home';
import RestaurantDetails from '../pages/public/RestaurantDetails';
import SearchResults from '../pages/public/SearchResults';
import About from '../pages/public/About';
import Careers from '../pages/public/Careers';
import Blog from '../pages/public/Blog';
import HelpCenter from '../pages/public/HelpCenter';
import PrivacyPolicy from '../pages/public/PrivacyPolicy';
import TermsOfService from '../pages/public/TermsOfService';

// Auth pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';

// User pages
import UserDashboard from '../pages/user/UserDashboard';
import Cart from '../pages/user/Cart';
import Checkout from '../pages/user/Checkout';
import OrderHistory from '../pages/user/OrderHistory';
import OrderTracking from '../pages/user/OrderTracking';

// Restaurant owner pages
import RestaurantDashboard from '../pages/restaurant/RestaurantDashboard';
import RestaurantMenu from '../pages/restaurant/RestaurantMenu';
import RestaurantOrders from '../pages/restaurant/RestaurantOrders';

// Delivery pages
import DeliveryDashboard from '../pages/delivery/DeliveryDashboard';
import ActiveDelivery from '../pages/delivery/ActiveDelivery';

// Admin pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import ManageRestaurants from '../pages/admin/ManageRestaurants';
import ManageUsers from '../pages/admin/ManageUsers';

const AppRoutes = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        if (localStorage.getItem('token')) {
            dispatch(fetchMe());
        }
    }, [dispatch]);

    return (
        <Routes>
            {/* ── Public (with Navbar/Footer) ── */}
            <Route element={<MainLayout />}>
                <Route path={ROUTES.HOME} element={<Home />} />
                <Route path={ROUTES.RESTAURANT_DETAILS} element={<RestaurantDetails />} />
                <Route path={ROUTES.SEARCH} element={<SearchResults />} />
                <Route path={ROUTES.ABOUT} element={<About />} />
                <Route path={ROUTES.CAREERS} element={<Careers />} />
                <Route path={ROUTES.BLOG} element={<Blog />} />
                <Route path={ROUTES.HELP} element={<HelpCenter />} />
                <Route path={ROUTES.PRIVACY} element={<PrivacyPolicy />} />
                <Route path={ROUTES.TERMS} element={<TermsOfService />} />
            </Route>

            {/* ── Auth (centered card layout) ── */}
            <Route element={<AuthLayout />}>
                <Route path={ROUTES.LOGIN} element={<Login />} />
                <Route path={ROUTES.REGISTER} element={<Register />} />
                <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
            </Route>

            {/* ── Customer protected ── */}
            <Route element={<ProtectedRoute roles={[ROLES.CUSTOMER]} />}>
                <Route element={<MainLayout />}>
                    <Route path={ROUTES.USER_DASHBOARD} element={<UserDashboard />} />
                    <Route path={ROUTES.CART} element={<Cart />} />
                    <Route path={ROUTES.CHECKOUT} element={<Checkout />} />
                    <Route path={ROUTES.ORDER_HISTORY} element={<OrderHistory />} />
                    <Route path={ROUTES.ORDER_TRACKING} element={<OrderTracking />} />
                </Route>
            </Route>

            {/* ── Restaurant owner protected ── */}
            <Route element={<ProtectedRoute roles={[ROLES.RESTAURANT_OWNER]} />}>
                <Route element={<DashboardLayout />}>
                    <Route path={ROUTES.RESTAURANT_DASHBOARD} element={<RestaurantDashboard />} />
                    <Route path={ROUTES.RESTAURANT_MENU} element={<RestaurantMenu />} />
                    <Route path={ROUTES.RESTAURANT_ORDERS} element={<RestaurantOrders />} />
                </Route>
            </Route>

            {/* ── Delivery partner protected ── */}
            <Route element={<ProtectedRoute roles={[ROLES.DELIVERY_PARTNER]} />}>
                <Route element={<DashboardLayout />}>
                    <Route path={ROUTES.DELIVERY_DASHBOARD} element={<DeliveryDashboard />} />
                    <Route path={ROUTES.DELIVERY_ACTIVE} element={<ActiveDelivery />} />
                </Route>
            </Route>

            {/* ── Admin protected ── */}
            <Route element={<ProtectedRoute roles={[ROLES.ADMIN]} />}>
                <Route element={<DashboardLayout />}>
                    <Route path={ROUTES.ADMIN_DASHBOARD} element={<AdminDashboard />} />
                    <Route path={ROUTES.ADMIN_RESTAURANTS} element={<ManageRestaurants />} />
                    <Route path={ROUTES.ADMIN_USERS} element={<ManageUsers />} />
                </Route>
            </Route>

            {/* ── Fallback ── */}
            <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
        </Routes>
    );
};

export default AppRoutes;
