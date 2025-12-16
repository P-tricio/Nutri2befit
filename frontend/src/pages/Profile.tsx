import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { useAuth } from '../context/AuthContext';
import { useUserProfile } from '../hooks/useUserProfile';
import { useDataMigration } from '../hooks/useDataMigration';
// import { SEED_MENUS } from '../data/seedMenus'; // Moved to History
// import { useSavedMenus } from '../hooks/useSavedMenus'; // Not needed if removing button
import type { SavedMenu } from '../types'; // Import type
import { useTranslation } from 'react-i18next';


export default function Profile() {
    const { t, i18n } = useTranslation();
    const { currentUser, logout } = useAuth();
    const { profile: userProfile, loading, updateProfile } = useUserProfile();
    const { checkForLocalData, migrateData, isMigrating } = useDataMigration();
    // const { addMenu } = useSavedMenus();
    const navigate = useNavigate();
    const hasLocalData = checkForLocalData();

    // Local state for editing
    const [name, setName] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');
    // const [loadLoading, setLoadLoading] = useState(false);

    // Load profile data into local state when available
    useEffect(() => {
        if (userProfile?.displayName) {
            setName(userProfile.displayName || '');
        }
    }, [userProfile]);

    // handleLoadExamples moved to History.tsx

    const handleSaveProfile = async () => {
        setIsSaving(true);
        setSaveMessage('');
        try {
            if (!currentUser || !name.trim()) return;
            // Update Profile Info
            await updateProfile({ displayName: name });
            setSaveMessage('¡Cambios guardados!');
            setTimeout(() => setSaveMessage(''), 3000);
        } catch (error) {
            console.error("Error saving profile:", error);
            setSaveMessage('Error al guardar.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleMigration = async () => {
        if (window.confirm("¿Estás seguro de que quieres subir tus datos locales? Esto podría sobrescribir datos en la nube si hay conflictos.")) {
            const success = await migrateData();
            if (success) {
                alert("¡Migración completada!");
                window.location.reload();
            } else {
                alert("Error durante la migración.");
            }
        }
    };

    if (loading) return <div className="p-8 text-center opacity-50">{t('common.loading')}</div>;

    return (
        <div className="p-6 space-y-8 pb-24 max-w-2xl mx-auto">

            {/* Header */}
            <div className="pt-2 pb-2 flex flex-col items-center text-center gap-2">
                <img src="/brand-compact.png" alt="2B" className="h-8 w-auto object-contain" />
                <div>
                    <h1 className="text-slate-400 text-xs font-bold leading-none uppercase tracking-wider">
                        {t('profile.title')}
                    </h1>
                </div>
            </div>

            {/* Language Selector */}



            {/* Personal Info Card */}
            <section className="space-y-4">
                <div className="flex items-center justify-between ml-1 mb-2">
                    <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">{t('profile.personal_info')}</h3>
                    <button onClick={logout} className="text-red-400 hover:text-red-500 font-bold text-[10px] flex items-center gap-1 transition-colors bg-red-50 dark:bg-red-900/10 px-2 py-1 rounded-md">
                        <span className="material-symbols-outlined text-sm">logout</span>
                        {t('profile.logout')}
                    </button>
                </div>
                <div className="glass-card p-6 rounded-3xl space-y-6">
                    <div className="flex items-center gap-6">
                        <div className="size-20 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-3xl font-black text-slate-300 dark:text-slate-600 overflow-hidden border-4 border-slate-50 dark:border-slate-800">
                            {currentUser?.photoURL ? <img src={currentUser.photoURL} className="w-full h-full object-cover" /> : (name[0] || 'U')}
                        </div>
                        <div className="flex-1 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">{t('profile.display_name')}</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    onBlur={handleSaveProfile}
                                    className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    placeholder="Tu Nombre"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">{t('profile.email')}</label>
                                <div className="w-full bg-slate-50/50 dark:bg-white/5 border border-transparent rounded-xl px-4 py-3 text-slate-500 dark:text-slate-500 text-sm font-medium truncate">
                                    {currentUser?.email}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Language Selector Moved Here */}
                    <div className="pt-2 border-t border-slate-100 dark:border-white/5">
                        <label className="block text-center text-xs font-bold text-slate-400 uppercase mb-3">{t('profile.language')}:</label>
                        <div className="bg-slate-50 dark:bg-black/20 rounded-xl p-1 flex items-center relative">
                            <button
                                onClick={() => i18n.changeLanguage('es')}
                                className={clsx(
                                    "flex-1 py-2 rounded-lg text-xs font-bold transition-all z-10",
                                    i18n.language === 'es' ? "text-slate-900 bg-white dark:bg-slate-600 shadow-sm" : "text-slate-400"
                                )}
                            >
                                Español
                            </button>
                            <button
                                onClick={() => i18n.changeLanguage('en')}
                                className={clsx(
                                    "flex-1 py-2 rounded-lg text-xs font-bold transition-all z-10",
                                    i18n.language === 'en' ? "text-slate-900 bg-white dark:bg-slate-600 shadow-sm" : "text-slate-400"
                                )}
                            >
                                English
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Support Section */}


            {/* Save Action Bar */}
            {/* Support Section as Primary Action */}
            <div className="sticky bottom-24 z-10 space-y-3">
                {/* Auto-save Indicator (Floating) */}
                {saveMessage && (
                    <div className="absolute -top-12 left-0 w-full text-center pointer-events-none">
                        <span className="bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg animate-in fade-in slide-in-from-bottom-2">
                            {saveMessage}
                        </span>
                    </div>
                )}

                <a
                    href="https://www.instagram.com/2befit.online"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-emerald-500 text-white font-bold py-4 rounded-2xl shadow-xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                    <span className="material-symbols-outlined">chat</span>
                    {t('profile.support')}
                </a>

                {/* 2BeFit Link - Visible Card Style */}
                <a
                    href="https://2befit.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block mt-4 bg-slate-900 dark:bg-white p-1 rounded-2xl shadow-xl hover:scale-[1.02] transition-transform group"
                >
                    <div className="bg-slate-900 dark:bg-white rounded-xl px-4 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/10 dark:bg-black/5 p-2 rounded-lg">
                                <span className="material-symbols-outlined text-white dark:text-slate-900">fitness_center</span>
                            </div>
                            <div>
                                <h4 className="text-white dark:text-slate-900 font-black text-sm uppercase tracking-wider">{t('profile.premium_title')}</h4>
                                <p className="text-slate-400 dark:text-slate-500 text-xs font-medium">{t('profile.premium_desc')}</p>
                            </div>
                        </div>
                        <span className="material-symbols-outlined text-white dark:text-slate-900 -rotate-45 group-hover:rotate-0 transition-transform">arrow_forward</span>
                    </div>
                </a>
            </div>

            {/* Legacy / Migration Actions */}


            {
                hasLocalData && (
                    <section className="pt-8 border-t border-slate-200 dark:border-white/10">
                        <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider ml-1 mb-4">Zona de Peligro & Utilidades</h3>
                        <div className="bg-slate-50 dark:bg-black/20 p-4 rounded-2xl flex items-center justify-between">
                            <div>
                                <h4 className="font-bold text-slate-700 dark:text-slate-300">Sincronizar Datos Locales</h4>
                                <p className="text-xs text-slate-500">Sube backups antiguos a la nube</p>
                            </div>
                            <button
                                className="bg-white dark:bg-white/10 text-slate-700 dark:text-white px-4 py-2 rounded-xl font-bold text-xs shadow-sm hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 transition-colors"
                                onClick={handleMigration}
                                disabled={isMigrating}
                            >
                                {isMigrating ? "..." : t('profile.sync')}
                            </button>
                        </div>
                    </section>
                )
            }


        </div >
    );
}
