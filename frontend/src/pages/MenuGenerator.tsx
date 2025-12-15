import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { useDailyLog } from '../hooks/useDailyLog'; // Import Hook
import type { Meal, DailyLog, SelectionDetail } from './History'; // Import Shared Types
import ImageWithFallback from '../components/ImageWithFallback';
import { DATA } from '../data/foodData';




// ... existing render ...






const DEFAULT_TARGETS: Record<string, number> = {
    protein: 4,
    color: 5,
    carbs: 2,
    fats: 3,
    magic: 0 // 0 means Free/Unlimited
};

// DATA array removed (imported)

// --- STATE TYPES ---
// Use strict type for local creation, but compatible with Shared Types
type LocalSelectionState = Record<string, Record<string, SelectionDetail>>;


interface ColorConfig {
    bg: string;
    iconBg: string;
    darkBg: string;
    border: string;
    text: string;
    lightText: string;
    shadowColor: string; // New
}

const GENERATOR_THEME: Record<string, ColorConfig> = {
    red: { bg: 'bg-rose-50', iconBg: 'bg-rose-500', darkBg: 'dark:bg-rose-950/20', border: 'border-rose-100', text: 'text-rose-900', lightText: 'text-rose-600', shadowColor: 'shadow-rose-500/10' },
    green: { bg: 'bg-emerald-50', iconBg: 'bg-emerald-500', darkBg: 'dark:bg-emerald-950/20', border: 'border-emerald-100', text: 'text-emerald-900', lightText: 'text-emerald-600', shadowColor: 'shadow-emerald-500/10' },
    orange: { bg: 'bg-orange-50', iconBg: 'bg-orange-500', darkBg: 'dark:bg-orange-950/20', border: 'border-orange-100', text: 'text-orange-900', lightText: 'text-orange-600', shadowColor: 'shadow-orange-500/10' },
    yellow: { bg: 'bg-amber-50', iconBg: 'bg-amber-400', darkBg: 'dark:bg-amber-950/20', border: 'border-amber-100', text: 'text-amber-900', lightText: 'text-amber-600', shadowColor: 'shadow-amber-500/10' },
    purple: { bg: 'bg-purple-50', iconBg: 'bg-purple-500', darkBg: 'dark:bg-purple-950/20', border: 'border-purple-100', text: 'text-purple-900', lightText: 'text-purple-600', shadowColor: 'shadow-purple-500/10' }
};

