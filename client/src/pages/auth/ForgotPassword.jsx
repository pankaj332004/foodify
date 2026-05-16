import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

import useAuth from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
    const { sendResetLink, isLoading, error } = useAuth();
    const [email, setEmail] = useState('');
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await sendResetLink(email);
        if (!result.error) {
            setSent(true);
            toast.success('Reset link sent to your email!');
        } else {
            toast.error(result.payload || 'Failed to send reset link');
        }
    };

    return (
        <div className="food-card w-full max-w-[400px] p-10 text-center">
            <span className="text-5xl block mb-3">🔒</span>
            <h2 className="font-heading text-[1.7rem] font-bold text-gray-900 mb-2">Forgot Password?</h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-7">
                No worries! Enter your email and we'll send a reset link straight away.
            </p>

            {sent ? (
                <div className="bg-green-50 border border-green-200 text-green-700 font-semibold px-4 py-4 rounded-xl mb-4">
                    ✅ Reset link sent! Check your inbox.
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-gray-600">Email Address</label>
                        <input
                            className="input-brand"
                            type="email"
                            autoComplete="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <button className="btn-brand mt-1" type="submit" disabled={isLoading}>
                        {isLoading ? '⏳ Sending...' : 'Send Reset Link →'}
                    </button>
                </form>
            )}

            <p className="mt-6">
                <Link to={ROUTES.LOGIN} className="text-primary font-semibold text-sm no-underline">
                    ← Back to Sign In
                </Link>
            </p>
        </div>
    );
};

export default ForgotPassword;
