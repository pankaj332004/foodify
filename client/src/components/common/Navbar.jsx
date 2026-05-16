import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useCart from '../../hooks/useCart';
import { ROUTES } from '../../constants/routes';
import { ROLES } from '../../constants/roles';

const Navbar = () => {
    const { isAuthenticated, user, role, logout } = useAuth();
    const { itemCount } = useCart();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate(ROUTES.LOGIN);
    };

    return (
        <nav className="sticky top-0 z-50 flex items-center justify-between px-8 h-[68px] shadow-[0_4px_20px_rgba(255,87,34,0.35)]" style={{ background: 'linear-gradient(90deg,#ff5722 0%,#ff7043 100%)' }}>

            {/* Brand */}
            <Link to={ROUTES.HOME} className="flex items-center gap-2 no-underline">
                <span className="text-3xl drop-shadow-lg">🍔</span>
                <span className="font-heading font-extrabold text-2xl tracking-tight text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.15)]">
                    Foodify
                </span>
            </Link>

            {/* Desktop links */}
            <div className="flex items-center gap-5">
                <Link to={ROUTES.HOME} className="text-white/90 font-medium text-[0.95rem] hover:text-white transition-colors">Home</Link>
                <Link to={ROUTES.SEARCH} className="text-white/90 font-medium text-[0.95rem] hover:text-white transition-colors">Explore</Link>

                {isAuthenticated ? (
                    <>
                        {role === ROLES.CUSTOMER && (
                            <>
                                <Link to={ROUTES.CART} className="flex items-center gap-1 text-white/90 font-medium text-[0.95rem] hover:text-white transition-colors">
                                    🛒 Cart
                                    {itemCount > 0 && (
                                        <span className="inline-flex items-center justify-center bg-white text-primary font-bold text-[0.72rem] w-5 h-5 rounded-full ml-0.5">
                                            {itemCount}
                                        </span>
                                    )}
                                </Link>
                                <Link to={ROUTES.ORDER_HISTORY} className="text-white/90 font-medium text-[0.95rem] hover:text-white transition-colors">Orders</Link>
                            </>
                        )}
                        {role === ROLES.RESTAURANT_OWNER && (
                            <Link to={ROUTES.RESTAURANT_DASHBOARD} className="text-white/90 font-medium hover:text-white transition-colors">Dashboard</Link>
                        )}
                        {role === ROLES.DELIVERY_PARTNER && (
                            <Link to={ROUTES.DELIVERY_DASHBOARD} className="text-white/90 font-medium hover:text-white transition-colors">Dashboard</Link>
                        )}
                        {role === ROLES.ADMIN && (
                            <Link to={ROUTES.ADMIN_DASHBOARD} className="text-white/90 font-medium hover:text-white transition-colors">Admin</Link>
                        )}

                        {/* User avatar + name */}
                        <div className="flex items-center gap-2">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/25 border-2 border-white/50 text-white font-bold text-sm">
                                {user?.name?.[0]?.toUpperCase() || 'U'}
                            </span>
                            <span className="text-white/90 text-sm font-medium">{user?.name}</span>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="px-[18px] py-1.5 rounded-lg bg-white/15 border border-white/50 text-white font-semibold text-sm backdrop-blur hover:bg-white/25 transition-colors"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to={ROUTES.LOGIN} className="text-white/90 font-medium text-[0.95rem] hover:text-white transition-colors">Login</Link>
                        <Link
                            to={ROUTES.REGISTER}
                            className="px-5 py-2 rounded-lg bg-white text-primary font-bold text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
                        >
                            Get Started
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
