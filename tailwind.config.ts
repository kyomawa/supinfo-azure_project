import type { Config } from "tailwindcss";
import TailwindCssAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: "400px",
        "1280px": "1280px",
        "3xl": "1700px",
        "2k": "1921px",
        "3k": "2561px",
        "4k": "3073px",
        "4.5k": "3458px",
        "5k": "3841px",
        "6k": "5121px",
        "8k": "6017px",
        "10k": "7681px",
        "12k": "10241px",
      },
      colors: {
        primary: {
          "50": "#fef2f4",
          "100": "#fde6e9",
          "200": "#fbd0d9",
          "300": "#f7aab9",
          "400": "#f27a93",
          "500": "#e63f66",
          "600": "#d42a5b",
          "700": "#b21e4b",
          "800": "#951c45",
          "900": "#801b40",
          "950": "#470a1f",
        },
      },
      fontFamily: {
        satoshi: ["var(--font-satoshi)"],
      },
    },
  },
  plugins: [TailwindCssAnimate],
} satisfies Config;
