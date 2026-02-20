/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "#0a1a0f",
        foreground: "#f5f5f5",
        card: "#142218",
        "card-foreground": "#f5f5f5",
        primary: "#4ade80",
        "primary-foreground": "#0a1a0f",
        muted: "#2a3d30",
        "muted-foreground": "#9ca3af",
        border: "#2a3d30",
        destructive: "#ef4444",
        accent: "#1a2e20",
        "accent-foreground": "#f5f5f5",
        "macro-protein": "#3b82f6",
        "macro-carbs": "#eab308",
        "macro-fat": "#f43f5e",
      },
    },
  },
  plugins: [],
};
