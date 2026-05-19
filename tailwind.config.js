/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FDFBF7',
        beige: {
          DEFAULT: '#F4EDE4',
          dark: '#E9DEC9'
        },
        brown: {
          muted: '#8C7A6B',
          dark: '#4A3B32',
          light: '#A69688'
        },
        pink: {
          dusty: '#F0D5D1',
          soft: '#F9EAE8',
          dark: '#E8C1BD'
        },
        gray: {
          warm: '#D6D2CC',
          dark: '#3A3835'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Lora', 'serif'],
      },
      boxShadow: {
        'soft': '0 8px 30px -4px rgba(140, 122, 107, 0.08)',
        'glow': '0 0 15px rgba(226, 199, 197, 0.4)',
        'inner-soft': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.02)'
      }
    },
  },
  plugins: [],
}
