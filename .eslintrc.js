module.exports = {
  root: true,

  env: {
    node: true
  },

  extends: ['plugin:vue/essential', '@vue/standard'],

  parserOptions: {
    parser: 'babel-eslint'
  },

  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
    'space-before-function-paren': 'false',
    'vue/require-render-return': 'off'
  },

  extends: ['plugin:vue/essential', '@vue/standard'],

  'extends': [
    'plugin:vue/essential',
    '@vue/standard'
  ]
}
