import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0f0f0f",
        secondary: "#1a1a1a",
        "secondary-light": "#252525",
        gold: {
          DEFAULT: "#d4af37",
          light: "#facc15",
          dark: "#b8860b",
        },
        accent: {
          red: "#ef4444",
          green: "#22c55e",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "slide-up": "slide-up 0.3s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        ticker: "ticker 20s linear infinite",
        spin: "spin 4s linear infinite",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": {
            boxShadow: "0 0 20px rgba(212, 175, 55, 0.4)",
          },
          "50%": {
            boxShadow: "0 0 40px rgba(212, 175, 55, 0.8)",
          },
        },
        "slide-up": {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      boxShadow: {
        glow: "0 0 20px rgba(212, 175, 55, 0.4)",
        "glow-lg": "0 0 40px rgba(212, 175, 55, 0.6)",
      },
    },
  },
  plugins: [],
};

export default config;
