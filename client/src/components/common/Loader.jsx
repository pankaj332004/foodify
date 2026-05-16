const Loader = ({ message = 'Loading...' }) => (
    <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', padding: '48px', color: '#666',
    }}>
        <div style={{
            width: '40px', height: '40px', border: '4px solid #f3f3f3',
            borderTop: '4px solid #ff5722', borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
        }} />
        <p style={{ marginTop: '12px', fontSize: '0.9rem' }}>{message}</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
);

export default Loader;
