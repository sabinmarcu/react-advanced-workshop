const rules = {
  'import/prefer-default-export': 0,
  'import/no-dynamic-require': 0,
  'global-require': 0,
  'react/react-in-jsx-scope': 0,
  'react/prop-types': 0,
  'react/jsx-props-no-spreading': 0,
};

module.exports = {
  extends: ['eslint-config-airbnb'],
  parserOptions: {
    project: './tsconfig.json',
  },
  rules,
  env: {
    browser: true,
  },
  overrides: [
    {
      files: ['.eslintrc.js'],
      rules: {
        'import/no-extraneous-dependencies': 0,
      },
    },
    {
      files: ['*.ts', '*.tsx'],
      extends: ['eslint-config-airbnb-typescript'],
      rules,
    },
  ],
};
