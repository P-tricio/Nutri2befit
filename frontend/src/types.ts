export type SelectionDetail = {
    count: number;
    ingredients: string[];
};

export type Meal = {
    id: string;
    name: string;
    description?: string;
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
    description?: string;
    meals: Meal[];
    goals: Record<string, number>;
    createdAt: number;
};
