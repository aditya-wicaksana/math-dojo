/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        nunito: ['Nunito', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#fff4ef',
          100: '#ffe4d5',
          200: '#ffc4a8',
          300: '#ff9a70',
          400: '#ff6b35',
          500: '#ff4a0d',
          600: '#f02f00',
          700: '#c72300',
          800: '#9e1d00',
          900: '#7f1a00',
        },
        secondary: {
          50: '#edfcfb',
          100: '#d0f7f5',
          200: '#a5efec',
          300: '#6de3e0',
          400: '#4ecdc4',
          500: '#1fb3ab',
          600: '#158f8a',
          700: '#147270',
          800: '#145b5a',
          900: '#154c4b',
        },
        accent: {
          50: '#fffce8',
          100: '#fff8c3',
          200: '#ffef86',
          300: '#ffe147',
          400: '#ffe66d',
          500: '#f5c400',
          600: '#d99700',
          700: '#b06b02',
          800: '#8e530a',
          900: '#76440e',
        },
      },
      animation: {
        'pop-in': 'popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        'slide-up': 'slideUp 0.3s ease-out forwards',
        'bounce-in': 'bounceIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        shake: 'shake 0.4s ease-in-out',
        'confetti-fall': 'confettiFall 1.2s ease-in forwards',
        'star-pop': 'starPop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'fade-in': 'fadeIn 0.3s ease-out forwards',
      },
      keyframes: {
        popIn: {
          '0%': { transform: 'scale(0.5)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-6px)' },
          '40%': { transform: 'translateX(6px)' },
          '60%': { transform: 'translateX(-4px)' },
          '80%': { transform: 'translateX(4px)' },
        },
        confettiFall: {
          '0%': { transform: 'translateY(-20px) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(120px) rotate(720deg)', opacity: '0' },
        },
        starPop: {
          '0%': { transform: 'scale(0) rotate(-30deg)', opacity: '0' },
          '60%': { transform: 'scale(1.3) rotate(10deg)' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.04)' },
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
