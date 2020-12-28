module.exports = {
  extends: [
    '@monai/base',
    '@monai/node',
    '@monai/style',
    'plugin:unicorn/recommended',
  ],
  rules: {
    'no-bitwise': 'off',
    'no-param-reassign': 'off',
    'no-restricted-syntax': [
      'error',
      {
        selector: 'ForInStatement',
        message: 'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.',
      },
      {
        selector: 'LabeledStatement',
        message: 'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.',
      },
      {
        selector: 'WithStatement',
        message: '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
      },
    ],
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: ['**/__test__/**/*.js'],
      },
    ],
    'unicorn/filename-case': [
      'error',
      {
        case: 'camelCase',
      },
    ],
    'unicorn/import-style': [
      'error',
      {
        styles: {
          util: false,
        },
      },
    ],
    'unicorn/no-useless-undefined': 'off',
    'unicorn/number-literal-case': 'off',
  },
};
