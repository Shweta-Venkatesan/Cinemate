/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'background': '#0A0A0F',
        'surface': '#15151D',
        'surface-light': '#1F1F2A',
        'primary': '#8b5cf6',
        'primary-dark': '#7c3aed',
        'accent-gold': '#FFC857',
        'accent-green': '#22C55E',
        'text-primary': '#F5F5F7',
        'text-secondary': '#A1A1AA',
        'border-glass': 'rgba(255,255,255,0.08)',
      },
      fontFamily: {
        'display': ['Sora', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(to right, rgba(10,10,15,0.95) 30%, rgba(10,10,15,0.4) 100%)',
      },
      animation: {
        'shimmer': 'shimmer 1.4s ease infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0 50%' },
        },
      },
      aspectRatio: {
        'poster': '2/3',
        'backdrop': '16/9',
      },
    },
  },
  plugins: [],
}
