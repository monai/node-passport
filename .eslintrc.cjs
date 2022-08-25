module.exports = {
  extends: [
    '@monai/base',
    '@monai/style',
    '@monai/node',
  ],
  rules: {
    'no-bitwise': 'off',
    'no-param-reassign': 'off',
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: ['**/__test__/**/*.mjs'],
      },
    ],
  },
};
