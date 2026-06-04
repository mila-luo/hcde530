/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        google: {
          blue: '#4285F4',
          red: '#EA4335',
          yellow: '#FBBC05',
          green: '#34A853',
        },
        sticky: {
          blue: '#E8F0FE',
          red: '#FCE8E6',
          yellow: '#FEF7E0',
          green: '#E6F4EA',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Google Sans', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
