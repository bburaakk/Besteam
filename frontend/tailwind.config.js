/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0500f1',
          50: '#f0f0ff',
          100: '#e0e0ff',
          200: '#c7c7ff',
          300: '#a3a3ff',
          400: '#7a7aff',
          500: '#0500f1',
          600: '#0400d9',
          700: '#0300b8',
          800: '#020096',
          900: '#010074',
        },
        secondary: {
          DEFAULT: '#ffbe41',
          50: '#fffdf7',
          100: '#fff9e6',
          200: '#fff2cc',
          300: '#ffe699',
          400: '#ffd966',
          500: '#ffbe41',
          600: '#e6ab3a',
          700: '#cc9833',
          800: '#b3852d',
          900: '#997226',
        },
        accent: {
          DEFAULT: '#fffff3',
          50: '#fffff3',
          100: '#fffff0',
          200: '#ffffe6',
          300: '#ffffcc',
          400: '#ffffb3',
          500: '#fffff3',
          600: '#e6e6da',
          700: '#ccccb8',
          800: '#b3b399',
          900: '#99997a',
        },
        career: {
          blue: '#0500f1',
          yellow: '#ffbe41',
          cream: '#fffff3',
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
