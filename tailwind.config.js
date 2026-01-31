export default {
    content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
    darkMode: "media",
    theme: {
        extend: {
            fontFamily: {
                sans: ['"Space Grotesk"', '"Segoe UI"', "sans-serif"],
                display: ['"Fraunces"', '"Times New Roman"', "serif"],
            },
            keyframes: {
                "fade-up": {
                    "0%": { opacity: "0", transform: "translateY(8px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                "float-in": {
                    "0%": { opacity: "0", transform: "translateY(12px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
            },
            animation: {
                "fade-up": "fade-up 400ms ease forwards",
                "float-in": "float-in 450ms ease",
            },
        },
    },
    plugins: [],
}
