module.exports = {
  extends: [
    '@monai/base',
    '@monai/style',
    '@monai/node',
  ],
  rules: {
    'no-bitwise': 'off',
    'no-param-reassign': 'off',
    'no-unused-vars': [
      'error',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        ignoreRestSiblings: true,
      },
    ],
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: ['**/__test__/**/*.mjs'],
      },
    ],
  },
};
