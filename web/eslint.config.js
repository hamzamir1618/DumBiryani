import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

/**
 * Lint for the things that actually bite in this codebase: unused code, bad
 * hook dependencies, and accidental `any`. The CI pipeline runs `npm run lint`
 * before it builds, so anything in here gates a deploy.
 */
export default tseslint.config(
  { ignores: ['dist', 'node_modules'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      // GSAP selector strings and the ornament tokens are plain strings; the
      // non-null assertions around refs inside useGSAP are deliberate, because
      // the scope guarantees the element exists by the time it runs.
      '@typescript-eslint/no-non-null-assertion': 'off',
    },
  },
);
