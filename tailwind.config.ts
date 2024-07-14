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
        "border-color": "var(--border)",
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
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        success: {
          DEFAULT: "var(--success)",
          foreground: "var(--success-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
      },
      fontFamily: {
        KohinoorBangla: ["KohinoorBangla", "Nunito", "Arial"],
        siliguri: ["Hind Siliguri", "Nunito", "Arial"],
        mono: ["Fira Code", "techdiary-bangla", "monospace"],
        boshonto: ["Boshonto", "Kohinoor Bangla"],
      },
      zIndex: {
        "-1": "-1",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
