/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mythic: {
          dark: '#0B0F19',
          card: '#111827',
          gold: '#F59E0B',
          goldLight: '#FDE68A',
          saffron: '#EA580C',
          royal: '#1E3A8A'
        }
      },
      fontFamily: {
        serif: ['Cinzel', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        devanagari: ['"Noto Sans Devanagari"', 'sans-serif']
      }
    },
  },
  plugins: [],
}
