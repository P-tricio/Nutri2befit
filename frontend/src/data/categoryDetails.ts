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
        title: 'La Proteína', subtitle: 'Construcción', color: 'text-red-500',
        icon: 'restaurant', borderColor: 'border-red-500/30',
        description: 'La base de tu estructura. Incluye carnes, pescados, mariscos, huevos y lácteos ricos en proteína.',
        image: '/protein_category.png',
        portionInfo: { metric: '1 Palma', icon: 'back_hand', description: 'Grosor y tamaño de la palma de tu mano (sin dedos).' },
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
        title: 'La Verdura', subtitle: 'Saciedad y Salud', color: 'text-emerald-500',
        icon: 'nutrition', borderColor: 'border-emerald-500/30',
        description: 'Fuente vital de fibra y micronutrientes. Aportan volumen a tus platos mejorando la digestión sin apenas calorías.',
        image: '/vegetable_category.png',
        portionInfo: { metric: 'Libre / 2 Manos', icon: 'nest_eco_leaf', description: 'Cantidad ilimitada. Mínimo dos manos juntas llenas.' },
        groups: [
            { title: 'Hojas', items: ['Espinacas', 'Lechuga', 'Rúcula'], metric: '📏 Libre / 2 Manos' },
            { title: 'Crucíferas', items: ['Brócoli', 'Coliflor', 'Repollo'], metric: '📏 1 Puño / Libre' },
            { title: 'Colores', items: ['Pimientos', 'Tomate', 'Setas'], metric: '📏 Libre / 1 Taza' },
            { title: 'Hongos', items: ['Champiñones', 'Setas'], metric: '📏 Libre' }
        ]
    },
    carb: {
        title: 'El Carbohidrato', subtitle: 'Gasolina', color: 'text-orange-500',
        icon: 'bolt', borderColor: 'border-orange-500/30',
        description: 'Tu combustible principal. Esenciales para rendir en los entrenamientos y recuperar la energía gastada.',
        image: '/carbohydrate_category.png',
        portionInfo: { metric: '1 Puño', icon: 'sports_mma', description: 'Varía según el tipo (puño, cuenco...).' },
        groups: [
            { title: 'Tubérculos', items: ['Patata', 'Boniato', 'Yuca'], metric: '📏 1 Puño cerrado' },
            { title: 'Granos', items: ['Arroz', 'Pasta', 'Avena'], metric: '📏 1 Mano en cuenco' },
            { title: 'Legumbres', items: ['Lentejas', 'Garbanzos'], metric: '📏 1 Mano en cuenco' },
            { title: 'Frutas', items: ['Fresas', 'Plátano', 'Cítricos'], metric: '📏 1 Pieza / Taza' }
        ]
    },
    fat: {
        title: 'La Grasa', subtitle: 'Salud Hormonal', color: 'text-yellow-500',
        icon: 'water_drop', borderColor: 'border-yellow-500/30',
        description: 'Clave para tu entorno hormonal y absorción de nutrientes. Aportan sabor y una saciedad más duradera.',
        image: '/fat_category.png',
        portionInfo: { metric: '1 Pulgar', icon: 'thumb_up', description: 'Grasas densas (aceites, frutos secos).' },
        groups: [
            { title: 'Aceites', items: ['AOVE', 'Coco', 'Ghee'], metric: '📏 1 Cda. Sopera' },
            { title: 'Frutos Secos', items: ['Nueces', 'Almendras'], metric: '📏 1 Pulgar / Puñadito' },
            { title: 'Mantequillas', items: ['Cacahuete', 'Almendra'], metric: '📏 1 Pulgar' },
            { title: 'Otros', items: ['Aguacate', 'Aceitunas', 'Choco'], metric: '📏 1/2 Pieza / 1 Onza' }
        ]
    }
};
