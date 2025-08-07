export default {
  env: {
    browser: true,
    es2021: true
  },

  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    'prettier',
    'plugin:prettier/recommended'
  ],

  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },

  rules: {
    'no-trailing-spaces': 'error',
    'no-multi-spaces': 'error',
    'no-multiple-empty-lines': ['error', { max: 1 }],
    semi: ['error', 'always'],
    'vue/multi-word-component-names': [
      'error',
      {
        ignores: ['Index', 'Default', 'Error']
      }
    ],
    'vue/html-self-closing': 'off',
    'vue/require-default-prop': 'off',

    'no-console': 'warn',
    'no-debugger': 'warn',
    'no-unused-vars': 'warn'
  }
};
