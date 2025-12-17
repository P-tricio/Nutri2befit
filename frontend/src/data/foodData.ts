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
        id: 'protein', title: 'food.protein.title', subtitle: 'food.protein.subtitle', color: 'red', allowMultiple: true,
        items: [
            {
                id: 'meat', name: 'food.protein.items.meat.name', description: 'food.protein.items.meat.desc',
                image: '/sub_prot_meat.png',
                portionMetric: 'food.protein.items.meat.metric',
                subItems: [
                    'food.protein.items.meat.sub.chicken',
                    'food.protein.items.meat.sub.turkey',
                    'food.protein.items.meat.sub.rabbit',
                    'food.protein.items.meat.sub.veal',
                    'food.protein.items.meat.sub.pork',
                    'food.protein.items.meat.sub.burger',
                    'food.protein.items.meat.sub.offal'
                ]
            },
            {
                id: 'fish', name: 'food.protein.items.fish.name', description: 'food.protein.items.fish.desc',
                image: '/sub_prot_fish.png',
                portionMetric: 'food.protein.items.fish.metric',
                subItems: [
                    'food.protein.items.fish.sub.hake',
                    'food.protein.items.fish.sub.cod',
                    'food.protein.items.fish.sub.salmon',
                    'food.protein.items.fish.sub.tuna',
                    'food.protein.items.fish.sub.mackerel',
                    'food.protein.items.fish.sub.hosmemackerel',
                    'food.protein.items.fish.sub.sardines',
                    'food.protein.items.fish.sub.whitefish'
                ]
            },
            {
                id: 'seafood', name: 'food.protein.items.seafood.name', description: 'food.protein.items.seafood.desc',
                image: '/sub_prot_seafood.png',
                portionMetric: 'food.protein.items.seafood.metric',
                subItems: [
                    'food.protein.items.seafood.sub.shrimp',
                    'food.protein.items.seafood.sub.squid',
                    'food.protein.items.seafood.sub.clams',
                    'food.protein.items.seafood.sub.mussels'
                ]
            },
            {
                id: 'dairy_zero', name: 'food.protein.items.dairy_zero.name', description: 'food.protein.items.dairy_zero.desc',
                image: '/sub_prot_dairy.png',
                portionMetric: 'food.protein.items.dairy_zero.metric',
                subItems: [
                    'food.protein.items.dairy_zero.sub.eggs',
                    'food.protein.items.dairy_zero.sub.whites',
                    'food.protein.items.dairy_zero.sub.fresh_cheese',
                    'food.protein.items.dairy_zero.sub.beaten_cheese',
                    'food.protein.items.dairy_zero.sub.greek_yogurt',
                    'food.protein.items.dairy_zero.sub.kefir',
                    'food.protein.items.dairy_zero.sub.protein_whey',
                    'food.protein.items.dairy_zero.sub.cottage'
                ]
            },
            {
                id: 'veggie_prot', name: 'food.protein.items.veggie_prot.name', description: 'food.protein.items.veggie_prot.desc',
                image: '/sub_prot_veggie.png',
                portionMetric: 'food.protein.items.veggie_prot.metric',
                subItems: [
                    'food.protein.items.veggie_prot.sub.tofu',
                    'food.protein.items.veggie_prot.sub.textured_soy',
                    'food.protein.items.veggie_prot.sub.edamame',
                    'food.protein.items.veggie_prot.sub.seitan',
                    'food.protein.items.veggie_prot.sub.tempeh',
                    'food.protein.items.veggie_prot.sub.legumes'
                ]
            }
        ]
    },
    {
        id: 'color', title: 'food.color.title', subtitle: 'food.color.subtitle', color: 'green', allowMultiple: true,
        items: [
            {
                id: 'leaves', name: 'food.color.items.leaves.name', description: 'food.color.items.leaves.desc',
                image: '/sub_veg_leaves.png',
                portionMetric: 'food.color.items.leaves.metric',
                subItems: [
                    'food.color.items.leaves.sub.spinach',
                    'food.color.items.leaves.sub.lambs_lettuce',
                    'food.color.items.leaves.sub.arugula',
                    'food.color.items.leaves.sub.chard',
                    'food.color.items.leaves.sub.kale',
                    'food.color.items.leaves.sub.endive',
                    'food.color.items.leaves.sub.cabbage',
                    'food.color.items.leaves.sub.lettuce'
                ]
            },
            {
                id: 'cruciferous', name: 'food.color.items.cruciferous.name', description: 'food.color.items.cruciferous.desc',
                image: '/sub_veg_cruciferous.png',
                portionMetric: 'food.color.items.cruciferous.metric',
                subItems: [
                    'food.color.items.cruciferous.sub.broccoli',
                    'food.color.items.cruciferous.sub.cauliflower',
                    'food.color.items.cruciferous.sub.cabbage_re',
                    'food.color.items.cruciferous.sub.red_cabbage',
                    'food.color.items.cruciferous.sub.brussels'
                ]
            },
            {
                id: 'green_veg', name: 'food.color.items.green_veg.name', description: 'food.color.items.green_veg.desc',
                image: '/sub_veg_green.png',
                portionMetric: 'food.color.items.green_veg.metric',
                subItems: [
                    'food.color.items.green_veg.sub.asparagus',
                    'food.color.items.green_veg.sub.celery',
                    'food.color.items.green_veg.sub.cucumber',
                    'food.color.items.green_veg.sub.green_beans',
                    'food.color.items.green_veg.sub.zucchini',
                    'food.color.items.green_veg.sub.artichoke'
                ]
            },
            {
                id: 'colors', name: 'food.color.items.colors.name', description: 'food.color.items.colors.desc',
                image: '/sub_veg_colors.png',
                portionMetric: 'food.color.items.colors.metric',
                subItems: [
                    'food.color.items.colors.sub.tomato',
                    'food.color.items.colors.sub.pepper',
                    'food.color.items.colors.sub.carrot',
                    'food.color.items.colors.sub.pumpkin',
                    'food.color.items.colors.sub.eggplant',
                    'food.color.items.colors.sub.onion',
                    'food.color.items.colors.sub.mushrooms'
                ]
            }
        ]
    },
    {
        id: 'carbs', title: 'food.carbs.title', subtitle: 'food.carbs.subtitle', color: 'orange', allowMultiple: true,
        items: [
            {
                id: 'tubers', name: 'food.carbs.items.tubers.name', description: 'food.carbs.items.tubers.desc',
                image: '/sub_carb_tubers.png',
                portionMetric: 'food.carbs.items.tubers.metric',
                subItems: [
                    'food.carbs.items.tubers.sub.potato',
                    'food.carbs.items.tubers.sub.sweet_potato',
                    'food.carbs.items.tubers.sub.gnocchi',
                    'food.carbs.items.tubers.sub.yucca'
                ]
            },
            {
                id: 'grains', name: 'food.carbs.items.grains.name', description: 'food.carbs.items.grains.desc',
                image: '/sub_carb_grains.png',
                portionMetric: 'food.carbs.items.grains.metric',
                subItems: [
                    'food.carbs.items.grains.sub.rice',
                    'food.carbs.items.grains.sub.oats',
                    'food.carbs.items.grains.sub.pasta',
                    'food.carbs.items.grains.sub.quinoa',
                    'food.carbs.items.grains.sub.wasa_bread',
                    'food.carbs.items.grains.sub.rice_corn_cakes'
                ]
            },
            {
                id: 'legumes', name: 'food.carbs.items.legumes.name', description: 'food.carbs.items.legumes.desc',
                image: '/sub_carb_legumes.png',
                portionMetric: 'food.carbs.items.legumes.metric',
                subItems: [
                    'food.carbs.items.legumes.sub.lentils',
                    'food.carbs.items.legumes.sub.beans',
                    'food.carbs.items.legumes.sub.peas',
                    'food.carbs.items.legumes.sub.chickpeas',
                    'food.carbs.items.legumes.sub.soy'
                ]
            },
            {
                id: 'fruit', name: 'food.carbs.items.fruit.name', description: 'food.carbs.items.fruit.desc',
                image: '/sub_carb_fruit.png',
                portionMetric: 'food.carbs.items.fruit.metric',
                subItems: [
                    'food.carbs.items.fruit.sub.berries',
                    'food.carbs.items.fruit.sub.blueberries_blackberries',
                    'food.carbs.items.fruit.sub.melon_watermelon',
                    'food.carbs.items.fruit.sub.apple_pear',
                    'food.carbs.items.fruit.sub.banana',
                    'food.carbs.items.fruit.sub.grapes',
                    'food.carbs.items.fruit.sub.peach',
                    'food.carbs.items.fruit.sub.kiwi',
                    'food.carbs.items.fruit.sub.orange'
                ]
            }
        ]
    },
    {
        id: 'fats', title: 'food.fats.title', subtitle: 'food.fats.subtitle', color: 'yellow', allowMultiple: true,
        items: [
            {
                id: 'oils', name: 'food.fats.items.oils.name', description: 'food.fats.items.oils.desc',
                image: '/sub_fat_oils.png',
                portionMetric: 'food.fats.items.oils.metric',
                subItems: [
                    'food.fats.items.oils.sub.olive_oil',
                    'food.fats.items.oils.sub.coconut_oil',
                    'food.fats.items.oils.sub.butter',
                    'food.fats.items.oils.sub.ghee'
                ]
            },
            {
                id: 'fruit_fat', name: 'food.fats.items.fruit_fat.name', description: 'food.fats.items.fruit_fat.desc',
                image: '/sub_fat_fruit.png',
                portionMetric: 'food.fats.items.fruit_fat.metric',
                subItems: [
                    'food.fats.items.fruit_fat.sub.avocado',
                    'food.fats.items.fruit_fat.sub.olives',
                    'food.fats.items.fruit_fat.sub.coconut'
                ]
            },
            {
                id: 'nuts', name: 'food.fats.items.nuts.name', description: 'food.fats.items.nuts.desc',
                image: '/sub_fat_nuts.png',
                portionMetric: 'food.fats.items.nuts.metric',
                subItems: [
                    'food.fats.items.nuts.sub.walnuts',
                    'food.fats.items.nuts.sub.almonds',
                    'food.fats.items.nuts.sub.hazelnuts',
                    'food.fats.items.nuts.sub.pistachios',
                    'food.fats.items.nuts.sub.cashews',
                    'food.fats.items.nuts.sub.peanuts',
                    'food.fats.items.nuts.sub.seeds'
                ]
            },
            {
                id: 'creamy', name: 'food.fats.items.creamy.name', description: 'food.fats.items.creamy.desc',
                image: '/sub_fat_other.png',
                portionMetric: 'food.fats.items.creamy.metric',
                subItems: [
                    'food.fats.items.creamy.sub.cured_cheese',
                    'food.fats.items.creamy.sub.dark_chocolate_plus',
                    'food.fats.items.creamy.sub.nut_butter'
                ]
            }
        ]
    },
    {
        id: 'magic', title: 'food.magic.title', subtitle: 'food.magic.subtitle', color: 'purple', allowMultiple: true,
        items: [
            {
                id: 'spices', name: 'food.magic.items.spices.name', description: 'food.magic.items.spices.desc',
                image: '/sub_magic_spices.png',
                portionMetric: 'food.magic.items.spices.metric',
                subItems: [
                    'food.magic.items.spices.sub.turmeric',
                    'food.magic.items.spices.sub.chili',
                    'food.magic.items.spices.sub.ginger',
                    'food.magic.items.spices.sub.pepper',
                    'food.magic.items.spices.sub.saffron',
                    'food.magic.items.spices.sub.oregano',
                    'food.magic.items.spices.sub.parsley',
                    'food.magic.items.spices.sub.nutmeg',
                    'food.magic.items.spices.sub.cumin',
                    'food.magic.items.spices.sub.cinnamon',
                    'food.magic.items.spices.sub.garlic',
                    'food.magic.items.spices.sub.sesame'
                ]
            },
            {
                id: 'seasoning', name: 'food.magic.items.seasoning.name', description: 'food.magic.items.seasoning.desc',
                image: '/sub_magic_seasoning.png',
                portionMetric: 'food.magic.items.seasoning.metric',
                subItems: [
                    'food.magic.items.seasoning.sub.sea_salt',
                    'food.magic.items.seasoning.sub.wine_vinegar',
                    'food.magic.items.seasoning.sub.apple_cider_vinegar',
                    'food.magic.items.seasoning.sub.lemon',
                    'food.magic.items.seasoning.sub.mustard'
                ]
            },
            {
                id: 'drinks', name: 'food.magic.items.drinks.name', description: 'food.magic.items.drinks.desc',
                image: '/sub_magic_drinks.png',
                portionMetric: 'food.magic.items.drinks.metric',
                subItems: [
                    'food.magic.items.drinks.sub.water',
                    'food.magic.items.drinks.sub.tea',
                    'food.magic.items.drinks.sub.coffee',
                    'food.magic.items.drinks.sub.soda_zero'
                ]
            }
        ]
    },
];
