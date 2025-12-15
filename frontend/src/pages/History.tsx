import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { DATA } from '../data/foodData';
import { useSavedMenus } from '../hooks/useSavedMenus'; // Hook Import
import ConfirmModal from '../components/ConfirmModal';
import { useDailyLog } from '../hooks/useDailyLog';

// Imported DATA from ../data/foodData

export type SelectionDetail = {
    count: number;
    ingredients: string[];
};

export type Meal = {
    id: string;
    name: string;
    timestamp: number;
    selection: Record<string, Record<string, SelectionDetail | number>>;
};

export type DailyLog = {
    date: string;
    goals: Record<string, number>;
    meals: Meal[];
};

export type SavedMenu = {
    id: string;
    name: string;
    meals: Meal[];
    goals: Record<string, number>;
    createdAt: number;
};


const EXAMPLE_MENU: SavedMenu = {
    id: 'example-menu-1',
    name: 'Menú Ejemplo 🌟',
    createdAt: Date.now(),
    goals: { protein: 4, color: 5, carbs: 2, fats: 3 },
    meals: [
        {
            id: 'ex-meal-1',
            name: 'Desayuno: Tostadas Francesas',
            timestamp: Date.now(),
            selection: {
                protein: { 'dairy_zero': { count: 1, ingredients: ['Claras', 'Queso Batido 0%'] } },
                carbs: { 'grains': { count: 1, ingredients: ['Pan Wasa'] } },
                magic: { 'spices': { count: 1, ingredients: ['Canela', 'Vainilla'] } }
            }
        },
        {
            id: 'ex-meal-2',
            name: 'Almuerzo: Pollo al Curry',
            timestamp: Date.now() + 1000,
            selection: {
                protein: { 'meat': { count: 1, ingredients: ['Pollo'] } },
                carbs: { 'grains': { count: 1, ingredients: ['Arroz'] } },
                color: { 'colors': { count: 2, ingredients: ['Pimiento', 'Cebolla'] } },
                fats: { 'oils': { count: 1, ingredients: ['Aceite Coco V.E.'] } },
                magic: { 'spices': { count: 1, ingredients: ['Cúrcuma', 'Pimienta'] } }
            }
        },
        {
            id: 'ex-meal-3',
            name: 'Cena: Ensalada Fresca',
            timestamp: Date.now() + 2000,
            selection: {
                protein: { 'fish': { count: 1, ingredients: ['Atún', 'Huevo Duro'] } },
                color: { 'leaves': { count: 2, ingredients: ['Rúcula', 'Canónigos'] } },
                fats: { 'oils': { count: 1, ingredients: ['Aceite Oliva V.E.'] } },
                magic: { 'seasoning': { count: 1, ingredients: ['Vinagre de manzana', 'Sal marina'] } }
            }
        }
    ]
};

