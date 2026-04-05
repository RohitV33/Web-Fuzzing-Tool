/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        display: ['Syne', 'sans-serif'],
      },
      colors: {
        cyber: {
          50:  '#f0fdf4',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          900: '#14532d',
        },
        dark: {
          900: '#020b0f',
          800: '#061018',
          700: '#0a1a24',
          600: '#0f2333',
          500: '#152d40',
        },
      },
      animation: {
        'float':        'float 6s ease-in-out infinite',
        'pulse-slow':   'pulse 4s ease-in-out infinite',
        'scan-line':    'scanLine 3s linear infinite',
        'glow':         'glow 2s ease-in-out infinite alternate',
        'spin-slow':    'spin 20s linear infinite',
        'matrix-fall':  'matrixFall 8s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-20px)' },
        },
        scanLine: {
          '0%':   { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        glow: {
          '0%':   { boxShadow: '0 0 20px rgba(34,197,94,0.3)' },
          '100%': { boxShadow: '0 0 60px rgba(34,197,94,0.8), 0 0 100px rgba(34,197,94,0.4)' },
        },
        matrixFall: {
          '0%':   { transform: 'translateY(-60px)', opacity: '0' },
          '5%':   { opacity: '0.9' },
          '95%':  { opacity: '0.7' },
          '100%': { transform: 'translateY(calc(100vh + 60px))', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}
