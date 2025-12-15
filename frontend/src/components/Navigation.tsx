import { Link, useLocation } from 'react-router-dom';

export default function Navigation() {
    const location = useLocation();

    const links = [
        { path: '/portions', icon: 'dashboard', label: 'Porciones' },
        { path: '/menu-generator', icon: 'restaurant_menu', label: 'Generador' },
        { path: '/history', icon: 'calendar_today', label: 'Diario' },
        { path: '/profile', icon: 'person', label: 'Perfil' },
    ];

    return (
        <nav className="fixed bottom-6 left-0 right-0 z-50 flex justify-center pointer-events-none">
            <div className="glass-island rounded-full px-6 py-3 flex items-center gap-8 pointer-events-auto transition-transform hover:scale-105 duration-300">
                {links.map((link) => {
                    const isActive = location.pathname === link.path;
                    return (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`relative flex flex-col items-center justify-center gap-1 transition-all duration-300 ${isActive ? 'text-primary' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                                }`}
                        >


                            <span className={`material-symbols-outlined text-2xl transition-transform duration-300 ${isActive ? 'scale-110' : ''} ${isActive ? 'fill-current' : ''}`}>
                                {link.icon}
                            </span>
                            {/* Label hidden for cleaner look, or small? Let's hide label for "Premium" dock feel or keep extremely small */}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
