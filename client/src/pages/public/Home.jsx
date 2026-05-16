import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

const FEATURES = [
    { icon: '🚀', title: 'Lightning Fast', desc: 'Hot food delivered in 30 minutes or less.' },
    { icon: '🍽️', title: '500+ Restaurants', desc: 'Explore diverse cuisines from top local spots.' },
    { icon: '🔒', title: 'Secure Payments', desc: 'Pay safely with multiple payment options.' },
    { icon: '📍', title: 'Live Tracking', desc: 'Watch your order move in real time on the map.' },
];

const CATEGORIES = [
    { emoji: '🍕', name: 'Pizza' },
    { emoji: '🍣', name: 'Sushi' },
    { emoji: '🍔', name: 'Burgers' },
    { emoji: '🌮', name: 'Tacos' },
    { emoji: '🍜', name: 'Noodles' },
    { emoji: '🧁', name: 'Desserts' },
];

const Home = () => (
    <div className="bg-brand-bg">

        {/* ── Hero ─────────────────────────────────────────────── */}
        <section className="relative flex flex-wrap items-center justify-between gap-10 min-h-[560px] px-16 py-20 overflow-hidden"
            style={{ background: 'linear-gradient(135deg,#ff5722 0%,#ff7043 50%,#ffa726 100%)' }}>
            {/* Blobs */}
            <div className="absolute -top-24 right-[200px] w-[350px] h-[350px] rounded-full bg-white/8 pointer-events-none" />
            <div className="absolute -bottom-20 left-[40%] w-[250px] h-[250px] rounded-full bg-white/6 pointer-events-none" />

            {/* Copy */}
            <div className="relative z-10 flex-1 basis-[420px] text-white">
                <span className="inline-block px-4 py-1.5 mb-5 rounded-full text-sm font-semibold bg-white/20 backdrop-blur border border-white/30">
                    🔥 #1 Food Delivery App
                </span>
                <h1 className="font-heading text-[clamp(2.2rem,5vw,3.6rem)] font-extrabold leading-[1.15] text-white mb-4">
                    Delicious Food,<br />
                    <span style={{ background: 'linear-gradient(90deg,#fff,#ffe0b2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Delivered Fast
                    </span>
                </h1>
                <p className="text-white/88 text-lg leading-relaxed mb-8 max-w-xl">
                    Order from hundreds of top-rated restaurants near you. Fresh, hot, and right to your door.
                </p>
                <div className="flex flex-wrap gap-4 mb-10">
                    <Link to={ROUTES.SEARCH}
                        className="px-8 py-3.5 bg-white text-primary font-bold rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all no-underline">
                        🍽️ Order Now
                    </Link>
                    <Link to={ROUTES.REGISTER}
                        className="px-8 py-3.5 bg-white/15 text-white font-bold rounded-xl border-2 border-white/50 backdrop-blur hover:bg-white/25 transition-all no-underline">
                        Join Free
                    </Link>
                </div>
                {/* Stats */}
                <div className="flex items-center gap-5 flex-wrap">
                    {[['50K+', 'Happy Customers'], ['500+', 'Restaurants'], ['4.9★', 'App Rating']].map(([val, lbl], i) => (
                        <div key={lbl} className="flex items-center gap-5">
                            <div className="flex flex-col font-heading">
                                <strong className="text-white text-xl font-bold">{val}</strong>
                                <span className="text-white/80 text-xs">{lbl}</span>
                            </div>
                            {i < 2 && <div className="w-px h-8 bg-white/30" />}
                        </div>
                    ))}
                </div>
            </div>

            {/* Illustration */}
            <div className="relative flex items-center justify-center w-[320px] h-[320px] shrink-0">
                <span className="text-[10rem] animate-soft-pulse drop-shadow-2xl">🍔</span>
                <span className="absolute top-5 right-0 bg-white text-primary font-semibold text-sm px-4 py-2 rounded-full shadow-md">🍕 Pizza</span>
                <span className="absolute bottom-16 left-0 bg-white text-primary font-semibold text-sm px-4 py-2 rounded-full shadow-md">30 min ⚡</span>
                <span className="absolute bottom-5 right-5 bg-secondary text-white font-semibold text-sm px-4 py-2 rounded-full shadow-md">⭐ 4.9</span>
            </div>
        </section>

        {/* ── Categories ───────────────────────────────────────── */}
        <section className="max-w-6xl mx-auto px-6 py-20">
            <div className="text-center mb-12">
                <h2 className="font-heading text-3xl font-bold text-gray-900">What are you craving?</h2>
                <p className="text-gray-400 mt-2">Browse by category and find exactly what you want</p>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                {CATEGORIES.map((c) => (
                    <Link key={c.name} to={`${ROUTES.SEARCH}?cuisine=${c.name}`}
                        className="flex flex-col items-center gap-2.5 py-6 px-4 bg-white rounded-2xl no-underline shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all"
                        style={{ border: '1.5px solid #ffd4c2' }}>
                        <span className="text-4xl">{c.emoji}</span>
                        <span className="font-semibold text-sm text-gray-700">{c.name}</span>
                    </Link>
                ))}
            </div>
        </section>

        {/* ── Features ─────────────────────────────────────────── */}
        <section className="px-6 py-20" style={{ background: 'linear-gradient(135deg,#fff3ee 0%,#ffe8dd 100%)' }}>
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="font-heading text-3xl font-bold text-gray-900">Why choose Foodify?</h2>
                    <p className="text-gray-400 mt-2">We make every bite count</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {FEATURES.map((f) => (
                        <div key={f.title}
                            className="bg-white rounded-2xl p-8 text-center shadow-primary-sm hover:shadow-primary-md hover:-translate-y-1 transition-all"
                            style={{ border: '1px solid rgba(255,87,34,0.10)' }}>
                            <span className="text-5xl mb-4 block">{f.icon}</span>
                            <h3 className="font-heading font-bold text-lg text-gray-900 mb-2">{f.title}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────── */}
        <section className="text-center py-20 px-6" style={{ background: 'linear-gradient(135deg,#ff5722 0%,#e64a19 50%,#bf360c 100%)' }}>
            <h2 className="font-heading text-4xl font-extrabold text-white mb-3">Ready to order?</h2>
            <p className="text-white/85 text-lg mb-8">Join thousands of food lovers and get your first delivery free!</p>
            <Link to={ROUTES.REGISTER}
                className="inline-block bg-white text-primary font-bold text-lg px-10 py-4 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.18)] hover:shadow-xl hover:-translate-y-0.5 transition-all no-underline">
                Create Free Account 🚀
            </Link>
        </section>

    </div>
);

export default Home;
