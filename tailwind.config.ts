// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // LUMINA Brand Colors
        ivory: '#FFFDF9',
        linen: '#F7F4EF',
        gold: {
          DEFAULT: '#B8956C',
          light: '#D4B896',
          dark: '#9A7B56',
        },
        charcoal: '#232323',
        'warm-gray': {
          DEFAULT: '#D6D0C7',
          dark: '#A8A29E',
          light: '#E8E4DD',
        },
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'brand': '12px',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(35, 35, 35, 0.07), 0 10px 20px -2px rgba(35, 35, 35, 0.04)',
        'hover': '0 10px 40px -10px rgba(35, 35, 35, 0.12)',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
    },
  },
  plugins: [],
}

export default config