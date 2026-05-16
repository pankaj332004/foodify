import useAuth from '../../hooks/useAuth';
const UserDashboard = () => {
    const { user } = useAuth();
    return <div style={{ padding: '40px' }}><h2>Welcome, {user?.name} 👋</h2><p>Your dashboard</p></div>;
};
export default UserDashboard;
