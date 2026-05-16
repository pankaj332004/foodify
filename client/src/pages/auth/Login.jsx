import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes';

const Login = () => {
    const { login, isLoading, error } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await login(form);
        if (!result.error) navigate(ROUTES.HOME);
    };

    return (
        <div className="food-card w-full max-w-[420px] p-10">

            {/* Header */}
            <div className="mb-7">
                <h2 className="font-heading text-[1.8rem] font-bold text-gray-900 mb-1.5">Welcome back 👋</h2>
                <p className="text-gray-400 text-[0.95rem]">Sign in to your Foodify account</p>
            </div>

            {/* Error */}
            {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm">
                    <span>⚠️</span> {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-gray-600">Email address</label>
                    <input
                        className="input-brand"
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        required
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-gray-600">Password</label>
                    <input
                        className="input-brand"
                        type="password"
                        autoComplete="current-password"
                        placeholder="••••••••"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        required
                    />
                </div>
                <div className="text-right">
                    <Link to={ROUTES.FORGOT_PASSWORD} className="text-primary text-sm font-medium no-underline">
                        Forgot password?
                    </Link>
                </div>
                <button className="btn-brand mt-1" type="submit" disabled={isLoading}>
                    {isLoading ? '⏳ Signing in...' : 'Sign In →'}
                </button>
            </form>

            <p className="text-center mt-6 text-sm text-gray-500">
                Don&apos;t have an account?{' '}
                <Link to={ROUTES.REGISTER} className="text-primary font-bold no-underline">Create one free</Link>
            </p>
        </div>
    );
};

export default Login;
