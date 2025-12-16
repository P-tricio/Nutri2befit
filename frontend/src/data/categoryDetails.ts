export type Targets = {
    protein: number;
    carbs: number;
    fats: number;
    veggies: number;
    fruit: number;
    [key: string]: number; // Allow extensibility
};

export type CategoryDetail = {
    title: string;
    subtitle: string;
    description: string;
    color: string;
    icon: string;
    borderColor: string;
    image: string;
    portionInfo?: {
        metric: string;
        icon: string;
        description: string;
    };
    groups: {
        title: string;
        items: string[];
        metric: string; // New field for specific portion guide
    }[];
};

export const CATEGORY_DETAILS: Record<string, CategoryDetail> = {
    protein: {
        title: 'food.protein.title', subtitle: 'category_details.protein.subtitle', color: 'text-red-500',
        icon: 'restaurant', borderColor: 'border-red-500/30',
        description: 'category_details.protein.desc',
        image: '/protein_category.png',
        portionInfo: { metric: 'category_details.protein.portion.metric', icon: 'back_hand', description: 'category_details.protein.portion.desc' },
        groups: [
            { title: 'Carne Blanca', items: ['Pollo', 'Pavo', 'Conejo'], metric: '📏 1 Palma' },
            { title: 'Carne Roja', items: ['Ternera', 'Cerdo', 'Vísceras'], metric: '📏 1 Palma' },
            { title: 'Pescados', items: ['Merluza', 'Salmón', 'Atún'], metric: '📏 1 Palma' },
            { title: 'Moluscos', items: ['Gambas', 'Pulpo', 'Mejillones'], metric: '📏 1 Palma' },
            { title: 'Lácteos 0% y Huevos', items: ['Q. Fresco', 'Huevo', 'Claras'], metric: '📏 2 Huevos / 1 Taza' },
            { title: 'Veggie', items: ['Tofu', 'Seitán', 'Legumbre'], metric: '📏 1 Palma' }
        ]
    },
    veg: {
        title: 'food.color.title', subtitle: 'category_details.veg.subtitle', color: 'text-emerald-500',
        icon: 'nutrition', borderColor: 'border-emerald-500/30',
        description: 'category_details.veg.desc',
        image: '/vegetable_category.png',
        portionInfo: { metric: 'category_details.veg.portion.metric', icon: 'nest_eco_leaf', description: 'category_details.veg.portion.desc' },
        groups: [
            { title: 'Hojas', items: ['Espinacas', 'Lechuga', 'Rúcula'], metric: '📏 Libre / 2 Manos' },
            { title: 'Crucíferas', items: ['Brócoli', 'Coliflor', 'Repollo'], metric: '📏 1 Puño / Libre' },
            { title: 'Colores', items: ['Pimientos', 'Tomate', 'Setas'], metric: '📏 Libre / 1 Taza' },
            { title: 'Hongos', items: ['Champiñones', 'Setas'], metric: '📏 Libre' }
        ]
    },
    carb: {
        title: 'food.carbs.title', subtitle: 'category_details.carb.subtitle', color: 'text-orange-500',
        icon: 'bolt', borderColor: 'border-orange-500/30',
        description: 'category_details.carb.desc',
        image: '/carbohydrate_category.png',
        portionInfo: { metric: 'category_details.carb.portion.metric', icon: 'sports_mma', description: 'category_details.carb.portion.desc' },
        groups: [
            { title: 'Tubérculos', items: ['Patata', 'Boniato', 'Yuca'], metric: '📏 1 Puño cerrado' },
            { title: 'Granos', items: ['Arroz', 'Pasta', 'Avena'], metric: '📏 1 Mano en cuenco' },
            { title: 'Legumbres', items: ['Lentejas', 'Garbanzos'], metric: '📏 1 Mano en cuenco' },
            { title: 'Frutas', items: ['Fresas', 'Plátano', 'Cítricos'], metric: '📏 1 Pieza / Taza' }
        ]
    },
    fat: {
        title: 'food.fats.title', subtitle: 'category_details.fat.subtitle', color: 'text-yellow-500',
        icon: 'water_drop', borderColor: 'border-yellow-500/30',
        description: 'category_details.fat.desc',
        image: '/fat_category.png',
        portionInfo: { metric: 'category_details.fat.portion.metric', icon: 'thumb_up', description: 'category_details.fat.portion.desc' },
        groups: [
            { title: 'Aceites', items: ['AOVE', 'Coco', 'Ghee'], metric: '📏 1 Cda. Sopera' },
            { title: 'Frutos Secos', items: ['Nueces', 'Almendras'], metric: '📏 1 Pulgar / Puñadito' },
            { title: 'Mantequillas', items: ['Cacahuete', 'Almendra'], metric: '📏 1 Pulgar' },
            { title: 'Otros', items: ['Aguacate', 'Aceitunas', 'Choco'], metric: '📏 1/2 Pieza / 1 Onza' }
        ]
    }
};
