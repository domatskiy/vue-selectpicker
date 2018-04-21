// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
    es6: true,
    node: true,
    jasmine: true
  },
  // https://github.com/standard/standard/blob/master/docs/RULES-en.md
  extends: 'standard',
  // required to lint *.vue files
  plugins: [
    'html'
  ],

  // add your custom rules here
  'rules': {
      //"no-else-return": "error",
      //"no-multi-spaces": "error",
      //"no-whitespace-before-property": "error",
      //"camelcase": "error",
      //"new-cap": "error",
      //"no-console": "error",
      //"comma-dangle": "error",
      //"no-var": "error",
      //"indent": ["error", 2, {"SwitchCase": 1}],
      //"quotes": [
      //    "error",
      //    "single"
      //],
      //"semi": [
      //    "error",
      //    "always"
      //],
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  }
}
