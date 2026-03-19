import React, { useState, useEffect, useRef } from 'react';

let toast_callback = null;

export const showToast = (message, type = 'success') => {
    if (toast_callback) {
        toast_callback({ message, type });
    }
};

const ToastContainer = () => {
    const [toasts, setToasts] = useState([]);
    const counterRef = useRef(0);

    useEffect(() => {
        toast_callback = ({ message, type }) => {
            const id = ++counterRef.current;
            setToasts(prev => [...prev, { id, message, type, exiting: false }]);

            // Auto-remove after 3.5s (slight buffer after 3s progress bar)
            setTimeout(() => {
                setToasts(prev =>
                    prev.map(t => t.id === id ? { ...t, exiting: true } : t)
                );
                setTimeout(() => {
                    setToasts(prev => prev.filter(t => t.id !== id));
                }, 400);
            }, 3200);
        };
    }, []);

    const dismiss = (id) => {
        setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: true } : t));
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 400);
    };

    if (toasts.length === 0) return null;

    return (
        <>
            <style>{`
                @keyframes slideInRight {
                    from { transform: translateX(110%); opacity: 0; }
                    to   { transform: translateX(0);    opacity: 1; }
                }
                @keyframes slideOutRight {
                    from { transform: translateX(0);    opacity: 1; }
                    to   { transform: translateX(110%); opacity: 0; }
                }
                @keyframes progressShrink {
                    from { width: 100%; }
                    to   { width: 0%;   }
                }
                .toast-enter {
                    animation: slideInRight 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards;
                }
                .toast-exit {
                    animation: slideOutRight 0.4s cubic-bezier(0.55, 0, 1, 0.45) forwards;
                }
                .toast-progress {
                    animation: progressShrink 3.2s linear forwards;
                }
            `}</style>

            <div
                style={{
                    position: 'fixed',
                    top: '80px',
                    right: '20px',
                    zIndex: 9999,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    maxWidth: '360px',
                    width: '100%',
                    pointerEvents: 'none',
                }}
            >
                {toasts.map(toast => (
                    <div
                        key={toast.id}
                        className={toast.exiting ? 'toast-exit' : 'toast-enter'}
                        style={{
                            pointerEvents: 'auto',
                            background: '#ffffff',
                            borderRadius: '16px',
                            boxShadow: '0 8px 30px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)',
                            overflow: 'hidden',
                            border: '1px solid #f1f5f9',
                        }}
                    >
                        {/* Main Content */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px' }}>
                            {/* Icon */}
                            <div style={{
                                width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: toast.type === 'success' ? '#d1fae5' : '#fee2e2',
                            }}>
                                {toast.type === 'success' ? (
                                    <svg width="18" height="18" fill="none" stroke="#059669" strokeWidth="2.5" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    <svg width="18" height="18" fill="none" stroke="#dc2626" strokeWidth="2.5" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                )}
                            </div>

                            {/* Text */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{
                                    margin: 0, fontSize: '13px', fontWeight: 700,
                                    color: '#0f172a', letterSpacing: '-0.01em',
                                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                                }}>
                                    {toast.type === 'success' ? 'Success' : 'Error'}
                                </p>
                                <p style={{
                                    margin: 0, fontSize: '12px', color: '#64748b',
                                    fontWeight: 500, marginTop: '1px',
                                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                                }}>
                                    {toast.message}
                                </p>
                            </div>

                            {/* Close Button */}
                            <button
                                onClick={() => dismiss(toast.id)}
                                style={{
                                    width: '24px', height: '24px', borderRadius: '6px', border: 'none',
                                    background: '#f1f5f9', cursor: 'pointer', display: 'flex',
                                    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                    padding: 0,
                                }}
                            >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Progress Bar */}
                        <div style={{ height: '3px', background: '#f1f5f9' }}>
                            <div
                                className="toast-progress"
                                style={{
                                    height: '100%',
                                    background: toast.type === 'success'
                                        ? 'linear-gradient(90deg, #10b981, #059669)'
                                        : 'linear-gradient(90deg, #f87171, #dc2626)',
                                    borderRadius: '0 0 0 0',
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default ToastContainer;
