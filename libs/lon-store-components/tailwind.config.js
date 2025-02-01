const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(
      __dirname,
      '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}'
    ),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Arial', 'sans-serif'], // Default global font
      },
      colors: {
        'blue-900': '#4338CA',
        'blue-700': '#4F46E5',
        'green-900': '#15803D',
        'green-700': '#16A34A',
        'black-700': '#1A1A1A',
        'gray-500': '#EFF0F3'
      }
    },
  },
  plugins: [],
};
