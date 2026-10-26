import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#090d16",
        surface: "#0f172a",
        card: "#1e293b",
        border: "#334155",
        primary: {
          DEFAULT: "#6366f1", // Indigo
          hover: "#4f46e5",
          foreground: "#ffffff",
        },
        emergency: {
          DEFAULT: "#ef4444", // Red
          hover: "#dc2626",
          subtle: "rgba(239, 68, 68, 0.12)",
        },
        success: "#10b981",
        warning: "#f59e0b",
      },
    },
  },
  plugins: [],
};

export default config;
