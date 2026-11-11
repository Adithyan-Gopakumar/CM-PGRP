/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        kerala: {
          dark: '#034526',
          primary: '#056839',
          light: '#0a8a4e',
          accent: '#d97706',
          gold: '#f59e0b',
          surface: '#f8fafc',
          navy: '#0f172a'
        }
      }
    },
  },
  plugins: [],
}
