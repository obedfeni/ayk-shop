/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        'ayk': {
          primary: '#D97706',
          'primary-dark': '#B45309',
          'primary-light': '#FCD34D',
          accent: '#EC4899',
          success: '#10B981',
          danger: '#EF4444',
          text: '#1C1917',
          'text-soft': '#78716C',
          'text-muted': '#A8A29E',
          bg: '#FEFCE8',
          surface: '#FFFBEB',
          border: '#E7E5E4',
        },
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
