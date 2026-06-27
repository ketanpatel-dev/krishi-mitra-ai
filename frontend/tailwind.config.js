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
        sans: ['Poppins', 'Noto Sans Devanagari', 'Segoe UI', 'system-ui', 'sans-serif'],
        hindi: ['Noto Sans Devanagari', 'Poppins', 'Segoe UI', 'sans-serif'],
      },
      backdropBlur: {
        glass: '12px',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(45, 106, 79, 0.2)' },
          '50%': { boxShadow: '0 0 40px rgba(45, 106, 79, 0.4)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}