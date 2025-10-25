/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3B82F6',
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A'
        },
        secondary: {
          DEFAULT: '#F472B6',
          500: '#F472B6',
          600: '#EC4899',
          700: '#DB2777'
        },
        info: '#0EA5E9',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        gray: {
          50: '#F1F5F9',
          100: '#E2E8F0',
          200: '#CBD5E1',
          300: '#94A3B8',
          400: '#64748B',
          500: '#475569',
          600: '#334155',
          700: '#1F2937',
          800: '#161B22',
          900: '#0D1117'
        },
        background: {
          DEFAULT: '#0D1117',
          subtle: '#161B22',
          elevated: '#1F2937'
        },
        accent: {
          gradientStart: '#6366F1',
          gradientMid: '#8B5CF6',
          gradientEnd: '#D946EF'
        }
      }
    }
  },
  plugins: []
}
