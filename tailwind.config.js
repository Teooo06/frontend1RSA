/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}', // Includi tutti i file sorgente di React
  ],
  darkMode: 'class', // Enable dark mode using class strategy
  theme: {
    extend: {
      colors: {
        // Define custom colors for dark mode if needed
        darkBg: '#1a1a1a',
        darkCard: '#2d2d2d',
        darkBorder: '#444'
      }
    },
  },
  plugins: [],
}

