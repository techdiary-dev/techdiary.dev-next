import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class", '[data-mantine-color-scheme="dark"]'],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: { "reverse-spin": "reverse-spin 1s linear infinite" },
      keyframes: { "reverse-spin": { from: { transform: "rotate(360deg)" } } },
      colors: {
        background: "var(--background)",
        forground: {
          DEFAULT: "var(--forground)",
          muted: "var(--forgroun-muted)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
          variant: "var(--primary-variant)",
        },
        light: "var(--theme-light)",
        surface: "var(--theme-surface)",
        "light-gray": "var(--light-gray)",
        "text-gray": "var(--text-gray)",
        "text-muted": "var(--text-muted)",
        "card-header": "var(--card-header)",
        neutral: {
          primary: "var(--neutral-primary)",
          secondary: "var(--neutral-secondary)",
          muted: "var(--neutral-muted)",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
