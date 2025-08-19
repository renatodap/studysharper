import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#E8F4FF',
          100: '#C2E3FF',
          200: '#85C7FF',
          300: '#47ABFF',
          400: '#0A8FFF',
          500: '#0073E6',
          600: '#005BB5',
          700: '#004385',
          800: '#002B54',
          900: '#001324',
          950: '#000912'
        },
        dark: {
          50: '#F7F7F8',
          100: '#E3E4E6',
          200: '#C6C9CD',
          300: '#AAAEB3',
          400: '#8D939A',
          500: '#717881',
          600: '#5A5F67',
          700: '#43474E',
          800: '#2C2F34',
          900: '#15171A',
          950: '#0A0B0D'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}