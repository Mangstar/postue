module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true
  },
  extends: [
    '@vue/standard',
    'plugin:vue/recommended'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'semi': ['error', 'always'],
    'linebreak-style': ['error', 'unix'],
    'eol-last': ['off'],
    'no-trailing-spaces': 'off',
    'getter-return': 'warn',
    'no-setter-return': 'error',
    'no-dupe-else-if': 'error',
    'no-empty': ['error', { allowEmptyCatch: true }],
    'no-extra-semi': 'warn',
    'no-import-assign': 'error',
    'accessor-pairs': 'off',
    'default-case': 'warn',
    'default-param-last': 'error',
    'grouped-accessor-pairs': 'warn',
    'guard-for-in': 'error',
    'no-else-return': 'error',
    'no-eq-null': 'error',
    'no-fallthrough': 'warn',
    'no-invalid-this': 'warn',
    'no-magic-numbers': 'warn',
    'no-useless-concat': 'warn',
    'radix': 'error',
    'require-await': 'warn',
    "camelcase": ["error", { "properties": "always" }],
    'function-call-argument-newline': ['error', 'consistent'],
    'function-paren-newline': ['error', 'consistent'],
    'implicit-arrow-linebreak': ['error', 'beside'],
    'line-comment-position': ['error', 'above'],
    'multiline-comment-style': ['error', 'separate-lines'],
    'newline-per-chained-call': ['warn', { ignoreChainWithDepth: 2 }],
    'no-underscore-dangle': 'error',

    'vue/max-attributes-per-line': [
      'error',
      {
        singleline: 5,
        multiline: {
          max: 1,
          allowFirstLine: true
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
        ignoreProperties: true
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
      'error', 2,
      {
        attribute: 1,
        baseIndent: 1,
        closeBracket: 0,
        alignAttributesVertically: true,
        ignores: []
      }
    ],
    'vue/v-bind-style': [
      'error',
      'shorthand'
    ],
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
  }
};
