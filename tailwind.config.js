/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      'white': '#ffffff',
      'black': '#000000',
      'ciano': '#1abc9c',
    },
    extend: {
      fontFamily: {
        oswald: ["Oswald", "sans-serif"], 
      }
    },
  },
  plugins: [require('daisyui')],
}
