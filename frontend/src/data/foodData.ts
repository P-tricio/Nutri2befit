export type SubItem = {
    id: string;
    name: string;
};

export type GroupItem = {
    id: string;
    name: string;
    image: string;
    description: string;
    portionMetric?: string; // New field for specific portion guide
    subItems: string[]; // List of specific ingredients in this group
};

export type Category = {
    id: string;
    title: string;
    subtitle: string;
    color: 'red' | 'green' | 'orange' | 'yellow' | 'purple';
    allowMultiple: boolean;
    items: GroupItem[];
};

export const DATA: Category[] = [
    {
        id: 'protein', title: 'La Proteína', subtitle: 'Construcción', color: 'red', allowMultiple: true,
        items: [
            {
                id: 'meat', name: 'Carnes', description: 'Pollo, Ternera, Cerdo...',
                image: '/sub_prot_meat.png',
                portionMetric: '📏 1 Palma',
                subItems: ['Pollo', 'Pavo', 'Conejo', 'Ternera', 'Cerdo sin grasa', 'Hamburguesa magra', 'Vísceras']
            },
            {
                id: 'fish', name: 'Pescados', description: 'Merluza, Salmón, Atún...',
                image: '/sub_prot_fish.png',
                portionMetric: '📏 1 Palma',
                subItems: ['Merluza', 'Bacalao', 'Salmón', 'Atún', 'Caballa', 'Jurel', 'Sardinas', 'Pescado blanco']
            },
            {
                id: 'seafood', name: 'Moluscos', description: 'Gambas, Calamar, Mejillones...',
                image: '/sub_prot_seafood.png',
                portionMetric: '📏 1 Palma',
                subItems: ['Gambas', 'Calamar', 'Almejas', 'Mejillones']
            },
            {
                id: 'dairy_zero', name: 'Lácteos 0% y Huevos', description: 'Quesos 0%, Suero, Huevos...',
                image: '/sub_prot_dairy.png',
                portionMetric: '📏 2 Huevos / 1 Taza',
                subItems: ['Huevos', 'Claras', 'Queso Fresco 0%', 'Queso Batido 0%', 'Yogur Griego', 'Kefir', 'Suero de proteína', 'Requesón']
            },
            {
                id: 'veggie_prot', name: 'Veggie', description: 'Tofu, Soja, Edamame...',
                image: '/sub_prot_veggie.png',
                portionMetric: '📏 1 Palma',
                subItems: ['Tofu', 'Soja Texturizada', 'Edamame', 'Seitán', 'Tempeh', 'Legumbre (Proteína)']
            }
        ]
    },
    {
        id: 'color', title: 'La Verdura', subtitle: 'Fibra y Salud', color: 'green', allowMultiple: true,
        items: [
            {
                id: 'leaves', name: 'Hojas', description: 'Espinaca, Rúcula, Kale...',
                image: '/sub_veg_leaves.png',
                portionMetric: '📏 Libre / 2 Manos',
                subItems: ['Espinacas', 'Canónigos', 'Rúcula', 'Acelgas', 'Kale', 'Endivias', 'Col', 'Lechuga']
            },
            {
                id: 'cruciferous', name: 'Crucíferas', description: 'Brócoli, Coliflor...',
                image: '/sub_veg_cruciferous.png',
                portionMetric: '📏 1 Puño / Libre',
                subItems: ['Brócoli', 'Coliflor', 'Repollo', 'Lombarda', 'Col de Bruselas']
            },
            {
                id: 'green_veg', name: 'Verdes', description: 'Espárragos, Apio, Pepino...',
                image: '/sub_veg_green.png',
                portionMetric: '📏 Libre / 2 Manos',
                subItems: ['Espárragos', 'Apio', 'Pepino', 'Habas verdes', 'Calabacín', 'Alcachofa']
            },
            {
                id: 'colors', name: 'Colores', description: 'Tomate, Zanahoria, Setas...',
                image: '/sub_veg_colors.png',
                portionMetric: '📏 Libre / 1 Puño',
                subItems: ['Tomate', 'Pimiento', 'Zanahoria', 'Calabaza', 'Berenjena', 'Cebolla', 'Setas']
            }
        ]
    },
    {
        id: 'carbs', title: 'El Carbohidrato', subtitle: 'Energía Rápida', color: 'orange', allowMultiple: true,
        items: [
            {
                id: 'tubers', name: 'Tubérculos', description: 'Patata, Boniato...',
                image: '/sub_carb_tubers.png',
                portionMetric: '📏 1 Puño cerrado',
                subItems: ['Patata', 'Boniato', 'Gnocchi', 'Yuca']
            },
            {
                id: 'grains', name: 'Granos', description: 'Arroz, Avena, Pasta...',
                image: '/sub_carb_grains.png',
                portionMetric: '📏 1 Mano en cuenco',
                subItems: ['Arroz', 'Avena', 'Pasta', 'Quinoa', 'Pan Wasa', 'Tortitas Arroz/Maíz']
            },
            {
                id: 'legumes', name: 'Legumbres', description: 'Lentejas, Alubias, Guisantes',
                image: '/sub_carb_legumes.png',
                portionMetric: '📏 2 Manos en cuenco',
                subItems: ['Lentejas', 'Alubias', 'Guisantes', 'Garbanzos', 'Soja']
            },
            {
                id: 'fruit', name: 'Frutas', description: 'Fresas, Melón, Plátano...',
                image: '/sub_carb_fruit.png',
                portionMetric: '📏 1 Pieza / Taza',
                subItems: ['Fresas/Frambuesas', 'Arándanos/Moras', 'Melón/Sandía', 'Manzana/Pera', 'Plátano', 'Uvas', 'Melocotón', 'Kiwi', 'Naranja']
            }
        ]
    },
    {
        id: 'fats', title: 'La Grasa', subtitle: 'Salud Hormonal', color: 'yellow', allowMultiple: true,
        items: [
            {
                id: 'oils', name: 'Aceites y Mantequilla', description: 'Oliva, Coco, Ghee...',
                image: '/sub_fat_oils.png',
                portionMetric: '📏 1 Cda. Sopera',
                subItems: ['Aceite Oliva V.E.', 'Aceite Coco V.E.', 'Mantequilla', 'Ghee']
            },
            {
                id: 'fruit_fat', name: 'Frutal', description: 'Aguacate, Aceitunas...',
                image: '/sub_fat_fruit.png',
                portionMetric: '📏 1/2 Pieza / Puñado',
                subItems: ['Aguacate', 'Aceitunas', 'Coco natural']
            },
            {
                id: 'nuts', name: 'Frutos Secos', description: 'Nueces, Almendras, Pipas...',
                image: '/sub_fat_nuts.png',
                portionMetric: '📏 1 Pulgar / Puñadito',
                subItems: ['Nueces', 'Almendras', 'Avellanas', 'Pistachos', 'Anacardos', 'Nueces Macadamia', 'Nueces Pecanas', 'Pipas Girasol', 'Pipas Calabaza']
            },
            {
                id: 'creamy', name: 'Otros', description: 'Queso, Chocolate...',
                image: '/sub_fat_other.png',
                portionMetric: '📏 1 Onza / Pulgar',
                subItems: ['Queso curado', 'Chocolate >85%', 'Crema Frutos Secos']
            }
        ]
    },
    {
        id: 'magic', title: 'La Magia', subtitle: 'Sabor', color: 'purple', allowMultiple: true,
        items: [
            {
                id: 'spices', name: 'Especias', description: 'Cúrcuma, Orégano, Canela...',
                image: '/sub_magic_spices.png',
                portionMetric: '🧂 Al gusto',
                subItems: ['Cúrcuma', 'Chile', 'Jengibre', 'Pimienta', 'Azafrán', 'Orégano', 'Perejil', 'Nuez Moscada', 'Comino', 'Canela', 'Ajo', 'Sésamo']
            },
            {
                id: 'seasoning', name: 'Condimentos', description: 'Sal, Vinagre, Limón...',
                image: '/sub_magic_seasoning.png',
                portionMetric: '🥄 Con moderación',
                subItems: ['Sal marina', 'Vinagre de vino', 'Vinagre de manzana', 'Limón', 'Mostaza']
            },
            {
                id: 'drinks', name: 'Bebidas', description: 'Agua, Té, Café...',
                image: '/sub_magic_drinks.png',
                portionMetric: '💧 A demanda',
                subItems: ['Agua', 'Té sin azúcar', 'Café solo', 'Refresco Zero']
            }
        ]
    },
];