export default function MenuGenerator() {
    const navigate = useNavigate();
    const location = useLocation();
    const [selection, setSelection] = useState<LocalSelectionState>({}); // Use local strict type
    const [mealName, setMealName] = useState<string>(''); // Ensure this exists or matches existing state

    // Initialize from Location State (Edit Mode)
    useEffect(() => {
        if (location.state && location.state.editMeal) {
            const { name, selection: importedSelection } = location.state.editMeal;
            setMealName(name || '');
            setSelection(importedSelection || {});

            // Should we clear the state so refresh doesn't re-trigger? 
            // Often better to replace history, but for now simple is fine.
            // window.history.replaceState({}, document.title);
        }
    }, [location]);

    // Toast State
    const [toast, setToast] = useState<{ message: string, visible: boolean }>({ message: '', visible: false });

    // Auto-hide toast
    useEffect(() => {
        if (toast.visible) {
            const timer = setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 2000);
            return () => clearTimeout(timer);
        }
    }, [toast.visible]);

    // Scroll Logic State
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    // Default right to true to show arrow initially
    const [canScroll, setCanScroll] = useState({ left: false, right: true });

    const checkScrollButtons = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setCanScroll({
                left: scrollLeft > 10,
                right: scrollLeft < (scrollWidth - clientWidth - 10)
            });
        }
    };

    useEffect(() => {
        // Initial delayed check to allow layout
        setTimeout(checkScrollButtons, 500);
        window.addEventListener('resize', checkScrollButtons);
        return () => window.removeEventListener('resize', checkScrollButtons);
    }, []);

    // Modal State for Two-Step Selection
    const [activeGroup, setActiveGroup] = useState<{ catId: string, groupId: string } | null>(null);

    // Sticky State
    const [isSticky, setIsSticky] = useState(false);

    // Scroll Listener for Sticky Header
    useEffect(() => {
        const handleScroll = () => {
            setIsSticky(window.scrollY > 80);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Refs for scrolling
    const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});

    // Effect: Scroll to active item
    useEffect(() => {
        if (activeGroup) {
            const key = `${activeGroup.catId}-${activeGroup.groupId}`;
            const element = itemRefs.current[key];
            if (element) {
                // Small delay to allow expansion animation to start/layout
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
                }, 150);
            }
        }
    }, [activeGroup]);

    // --- HOOK: Firestore Daily Log ---
    const todayKey = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD
    const { log, addMeal } = useDailyLog(todayKey);
    const [targets, setTargets] = useState<Record<string, number>>(DEFAULT_TARGETS);

    // Initial targets load (local storage preference for now)
    useEffect(() => {
        const savedTargets = localStorage.getItem('user_targets');
        if (savedTargets) {
            setTargets(JSON.parse(savedTargets));
        }
    }, []);

    // Fallback activeLog structure (synced with Firestore or default empty)
    // Note: If log exists, it has goals. If not, we use current targets.
    const todayLog: DailyLog = log || { date: todayKey, goals: targets, meals: [] };

    // --- LOGIC ---


    const addIngredient = (ingredient: string) => {
        if (!activeGroup) return;
        const { catId, groupId } = activeGroup;

        setSelection(prev => {
            const catSelection = prev[catId] || {};
            const currentDetail = catSelection[groupId] || { count: 0, ingredients: [] };

            const categoryDef = DATA.find(c => c.id === catId);
            const isMultiple = categoryDef?.allowMultiple;

            let newCatSelection = { ...catSelection };

            if (!isMultiple) {
                newCatSelection = {
                    [groupId]: {
                        count: 1,
                        ingredients: [ingredient] // Replace
                    }
                };
            } else {
                newCatSelection = {
                    ...catSelection,
                    [groupId]: {
                        count: currentDetail.count + 1,
                        ingredients: [...currentDetail.ingredients, ingredient]
                    }
                };
            }

            return { ...prev, [catId]: newCatSelection };
        });

        // Show Toast Feedback
        setToast({ message: "+1 Porción añadida", visible: true });

        // Auto close if not multiple
        const categoryDef = DATA.find(c => c.id === catId);
        if (!categoryDef?.allowMultiple) {
            // Small delay to let the toast be seen? No, better immediate close.
            setActiveGroup(null);
        }
    };

    const handleGroupClick = (catId: string, groupId: string) => {
        // Toggle if clicking the already active one
        if (activeGroup?.catId === catId && activeGroup?.groupId === groupId) {
            setActiveGroup(null);
            return;
        }

        setActiveGroup({ catId, groupId });

        // If category allows multiple, we don't clear previous selections 
        // (logic for single-select categories would go here if needed)
        const categoryDef = DATA.find(c => c.id === catId);
        if (!categoryDef?.allowMultiple) {
            // For single select, maybe clear others? But requirement says simple open/close.
            // Keeping existing logic:
            setActiveGroup({ catId, groupId });
        }
    };

    const removeGroup = (catId: string, groupId: string, ingredientToRemove?: string) => {
        setSelection(prev => {
            const catSelection = prev[catId] || {};

            // If specific ingredient removal requested
            if (ingredientToRemove) {
                const currentDetail = catSelection[groupId];
                if (!currentDetail) return prev;

                const newIngredients = [...currentDetail.ingredients];
                const indexToRemove = newIngredients.indexOf(ingredientToRemove);

                if (indexToRemove !== -1) {
                    newIngredients.splice(indexToRemove, 1);
                }

                // If empty after removal, delete key
                if (newIngredients.length === 0) {
                    const { [groupId]: _, ...rest } = catSelection;
                    return { ...prev, [catId]: rest };
                }

                // Otherwise update count and list
                return {
                    ...prev,
                    [catId]: {
                        ...catSelection,
                        [groupId]: {
                            ...currentDetail,
                            count: newIngredients.length,
                            ingredients: newIngredients
                        }
                    }
                };
            }

            // Default: Remove entire group
            const { [groupId]: _, ...rest } = catSelection;
            return { ...prev, [catId]: rest };
        });
    }


    // --- SAVE MEAL MODAL STATE ---
    const [saveModal, setSaveModal] = useState<{ isOpen: boolean; currentName: string }>({
        isOpen: false,
        currentName: ''
    });

    const openSaveModal = () => {
        setSaveModal({
            isOpen: true,
            currentName: mealName || `Comida ${todayLog.meals.length + 1}`
        });
    };

    const closeSaveModal = () => setSaveModal(prev => ({ ...prev, isOpen: false }));

    const confirmSaveMeal = async () => {
        const newMeal: Meal = {
            id: Date.now().toString(),
            name: saveModal.currentName || `Comida ${todayLog.meals.length + 1}`, // Fallback
            timestamp: Date.now(),
            selection: { ...selection }
        };

        // Add to Firestore (passing targets to ensure goals are saved if it's the first meal)
        await addMeal(newMeal, targets);

        setSelection({});
        closeSaveModal();
        navigate('/history');
    };

    const isSelectionEmpty = Object.values(selection).every(catSel => Object.values(catSel).length === 0);

    // --- CALCULATIONS ---
    const getConsumedToday = (catId: string) => {
        return todayLog.meals.reduce((acc, meal) => {
            const catSel = meal.selection[catId] || {};
            // Handle both legacy (number) and new (SelectionDetail) formats
            return acc + Object.values(catSel).reduce((a: number, b: any) => {
                return a + (typeof b === 'number' ? b : b.count);
            }, 0);
        }, 0);
    };

    const getCurrentSelectionCount = (catId: string) => {
        const sel = selection[catId] || {};
        return Object.values(sel).reduce((a, b) => a + b.count, 0);
    };



    const scrollColumns = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const scrollAmount = container.clientWidth * 0.85; // Scroll one column width approx
            const newScrollLeft = direction === 'left'
                ? container.scrollLeft - scrollAmount
                : container.scrollLeft + scrollAmount;

            container.scrollTo({
                left: newScrollLeft,
                behavior: 'smooth'
            });

            // Auto-scroll to top of page/container to show header of new column
            // Using a small timeout to let the horizontal scroll start/finish smooth?
            // Or just fire it. Smooth behavior on both might be nice.
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div className="w-full h-full flex flex-col">
            {/* Header */}
            <div className="px-5 pt-6 pb-2 flex flex-col gap-3">
                <div className="flex justify-center items-center text-center">
                    <div className="flex flex-col items-center gap-2">
                        <img src="/brand-compact.png" alt="2B" className="h-9 w-auto object-contain" />
                        <div>
                            <h1 className="text-slate-900 dark:text-white text-[24px] font-bold leading-[1.1] uppercase">
                                Creador de comidas
                            </h1>
                        </div>
                    </div>
                </div>

            </div>

            {/* Sticky Targets Row - PORTALED to avoid transform issues */}
            {isSticky && createPortal(
                <div className="fixed top-4 left-0 right-0 z-[100] px-4 animate-in fade-in slide-in-from-top-4 duration-300 pointer-events-none">
                    <div className="max-w-md mx-auto pointer-events-auto">
                        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-lg border-t border-slate-200 dark:border-white/10 p-3 flex flex-col items-center gap-2 rounded-3xl">
                            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider leading-none">Porciones diarias</p>
                            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar max-w-full px-2">
                                {DATA.filter(cat => cat.id !== 'magic').map(cat => {
                                    const consumed = getConsumedToday(cat.id);
                                    const current = getCurrentSelectionCount(cat.id);
                                    const total = consumed + current;
                                    const target = todayLog.goals?.[cat.id] ?? targets[cat.id] ?? 1;

                                    const isUnlimited = target === 0;
                                    const remaining = target - total;
                                    const isOverLimit = remaining < 0;
                                    const isExact = remaining === 0;

                                    const showRed = !isUnlimited && isOverLimit && cat.id !== 'color';
                                    const showGreen = !isUnlimited && (isExact || (isOverLimit && cat.id === 'color'));

                                    const theme = GENERATOR_THEME[cat.color] || GENERATOR_THEME.purple;
                                    const iconName = cat.id === 'protein' ? 'egg_alt' : cat.id === 'color' ? 'nutrition' : cat.id === 'carbs' ? 'rice_bowl' : cat.id === 'fats' ? 'water_drop' : 'auto_awesome';

                                    return (
                                        <div key={cat.id} className={clsx(
                                            "flex items-center px-1.5 py-1 rounded-full border text-xs font-bold shrink-0 transition-colors shadow-sm",
                                            theme.bg, theme.border, theme.text, theme.shadowColor,
                                            isUnlimited && "opacity-80",
                                            showRed && "!bg-red-100 !text-red-700 !border-red-300"
                                        )}>
                                            <div className={clsx("size-5 rounded-full flex items-center justify-center text-[9px] text-white font-black mr-1.5 shadow-sm", theme.iconBg)}>
                                                <span className="material-symbols-outlined text-[12px]">{iconName}</span>
                                            </div>
                                            <span className="mr-1">
                                                {isUnlimited ? 'Libre' : `${total}/${target}`}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Static Row (transitions to opacity 0 when sticky) */}
            <div className={clsx(
                "transition-opacity duration-300 flex flex-col items-center gap-2 pb-2",
                isSticky ? "opacity-0 pointer-events-none" : "opacity-100"
            )}>
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider leading-none">Porciones diarias</p>
                <div className="flex items-center justify-center gap-2 overflow-x-auto hide-scrollbar mask-fade w-full">
                    {DATA.filter(cat => cat.id !== 'magic').map(cat => {
                        const consumed = getConsumedToday(cat.id);
                        const current = getCurrentSelectionCount(cat.id);
                        const total = consumed + current;
                        const target = todayLog.goals?.[cat.id] ?? targets[cat.id] ?? 1;

                        const isUnlimited = target === 0;
                        const remaining = target - total;
                        const isOverLimit = remaining < 0;
                        const isExact = remaining === 0;

                        const showRed = !isUnlimited && isOverLimit && cat.id !== 'color';
                        const showGreen = !isUnlimited && (isExact || (isOverLimit && cat.id === 'color'));

                        // Base theme
                        const theme = GENERATOR_THEME[cat.color] || GENERATOR_THEME.purple;
                        const iconName = cat.id === 'protein' ? 'egg_alt' : cat.id === 'color' ? 'nutrition' : cat.id === 'carbs' ? 'rice_bowl' : cat.id === 'fats' ? 'water_drop' : 'auto_awesome';

                        return (
                            <div key={cat.id} className={clsx(
                                "flex items-center gap-1.5 px-2 py-1 rounded-lg border text-xs font-bold shrink-0 transition-colors",
                                isUnlimited ? "bg-purple-50 border-purple-200 text-purple-700" :
                                    showRed ? "bg-red-50 border-red-200 text-red-700" :
                                        showGreen ? "bg-emerald-50 border-emerald-200 text-emerald-700" :
                                            clsx("bg-white text-slate-700 border-slate-200", theme.border) // Default but with colored border hint? Or plain?
                            )}>
                                <span className={clsx("material-symbols-outlined text-[10px]",
                                    isUnlimited ? "text-purple-500" : showRed ? "text-red-500" : showGreen ? "text-emerald-500" : theme.text
                                )}>
                                    {iconName}
                                </span>
                                <span>
                                    {isUnlimited ? 'Libre' : `${total}/${target}`}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Spacer to prevent jump when sticky */}
            {isSticky && <div className="h-[0px]" />}


            {/* Horizontal Scroll Columns Wrapper */}
            <div className="flex-1 w-full relative group/scroll">
                {/* Navigation Arrows (Absolute) */}
                <button
                    onClick={() => scrollColumns('left')}
                    className={clsx(
                        "absolute left-2 top-1/2 -translate-y-1/2 z-30 size-10 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-xl border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-all",
                        "opacity-0 group-hover/scroll:opacity-100",
                        !canScroll.left && "invisible pointer-events-none"
                    )}
                    aria-label="Scroll Left"
                >
                    <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button
                    onClick={() => scrollColumns('right')}
                    className={clsx(
                        "absolute right-2 top-1/2 -translate-y-1/2 z-30 size-10 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-xl border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-all",
                        "opacity-0 group-hover/scroll:opacity-100",
                        !canScroll.right && "invisible pointer-events-none"
                    )}
                    aria-label="Scroll Right"
                >
                    <span className="material-symbols-outlined">chevron_right</span>
                </button>

                {/* Warning: Added ref here to the scroll container */}
                <div
                    ref={scrollContainerRef}
                    onScroll={checkScrollButtons}
                    className="w-full h-full overflow-x-auto hide-scrollbar mask-fade snap-x snap-mandatory px-5 py-4 flex gap-4"
                >
                    {/* ... inside the component loop ... */}
                    {
                        DATA.map((cat, index) => {
                            const theme = GENERATOR_THEME[cat.color] || GENERATOR_THEME.purple;
                            return (
                                <div key={cat.id} className="snap-center shrink-0 w-[85%] sm:w-[280px] flex flex-col gap-3">
                                    <div className={clsx("relative mb-4 overflow-hidden rounded-2xl border transition-all shadow-md", theme.bg, theme.border, theme.shadowColor)}>
                                        <div className="relative p-4">
                                            <div className="flex items-center gap-3">
                                                <span className={clsx("flex items-center justify-center size-9 rounded-lg text-lg font-black shadow-sm text-white shrink-0", theme.iconBg)}>
                                                    {cat.id === 'protein' ? 'P' :
                                                        cat.id === 'color' ? 'V' :
                                                            cat.id === 'carbs' ? 'C' :
                                                                cat.id === 'fats' ? 'G' : 'M'}
                                                </span>
                                                <div className="min-w-0">
                                                    <h3 className={clsx("text-lg font-black uppercase tracking-tight leading-none truncate", theme.text)}>
                                                        {cat.title}
                                                    </h3>
                                                    <p className={clsx("text-[11px] font-bold uppercase tracking-wider truncate opacity-70", theme.text)}>
                                                        {cat.subtitle}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3 pb-4">
                                        {cat.items.map(group => {
                                            const qty = selection[cat.id]?.[group.id]?.count || 0;
                                            const isSelected = qty > 0;
                                            const selectedIngredients = selection[cat.id]?.[group.id]?.ingredients || [];

                                            return (
                                                <div
                                                    key={group.id}
                                                    ref={(el) => { itemRefs.current[`${cat.id}-${group.id}`] = el; }}
                                                    className={clsx(
                                                        "relative flex flex-col gap-1 p-2 rounded-xl transition-all shadow-sm group glass-card border border-white/40 dark:border-white/10 key-motion-card",
                                                        isSelected ? "ring-2 ring-primary bg-primary/5 dark:bg-primary/10" : "hover:bg-white/60 dark:hover:bg-white/5"
                                                    )}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <button
                                                            className="flex items-center gap-3 flex-1 text-left min-w-0"
                                                            onClick={() => handleGroupClick(cat.id, group.id)}
                                                        >
                                                            <div className="size-12 rounded-lg bg-gray-200 overflow-hidden shrink-0 shadow-sm relative">
                                                                <ImageWithFallback
                                                                    src={group.image}
                                                                    alt={group.name}
                                                                    className="h-full w-full object-cover"
                                                                    fallbackColor={clsx(
                                                                        cat.color === 'red' && "bg-red-200",
                                                                        cat.color === 'green' && "bg-emerald-200",
                                                                        cat.color === 'orange' && "bg-orange-200",
                                                                        cat.color === 'yellow' && "bg-yellow-200",
                                                                        cat.color === 'purple' && "bg-purple-200"
                                                                    )}
                                                                />
                                                                {isSelected && <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                                                                    <span className="material-symbols-outlined text-primary font-bold bg-white rounded-full p-0.5 text-[10px]">check</span>
                                                                </div>}
                                                            </div>
                                                            <div className="flex-1 min-w-0 pr-1">
                                                                <span className={clsx("text-base font-bold leading-tight block truncate", isSelected ? "text-primary" : "text-slate-800 dark:text-slate-100")}>
                                                                    {group.name}
                                                                </span>
                                                                <p className="text-xs text-slate-500 dark:text-slate-400 truncate font-medium">{group.description}</p>
                                                            </div>
                                                        </button>

                                                        {/* Controls */}
                                                        {isSelected ? (
                                                            <div className="flex flex-col items-center gap-1 bg-white/50 dark:bg-black/30 backdrop-blur-md rounded-lg p-1 mr-1 border border-white/20">
                                                                <span className="text-xs font-bold text-slate-900 dark:text-white pt-1">{qty}</span>
                                                                <button onClick={() => removeGroup(cat.id, group.id)} className="text-slate-400 hover:text-red-500 hover:bg-white dark:hover:bg-white/10 rounded transition-colors"><span className="material-symbols-outlined text-base">delete</span></button>
                                                            </div>
                                                        ) : (
                                                            <button onClick={() => handleGroupClick(cat.id, group.id)} className="mr-2 size-8 rounded-full border-2 border-slate-200 dark:border-slate-600 flex items-center justify-center text-transparent hover:border-primary/50 transition-colors group-hover:scale-110">
                                                                <div className="size-2.5 rounded-full bg-slate-200 dark:bg-slate-600 group-hover:bg-primary/50 transition-colors" />
                                                            </button>
                                                        )}
                                                    </div>

                                                    {/* selected list preview */}
                                                    {/* selected list preview */}
                                                    {selectedIngredients.length > 0 && (
                                                        <div className="flex flex-wrap gap-1 pl-16">
                                                            {(() => {
                                                                const aggregated = selectedIngredients.reduce<{ name: string, count: number }[]>((acc, curr) => {
                                                                    const existing = acc.find(i => i.name === curr);
                                                                    if (existing) {
                                                                        existing.count++;
                                                                    } else {
                                                                        acc.push({ name: curr, count: 1 });
                                                                    }
                                                                    return acc;
                                                                }, []);

                                                                return (
                                                                    <>
                                                                        {aggregated.map((item, i) => (
                                                                            <span key={i} className="text-[9px] px-1.5 py-0.5 rounded-md bg-white dark:bg-black/20 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10 flex items-center gap-1 shadow-sm">
                                                                                <span className="truncate max-w-[60px]">{item.name}</span>
                                                                                {item.count > 1 && <strong className="text-primary font-bold">x{item.count}</strong>}
                                                                                <button
                                                                                    onClick={(e) => { e.stopPropagation(); removeGroup(cat.id, group.id, item.name); }}
                                                                                    className="size-4 rounded-full bg-slate-200 dark:bg-white/20 flex items-center justify-center text-slate-500 dark:text-slate-300 hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-900/40 dark:hover:text-red-400 transition-colors ml-0.5"
                                                                                    title="Borrar 1 porción"
                                                                                >
                                                                                    <span className="material-symbols-outlined text-[10px] font-bold">close</span>
                                                                                </button>
                                                                            </span>
                                                                        ))}
                                                                    </>
                                                                );
                                                            })()}
                                                        </div>
                                                    )}
                                                    {/* EXPANDED INLINE OPTIONS (ACCORDION) */}
                                                    <AnimatePresence>
                                                        {activeGroup?.catId === cat.id && activeGroup?.groupId === group.id && (
                                                            <motion.div
                                                                initial={{ height: 0, opacity: 0 }}
                                                                animate={{ height: 'auto', opacity: 1 }}
                                                                exit={{ height: 0, opacity: 0 }}
                                                                className="w-full overflow-hidden"
                                                            >
                                                                <div className="pt-2 pb-2 px-1">
                                                                    {group.portionMetric && (
                                                                        <div className="mb-2 flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-lg border border-blue-100 dark:border-blue-500/30">
                                                                            <span className="material-symbols-outlined text-sm text-blue-600 dark:text-blue-400">straighten</span>
                                                                            <span className="text-xs font-bold text-blue-800 dark:text-blue-200">{group.portionMetric}</span>
                                                                        </div>
                                                                    )}
                                                                    <div className="bg-slate-50 dark:bg-white/5 rounded-2xl p-3 grid grid-cols-2 gap-2 border border-slate-100 dark:border-white/5 shadow-inner">
                                                                        {group.subItems.map(item => (
                                                                            <button
                                                                                key={item}
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    addIngredient(item);
                                                                                }}
                                                                                className="px-3 py-2.5 rounded-xl bg-white dark:bg-black/20 text-sm font-bold text-slate-600 dark:text-slate-300 shadow-sm border border-slate-200 dark:border-white/5 hover:border-primary hover:text-primary active:scale-95 transition-all text-left flex justify-between items-center group/btn min-h-[44px]"
                                                                            >
                                                                                <span className="break-words leading-tight pr-1">{item}</span>
                                                                                <span className="material-symbols-outlined text-[10px] opacity-30 group-hover/btn:opacity-100 text-primary transition-opacity shrink-0">add</span>
                                                                            </button>
                                                                        ))}
                                                                    </div>
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setActiveGroup(null);
                                                                        }}
                                                                        className="w-full mt-3 py-2 flex items-center justify-center gap-1 text-[10px] font-black text-slate-300 uppercase tracking-widest hover:text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-all"
                                                                    >
                                                                        <span>Cerrar</span>
                                                                        <span className="material-symbols-outlined text-sm">expand_less</span>
                                                                    </button>
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })
                    }
                </div >
            </div>

            {/* Floating Action - PORTALED */}
            {
                createPortal(
                    <div className="fixed bottom-24 left-0 right-0 max-w-md mx-auto px-6 z-[90] pointer-events-none flex justify-center gap-4">
                        <AnimatePresence>
                            {!isSelectionEmpty && (
                                <motion.div
                                    initial={{ y: 50, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: 50, opacity: 0 }}
                                    className="pointer-events-auto flex items-center gap-3"
                                >
                                    <button
                                        onClick={() => setSelection({})}
                                        className="size-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all shadow-sm border border-slate-200 dark:border-white/5 active:scale-95"
                                        title="Borrar todo"
                                    >
                                        <span className="material-symbols-outlined text-xl">delete</span>
                                    </button>

                                    <button
                                        onClick={openSaveModal}
                                        className="bg-primary/90 backdrop-blur-md text-slate-900 font-black tracking-wide px-8 py-3 rounded-full shadow-lg shadow-primary/20 flex items-center gap-2 hover:bg-emerald-400 active:scale-95 transition-all border border-white/20"
                                    >
                                        <span>GUARDAR COMIDA</span>
                                        <span className="material-symbols-outlined">check</span>
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>,
                    document.body
                )
            }

            {/* SAVE MODAL PORTAL */}
            {createPortal(
                <AnimatePresence>
                    {saveModal.isOpen && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                                onClick={closeSaveModal}
                            />
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                                className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-sm relative z-10 shadow-2xl"
                            >
                                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-4">¿Nombre de la comida?</h3>
                                <input
                                    type="text"
                                    value={saveModal.currentName}
                                    onChange={(e) => setSaveModal(prev => ({ ...prev, currentName: e.target.value }))}
                                    className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 mb-6 font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="Ej: Almuerzo post-entreno"
                                    autoFocus
                                />
                                <div className="flex gap-3">
                                    <button onClick={closeSaveModal} className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500 font-bold hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">Cancelar</button>
                                    <button onClick={confirmSaveMeal} className="flex-1 py-3 rounded-xl bg-primary text-slate-900 font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors">Guardar</button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>,
                document.body
            )}

            {/* Toast Notification Portal */}
            {createPortal(
                <AnimatePresence>
                    {toast.visible && (
                        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[500] pointer-events-none">
                            <motion.div
                                initial={{ opacity: 0, y: -20, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                                className="bg-slate-800 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 backdrop-blur-md border border-white/10"
                            >
                                <div className="bg-green-500 rounded-full p-1">
                                    <span className="material-symbols-outlined text-sm font-bold text-white">check</span>
                                </div>
                                <span className="font-bold text-sm tracking-wide">{toast.message}</span>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>,
                document.body
            )}

        </div>
    );
}

// Subcomponents removed or moved to History.tsx

// End of file. Unused components removed.
