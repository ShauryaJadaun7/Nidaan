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
        background: "var(--background)",
        foreground: "var(--foreground)",
        clinical: {
            50: '#f8fafc',
            100: '#f1f5f9',
            DEFAULT: '#0f766e',
            dark: '#115e59',
        },
        accent: {
            DEFAULT: '#059669',
            light: '#d1fae5',
        },
        alert: {
            DEFAULT: '#e11d48',
            light: '#ffe4e6',
        }
      },
      fontFamily: {
        sans: ['var(--font-dm-sans)'],
        heading: ['var(--font-sora)'],
      }
    },
  },
  plugins: [],
};
export default config;
