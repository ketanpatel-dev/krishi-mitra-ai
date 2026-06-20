/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        krishi: {
          green: '#2d6a4f',
          light: '#52b788',
          yellow: '#fefae0',
          cream: '#fffef7',
          dark: '#1b4332',
        },
      },
      fontFamily: {
        sans: ['Segoe UI', 'system-ui', 'sans-serif'],
      },
      backdropBlur: {
        glass: '12px',
      },
    },
  },
  plugins: [],
}
