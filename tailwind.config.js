/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    colors: {
      tranparent: 'tranparent',
      current: 'currentColor',
      'white': '#ffffff',
      'ciano': '#1abc9c',
    },
    extend: {},
    
  },
  plugins: [require('daisyui')],


}

