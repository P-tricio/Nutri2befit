
import { motion } from 'framer-motion';

interface HydrationCardProps {
    value: number; // in ml
    onChange: (newValue: number) => void;
    isEditing?: boolean;
}

export default function HydrationCard({ value, onChange, isEditing = false }: HydrationCardProps) {
    // Subtle design: Just a small row with icon, value and simple +/-

    const update = (amount: number) => {
        const newValue = Math.max(0, value + amount);
        onChange(newValue);
    };

    return (
        <div className="flex items-center justify-between py-3 px-4 rounded-xl border border-blue-100 dark:border-blue-900/20 bg-blue-50/50 dark:bg-blue-900/10 text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-xl text-blue-400">water_drop</span>
                <span className="text-xs font-bold uppercase tracking-widest opacity-80">Hidratación</span>
            </div>

            <div className="flex items-center gap-4">
                <span className="text-sm font-black text-slate-700 dark:text-slate-200">
                    {(value / 1000).toFixed(1)} <span className="text-xs text-slate-400">L</span>
                </span>

                {isEditing && (
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => update(-250)}
                            className="size-6 rounded-md hover:bg-slate-100 dark:hover:bg-white/5 flex items-center justify-center text-slate-400 transition-colors"
                        >
                            <span className="material-symbols-outlined text-sm">remove</span>
                        </button>
                        <button
                            onClick={() => update(250)}
                            className="size-6 rounded-md bg-blue-50 dark:bg-blue-900/20 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/40 flex items-center justify-center transition-colors shadow-sm"
                        >
                            <span className="material-symbols-outlined text-sm">add</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
