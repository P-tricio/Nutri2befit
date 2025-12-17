import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isIOS, setIsIOS] = useState(false);
    const [showIOSModal, setShowIOSModal] = useState(false);
    const [isAppInstalled, setIsAppInstalled] = useState(false);

    useEffect(() => {
        // Check if already installed (standalone mode)
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsAppInstalled(true);
        }

        // Android / Desktop standard event
        const handleBeforeInstallPrompt = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        // Detect iOS
        const isIosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
        setIsIOS(isIosDevice);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                setDeferredPrompt(null);
            }
        } else if (isIOS) {
            setShowIOSModal(true);
        }
    };

    if (isAppInstalled) return null; // Don't show if already installed
    if (!deferredPrompt && !isIOS) return null; // Don't show if not installable and not iOS (e.g. standard desktop browser without PWA support or already installed)

    return (
        <>
            {/* Install Button (Floating or Inline) */}
            <div className="fixed bottom-24 right-4 z-40 md:static md:w-full md:mt-4 pointer-events-none">
                {/* Only show floating button on mobile if needed, or integrate elsewhere. 
                     For now, let's make it a discrete floating button that pulses. */}
                <div className="pointer-events-auto">
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleInstallClick}
                        className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl rounded-full px-4 py-3 flex items-center gap-2 text-sm font-bold border border-slate-700 dark:border-slate-200"
                    >
                        <span className="material-symbols-outlined text-[20px]">download</span>
                        <span>Instalar App</span>
                    </motion.button>
                </div>
            </div>

            {/* iOS Instructions Modal */}
            <AnimatePresence>
                {showIOSModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowIOSModal(false)}>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 dark:border-white/10"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Instalar en iPhone</h3>
                                <button onClick={() => setShowIOSModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>

                            <div className="space-y-4 text-slate-600 dark:text-slate-300 text-sm">
                                <p>iOS no permite la instalación directa, pero puedes hacerlo manualmente:</p>
                                <ol className="space-y-3 list-decimal pl-4">
                                    <li>Pulsa el botón <strong>Compartir</strong> <span className="material-symbols-outlined align-middle text-blue-500">ios_share</span> en la barra de tu navegador.</li>
                                    <li>Desliza hacia abajo y busca <strong>"Añadir a la pantalla de inicio"</strong>.</li>
                                    <li>Pulsa <strong>Añadir</strong> arriba a la derecha.</li>
                                </ol>
                            </div>

                            <button
                                onClick={() => setShowIOSModal(false)}
                                className="mt-6 w-full py-3 bg-primary text-white rounded-xl font-bold hover:opacity-90 transition-opacity"
                            >
                                Entendido
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
