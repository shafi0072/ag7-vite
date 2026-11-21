import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0a0a0a",
        surface: "#111111",
        "surface-hover": "#1a1a1a",
        accent: "#e8612a",
        "text-primary": "#ffffff",
        "text-secondary": "#6b6b6b",
        border: "#222222",
        "sidebar-bg": "#0d0d0d",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      borderRadius: {
        card: "16px",
        btn: "12px",
      },
    },
  },
  plugins: [],
};
export default config;
