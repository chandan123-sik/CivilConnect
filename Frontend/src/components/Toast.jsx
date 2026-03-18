import React, { useState, useEffect } from 'react';

let toast_timeout;
let toast_callback;

export const showToast = (message, type = 'success') => {
    if (toast_callback) {
        toast_callback({ message, type });
    }
};

const ToastContainer = () => {
    const [toast, setToast] = useState(null);

    useEffect(() => {
        toast_callback = (data) => {
            setToast(data);
            if (toast_timeout) clearTimeout(toast_timeout);
            toast_timeout = setTimeout(() => setToast(null), 3000);
        };
    }, []);

    if (!toast) return null;

    return (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[1000] animate-in slide-in-from-top-10 duration-500">
            <div className={`px-6 py-3 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-3 border ${
                toast.type === 'success' 
                ? 'bg-emerald-500/90 border-emerald-400 text-white' 
                : 'bg-red-500/90 border-red-400 text-white'
            }`}>
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                    {toast.type === 'success' ? '✓' : '✕'}
                </div>
                <p className="text-[13px] font-[1000] tracking-tight whitespace-nowrap">{toast.message}</p>
            </div>
        </div>
    );
};

export default ToastContainer;
