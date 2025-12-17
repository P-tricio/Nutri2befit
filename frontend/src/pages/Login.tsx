import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';

export default function Login() {
    const { signInWithGoogle, registerWithEmail, loginWithEmail, currentUser } = useAuth();
    const navigate = useNavigate();

    const [isRegistering, setIsRegistering] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // If already logged in, redirect home
    if (currentUser) {
        return <Navigate to="/" replace />;
    }

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError('');
        try {
            await signInWithGoogle();
            navigate('/');
        } catch (error: any) {
            console.error("Login Error:", error);
            setError('Error al iniciar con Google. Inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!email || !password) {
            setError('Por favor, rellena todos los campos.');
            setLoading(false);
            return;
        }

        try {
            if (isRegistering) {
                await registerWithEmail(email, password);
            } else {
                await loginWithEmail(email, password);
            }
            navigate('/');
        } catch (error: any) {
            console.error("Auth Error:", error);
            if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
                setError('Credenciales incorrectas.');
            } else if (error.code === 'auth/email-already-in-use') {
                setError('Este email ya está registrado.');
            } else if (error.code === 'auth/weak-password') {
                setError('La contraseña es muy débil (mínimo 6 caracteres).');
            } else {
                setError('Ocurrió un error. Inténtalo de nuevo.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl max-w-md w-full border border-slate-100 dark:border-white/5">
                <div className="mb-8 text-center">
                    <img
                        src="/logo2befitancho.PNG"
                        alt="2BeFit"
                        className="h-24 mx-auto mb-6 object-contain"
                    />
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">
                        {isRegistering ? 'Crear Cuenta' : 'Bienvenido'}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400">
                        {isRegistering ? 'Regístrate para comenzar tu viaje.' : 'Inicia sesión para sincronizar tus menús.'}
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-xl mb-4 text-sm font-medium text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleEmailAuth} className="space-y-4 mb-6">
                    <div>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all dark:text-white"
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all dark:text-white"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-4 px-6 rounded-2xl hover:opacity-90 transition-all shadow-lg shadow-slate-200 dark:shadow-none disabled:opacity-50"
                    >
                        {loading ? 'Procesando...' : (isRegistering ? 'Registrarse' : 'Iniciar Sesión')}
                    </button>
                </form>

                <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-100 dark:border-white/10"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white dark:bg-slate-800 text-slate-400">O continúa con</span>
                    </div>
                </div>

                <button
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="w-full bg-white dark:bg-black/20 text-slate-700 dark:text-white border border-slate-200 dark:border-white/10 font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 hover:bg-slate-50 dark:hover:bg-white/5 transition-all shadow-sm disabled:opacity-50"
                >
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-6 h-6" alt="Google" />
                    <span>Google</span>
                </button>

                <div className="mt-8 text-center">
                    <button
                        onClick={() => { setIsRegistering(!isRegistering); setError(''); }}
                        className="text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors"
                    >
                        {isRegistering ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
                    </button>
                </div>
            </div>
        </div>
    );
}
