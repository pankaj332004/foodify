import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

const MainLayout = () => (
    <div className="flex flex-col min-h-screen bg-brand-bg">
        <Navbar />
        <main className="flex-1">
            <Outlet />
        </main>
        <Footer />
    </div>
);

export default MainLayout;
