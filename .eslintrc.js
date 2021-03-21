module.exports = {
  root: true,
  env: {
    node: true,
    es6: true
  },
  extends: [
    '@vue/standard',
    'plugin:vue/essential',
    "plugin:vue/strongly-recommended",
    "plugin:vue/recommended"
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'vue/no-async-in-computed-properties': 'error',
    'semi': ['error', 'always'],
    'indent': ['error', 2],
    'linebreak-style': ['error', 'unix'],
    'eol-last': ['off'],
    'no-trailing-spaces': 'off',
    'vue/max-attributes-per-line': [
      'error',
      {
        'singleline': 5,
        'multiline': {
          'max': 1,
          'allowFirstLine': true
        }
      }
    ],
    'vue/require-default-prop': ['off'],
    'vue/mustache-interpolation-spacing': [
      'error',
      'always'
    ],
    'vue/no-multi-spaces': [
      'error',
      {
        'ignoreProperties': true
      }
    ],
    'vue/require-prop-types': [
      'error'
    ],
    'vue/name-property-casing': [
      'error',
      'kebab-case'
    ],
    'vue/html-indent': [
      'error',
      2,
      {
        'attribute': 1,
        'baseIndent': 1,
        'closeBracket': 0,
        'alignAttributesVertically': true,
        'ignores': []
      }
    ],
    'vue/v-bind-style': [
      'error',
      'shorthand'
    ],
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
  }
}
