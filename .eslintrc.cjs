module.exports = {
  root: true,
  extends: [
    '@monai/base',
    '@monai/style',
    '@monai/node',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    'no-bitwise': 'off',
    'no-param-reassign': 'off',
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: ['**/__test__/**/*.mjs'],
      },
    ],
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        cjs: 'never',
        ts: 'never',
        cts: 'never',
        mts: 'never',
      },
    ],
    'node/no-missing-import': 'off',
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.cts', '.mts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
      },
    },
  },
};
