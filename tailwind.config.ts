import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sora: ["Sora", "sans-serif"],
        inter: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      colors: {
        surface: {
          DEFAULT: "#09090b",
          dim: "#131315",
          container: "#201f22",
          "container-low": "#1c1b1d",
          "container-high": "#2a2a2c",
          "container-highest": "#353437",
          bright: "#39393b",
          glass: "rgba(24, 24, 27, 0.7)",
        },
        brand: {
          cyan: "#4cd7f6",
          "cyan-dim": "#06b6d4",
          violet: "#a78bfa",
          "violet-dim": "#4f319c",
          rose: "#f43f5e",
        },
        on: {
          surface: "#e5e1e4",
          "surface-variant": "#bcc9cd",
          "surface-muted": "rgba(229, 225, 228, 0.6)",
          primary: "#003640",
        },
        outline: {
          DEFAULT: "#869397",
          variant: "#3d494c",
        },
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        "glow-sm": "0 0 10px rgba(76, 215, 246, 0.15)",
        glow: "0 0 20px rgba(76, 215, 246, 0.25)",
        "glow-lg": "0 0 30px rgba(76, 215, 246, 0.35)",
        "glow-button": "0 0 20px rgba(76, 215, 246, 0.4)",
      },
      spacing: {
        "safe-top": "env(safe-area-inset-top, 0px)",
        "safe-bottom": "env(safe-area-inset-bottom, 0px)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite alternate",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "glow-pulse": {
          "0%": { boxShadow: "0 0 15px rgba(76, 215, 246, 0.2)" },
          "100%": { boxShadow: "0 0 25px rgba(76, 215, 246, 0.4)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;