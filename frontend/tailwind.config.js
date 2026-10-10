/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f2f7f4',
          100: '#e0efe6',
          200: '#c2dfcf',
          300: '#9ac8b0',
          400: '#6ea98e',
          500: '#4e8d72',
          600: '#3e705b',
          700: '#335a4a',
          800: '#2b4a3e',
          900: '#243d34',
        },
        cream: {
          50: '#fdfbf7',
          100: '#fbf5eb',
          200: '#f5ead2',
          300: '#eedab2',
          400: '#e4c489',
          500: '#daae66',
        }
      }
    },
  },
  plugins: [],
}
