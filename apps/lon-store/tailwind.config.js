const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');
const componentsConfig = require('../../libs/lon-store-components/tailwind.config');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, '../../libs/lon-store-components/{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}'),
    join(
      __dirname,
      '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}'
    ),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  ...componentsConfig,
};
