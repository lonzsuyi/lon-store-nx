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
        'gray-600': '#374151',
        'gray-500': '#EFF0F3',
        'gray-400': '#707784',
        'gray-200': '#E5E7EB',
        'gray-150': '#9CA3AF',
        'gray-100': '#D1D5DB',
        'black-700': '#1A1A1A',
        'yellow-700': '#FABE3A'
      }
    },
  },
  plugins: [],
};
