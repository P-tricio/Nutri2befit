export const SEED_MENUS = [
    {
        name: "Día Ejemplo: Equilibrado",
        description: "Un menú balanceado ideal para mantener niveles de energía constantes durante todo el día. Incluye fuentes de proteína magra, carbohidratos complejos y grasas saludables.",
        goals: { protein: 4, color: 4, carbs: 4, fats: 3 },
        meals: [
            {
                id: "seed_1_breakfast",
                name: "Desayuno Energético",
                timestamp: 1700000000000,
                description: "Empezando el día con fuerza y fibra.",
                selection: {
                    carbs: {
                        "grains": { count: 2, ingredients: ["Pan Integral 100%", "Pan Integral 100%"] }
                    },
                    protein: {
                        "dairy_zero": { count: 1, ingredients: ["Huevo Cocido"] }
                    },
                    fats: {
                        "fruit_fat": { count: 1, ingredients: ["Aguacate (1/4)"] }
                    }
                }
            },
            {
                id: "seed_1_lunch",
                name: "Almuerzo Completo",
                timestamp: 1700000000001,
                description: "Comida principal con todos los macronutrientes cubiertos.",
                selection: {
                    protein: {
                        "meat": { count: 2, ingredients: ["Pechuga de Pollo", "Pechuga de Pollo"] }
                    },
                    color: {
                        "leaves": { count: 1, ingredients: ["Mezcla de Lechugas"] },
                        "colors": { count: 1, ingredients: ["Tomate Cherry"] }
                    },
                    carbs: {
                        "grains": { count: 1, ingredients: ["Arroz Integral"] }
                    },
                    fats: {
                        "oils": { count: 1, ingredients: ["Aceite de Oliva Virgen"] }
                    }
                }
            },
            {
                id: "seed_1_dinner",
                name: "Cena Ligera",
                timestamp: 1700000000002,
                description: "Fácil de digerir para dormir mejor.",
                selection: {
                    protein: { "fish": { count: 1, ingredients: ["Merluza Plancha"] } },
                    color: { "green_veg": { count: 1, ingredients: ["Calabacín Asado"] }, "colors": { count: 1, ingredients: ["Berenjena"] } },
                }
            }
        ]
    },
    {
        name: "Día Ejemplo: Bajo en Carbos",
        description: "Focus en proteínas y vegetales para días de menor actividad física o descanso.",
        goals: { protein: 5, color: 5, carbs: 2, fats: 4 },
        meals: [
            {
                id: "seed_2_breakfast",
                name: "Desayuno Proteico",
                timestamp: 1700000000002,
                description: "Alto contenido proteico sin harinas.",
                selection: {
                    protein: { "dairy_zero": { count: 1, ingredients: ["Yogur Griego"] } },
                    fats: { "nuts": { count: 1, ingredients: ["Nueces (30g)"] } }
                }
            },
            {
                id: "seed_2_lunch",
                name: "Almuerzo Verde",
                timestamp: 1700000000003,
                description: "Gran ensalada saciante.",
                selection: {
                    protein: { "fish": { count: 1, ingredients: ["Atún al natural"] }, "dairy_zero": { count: 1, ingredients: ["Huevo duro"] } },
                    color: { "leaves": { count: 1, ingredients: ["Espinacas"] }, "green_veg": { count: 1, ingredients: ["Pepino"] }, "colors": { count: 1, ingredients: ["Pimiento Rojo"] } },
                    fats: { "oils": { count: 1, ingredients: ["Aceite de Oliva"] }, "fruit_fat": { count: 1, ingredients: ["Aceitunas"] } }
                }
            },
            {
                id: "seed_2_dinner",
                name: "Cena de Recuperación",
                timestamp: 1700000000003,
                description: "Perfecta post-entreno ligero.",
                selection: {
                    protein: { "fish": { count: 2, ingredients: ["Salmón al horno", "Salmón al horno"] } },
                    color: { "green_veg": { count: 2, ingredients: ["Espárragos trigueros", "Champiñones"] } },
                    fats: { "fruit_fat": { count: 1, ingredients: ["Guacamole casero"] } }
                }
            }
        ]
    }
];