export default function History() {
    const navigate = useNavigate();


    const [todayKey] = useState(new Date().toLocaleDateString('en-CA'));
    const [selectedDate] = useState(todayKey);

    // --- HOOK: Firestore Daily Log ---
    const { log, addMeal, deleteMeal, updateMeal } = useDailyLog(selectedDate);

    // --- HOOK: Firestore Saved Menus ---
    const { menus: savedMenus, addMenu, deleteMenu, updateMenu, renameMenu } = useSavedMenus();

    // Fallback activeLog structure if log is loading or null
    // SAFEGUARD: Ensure meals array exists if log is present but incomplete (e.g. only goals set)
    const activeLog: DailyLog = log ? { ...log, meals: log.meals || [] } : { date: selectedDate, goals: {}, meals: [] };

    // --- MODALS ---
    const [modal, setModal] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
        isDestructive?: boolean;
    }>({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => { },
    });

    // Name Input Modal State
    const [nameModal, setNameModal] = useState<{
        isOpen: boolean;
        currentName: string;
        onSave: (name: string) => void;
    } | null>(null);


    const closeModal = () => setModal(prev => ({ ...prev, isOpen: false }));
    const closeNameModal = () => setNameModal(null);

    // --- COPY MEAL MODAL STATE ---
    const [copyModal, setCopyModal] = useState<{
        isOpen: boolean;
        mealToCopy: Meal | null;
    }>({
        isOpen: false,
        mealToCopy: null
    });

    const openCopyModal = (meal: Meal) => setCopyModal({ isOpen: true, mealToCopy: meal });
    const closeCopyModal = () => setCopyModal({ isOpen: false, mealToCopy: null });

    // --- DRAG & DROP STATE ---
    const [dragOverMenuId, setDragOverMenuId] = useState<string | null>(null);
    const [toast, setToast] = useState<{ message: string, visible: boolean }>({ message: '', visible: false });

    // Auto-hide toast
    useEffect(() => {
        if (toast.visible) {
            const timer = setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 2000);
            return () => clearTimeout(timer);
        }
    }, [toast.visible]);

    // --- ACTIONS ---

    // 1. Save Current Day as Menu
    const promptSaveMenu = () => {
        setNameModal({
            isOpen: true,
            currentName: `Menú ${new Date().toLocaleDateString('es-ES', { weekday: 'long' })}`,
            onSave: async (name) => {
                // Deep clone meals and assign NEW IDs to ensure independence
                const clonedMeals = activeLog.meals.map((meal, index) => ({
                    ...meal,
                    id: `${Date.now()}-${index}`, // Unique ID for the saved version
                    timestamp: Date.now(), // update timestamp to saved time
                    selection: JSON.parse(JSON.stringify(meal.selection)) // Deep copy selection
                }));

                const newMenu: SavedMenu = {
                    id: Date.now().toString(),
                    name: name || 'Menú Sin Nombre',
                    meals: clonedMeals,
                    goals: JSON.parse(JSON.stringify(activeLog.goals)), // Deep copy goals too just in case
                    createdAt: Date.now()
                };

                await addMenu(newMenu);
                setToast({ message: "Menú guardado correctamente", visible: true });
                closeNameModal();
            }
        });
    };

    // 2. Rename Saved Menu
    const promptRenameMenu = (menu: SavedMenu) => {
        setNameModal({
            isOpen: true,
            currentName: menu.name,
            onSave: async (name) => {
                await renameMenu(menu.id, name);
                closeNameModal();
            }
        });
    };

    // 3. Delete Saved Menu
    const confirmDeleteMenu = (menuId: string) => {
        setModal({
            isOpen: true,
            title: '¿Borrar Menú?',
            message: 'Eliminarás este menú guardado permanentemente.',
            isDestructive: true,
            onConfirm: async () => {
                await deleteMenu(menuId);
                closeModal();
            }
        });
    };

    const confirmResetDay = () => {
        setModal({
            isOpen: true,
            title: '¿Reiniciar Día?',
            message: 'Esto borrará todas las comidas registradas hoy. Esta acción no se puede deshacer.',
            isDestructive: true,
            onConfirm: async () => {
                // Delete all meals one by one (or implementation a clear method in hook later)
                // For now, iterate and delete
                if (log?.meals) {
                    for (const meal of log.meals) {
                        await deleteMeal(meal);
                    }
                }
                closeModal();
            }
        });
    };

    const confirmDeleteMeal = (mealId: string) => {
        setModal({
            isOpen: true,
            title: '¿Borrar Comida?',
            message: '¿Estás seguro de que quieres eliminar esta comida?',
            isDestructive: true,
            onConfirm: async () => {
                // 1. Try delete from Log
                const mealToDelete = activeLog.meals.find(m => m.id === mealId);
                if (mealToDelete) {
                    await deleteMeal(mealToDelete);
                }

                // 2. Try delete from Saved Menus (Firestore)
                // We need to find if this meal is part of any saved menu and remove it
                const menuContainingMeal = savedMenus.find(menu => menu.meals.some(m => m.id === mealId));

                if (menuContainingMeal) {
                    const updatedMeals = menuContainingMeal.meals.filter(m => m.id !== mealId);
                    await updateMenu({ ...menuContainingMeal, meals: updatedMeals });
                }

                closeModal();
            }
        });
    };

    // 4. Shopping List Logic
    const [shoppingListContext, setShoppingListContext] = useState<{ title: string, menus: SavedMenu[] } | null>(null);

    const getShoppingList = (menus: SavedMenu[]) => {
        const list: Record<string, { title: string, color: string, items: Record<string, number> }> = {};

        menus.forEach(menu => {
            menu.meals.forEach(meal => {
                DATA.forEach(cat => {
                    const catSel = meal.selection[cat.id];
                    if (catSel) {
                        Object.values(catSel).forEach((val: any) => {
                            const ings = val.ingredients || [];
                            if (ings.length > 0) {
                                if (!list[cat.id]) {
                                    list[cat.id] = {
                                        title: cat.id === 'color' ? 'Vegetales' : cat.title,
                                        color: cat.color,
                                        items: {}
                                    };
                                }
                                ings.forEach((ing: string) => {
                                    list[cat.id].items[ing] = (list[cat.id].items[ing] || 0) + 1;
                                });
                            }
                        });
                    }
                });
            });
        });
        return list;
    };

    const copyShoppingList = () => {
        if (!shoppingListContext) return;
        const list = getShoppingList(shoppingListContext.menus);
        let text = `🛒 ${shoppingListContext.title}\n\n`;

        Object.values(list).forEach(cat => {
            text += `*${cat.title}*\n`;
            Object.entries(cat.items).forEach(([name, count]) => {
                text += `- ${name} ${count > 1 ? `(x${count})` : ''}\n`;
            });
            text += '\n';
        });

        navigator.clipboard.writeText(text);
        // Could add a toast here, but for now simple feedback
    };

    const [expandedMenuId, setExpandedMenuId] = useState<string | null>(null);

    const toggleMenu = (id: string) => {
        setExpandedMenuId(prev => prev === id ? null : id);
    };

    // --- EDIT MEAL LOGIC ---
    const [editingMealId, setEditingMealId] = useState<string | null>(null);
    const [editedName, setEditedName] = useState("");

    const handleStartEdit = (meal: Meal) => {
        setEditingMealId(meal.id);
        setEditedName(meal.name);
    };

    const handleCancelEdit = () => {
        setEditingMealId(null);
        setEditedName("");
    };

    const handleSaveEdit = async () => {
        if (!editingMealId) return;

        // 1. Update Daily Log (Firestore)
        const mealInLog = activeLog.meals.find(m => m.id === editingMealId);
        if (mealInLog) {
            const updatedMeal = { ...mealInLog, name: editedName };
            await updateMeal(updatedMeal);
        }

        // 2. Update Saved Menus (Firestore)
        // Find if this meal belongs to a saved menu
        const menuToUpdate = savedMenus.find(menu => menu.meals.some(m => m.id === editingMealId));
        if (menuToUpdate) {
            const updatedMeals = menuToUpdate.meals.map(m => m.id === editingMealId ? { ...m, name: editedName } : m);
            await updateMenu({ ...menuToUpdate, meals: updatedMeals });
        }

        setEditingMealId(null);
        setEditedName("");
    };



    const handleRemoveIngredient = async (mealId: string, catId: string, itemId: string, ingredientIndex: number) => {
        // Helper to update a meal list
        const updateMeals = (meals: Meal[]) => meals.map(meal => {
            if (meal.id !== mealId) return meal;

            const newSelection = { ...meal.selection };
            if (newSelection[catId] && newSelection[catId][itemId]) {
                const details = newSelection[catId][itemId];
                if (typeof details === 'object' && details.ingredients) {
                    const newIngredients = [...details.ingredients];
                    newIngredients.splice(ingredientIndex, 1);

                    if (newIngredients.length === 0) {
                        delete newSelection[catId][itemId];
                    } else {
                        newSelection[catId][itemId] = {
                            ...details,
                            count: newIngredients.length,
                            ingredients: newIngredients
                        };
                    }
                }
            }
            return { ...meal, selection: newSelection };
        });

        // Update Daily Logs (Firestore)
        const mealInLog = activeLog.meals.find(m => m.id === mealId);
        // We have to recreate the logic of modification in the hook or pass the modified meal
        // The hook `updateMeal` replaces the meal with the same ID.
        // So we just need to construct the new meal object here locally, then call update.

        if (mealInLog) {
            const newSelection = { ...mealInLog.selection };
            // ... apply logic ...
            // Re-applying logic locally to get 'newMeal'
            if (newSelection[catId] && newSelection[catId][itemId]) {
                const details = newSelection[catId][itemId];
                if (typeof details === 'object' && details.ingredients) {
                    const newIngredients = [...details.ingredients];
                    newIngredients.splice(ingredientIndex, 1);

                    if (newIngredients.length === 0) {
                        delete newSelection[catId][itemId];
                    } else {
                        newSelection[catId][itemId] = {
                            ...details,
                            count: newIngredients.length,
                            ingredients: newIngredients
                        };
                    }
                }
            }
            const updatedMeal = { ...mealInLog, selection: newSelection };
            // Call hook
            updateMeal(updatedMeal); // Async but we don't await here 
        }

        // Removed setDailyLogs local update block


        // Update Saved Menus (Firestore)
        const menuToUpdate = savedMenus.find(menu => menu.meals.some(m => m.id === mealId));
        if (menuToUpdate) {
            const updatedMeals = updateMeals(menuToUpdate.meals);
            await updateMenu({ ...menuToUpdate, meals: updatedMeals });
        }
    };

    // --- COPY TO MENU HANDLER ---
    const handleCopyMealToMenu = async (targetMenuId: string) => {
        if (!copyModal.mealToCopy) return;

        const originalMeal = copyModal.mealToCopy;
        const newMeal: Meal = {
            ...originalMeal,
            id: Date.now().toString(),
            timestamp: Date.now(),
            selection: JSON.parse(JSON.stringify(originalMeal.selection)) // Deep clone to prevent shared references
        };

        // Firestore Update
        const targetMenu = savedMenus.find(m => m.id === targetMenuId);
        if (targetMenu) {
            const updatedMeals = [...targetMenu.meals, newMeal];
            await updateMenu({ ...targetMenu, meals: updatedMeals });
        }

        setToast({ message: "Comida copiada al menú", visible: true });
        closeCopyModal();
    };

    // --- COPY TO CREATION ZONE (TODAY) HANDLER ---
    const handleCopyMealToDay = async (meal: Meal) => {
        const newMeal: Meal = {
            ...meal,
            id: Date.now().toString(),
            timestamp: Date.now(),
            selection: JSON.parse(JSON.stringify(meal.selection)) // Deep clone
        };

        await addMeal(newMeal);
        setToast({ message: "Comida enviada a Zona de Creación", visible: true });
    };

    // --- EDIT IN GENERATOR HANDLER ---
    const handleEditInGenerator = (meal: Meal) => {
        navigate('/menu-generator', { state: { editMeal: meal } });
    };

    // --- DRAG & DROP HANDLERS (Preserved but UI hidden) ---
    const handleDragStart = (e: React.DragEvent, meal: Meal) => {
        e.dataTransfer.setData("meal", JSON.stringify(meal));
        e.dataTransfer.effectAllowed = "copy";
    };

    const handleDragOver = (e: React.DragEvent, menuId: string) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "copy";
        if (dragOverMenuId !== menuId) {
            setDragOverMenuId(menuId);
        }
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOverMenuId(null);
    };

    const handleDrop = async (e: React.DragEvent, targetMenuId: string) => {
        e.preventDefault();
        setDragOverMenuId(null);

        try {
            const mealData = e.dataTransfer.getData("meal");
            if (!mealData) return;

            const originalMeal: Meal = JSON.parse(mealData);

            const newMeal: Meal = {
                ...originalMeal,
                id: Date.now().toString(),
                timestamp: Date.now(),
                selection: JSON.parse(JSON.stringify(originalMeal.selection)) // Deep clone
            };

            // Firestore Update
            // Find target menu
            const targetMenu = savedMenus.find(m => m.id === targetMenuId);
            if (targetMenu) {
                const updatedMeals = [...targetMenu.meals, newMeal];
                await updateMenu({ ...targetMenu, meals: updatedMeals });
            }

            setToast({ message: "Comida copiada al menú", visible: true });

        } catch (error) {
            console.error("Error dropping meal:", error);
        }
    };

    // Refs for scrolling
    const menuRefs = useRef<Record<string, HTMLDivElement | null>>({});

    // Effect: Scroll to expanded menu
    useEffect(() => {
        if (expandedMenuId) {
            const element = menuRefs.current[expandedMenuId];
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
                }, 300);
            }
        } else {
            // Close: Scroll to top
            setTimeout(() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
                document.body.scrollTo({ top: 0, behavior: 'smooth' });
            }, 100);
        }
    }, [expandedMenuId]);

    // Render Logic for Progress Grid
    const renderProgressGrid = (meals: Meal[], goals: Record<string, number>) => {
        return (
            <div className="grid grid-cols-2 gap-3 mb-4">
                {DATA.filter(c => c.id !== 'magic').map(cat => {
                    // Re-use logic for flexible calc
                    const consumed = meals.reduce<number>((acc, meal) => {
                        const catSel = meal.selection[cat.id] || {};
                        const mealCount = Object.values(catSel).reduce<number>((a, b: any) => {
                            const count = typeof b === 'number' ? b : b.count;
                            return a + count;
                        }, 0);
                        return acc + mealCount;
                    }, 0);

                    const target = goals[cat.id] || 0;

                    const displayTitle = {
                        'protein': 'Proteína',
                        'color': 'Verdura',
                        'carbs': 'Carbos',
                        'fats': 'Grasas'
                    }[cat.id] || cat.title;

                    const percentage = target > 0 ? Math.min((consumed / target) * 100, 100) : 0;
                    const isOver = consumed > target && target > 0 && cat.id !== 'color';

                    return (
                        <div key={cat.id} className="glass-card p-3 rounded-2xl flex flex-col gap-2">
                            <div className="flex justify-between items-center text-xs font-bold uppercase text-slate-500">
                                <span>{displayTitle}</span>
                                <span className={isOver ? "text-red-500" : "text-slate-900 dark:text-white"}>{consumed}/{target}</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 dark:bg-black/20 rounded-full overflow-hidden">
                                <div
                                    className={clsx("h-full rounded-full transition-all duration-500",
                                        isOver ? "bg-red-500" :
                                            cat.id === 'fats' ? "bg-amber-500" : // Explicit Amber for Fats
                                                cat.id === 'carbs' ? "bg-yellow-400" : // Explicit Yellow for Carbs
                                                    cat.color === 'red' ? "bg-red-400" :
                                                        cat.color === 'green' ? "bg-emerald-400" :
                                                            cat.color === 'orange' ? "bg-orange-400" :
                                                                cat.color === 'yellow' ? "bg-yellow-400" : "bg-purple-400"
                                    )}
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                        </div>
                    )
                })}
            </div>
        );
    };

    // --- MEAL EXPANSION LOGIC (FOR TODAY) ---
    const [expandedMealId, setExpandedMealId] = useState<string | null>(null);
    const [activeMealContext, setActiveMealContext] = useState<{ type: 'today' } | { type: 'menu', menuId: string } | null>(null);
    const mealRefs = useRef<Record<string, HTMLDivElement | null>>({});

    // Dropdown States
    const [openMenuOptionsId, setOpenMenuOptionsId] = useState<string | null>(null);
    const [openMealOptionsId, setOpenMealOptionsId] = useState<string | null>(null);

    // Close dropdowns on click outside
    useEffect(() => {
        const handleClickOutside = () => {
            setOpenMenuOptionsId(null);
            setOpenMealOptionsId(null);
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    // Meal Scroll Effect
    useEffect(() => {
        if (expandedMealId) {
            const element = mealRefs.current[expandedMealId];
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
                }, 300);
            }
        } else if (activeMealContext) {
            setTimeout(() => {
                if (activeMealContext.type === 'today') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
                    document.body.scrollTo({ top: 0, behavior: 'smooth' });
                } else if (activeMealContext.type === 'menu' && activeMealContext.menuId) {
                    const menuEl = menuRefs.current[activeMealContext.menuId];
                    if (menuEl) {
                        menuEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }
            }, 100);
        }
    }, [expandedMealId, activeMealContext]);

    const toggleMeal = (id: string, isCollapsible: boolean, context: { type: 'today' } | { type: 'menu', menuId: string }) => {
        if (!isCollapsible) return;
        if (expandedMealId === id) {
            setExpandedMealId(null);
        } else {
            setExpandedMealId(id);
            setActiveMealContext(context);
        }
    };

    // Shared Meal Renderer
    const renderMealList = (meals: Meal[], allowDelete: boolean = false, isDraggable: boolean = false, isCollapsible: boolean = false, allowCopyToCreationZone: boolean = false, context: { type: 'today' } | { type: 'menu', menuId: string } = { type: 'today' }) => (
        <div className="space-y-4">
            {meals.slice().reverse().map((meal) => {
                const isOpen = !isCollapsible || expandedMealId === meal.id;

                return (
                    <div
                        key={meal.id}
                        ref={(el) => { mealRefs.current[meal.id] = el; }} // Attack Ref
                        draggable={isDraggable && !editingMealId}
                        onDragStart={(e) => isDraggable ? handleDragStart(e, meal) : undefined}
                        className={clsx(
                            "glass-card rounded-2xl group relative transition-all duration-300",
                            isDraggable && !editingMealId ? "cursor-grab active:cursor-grabbing hover:shadow-md hover:-translate-y-0.5" : "",
                            isCollapsible ? "p-0" : "p-4",
                            openMealOptionsId === meal.id ? "z-50" : "z-0" // Elevate z-index when menu is open
                        )}
                    >
                        {/* Header */}
                        <div
                            onClick={() => toggleMeal(meal.id, isCollapsible, context)}
                            className={clsx(
                                "flex flex-col gap-2", // Column layout for multi-line support
                                isCollapsible ? "p-4 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors rounded-2xl" : "mb-3 border-b border-dashed border-slate-200 dark:border-white/10 pb-2"
                            )}
                        >
                            <div className="flex justify-between items-start w-full">
                                {/* LEFT SIDE: Name/Edit Input */}
                                <div className="flex items-center flex-1 gap-2 mr-2 min-w-0">
                                    {isDraggable && !editingMealId && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); openCopyModal(meal); }}
                                            className="size-8 rounded-full flex items-center justify-center text-slate-300 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors shrink-0"
                                            title="Copiar a Menú"
                                        >
                                            <span className="material-symbols-outlined text-xl">content_copy</span>
                                        </button>
                                    )}
                                    {editingMealId === meal.id ? (
                                        <div className="flex-1" onClick={(e) => e.stopPropagation()}>
                                            <input
                                                type="text"
                                                value={editedName}
                                                onChange={(e) => setEditedName(e.target.value)}
                                                className="w-full bg-slate-100 dark:bg-white/10 px-3 py-1.5 rounded-lg font-bold text-slate-900 dark:text-white border border-slate-300 dark:border-white/20 focus:ring-2 focus:ring-primary focus:outline-none"
                                                autoFocus
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 min-w-0 flex-1">
                                            <span className="font-black text-slate-800 dark:text-white text-lg leading-tight capitalize line-clamp-2 break-words">{meal.name}</span>
                                            {isCollapsible && (
                                                <motion.span
                                                    animate={{ rotate: isOpen ? 180 : 0 }}
                                                    className="material-symbols-outlined text-slate-400 text-lg shrink-0"
                                                >
                                                    expand_more
                                                </motion.span>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* RIGHT SIDE: Actions (Edit/Delete/Save/Cancel) */}
                                <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                                    {editingMealId === meal.id ? (
                                        <>
                                            <button onClick={handleSaveEdit} className="size-8 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 flex items-center justify-center hover:scale-110 transition-transform shadow-sm">
                                                <span className="material-symbols-outlined text-lg">check</span>
                                            </button>
                                            <button onClick={handleCancelEdit} className="size-8 rounded-full bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-white flex items-center justify-center hover:scale-110 transition-transform">
                                                <span className="material-symbols-outlined text-lg">close</span>
                                            </button>
                                        </>
                                    ) : (
                                        <div className="relative">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setOpenMealOptionsId(openMealOptionsId === meal.id ? null : meal.id);
                                                    setOpenMenuOptionsId(null);
                                                }}
                                                className="size-8 rounded-full flex items-center justify-center text-slate-300 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                                            >
                                                <span className="material-symbols-outlined">more_vert</span>
                                            </button>

                                            <AnimatePresence>
                                                {openMealOptionsId === meal.id && (
                                                    <motion.div
                                                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                                        className="absolute right-0 top-8 w-52 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-white/10 z-[50] overflow-hidden"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        {allowCopyToCreationZone && (
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleCopyMealToDay(meal);
                                                                    setOpenMealOptionsId(null);
                                                                }}
                                                                className="w-full px-2 py-2 text-sm font-medium text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 flex items-center justify-center gap-2"
                                                            >
                                                                <span className="material-symbols-outlined text-lg">arrow_upward</span>
                                                                Copiar a Hoy
                                                            </button>
                                                        )}

                                                        {isDraggable && !editingMealId && (
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleEditInGenerator(meal);
                                                                    setOpenMealOptionsId(null);
                                                                }}
                                                                className="w-full px-2 py-2 text-sm font-medium text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/10 flex items-center justify-center gap-2"
                                                            >
                                                                <span className="material-symbols-outlined text-lg">restaurant</span>
                                                                Editar en Plato
                                                            </button>
                                                        )}

                                                        {allowDelete && (
                                                            <>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleStartEdit(meal);
                                                                        setOpenMealOptionsId(null);
                                                                    }}
                                                                    className="w-full px-2 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 flex items-center justify-center gap-2 border-t border-slate-100 dark:border-white/5"
                                                                >
                                                                    <span className="material-symbols-outlined text-lg">edit</span>
                                                                    Renombrar
                                                                </button>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        confirmDeleteMeal(meal.id);
                                                                        setOpenMealOptionsId(null);
                                                                    }}
                                                                    className="w-full px-2 py-2 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 flex items-center justify-center gap-2 border-t border-slate-100 dark:border-white/5"
                                                                >
                                                                    <span className="material-symbols-outlined text-lg">delete</span>
                                                                    Eliminar
                                                                </button>
                                                            </>
                                                        )}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* SECOND ROW: Portion Summary (Only if not editing) */}
                            {(!editingMealId || editingMealId !== meal.id) && (
                                <div className="grid grid-cols-4 gap-2 mt-3 w-full px-1">
                                    {[
                                        { id: 'protein', icon: 'egg_alt', color: 'orange', label: 'Prot' },
                                        { id: 'color', icon: 'nutrition', color: 'green', label: 'Veg' },
                                        { id: 'carbs', icon: 'rice_bowl', color: 'yellow', label: 'Carb' },
                                        { id: 'fats', icon: 'water_drop', color: 'amber', label: 'Grasa' },
                                    ].map(cat => {
                                        const catSel = meal.selection[cat.id] || {};
                                        const count = Object.values(catSel).reduce<number>((acc, b: any) => {
                                            return acc + (typeof b === 'number' ? b : b.count);
                                        }, 0);

                                        const isActive = count > 0;

                                        // Dynamic classes based on active state and color
                                        const colorClasses = isActive
                                            ? cat.color === 'orange' ? "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400 border-orange-100 dark:border-orange-800/30"
                                                : cat.color === 'green' ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800/30"
                                                    : cat.color === 'yellow' ? "bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400 border-yellow-100 dark:border-yellow-800/30"
                                                        : "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 border-amber-100 dark:border-amber-800/30"
                                            : "bg-slate-50 text-slate-300 dark:bg-white/5 dark:text-slate-600 border-transparent";

                                        return (
                                            <div
                                                key={cat.id}
                                                className={clsx(
                                                    "flex flex-col items-center justify-center py-1.5 rounded-xl border transition-colors",
                                                    colorClasses
                                                )}
                                            >
                                                <span className={clsx("material-symbols-outlined text-lg mb-0.5", !isActive && "opacity-50")}>
                                                    {cat.icon}
                                                </span>
                                                <span className="text-xs font-black">
                                                    {count}
                                                </span>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Ingredients Grid (Collapsible) */}
                        <AnimatePresence>
                            {isOpen && (
                                <motion.div
                                    initial={isCollapsible ? { height: 0, opacity: 0 } : false}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className={clsx("overflow-hidden", isCollapsible ? "border-t border-slate-100 dark:border-white/5 mx-4" : "")}
                                >
                                    <div className={clsx("grid grid-cols-1 sm:grid-cols-2 gap-2", isCollapsible ? "py-4" : "mt-2")}>
                                        {DATA.flatMap(cat => {
                                            const items = meal.selection[cat.id] || {};
                                            return Object.entries(items).map(([itemId, detail]: [string, any]) => {
                                                const qty = typeof detail === 'number' ? detail : detail.count;
                                                const ingredients = detail.ingredients || [];

                                                const def = cat.items.find(i => i.id === itemId);
                                                if (!def) return null;

                                                const borderClass = cat.color === 'red' ? 'border-l-red-400' :
                                                    cat.color === 'green' ? 'border-l-emerald-400' :
                                                        cat.color === 'orange' ? 'border-l-orange-400' :
                                                            cat.color === 'yellow' ? 'border-l-yellow-400' : 'border-l-purple-400';

                                                return (
                                                    <div key={`${cat.id}-${itemId}`} className={clsx("flex flex-col justify-center bg-slate-50/80 dark:bg-white/5 rounded-r-xl rounded-l-[2px] border-l-[3px] py-2 px-3 min-h-[46px]", borderClass)}>
                                                        <div className="flex flex-wrap items-center gap-2 mb-0.5">
                                                            {ingredients.length > 0 ? (
                                                                ingredients.map((ing: string, idx: number) => (
                                                                    <span key={idx} className="inline-flex items-center gap-1 bg-white dark:bg-black/20 px-1.5 py-0.5 rounded-md text-[13px] font-bold text-slate-900 dark:text-white leading-tight shadow-sm border border-slate-100 dark:border-white/5">
                                                                        {ing}
                                                                        {editingMealId === meal.id && (
                                                                            <button
                                                                                onClick={() => handleRemoveIngredient(meal.id, cat.id, itemId, idx)}
                                                                                className="size-4 flex items-center justify-center rounded-full hover:bg-red-100 text-slate-400 hover:text-red-500 transition-colors"
                                                                            >
                                                                                <span className="material-symbols-outlined text-xs font-bold">close</span>
                                                                            </button>
                                                                        )}
                                                                    </span>
                                                                ))
                                                            ) : (
                                                                <span className="text-[13px] font-bold text-slate-900 dark:text-white leading-tight truncate">{def.name}</span>
                                                            )}

                                                            {qty > ingredients.length && (
                                                                <span className="text-xs font-bold text-white bg-slate-400/80 dark:bg-slate-600 px-1.5 py-0.5 rounded-full shrink-0">x{qty}</span>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                                                            {ingredients.length > 0 && <span>{def.name}</span>}
                                                            {def.portionMetric && (
                                                                <span className={clsx("flex items-center gap-1", ingredients.length > 0 && "before:content-['•'] before:mx-1 before:opacity-50")}>
                                                                    {def.portionMetric}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                )
                                            });
                                        })}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                );
            })}
        </div>
    );

    return (
        <div className="w-full">
            {/* Header */}
            <div className="px-5 pt-2 pb-2 flex flex-col items-center text-center gap-2">
                <img src="/brand-compact.png" alt="2B" className="h-8 w-auto object-contain" />
                <div>
                    <h1 className="text-slate-400 text-xs font-bold leading-none uppercase tracking-wider">
                        Crea tus menús
                    </h1>
                </div>
            </div>

            {/* TABS / SECTIONS */}

            {/* 1. CURRENT DAY */}
            <div className="px-4 mt-6">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-white capitalize flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">edit_square</span>
                        Zona de creación
                    </h2>

                    {activeLog.meals.length > 0 && (
                        <button
                            onClick={promptSaveMenu}
                            className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-sm hover:scale-105 transition-transform"
                        >
                            <span className="material-symbols-outlined text-sm">bookmark</span>
                            Guardar
                        </button>
                    )}
                </div>

                {/* Today's Context */}
                <div className="glass-card p-4 rounded-3xl border border-primary/20 bg-primary/5 mb-8">
                    {activeLog.meals.length === 0 ? (
                        <div className="text-center py-6">
                            <p className="text-slate-500 text-sm">Empieza a añadir comidas en el Generador para ver tu progreso hoy.</p>
                        </div>
                    ) : (
                        <>
                            {renderProgressGrid(activeLog.meals, activeLog.goals)}

                            {/* Simple Meal List for Today - ENABLE COLLAPSIBLE here */}
                            <div className="space-y-2 mt-4">
                                {renderMealList(activeLog.meals, true, true, true)}
                                <button onClick={confirmResetDay} className="w-full mt-2 text-xs text-red-400 font-bold uppercase py-2 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors">Reiniciar Hoy</button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* 2. SAVED MENUS LIST */}
            <div className="px-4 mt-2">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-slate-400">bookmark_border</span>
                        <h3 className="text-md font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Menús Guardados</h3>
                    </div>
                    {savedMenus.length > 0 && (
                        <button
                            onClick={() => setShoppingListContext({ title: "Lista de Compra Global", menus: savedMenus })}
                            className="text-xs font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 px-3 py-1.5 rounded-lg flex items-center gap-1 hover:scale-105 transition-transform"
                        >
                            <span className="material-symbols-outlined text-sm">shopping_cart</span>
                            Lista Global
                        </button>
                    )}
                </div>

                {savedMenus.length === 0 ? (
                    <div className="text-center py-8 opacity-60">
                        <p className="text-sm text-slate-400">No hay menús guardados aún.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {savedMenus.map(menu => (
                            <div
                                key={menu.id}
                                ref={(el) => { menuRefs.current[menu.id] = el; }}
                                // DROP TARGET
                                onDragOver={(e) => handleDragOver(e, menu.id)}
                                onDragLeave={handleDragLeave}
                                onDrop={(e) => handleDrop(e, menu.id)}
                                className={clsx(
                                    "glass-card p-4 rounded-2xl relative group transition-all duration-300",
                                    dragOverMenuId === menu.id ? "ring-2 ring-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 scale-[1.02]" : ""
                                )}
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex-1 cursor-pointer" onClick={() => toggleMenu(menu.id)}>
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-black text-slate-800 dark:text-white text-lg leading-tight line-clamp-2 break-words">{menu.name}</h4>
                                            <motion.span
                                                animate={{ rotate: expandedMenuId === menu.id ? 180 : 0 }}
                                                className="material-symbols-outlined text-slate-400 text-lg"
                                            >
                                                expand_more
                                            </motion.span>
                                        </div>
                                        <p className="text-xs text-slate-400 mt-1">
                                            Guardado el {new Date(menu.createdAt).toLocaleDateString()} • {menu.meals.length} Comidas
                                        </p>
                                    </div>
                                    <div className="relative">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setOpenMenuOptionsId(openMenuOptionsId === menu.id ? null : menu.id);
                                                setOpenMealOptionsId(null); // Close others
                                            }}
                                            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
                                        >
                                            <span className="material-symbols-outlined">more_vert</span>
                                        </button>

                                        <AnimatePresence>
                                            {openMenuOptionsId === menu.id && (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                                    className="absolute right-0 top-8 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-white/10 z-[50] overflow-hidden"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <button
                                                        onClick={() => {
                                                            setShoppingListContext({ title: `Lista: ${menu.name}`, menus: [menu] });
                                                            setOpenMenuOptionsId(null);
                                                        }}
                                                        className="w-full px-2 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 flex items-center justify-center gap-2"
                                                    >
                                                        <span className="material-symbols-outlined text-lg">shopping_cart</span>
                                                        Lista de Compra
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            promptRenameMenu(menu);
                                                            setOpenMenuOptionsId(null);
                                                        }}
                                                        className="w-full px-2 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 flex items-center justify-center gap-2"
                                                    >
                                                        <span className="material-symbols-outlined text-lg">edit</span>
                                                        Renombrar
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            confirmDeleteMenu(menu.id);
                                                            setOpenMenuOptionsId(null);
                                                        }}
                                                        className="w-full px-2 py-2 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 flex items-center justify-center gap-2 border-t border-slate-100 dark:border-white/5"
                                                    >
                                                        <span className="material-symbols-outlined text-lg">delete</span>
                                                        Eliminar
                                                    </button>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>

                                {/* Mini Grid Snapshot (Always visible) */}
                                <div className="opacity-80 scale-95 origin-left mb-2 pointer-events-none">
                                    {renderProgressGrid(menu.meals, menu.goals)}
                                </div>

                                {/* Expanded Detail */}
                                <AnimatePresence>
                                    {expandedMenuId === menu.id && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden border-t border-slate-200 dark:border-white/10 pt-4 mt-2"
                                        >
                                            {renderMealList(menu.meals, true, false, true, true, { type: 'menu', menuId: menu.id })}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {dragOverMenuId === menu.id && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-emerald-500/10 rounded-2xl pointer-events-none z-20">
                                        <div className="bg-white dark:bg-slate-900 text-emerald-600 px-4 py-2 rounded-full font-bold shadow-xl flex items-center gap-2">
                                            <span className="material-symbols-outlined">add_circle</span>
                                            Soltar para Copiar
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* MODALS - PORTALED */}
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
                    {modal.isOpen && (
                        <ConfirmModal
                            isOpen={modal.isOpen}
                            title={modal.title}
                            message={modal.message}
                            onConfirm={modal.onConfirm}
                            onCancel={closeModal}
                            isDestructive={modal.isDestructive}
                        />
                    )}
                    {nameModal && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-sm shadow-xl">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Nombre del Menú</h3>
                                <input
                                    autoFocus
                                    type="text"
                                    value={nameModal.currentName}
                                    onChange={(e) => setNameModal(prev => prev ? { ...prev, currentName: e.target.value } : null)}
                                    className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 mb-6 font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="Ej: Lunes Saludable"
                                />
                                <div className="flex gap-3">
                                    <button onClick={closeNameModal} className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500 font-bold">Cancelar</button>
                                    <button onClick={() => nameModal.onSave(nameModal.currentName)} className="flex-1 py-3 rounded-xl bg-primary text-slate-900 font-bold shadow-lg shadow-primary/20">Guardar</button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                    {shoppingListContext && (
                        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                            <motion.div
                                initial={{ y: 100, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 100, opacity: 0 }}
                                className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-md shadow-2xl max-h-[85vh] flex flex-col"
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                                            <span className="material-symbols-outlined text-emerald-500">shopping_cart</span>
                                            Lista de Compra
                                        </h3>
                                        <p className="text-sm font-medium text-slate-500">{shoppingListContext.title}</p>
                                    </div>
                                    <button onClick={() => setShoppingListContext(null)} className="p-2 bg-slate-100 dark:bg-white/5 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">
                                        <span className="material-symbols-outlined text-slate-500">close</span>
                                    </button>
                                </div>

                                <div className="flex-1 overflow-y-auto pr-2 space-y-6">
                                    {Object.values(getShoppingList(shoppingListContext.menus)).map((group: any) => (
                                        <div key={group.title}>
                                            <h4 className="font-bold text-xs uppercase tracking-wider mb-2 flex items-center gap-2" style={{ color: group.color === 'red' ? '#F87171' : group.color === 'green' ? '#34D399' : group.color === 'orange' ? '#FB923C' : group.color === 'yellow' ? '#FACC15' : '#C084FC' }}>
                                                <span className="size-2 rounded-full" style={{ backgroundColor: 'currentColor' }} />
                                                {group.title}
                                            </h4>
                                            <div className="space-y-2">
                                                {Object.entries(group.items).map(([name, count]: [string, any]) => (
                                                    <div key={name} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5">
                                                        <div className="flex items-center gap-3">
                                                            <div className="size-5 rounded-md border-2 border-slate-300 dark:border-slate-600" />
                                                            <span className="font-medium text-slate-700 dark:text-slate-300">{name}</span>
                                                        </div>
                                                        {count > 1 && <span className="bg-white dark:bg-black/20 text-xs font-bold px-2 py-1 rounded-lg text-slate-500">x{count}</span>}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                    {Object.keys(getShoppingList(shoppingListContext.menus)).length === 0 && (
                                        <div className="text-center py-10 opacity-50">
                                            <span className="material-symbols-outlined text-4xl mb-2">remove_shopping_cart</span>
                                            <p>No hay ingredientes en estos menús.</p>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5">
                                    <button
                                        onClick={copyShoppingList}
                                        className="w-full py-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-lg shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform"
                                    >
                                        <span className="material-symbols-outlined">content_copy</span>
                                        Copiar Lista
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                    {copyModal.isOpen && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-sm shadow-xl"
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Copiar Comida a...</h3>
                                    <button onClick={closeCopyModal} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                                        <span className="material-symbols-outlined">close</span>
                                    </button>
                                </div>
                                <p className="text-sm text-slate-500 mb-6 font-medium">Selecciona un menú para añadir <span className="text-slate-800 dark:text-white font-bold">"{copyModal.mealToCopy?.name}"</span></p>

                                <div className="space-y-2 max-h-[50vh] overflow-y-auto">
                                    {savedMenus.length === 0 ? (
                                        <div className="text-center py-4 text-slate-400 border-2 border-dashed border-slate-100 dark:border-white/10 rounded-xl">
                                            No hay menús disponibles.
                                        </div>
                                    ) : (
                                        savedMenus.map(menu => (
                                            <button
                                                key={menu.id}
                                                onClick={() => handleCopyMealToMenu(menu.id)}
                                                className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-white/5 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 border border-slate-100 dark:border-white/10 rounded-xl transition-all group"
                                            >
                                                <span className="font-bold text-slate-700 dark:text-slate-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-400">{menu.name}</span>
                                                <span className="material-symbols-outlined text-slate-300 group-hover:text-emerald-500">arrow_forward</span>
                                            </button>
                                        ))
                                    )}
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
