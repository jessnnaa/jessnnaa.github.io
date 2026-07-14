// One-off SCSS -> CSS build (sass + autoprefixer + cssnano), mirrors gulpfile.js's `style` task.
// Usage: npm run build:css
const sass = require('sass');
const postcss = require('postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const fs = require('fs');

const result = sass.compile('scss/main.scss', { style: 'expanded' });
postcss([autoprefixer(), cssnano()])
  .process(result.css, { from: undefined })
  .then(out => {
    fs.writeFileSync('css/main.css', out.css);
    console.log('CSS built, bytes:', out.css.length);
  })
  .catch(err => { console.error(err); process.exit(1); });
