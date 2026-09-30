/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#FDFDFD',
        surface: '#FFFFFF',
        // Softer, luminous, less saturated purples for Light Theme
        purple: {
          50: '#FAF7FE',
          100: '#F3EBFC',
          200: '#E6D8F8',
          300: '#D3BDF2',
          400: '#B896E8',
          500: '#9C70DD',
          600: '#844ECE',
          700: '#6F39B6',
          800: '#5C2D9B',
          900: '#48217D',
        },
        // Softer, luminous, less saturated pinks for Light Theme
        pink: {
          50: '#FDF7FA',
          100: '#FAECF5',
          200: '#F5D7EB',
          300: '#EEB5DB',
          400: '#E38DC5',
          500: '#D363AA',
          600: '#BE4390',
          700: '#A43276',
        },
      },
    },
  },
  plugins: [],
};
