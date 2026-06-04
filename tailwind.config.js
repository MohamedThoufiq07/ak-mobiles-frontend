/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
        brand: {
          white: '#FFFFFF',
          dark: '#1E293B',
          blue: '#2563EB',
          blueHover: '#1D4ED8',
          orange: '#F97316',
          orangeHover: '#EA580C',
          grey: '#F8FAFC',
          slate: '#64748B',
          success: '#10B981',
          danger: '#EF4444',
          gradientStart: '#2563EB',
          gradientEnd: '#7C3AED',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'marquee': 'marquee 25s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        }
      }
    },
  },
  plugins: [],
}
