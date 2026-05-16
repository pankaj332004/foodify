import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes';
import { Loader2 } from 'lucide-react';

/**
 * Protects routes that require login.
 * Optionally restricts to specific roles.
 *
 * Usage:
 *   <Route element={<ProtectedRoute />}>...</Route>
 *   <Route element={<ProtectedRoute roles={['admin']} />}>...</Route>
 */
const ProtectedRoute = ({ roles }) => {
    const { isAuthenticated, role, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to={ROUTES.LOGIN} replace />;
    }

    if (roles && !roles.includes(role)) {
        return <Navigate to={ROUTES.HOME} replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
