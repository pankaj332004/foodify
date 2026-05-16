import { Outlet } from 'react-router-dom';

const AuthLayout = () => (
    <div className="relative min-h-screen flex items-center justify-center px-6 py-10 overflow-hidden"
        style={{ background: 'linear-gradient(135deg,#fff3ee 0%,#ffe8dd 50%,#ffd4c2 100%)' }}>

        {/* Decorative blobs */}
        <div className="absolute -top-28 -right-28 w-[420px] h-[420px] rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle,rgba(255,112,67,0.18) 0%,transparent 70%)' }} />
        <div className="absolute -bottom-28 -left-28 w-[380px] h-[380px] rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle,rgba(255,167,38,0.15) 0%,transparent 70%)' }} />

        {/* Content */}
        <div className="relative z-10 w-full max-w-[420px] flex flex-col items-center gap-5">
            {/* Brand badge */}
            <div className="flex items-center gap-2">
                <span className="text-4xl">🍔</span>
                <span
                    className="font-heading font-extrabold text-3xl"
                    style={{ background: 'linear-gradient(90deg,#ff5722,#ffa726)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                >
                    Foodify
                </span>
            </div>
            <Outlet />
        </div>
    </div>
);

export default AuthLayout;
