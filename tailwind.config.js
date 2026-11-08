/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Space Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      colors: {
        canvas: {
          light: '#F8F7F4',
          dark: '#101114',
          slate: '#16181D'
        },
        ink: {
          dark: '#0D0E11',
          light: '#F4F4F2',
          muted: '#8A8D93'
        }
      }
    },
  },
  plugins: [],
}

