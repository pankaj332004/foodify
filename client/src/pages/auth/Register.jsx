import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes';
import { ROLES } from '../../constants/roles';

const ROLE_OPTIONS = [
    { value: ROLES.CUSTOMER, label: '🛍️ Customer', desc: 'Order delicious food' },
    { value: ROLES.RESTAURANT_OWNER, label: '🍴 Restaurant Owner', desc: 'List your restaurant' },
    { value: ROLES.DELIVERY_PARTNER, label: '🛵 Delivery Partner', desc: 'Earn by delivering' },
];

const Register = () => {
    const { register, isLoading, error } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', role: ROLES.CUSTOMER });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await register(form);
        if (!result.error) navigate(ROUTES.HOME);
    };

    const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

    return (
        <div className="food-card w-full max-w-[480px] p-10">

            {/* Header */}
            <div className="mb-7">
                <h2 className="font-heading text-[1.8rem] font-bold text-gray-900 mb-1.5">Create account 🍕</h2>
                <p className="text-gray-400 text-[0.95rem]">Join Foodify and start ordering today</p>
            </div>

            {/* Error */}
            {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm">
                    <span>⚠️</span> {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Name */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-gray-600">Full Name</label>
                    <input className="input-brand" placeholder="John Doe" value={form.name} onChange={set('name')} required />
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-gray-600">Email Address</label>
                    <input className="input-brand" type="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={set('email')} required />
                </div>

                {/* Password + Phone row */}
                <div className="flex gap-3 flex-wrap">
                    <div className="flex flex-col gap-1.5 flex-1 min-w-[140px]">
                        <label className="text-sm font-semibold text-gray-600">Password</label>
                        <input className="input-brand" type="password" autoComplete="new-password" placeholder="Min 6 characters" value={form.password} onChange={set('password')} required minLength={6} />
                    </div>
                    <div className="flex flex-col gap-1.5 flex-1 min-w-[140px]">
                        <label className="text-sm font-semibold text-gray-600">Phone (optional)</label>
                        <input className="input-brand" placeholder="+1 234 567 890" value={form.phone} onChange={set('phone')} />
                    </div>
                </div>

                {/* Role selector */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-gray-600">I am a…</label>
                    <div className="grid grid-cols-3 gap-2.5">
                        {ROLE_OPTIONS.map((r) => (
                            <label
                                key={r.value}
                                className={`flex flex-col items-center gap-1 py-3.5 px-2 rounded-xl cursor-pointer text-center transition-all duration-200
                                    ${form.role === r.value
                                        ? 'border-2 border-primary bg-primary-50 shadow-primary-sm'
                                        : 'border-2 bg-[#fffaf8]'
                                    }`}
                                style={{ borderColor: form.role === r.value ? '#ff5722' : '#ffd4c2' }}
                            >
                                <input type="radio" name="role" value={r.value} checked={form.role === r.value}
                                    onChange={set('role')} className="hidden" />
                                <span className="font-semibold text-[0.82rem] text-gray-700">{r.label}</span>
                                <span className="text-[0.72rem] text-gray-400 leading-tight">{r.desc}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <button className="btn-brand mt-1" type="submit" disabled={isLoading}>
                    {isLoading ? '⏳ Creating account...' : 'Create Account →'}
                </button>
            </form>

            <p className="text-center mt-6 text-sm text-gray-500">
                Already have an account?{' '}
                <Link to={ROUTES.LOGIN} className="text-primary font-bold no-underline">Sign In</Link>
            </p>
        </div>
    );
};

export default Register;
