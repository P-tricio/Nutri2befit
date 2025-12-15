import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import StrategyCard from '../components/StrategyCard';
import HydrationCard from '../components/HydrationCard';
import { useDailyLog } from '../hooks/useDailyLog'; // Hook Import
import { useUserProfile } from '../hooks/useUserProfile'; // Hook Import
import { useEffect, useState } from 'react';
import { CATEGORY_DETAILS } from '../data/categoryDetails';

// Define the shape of the goals state
interface Goals {
    protein: number;
    veg: number;
    carb: number;
    fat: number;
    water: number;
}

export default function Dashboard() {
    const navigate = useNavigate();

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // --- HOOK: Firestore Daily Log ---
    const todayKey = new Date().toLocaleDateString('en-CA');
    const { log, updateGoals } = useDailyLog(todayKey);
    const { updateTargets } = useUserProfile();

    // State for goals - Initialize from LocalStorage first, then sync with Firestore
    const [goals, setGoals] = useState<Goals>(() => {
        const saved = localStorage.getItem('user_goals');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                return {
                    protein: Number(parsed.protein) || 4,
                    veg: Number(parsed.veg) || 5,
                    carb: Number(parsed.carb) || 2,
                    fat: Number(parsed.fat) || 3,
                    water: Number(parsed.water) || 2000
                };
            } catch (e) {
                console.error("Failed to parse user_goals", e);
            }
        }
        return { protein: 4, veg: 5, carb: 2, fat: 3, water: 2000 };
    });

    // Sync from Firestore when log loads
    useEffect(() => {
        if (log && log.goals) {
            // If log has goals, they are the source of truth for TODAY
            // We map the raw key-value goals back to our internal "Goals" type
            // Note: log.goals keys might differ slightly if not normalized. 
            // In MenuGenerator we used keys: protein, color, carbs, fats. 
            // Here 'veg' maps to 'color', 'carb' to 'carbs', 'fat' to 'fats'.

            setGoals(prev => ({
                ...prev,
                protein: log.goals.protein ?? prev.protein,
                veg: log.goals.color ?? prev.veg,
                carb: log.goals.carbs ?? prev.carb,
                fat: log.goals.fats ?? prev.fat,
                // Water might not be in daily log goals yet? assuming it is or kept local
            }));
        }
    }, [log]);

    // Track saved state to detect changes
    const [savedGoals, setSavedGoals] = useState<Goals>(goals);

    // Track edit mode for goals
    const [isEditingGoals, setIsEditingGoals] = useState(false);

    // Sync savedGoals on mount (already handled by initial state, but good for clarity if logic changes)
    const hasUnsavedChanges = JSON.stringify(goals) !== JSON.stringify(savedGoals);

    useEffect(() => {
        // ... (existing useEffect comments)
    }, []);

    // Handlers
    const updateGoal = (key: keyof Goals, delta: number) => {
        setGoals(prev => ({
            ...prev,
            [key]: Math.max(0, prev[key] + delta)
        }));
    };

    const resetGoals = () => {
        const defaults = { protein: 4, veg: 5, carb: 2, fat: 3, water: 2000 };
        setGoals(defaults);
    };

    const handleSaveAndGenerate = async () => {
        // 1. Save Goals to Storage (Legacy Local Persist)
        localStorage.setItem('user_goals', JSON.stringify(goals));
        setSavedGoals(goals); // Mark as saved

        // 2. Map for Generator/Database 
        const mappedTargets = {
            protein: goals.protein,
            carbs: goals.carb,
            fats: goals.fat,
            veggies: goals.veg,
            fruit: 0,

            // Keep legacy/app-specific keys for compatibility if needed elsewhere
            color: goals.veg,
            magic: 0
        };
        localStorage.setItem('user_targets', JSON.stringify(mappedTargets));

        // 3. Update Firestore (Sync with Cloud)
        await Promise.all([
            updateGoals(mappedTargets), // Update Today's Log
            updateTargets(mappedTargets) // Update Global Profile Defaults
        ]);

        // 4. Navigate
        navigate('/menu-generator');
    };

    return (
        <div className="w-full flex flex-col relative pb-40"> {/* Adjusted padding for footer */}
            {/* Header */}
            <div className="px-6 pt-8 pb-4 flex flex-col items-center text-center">
                {/* ... existing header logo ... */}
                <div className="flex items-center justify-center mb-4">
                    <img
                        src="/brand-full.png"
                        alt="2BeFit"
                        className="h-40 object-contain"
                    />
                </div>
                <h1 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-widest mb-1">
                    Cantidades Diarias
                </h1>

                {/* Edit Mode Toggle */}
                <button
                    onClick={() => setIsEditingGoals(!isEditingGoals)}
                    className={`mt-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${isEditingGoals
                        ? 'bg-blue-100 text-blue-600 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800'
                        : 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-white/5 dark:text-slate-400 dark:border-white/10 hover:bg-slate-200'
                        }`}
                >
                    {isEditingGoals ? 'Terminar Edición' : 'Editar Objetivos'}
                </button>
            </div>

            {/* Cards Grid */}
            <div className="flex flex-col gap-2 px-4">
                <StrategyCard
                    title="Proteínas"
                    value={goals.protein}
                    color="rose"
                    icon="egg_alt"
                    onIncrease={() => updateGoal('protein', 1)}
                    onDecrease={() => updateGoal('protein', -1)}
                    details={CATEGORY_DETAILS.protein}
                    isEditing={isEditingGoals}
                />
                <StrategyCard
                    title="Vegetales"
                    value={goals.veg}
                    color="emerald"
                    icon="nutrition"
                    onIncrease={() => updateGoal('veg', 1)}
                    onDecrease={() => updateGoal('veg', -1)}
                    details={CATEGORY_DETAILS.veg}
                    isEditing={isEditingGoals}
                />
                <StrategyCard
                    title="Carbos"
                    expandedTitle="Carbohidratos"
                    value={goals.carb}
                    color="orange"
                    icon="rice_bowl"
                    onIncrease={() => updateGoal('carb', 1)}
                    onDecrease={() => updateGoal('carb', -1)}
                    details={CATEGORY_DETAILS.carb}
                    isEditing={isEditingGoals}
                />
                <StrategyCard
                    title="Grasas"
                    value={goals.fat}
                    color="amber"
                    icon="water_drop"
                    onIncrease={() => updateGoal('fat', 1)}
                    onDecrease={() => updateGoal('fat', -1)}
                    details={CATEGORY_DETAILS.fat}
                    isEditing={isEditingGoals}
                />
            </div>    <div className="px-4 mt-6">
                <HydrationCard
                    value={goals.water}
                    onChange={(val) => setGoals(prev => ({ ...prev, water: val }))}
                    isEditing={isEditingGoals}
                />
            </div>

            {/* Actions Dock - Sticky Bottom PORTAL */}
            {
                createPortal(
                    <div className="fixed bottom-24 left-0 right-0 max-w-md mx-auto px-6 z-[500] pointer-events-none flex justify-center gap-4">
                        <div className="pointer-events-auto flex items-center gap-3">
                            <button
                                onClick={resetGoals}
                                className="size-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all shadow-sm border border-slate-200 dark:border-white/5 active:scale-95"
                                title="Reiniciar"
                            >
                                <span className="material-symbols-outlined text-xl">restart_alt</span>
                            </button>

                            <button
                                onClick={handleSaveAndGenerate}
                                className={`
                                pointer-events-auto backdrop-blur-md font-bold tracking-wide px-8 py-3 rounded-full shadow-xl flex items-center gap-2 active:scale-95 transition-all border border-white/10
                                ${hasUnsavedChanges
                                        ? 'bg-green-500 text-white shadow-green-500/30 hover:bg-green-400'
                                        : 'bg-slate-800 text-slate-200 shadow-black/20 hover:bg-slate-700 hover:text-white'}
                            `}
                                title="Guardar y Generar Menú"
                            >
                                <span className="material-symbols-outlined">{hasUnsavedChanges ? 'save' : 'arrow_forward'}</span>
                                <span className="font-black">{hasUnsavedChanges ? 'GUARDAR CANTIDADES' : 'CREAR COMIDA'}</span>
                            </button>
                        </div>
                    </div>,
                    document.body
                )
            }
        </div >
    );
}
