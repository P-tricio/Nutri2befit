import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Home() {
    const navigate = useNavigate();

    return (
        <div className="relative flex h-full w-full flex-col justify-between overflow-hidden bg-background-light dark:bg-background-dark min-h-screen">

            {/* Scrollable Content */}
            <div className="flex-1 flex flex-col items-center w-full px-6 pt-16 pb-10 overflow-y-auto no-scrollbar z-10">

                {/* Logo Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full flex flex-col items-center justify-center mb-8"
                >
                    {/* Placeholder Logo if image not found, using text as fallback */}
                    <div className="size-32 rounded-full bg-primary/20 flex items-center justify-center mb-4 ring-4 ring-primary/10">
                        <span className="text-4xl text-primary font-black tracking-tighter">2BF</span>
                    </div>

                    <h1 className="text-primary tracking-tighter text-[42px] font-black leading-tight text-center">
                        2BEFIT
                    </h1>
                </motion.div>

                {/* Title Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="w-full flex flex-col items-center mb-6"
                >
                    <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
                        <span className="material-symbols-outlined text-primary text-sm mr-2">eco</span>
                        <span className="text-primary text-xs font-bold tracking-wide uppercase">Nutrición Consciente</span>
                    </div>

                    <h2 className="text-slate-900 dark:text-white tracking-tight text-[36px] font-bold leading-[1.1] text-center mb-3">
                        GUÍA DE <br /><span className="text-primary">NUTRICIÓN</span>
                    </h2>

                    <h3 className="text-slate-500 dark:text-slate-400 text-lg font-medium leading-tight tracking-tight text-center px-4">
                        Sistema de Alimentación Flexible y Sostenible
                    </h3>
                </motion.div>

                {/* Description Text */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="w-full max-w-sm"
                >
                    <p className="text-slate-600 dark:text-slate-400 text-base font-normal leading-relaxed text-center">
                        Bienvenido/a. Olvídate de pesar comida en gramos y de las obsesiones.
                        Este sistema está diseñado para darte resultados reales y sostenibles.
                        <br /><br />
                        Tu única herramienta será tu mano. Tu objetivo: la constancia.
                    </p>
                </motion.div>
            </div>

            {/* Hero Image & CTA Section */}
            <div className="relative w-full h-[45vh] mt-auto shrink-0">

                {/* Gradient Overlay top */}
                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-background-light dark:from-background-dark to-transparent z-10 pointer-events-none"></div>

                {/* Image Container */}
                <div className="w-full h-full relative rounded-t-[2.5rem] overflow-hidden shadow-[0_-10px_40px_rgba(0,0,0,0.3)] bg-gray-900">
                    {/* Fallback Image URL from Reference or Placeholder */}
                    <img
                        src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2053&auto=format&fit=crop"
                        alt="Healthy Food"
                        className="absolute inset-0 w-full h-full object-cover transform scale-105 opacity-90"
                    />

                    {/* Dark Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

                    {/* Floating CTA Button */}
                    <div className="absolute bottom-0 left-0 w-full p-6 pb-12 flex flex-col items-center gap-4 z-20">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate('/dashboard')}
                            className="w-full h-14 bg-primary hover:bg-emerald-400 text-background-dark active:scale-95 transition-all duration-200 rounded-full flex items-center justify-center gap-2 group shadow-xl shadow-primary/25"
                        >
                            <span className="text-background-dark text-lg font-bold tracking-tight">Empezar Ahora</span>
                            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                        </motion.button>

                        <p className="text-white/40 text-xs font-medium tracking-wide">
                            v1.0 • 2BEFIT Nutrition
                        </p>
                    </div>
                </div>
            </div>

        </div>
    );
}
