import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

const Footer = () => (
    <footer className="text-white pt-14" style={{ background: 'linear-gradient(135deg,#1a0a00 0%,#2d1100 60%,#3e1a00 100%)' }}>
        {/* Main grid */}
        <div className="max-w-6xl mx-auto px-8 pb-10 grid grid-cols-2 md:grid-cols-4 gap-10 border-b border-white/[0.07]">

            {/* Brand */}
            <div className="flex flex-col gap-2">
                <span className="text-4xl">🍔</span>
                <span
                    className="font-heading font-extrabold text-2xl"
                    style={{ background: 'linear-gradient(90deg,#ff7043,#ffa726)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                >
                    Foodify
                </span>
                <p className="text-white/45 text-sm leading-relaxed">Great food, delivered fast.</p>
            </div>

            {/* Company */}
            <div className="flex flex-col gap-2.5">
                <span className="text-[#ff7043] font-bold text-xs tracking-widest uppercase mb-1">Company</span>
                <Link to={ROUTES.ABOUT} className="text-white/55 text-sm hover:text-white/90 transition-colors no-underline">About Us</Link>
                <Link to={ROUTES.CAREERS} className="text-white/55 text-sm hover:text-white/90 transition-colors no-underline">Careers</Link>
                <Link to={ROUTES.BLOG} className="text-white/55 text-sm hover:text-white/90 transition-colors no-underline">Blog</Link>
            </div>

            {/* Support */}
            <div className="flex flex-col gap-2.5">
                <span className="text-[#ff7043] font-bold text-xs tracking-widest uppercase mb-1">Support</span>
                <Link to={ROUTES.HELP} className="text-white/55 text-sm hover:text-white/90 transition-colors no-underline">Help Center</Link>
                <Link to={ROUTES.PRIVACY} className="text-white/55 text-sm hover:text-white/90 transition-colors no-underline">Privacy Policy</Link>
                <Link to={ROUTES.TERMS} className="text-white/55 text-sm hover:text-white/90 transition-colors no-underline">Terms of Service</Link>
            </div>

            {/* Connect */}
            <div className="flex flex-col gap-2.5">
                <span className="text-[#ff7043] font-bold text-xs tracking-widest uppercase mb-1">Connect</span>
                {['Twitter', 'Instagram', 'Facebook'].map(l => (
                    <a key={l} href="#" className="text-white/55 text-sm hover:text-white/90 transition-colors no-underline">{l}</a>
                ))}
            </div>
        </div>

        {/* Bottom bar */}
        <div className="max-w-6xl mx-auto px-8 py-5 flex flex-wrap justify-between gap-2 text-white/30 text-xs">
            <span>© {new Date().getFullYear()} Foodify Inc. All rights reserved.</span>
            <span className="text-[rgba(255,160,70,0.6)]">Made with ❤️ for food lovers</span>
        </div>
    </footer>
);

export default Footer;
