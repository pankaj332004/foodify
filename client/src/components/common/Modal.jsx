const Modal = ({ title, children, onClose }) => (
    <div style={styles.overlay} onClick={onClose}>
        <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.header}>
                <h3 style={styles.title}>{title}</h3>
                <button onClick={onClose} style={styles.closeBtn}>✕</button>
            </div>
            <div style={styles.body}>{children}</div>
        </div>
    </div>
);

const styles = {
    overlay: {
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
    },
    modal: {
        background: '#fff', borderRadius: '8px', minWidth: '360px',
        maxWidth: '90vw', boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
    },
    header: {
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 20px', borderBottom: '1px solid #eee',
    },
    title: { margin: 0, fontSize: '1.1rem', fontWeight: 600 },
    closeBtn: {
        background: 'none', border: 'none', fontSize: '1.1rem',
        cursor: 'pointer', color: '#666',
    },
    body: { padding: '20px' },
};

export default Modal;
