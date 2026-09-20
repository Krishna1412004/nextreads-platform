/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Dark mode surface palette
        dark: {
          bg:      '#0d1117',   // page background
          surface: '#161b22',   // card surface
          elevated:'#1c2330',   // elevated card / hover
          border:  '#30363d',   // borders
          muted:   '#8b949e',   // muted text
          text:    '#e6edf3',   // primary text
          subtle:  '#c9d1d9',   // secondary text
        },
        teal: {
          50:  '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
      },
    },
  },
  plugins: [],
}
