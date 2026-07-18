import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const [toast, setToast] = useState(null);

    const showToast = useCallback((message, type = 'info') => {
        setToast({ message, type });
        setTimeout(() => {
            setToast(null);
        }, 4000);
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {toast && (
                <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[200] animate-in fade-in slide-in-from-bottom-10 duration-300">
                    <div className={`px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border ${
                        toast.type === 'error' 
                            ? 'bg-[var(--bug)] border-[var(--bug)] text-[var(--text-inverted)]' 
                            : 'bg-[var(--bg-card)] border-[var(--bg-soft)] text-[var(--text-primary)]'
                    }`}>
                        <span className="text-xl">
                            {toast.type === 'error' ? '⚠️' : 'ℹ️'}
                        </span>
                        <span className="text-sm font-bold tracking-tight">
                            {toast.message}
                        </span>
                        <button 
                            onClick={() => setToast(null)}
                            className="ml-4 opacity-50 hover:opacity-100 transition-opacity"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}
        </ToastContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
