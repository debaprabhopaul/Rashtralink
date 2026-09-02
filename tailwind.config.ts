import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#FDFBF7",
        navy: {
          DEFAULT: "#081D34",
          light: "#102A45",
          dark: "#040F1D",
          card: "#0F172A",
          border: "#1E293B",
        },
        saffron: {
          DEFAULT: "#E85D04",
          hover: "#DC2F02",
          light: "#FFF1EB",
          dark: "#9D2200",
        },
        viksit: {
          DEFAULT: "#10B981",
          hover: "#059669",
          light: "#ECFDF5",
          dark: "#047857",
        },
        border: {
          light: "#F0ECE1",
          dark: "#1E293B",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
      keyframes: {
        "heart-pop": {
          "0%": { transform: "scale(0) rotate(-15deg)", opacity: "0" },
          "50%": { transform: "scale(1.3) rotate(0deg)", opacity: "1" },
          "70%": { transform: "scale(0.95)", opacity: "0.9" },
          "100%": { transform: "scale(1)", opacity: "0" },
        },
        "greeting-scale": {
          "0%": { transform: "scale(0.8)", opacity: "0" },
          "40%": { transform: "scale(1.05)", opacity: "1" },
          "80%": { transform: "scale(1)", opacity: "1" },
          "100%": { transform: "scale(0.95)", opacity: "0" },
        },
        "fade-in-up": {
          "0%": { transform: "translateY(12px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        "heart-pop": "heart-pop 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards",
        "greeting-scale": "greeting-scale 0.8s ease-in-out forwards",
        "fade-in-up": "fade-in-up 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
    },
  },
  plugins: [],
};

export default config;
