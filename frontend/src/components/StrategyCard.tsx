import clsx from 'clsx';
import { useState, useRef } from 'react';
import { useAutoScroll } from '../hooks/useAutoScroll';
import { AnimatePresence, motion } from 'framer-motion';
import type { CategoryDetail } from '../data/categoryDetails';
import ImageWithFallback from './ImageWithFallback';
import { useTranslation } from 'react-i18next';

interface StrategyCardProps {
    title: string;
    expandedTitle?: string; // Title to show when expanded
    value: number;
    color: string; // Tailwind class like 'bg-red-500'
    icon: string; // Material symbol name
    onIncrease: () => void;
    onDecrease: () => void;
    details?: CategoryDetail; // Optional details for expansion
    isEditing?: boolean; // New prop to control visibility of +/- buttons
}

// ... imports and interfaces

interface ColorConfig {
    bg: string;
    iconBg: string;
    darkBg: string;
    border: string;
    shadowColor: string;
}

const COLOR_MAP: Record<string, ColorConfig> = {
    rose: {
        bg: 'bg-rose-50',
        iconBg: 'bg-rose-500',
        darkBg: 'dark:bg-rose-950/30',
        border: 'border-rose-100 dark:border-rose-900/30',
        shadowColor: 'shadow-rose-500/10'
    },
    emerald: {
        bg: 'bg-emerald-50',
        iconBg: 'bg-emerald-500',
        darkBg: 'dark:bg-emerald-950/30',
        border: 'border-emerald-100 dark:border-emerald-900/30',
        shadowColor: 'shadow-emerald-500/10'
    },
    orange: {
        bg: 'bg-orange-50',
        iconBg: 'bg-orange-500',
        darkBg: 'dark:bg-orange-950/30',
        border: 'border-orange-100 dark:border-orange-900/30',
        shadowColor: 'shadow-orange-500/10'
    },
    amber: {
        bg: 'bg-amber-50',
        iconBg: 'bg-amber-400',
        darkBg: 'dark:bg-amber-950/30',
        border: 'border-amber-100 dark:border-amber-900/30',
        shadowColor: 'shadow-amber-500/10'
    },
    blue: {
        bg: 'bg-blue-50',
        iconBg: 'bg-blue-500',
        darkBg: 'dark:bg-blue-950/30',
        border: 'border-blue-100 dark:border-blue-900/30',
        shadowColor: 'shadow-blue-500/10'
    },
    default: {
        bg: 'bg-slate-50',
        iconBg: 'bg-slate-500',
        darkBg: 'dark:bg-slate-800',
        border: 'border-slate-100 dark:border-slate-700',
        shadowColor: 'shadow-slate-500/10'
    }
};

