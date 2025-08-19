/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Dark-first StudySharper Theme
        // Background colors (dark primary)
        bg: '#0A0A0A',              // Pure black background
        surface: '#111418',         // Near-black surface
        'surface-2': '#161A1F',     // Elevated surface
        'surface-3': '#1D2127',     // Higher elevation
        
        // Text colors (white primary)
        'text-primary': '#FFFFFF',   // Primary text (white)
        'text-secondary': '#C7CBD1', // Secondary text (light gray)  
        'text-muted': '#8B9096',     // Muted text (mid gray)
        'text-disabled': '#6B6F76',  // Disabled text
        
        // Brand colors (blue focus for StudySharper)
        blue: {
          50: '#EBF8FF',
          100: '#BEE3F8',
          200: '#90CDF4',
          300: '#63B3ED',
          400: '#4299E1',
          500: '#3182CE',
          600: '#2B77CB',
          700: '#2C5AA0',
          800: '#2A4365',
          900: '#1A365D',
        },
        
        // Semantic colors
        'success': '#10B981',       // Success green
        'warning': '#F59E0B',       // Warning amber
        'error': '#EF4444',         // Error red
        'info': '#3B82F6',          // Info blue
        
        // Functional colors
        border: '#23272E',          // Border color
        focus: '#E5E7EB',           // Focus rings
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
  ],
}