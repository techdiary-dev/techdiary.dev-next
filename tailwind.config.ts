import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,jsx,ts,tsx,html}"],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#F5F6FF",
          100: "#E6E9FF",
          200: "#CCD4FF",
          300: "#AEBAFE",
          400: "#8A9CFE",
          500: "#768BFE",
          600: "#627AFE",
          700: "#4964FD",
          800: "#2646FD",
          900: "#0221D4",
          950: "#011898",
        },
        secondary: "#FDF9F3",
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
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
