/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#007bff', // Blue
        success: '#28a745', // Green
      },
      gradientColorStops: {
        'primary-start': '#007bff',
        'primary-end': '#0056b3',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

