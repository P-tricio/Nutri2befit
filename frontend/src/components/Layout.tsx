import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useUserProfile } from '../hooks/useUserProfile';
import Navigation from './Navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { createPortal } from 'react-dom';
import Onboarding from './Onboarding';
import { useTranslation } from 'react-i18next';

// --- LAYOUT ---
export default function Layout({ children }: { children: React.ReactNode }) {
    const [isFAQOpen, setIsFAQOpen] = useState(false);
    const [showOnboarding, setShowOnboarding] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();

    // Auth & Profile Hooks
    const { currentUser } = useAuth();
    const { profile, loading, updateProfile } = useUserProfile();

    useEffect(() => {
        // Wait for profile to load if user is logged in
        if (loading && currentUser) return;

        // CHECK 1: Local Storage (Device specific fallback)
        const localSeen = localStorage.getItem('onboarding_completed');

        // CHECK 2: Firestore Profile (Account specific source of truth)
        const cloudSeen = profile?.onboardingCompleted;

        // If explicitly completed in cloud, respect it (and sync local)
        if (cloudSeen) {
            if (!localSeen) localStorage.setItem('onboarding_completed', 'true');
            return;
        }

        // If not completed in cloud (or not logged in) AND not local -> SHOW
        // (If logged in and cloud is false, show it even if local says true? No, avoid annoyance. 
        //  But strictly following plan: "If false (or not exists) -> Show")

        // Revised Logic: Show if NEITHER has it.
        // Actually, ifCloud is false, we SHOULD show it to ensure account is marked.
        // But if user saw it locally before login?
        // Let's go with: If profile exists and is false => SHOW (to purge it).

        if (profile && !cloudSeen) {
            setShowOnboarding(true);
        } else if (!currentUser && !localSeen) {
            // Guest mode: relies on local
            setShowOnboarding(true);
        }
    }, [loading, currentUser, profile]);

    const handleCompleteOnboarding = () => {
        localStorage.setItem('onboarding_completed', 'true');
        setShowOnboarding(false);

        // Sync to Cloud
        if (currentUser) {
            updateProfile({ onboardingCompleted: true });
        }
    };

    return (
        <div className="w-full flex-1 flex flex-col max-w-md mx-auto relative min-h-screen">
            <main className="flex-1 w-full h-full pb-24 pt-4 relative z-0">
                {children}
            </main>

            <Navigation />

            {/* Onboarding - PORTALED */}
            {showOnboarding && createPortal(
                <AnimatePresence>
                    <Onboarding onClose={handleCompleteOnboarding} />
                </AnimatePresence>,
                document.body
            )}

            {/* Floating FAQ Button - PORTALED */}
            {createPortal(
                <button
                    onClick={() => setIsFAQOpen(true)}
                    className="fixed top-6 right-5 size-8 rounded-full bg-white dark:bg-slate-900/50 backdrop-blur-md text-slate-400 shadow-sm border border-slate-100 dark:border-white/5 flex items-center justify-center z-[1000] active:scale-95 transition-all hover:bg-slate-50 dark:hover:bg-white/10 outline-none focus:ring-2 ring-primary/20 pointer-events-auto"
                >
                    <span className="material-symbols-outlined text-base">help</span>
                </button>,
                document.body
            )}

            {/* FAQ Modal - Constant Portal, Conditional Content */}
            {createPortal(
                <AnimatePresence mode="wait">
                    {isFAQOpen && (
                        <div className="fixed inset-0 z-[2000] flex items-end sm:items-center justify-center pointer-events-none">
                            {/* Backdrop */}
                            <motion.div
                                key="backdrop"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsFAQOpen(false)}
                                className="absolute inset-0 bg-black/60 pointer-events-auto"
                            />

                            {/* Dialog */}
                            <motion.div
                                key="dialog"
                                initial={{ y: "100%" }}
                                animate={{ y: 0 }}
                                exit={{ y: "100%" }}
                                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                                className="bg-white dark:bg-slate-900 w-full max-w-md max-h-[85vh] rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl pointer-events-auto flex flex-col relative z-10"
                            >
                                <div className="p-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between shrink-0">
                                    <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary">help</span>
                                        FAQ & Consejos
                                    </h2>
                                    <button onClick={() => setIsFAQOpen(false)} className="p-2 bg-slate-100 dark:bg-white/5 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">
                                        <span className="material-symbols-outlined text-sm">close</span>
                                    </button>
                                </div>

                                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                                    {/* ONBOARDING TRIGGER BUTTON */}
                                    <button
                                        onClick={() => {
                                            setIsFAQOpen(false);
                                            setShowOnboarding(true);
                                        }}
                                        className="w-full py-4 rounded-xl bg-gradient-to-r from-primary/10 to-emerald-400/10 border border-primary/20 flex items-center justify-between px-4 group hover:bg-primary/20 transition-all mb-4"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="size-10 rounded-full bg-white dark:bg-white/10 flex items-center justify-center text-primary shadow-sm">
                                                <span className="material-symbols-outlined">waving_hand</span>
                                            </div>
                                            <div className="text-left">
                                                <h3 className="font-black text-slate-900 dark:text-white text-sm">Guía de Inicio</h3>
                                                <p className="text-xs text-slate-500 font-medium">Aprende a usar la app</p>
                                            </div>
                                        </div>
                                        <span className="material-symbols-outlined text-slate-400 group-hover:translate-x-1 transition-transform">arrow_forward_ios</span>
                                    </button>
                                    <FAQItem
                                        title="Cena social / Comida trabajo"
                                        solution="Ahorro de Calorías"
                                        details={[
                                            "Come solo Proteína + Verduras durante el día.",
                                            "Guarda carbos/grasas para la cena.",
                                            "Alcohol: 1 agua por cada copa."
                                        ]}
                                    />
                                    <FAQItem
                                        title="Me he quedado con hambre"
                                        solution="Espera 20 min y bebe agua"
                                        details={[
                                            "✅ Añade más Verdura.",
                                            "✅ Añade media palma de Proteína.",
                                            "❌ No picoteos."
                                        ]}
                                    />
                                    <FAQItem
                                        title="Azúcar y procesados"
                                        solution="Regla 90/10"
                                        details={[
                                            "Si el 90% cumples, el 10% (1-2 comidas libres) no daña."
                                        ]}
                                    />
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </div>
    );
}

function FAQItem({ title, solution, details }: { title: string, solution: string, details: string[] }) {
    return (
        <div className="bg-white dark:bg-white/5 rounded-xl p-4 border border-slate-100 dark:border-white/5">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">{title}</h3>
            <div className="inline-block bg-primary/10 px-2 py-0.5 rounded mb-2">
                <span className="text-primary text-xs font-bold uppercase tracking-wide">{solution}</span>
            </div>
            <ul className="list-disc list-inside space-y-1">
                {details.map((d, i) => (
                    <li key={i} className="text-xs text-slate-600 dark:text-slate-300">{d}</li>
                ))}
            </ul>
        </div>
    )
}
