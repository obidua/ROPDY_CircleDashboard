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
        admin: {
          gold: {
            50: '#FFF9E5',
            100: '#FFF2CC',
            200: '#FFE699',
            300: '#FFD966',
            400: '#FFCD33',
            500: '#FFC000',
            600: '#CC9A00',
            700: '#997300',
            800: '#664D00',
            900: '#332600',
          },
          'new-green': '#03FF00',
          'parrot-green': '#12AD2B',
          'cyan': {
            DEFAULT: '#0003DA',
            dark: '#00FEFF'
          },
          'brown': 'rgba(215, 204, 200, 0.3)'
        },
      },
    },
  },
  plugins: [],
}