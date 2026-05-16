import { useDispatch, useSelector } from 'react-redux';
import {
    selectCurrentUser,
    selectIsAuthenticated,
    selectAuthLoading,
    selectAuthError,
    selectUserRole,
} from '../features/auth/authSelectors';
import { loginUser, registerUser, logoutUser, forgotPassword } from '../features/auth/authThunk';

import { clearError } from '../features/auth/authSlice';

const useAuth = () => {
    const dispatch = useDispatch();
    const user = useSelector(selectCurrentUser);
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const isLoading = useSelector(selectAuthLoading);
    const error = useSelector(selectAuthError);
    const role = useSelector(selectUserRole);

    const login = (formData) => dispatch(loginUser(formData));
    const register = (formData) => dispatch(registerUser(formData));
    const logout = () => dispatch(logoutUser());
    const sendResetLink = (email) => dispatch(forgotPassword(email));
    const dismissError = () => dispatch(clearError());

    return { user, isAuthenticated, isLoading, error, role, login, register, logout, sendResetLink, dismissError };
};

export default useAuth;
