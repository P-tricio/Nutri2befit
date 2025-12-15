/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "primary": "#2bee79",
                "background-light": "#f6f8f7",
                "background-dark": "#102217",
                "card-dark": "#1a3526",
                // Custom macro colors based on user request
                "macro-protein": "#E07A5F", // Terracotta
                "macro-veg": "#81B29A",     // Leaf Green
                "macro-carb": "#F2CC8F",    // Orange/Yellow
                "macro-fat": "#3D405B",     // Blue/Gold (using a nice blue-grey, or stick to reference blue)
            },
            fontFamily: {
                "display": ["Montserrat", "sans-serif"],
                "body": ["Roboto", "sans-serif"],
            },
            borderRadius: {
                "lg": "2rem",
                "xl": "3rem",
            }
        },
    },
    plugins: [],
}
