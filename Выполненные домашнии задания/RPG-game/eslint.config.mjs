import js from '@eslint/js';
import globals from 'globals';
import { FlatCompat } from '@eslint/eslintrc';

// airbnb-base пока поставляется в старом формате конфигов,
// поэтому подключаем его через FlatCompat
const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
  recommendedConfig: js.configs.recommended,
});

export default [
  {
    // .eslintignore не читается ESLint 9, поэтому дублируем исключения здесь
    ignores: ['dist/', 'coverage/', 'node_modules/'],
  },
  js.configs.recommended,
  ...compat.extends('airbnb-base'),
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
];
