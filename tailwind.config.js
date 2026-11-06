/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#0B0F19',
          surface: '#111827',
          card: '#161F30',
          border: '#1F2937',
          primary: '#6366F1',
          neon: '#10B981',
          accent: '#F59E0B',
          danger: '#EF4444',
          muted: '#9CA3AF'
        }
      },
      boxShadow: {
        'glow-primary': '0 0 20px -3px rgba(99, 102, 241, 0.4)',
        'glow-neon': '0 0 20px -3px rgba(16, 185, 129, 0.4)',
        'glow-accent': '0 0 20px -3px rgba(245, 158, 11, 0.4)',
      }
    },
  },
  plugins: [],
}

