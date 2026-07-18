import { createContext, useContext, useState, useCallback, useRef } from 'react';

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
    const [modalConfig, setModalConfig] = useState(null);
    const resolverRef = useRef(null);

    const confirm = useCallback((config) => {
        setModalConfig({
            title: config.title || 'Confirm Action',
            message: config.message || 'Are you sure you want to proceed?',
            confirmText: config.confirmText || 'Confirm',
            cancelText: config.cancelText || 'Cancel',
            type: config.type || 'info', // info, danger, success
        });

        return new Promise((resolve) => {
            resolverRef.current = resolve;
        });
    }, []);

    const handleConfirm = () => {
        if (resolverRef.current) {
            resolverRef.current(true);
        }
        setModalConfig(null);
    };

    const handleCancel = () => {
        if (resolverRef.current) {
            resolverRef.current(false);
        }
        setModalConfig(null);
    };

    return (
        <ModalContext.Provider value={{ confirm }}>
            {children}
            {modalConfig && (
                <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 animate-in fade-in duration-300">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-[var(--bg-main)]/80 backdrop-blur-md"
                        onClick={handleCancel}
                    ></div>
                    
                    {/* Modal Content */}
                    <div className="relative w-full max-w-sm bg-[var(--bg-card)] border border-[var(--ui-accent)]/10 rounded-[2.5rem] p-8 shadow-[0_30px_100px_rgba(0,0,0,0.4)] shadow-[var(--ui-accent)]/10 animate-in zoom-in-95 duration-300">
                        <div className="flex flex-col items-center text-center">
                            <div className={`w-16 h-16 rounded-3xl flex items-center justify-center text-3xl mb-6 ${
                                modalConfig.type === 'danger' 
                                    ? 'bg-red-500/10 text-red-500' 
                                    : 'bg-[var(--ui-accent-soft)] text-[var(--ui-accent)]'
                            }`}>
                                {modalConfig.type === 'danger' ? '⚠️' : '✨'}
                            </div>
                            
                            <h3 className="text-2xl font-black text-[var(--text-primary)] mb-2 tracking-tight">
                                {modalConfig.title}
                            </h3>
                            <p className="text-[var(--text-secondary)] font-medium leading-relaxed mb-8">
                                {modalConfig.message}
                            </p>
                            
                            <div className="flex flex-col w-full gap-3">
                                <button
                                    onClick={handleConfirm}
                                    className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-lg ${
                                        modalConfig.type === 'danger'
                                            ? 'bg-red-500 text-white shadow-red-500/20 hover:bg-red-600'
                                            : 'bg-[var(--ui-accent)] text-black shadow-[var(--ui-accent)]/20 hover:scale-[1.02]'
                                    }`}
                                >
                                    {modalConfig.confirmText}
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className="w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-soft)] transition-all"
                                >
                                    {modalConfig.cancelText}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </ModalContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useModal = () => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error('useModal must be used within a ModalProvider');
    }
    return context;
};
