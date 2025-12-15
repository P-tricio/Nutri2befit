
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useUserProfile } from '../hooks/useUserProfile';
import { useDataMigration } from '../hooks/useDataMigration';


export default function Profile() {
    const { currentUser, logout } = useAuth();
    const { profile, loading, updateProfile } = useUserProfile();
    const { checkForLocalData, migrateData, isMigrating } = useDataMigration();
    const hasLocalData = checkForLocalData();

    // Local state for editing
    const [name, setName] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');

    // Load profile data into local state when available
    useEffect(() => {
        if (profile) {
            setName(profile.displayName || '');
        }
    }, [profile]);

    const handleSaveProfile = async () => {
        setIsSaving(true);
        setSaveMessage('');
        try {
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

    if (loading) return <div className="p-8 text-center opacity-50">Cargando perfil...</div>;

    return (
        <div className="p-6 space-y-8 pb-24 max-w-2xl mx-auto">

            {/* Header */}
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white">Mi Cuenta</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Gestiona tus datos y preferencias</p>
                </div>

            </header>

            {/* Personal Info Card */}
            <section className="space-y-4">
                <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider ml-1">Información Personal</h3>
                <div className="glass-card p-6 rounded-3xl space-y-6">
                    <div className="flex items-center gap-6">
                        <div className="size-20 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-3xl font-black text-slate-300 dark:text-slate-600 overflow-hidden border-4 border-slate-50 dark:border-slate-800">
                            {currentUser?.photoURL ? <img src={currentUser.photoURL} className="w-full h-full object-cover" /> : (name[0] || 'U')}
                        </div>
                        <div className="flex-1 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Nombre Visible</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    placeholder="Tu Nombre"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Email (No editable)</label>
                                <div className="w-full bg-slate-50/50 dark:bg-white/5 border border-transparent rounded-xl px-4 py-3 text-slate-500 dark:text-slate-500 text-sm font-medium truncate">
                                    {currentUser?.email}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Save Action Bar */}
            <div className="sticky bottom-24 z-10">
                <button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-4 rounded-2xl shadow-xl shadow-slate-900/20 dark:shadow-black/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
                >
                    {isSaving ? (
                        <>
                            <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Guardando...
                        </>
                    ) : 'Guardar Cambios'}
                </button>

                <button
                    onClick={logout}
                    className="w-full mt-3 bg-red-50 dark:bg-red-900/10 text-red-500 dark:text-red-400 font-bold py-4 rounded-2xl hover:bg-red-100 dark:hover:bg-red-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 border-2 border-transparent hover:border-red-200 dark:hover:border-red-900/30"
                >
                    <span className="material-symbols-outlined">logout</span>
                    Cerrar Sesión
                </button>
                {saveMessage && (
                    <div className="absolute -top-12 left-0 w-full text-center">
                        <span className="bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg">
                            {saveMessage}
                        </span>
                    </div>
                )}
            </div>

            {/* Legacy / Migration Actions */}
            {hasLocalData && (
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
                            {isMigrating ? "..." : "Sincronizar"}
                        </button>
                    </div>
                </section>
            )}
        </div>
    );
}