export default function StrategyCard({ title, expandedTitle, value, color, icon, onIncrease, onDecrease, details, isEditing = false }: StrategyCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);
    const { t } = useTranslation();

    // Resolve color configuration
    const theme = COLOR_MAP[color] || COLOR_MAP.default;

    const handleCardClick = () => {
        if (details) {
            setIsExpanded(!isExpanded);
        }
    };

    // Auto-Scroll Logic (Hook)
    useAutoScroll({
        isExpanded,
        ref: cardRef,
        enabled: !!details // Only enable if expandable
    });

    return (
        <div
            ref={cardRef}
            onClick={handleCardClick}
            className={clsx(
                "rounded-2xl relative overflow-hidden transition-all duration-300 border scroll-mt-24", // Added scroll-mt-24 for sticky header clearance
                details ? "cursor-pointer hover:shadow-md active:scale-[0.99]" : "",

                // Color Theme Application
                theme.bg,
                theme.darkBg,
                theme.border,

                // Stronger, colored shadow for contrast
                "shadow-md",
                theme.shadowColor,

                isExpanded ? "ring-2 ring-primary/20 bg-white dark:bg-slate-800 shadow-xl z-20" : "px-4 py-3 flex items-center min-h-[72px]", // Expanded resets to white standard
                details?.borderColor // Keep existing border logic? Maybe unnecessary now but safe to keep
            )}
        >
            {/* Collapsed View (Standard Row) */}
            {!isExpanded && (
                <>
                    {/* Left: Icon & Title */}
                    <div className="flex items-center gap-3 z-10 mr-auto overflow-hidden">
                        <div className={clsx("p-1.5 rounded-lg text-white shadow-sm shrink-0 flex items-center justify-center size-9", theme.iconBg)}> {/* Slightly larger icon size 9 */}
                            {icon.length <= 2 ? (
                                <span className="font-black text-base leading-none">{icon}</span>
                            ) : (
                                <span className="material-symbols-outlined text-lg">{icon}</span>
                            )}
                        </div>
                        <h3 className="font-bold text-slate-800 dark:text-white text-sm uppercase tracking-wider leading-tight truncate">{title}</h3>
                    </div>

                    {/* Right: Controls & Expand */}
                    <div className="flex items-center gap-1 z-10 shrink-0 ml-2">
                        {/* DECREASE BUTTON - Only show if editing */}
                        {isEditing && (
                            <button
                                onClick={(e) => { e.stopPropagation(); onDecrease(); }}
                                className="size-8 rounded-full bg-white dark:bg-white/10 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors active:scale-95 shrink-0 shadow-sm"
                            >
                                <span className="material-symbols-outlined text-sm">remove</span>
                            </button>
                        )}

                        <span className="font-black text-2xl text-slate-800 dark:text-white tabular-nums w-10 text-center shrink-0">
                            {value}
                        </span>

                        {/* INCREASE BUTTON - Only show if editing */}
                        {isEditing && (
                            <button
                                onClick={(e) => { e.stopPropagation(); onIncrease(); }}
                                className="size-8 rounded-full bg-white dark:bg-white/10 flex items-center justify-center text-slate-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors active:scale-95 shrink-0 shadow-sm lg:mr-2"
                            >
                                <span className="material-symbols-outlined text-sm">add</span>
                            </button>
                        )}

                        {details && (
                            <div className="size-8 rounded-full flex items-center justify-center text-slate-400 ml-1 shrink-0 opacity-50">
                                <span className="material-symbols-outlined text-base">expand_more</span>
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* Expanded Content */}
            <AnimatePresence>
                {isExpanded && details && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="w-full"
                    >
                        {/* Expanded Header (Replicated for layout stability) */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-white/5">
                            <div className="flex items-center gap-3 mr-auto overflow-hidden">
                                <div className={clsx("p-1.5 rounded-lg text-white shadow-sm shrink-0 flex items-center justify-center size-9", theme.iconBg)}>
                                    {icon.length <= 2 ? (
                                        <span className="font-black text-base leading-none">{icon}</span>
                                    ) : (
                                        <span className="material-symbols-outlined text-lg">{icon}</span>
                                    )}
                                </div>
                                <div className="truncate">
                                    <h3 className="font-bold text-slate-900 dark:text-white text-base uppercase tracking-wider leading-tight truncate">{expandedTitle || title}</h3>
                                    <p className="text-xs text-slate-400 font-bold uppercase truncate">{t(details.subtitle)}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 shrink-0 ml-2">
                                <div className="flex items-center bg-slate-100 dark:bg-black/20 rounded-lg p-1">
                                    {isEditing && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onDecrease(); }}
                                            className="size-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-white dark:hover:bg-white/10 transition-colors shrink-0"
                                        >
                                            <span className="material-symbols-outlined text-sm">remove</span>
                                        </button>
                                    )}
                                    <span className="font-black text-2xl text-slate-800 dark:text-white tabular-nums w-10 text-center shrink-0">{value}</span>
                                    {isEditing && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onIncrease(); }}
                                            className="size-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-white dark:hover:bg-white/10 transition-colors shrink-0"
                                        >
                                            <span className="material-symbols-outlined text-sm">add</span>
                                        </button>
                                    )}
                                </div>
                                <button onClick={(e) => { e.stopPropagation(); setIsExpanded(false); }} className="size-8 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 hover:bg-slate-200 transition-colors shrink-0">
                                    <span className="material-symbols-outlined">expand_less</span>
                                </button>
                            </div>
                        </div>

                        {/* Details Body */}
                        <div className="p-4 space-y-4">
                            {/* Visual Reference */}
                            <div className="relative h-32 rounded-xl overflow-hidden bg-gray-200 shadow-inner">
                                <ImageWithFallback
                                    src={details.image}
                                    alt={title}
                                    className="w-full h-full object-cover"
                                    fallbackColor="bg-slate-200"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                                    <p className="text-white text-xs font-bold tracking-wide">Fuentes principales</p>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-xl border border-slate-100 dark:border-white/5 mb-3">
                                <h4 className="font-bold text-xs text-slate-400 dark:text-slate-500 uppercase mb-2 tracking-wider">Beneficios Clave</h4>
                                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                                    {t(details.description)}
                                </p>
                            </div>

                            {/* Portion Guide (Simplified) */}
                            {details.portionInfo && (
                                <div className="bg-blue-50/50 dark:bg-blue-500/10 p-3 rounded-xl border border-blue-100 dark:border-blue-500/20 flex items-center gap-4">
                                    <div className="size-10 rounded-full bg-white dark:bg-white/10 flex items-center justify-center text-blue-500 dark:text-blue-400 shadow-sm shrink-0">
                                        <span className="material-symbols-outlined text-xl">{details.portionInfo.icon}</span>
                                    </div>
                                    <div>
                                        <p className="text-[11px] text-blue-500/80 dark:text-blue-300/80 font-bold uppercase tracking-wider mb-0.5">
                                            1 porción equivale a:
                                        </p>
                                        <h4 className="font-bold text-xs text-slate-800 dark:text-white">
                                            {t(details.portionInfo.metric)}
                                        </h4>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-tight">
                                            {t(details.portionInfo.description)}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
