/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#D52B1E',
        secondary: '#FECB00',
        'theme-bg': 'var(--bg-primary)',
        'theme-text': 'var(--text-primary)',
      },
      fontFamily: {
        'title': ['Arial', 'sans-serif'],
        'subtitle': ['Times New Roman', 'serif'],
        'body': ['Arial', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

