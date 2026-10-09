import path from 'node:path'
import js from '@eslint/js'
import boundaries from 'eslint-plugin-boundaries'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import globals from 'globals'

export default [
  { ignores: ['dist', 'public'] },
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.node },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: { react, 'react-hooks': reactHooks, boundaries },
    settings: {
      react: { version: 'detect' },
      'import/resolver': { [path.resolve(import.meta.dirname, 'eslint-resolver.cjs')]: {} },
      // Fitur = satu folder di src/features/<nama>. Antarfitur tidak boleh saling impor.
      'boundaries/elements': [
        { type: 'app', pattern: 'src/app' },
        { type: 'layouts', pattern: 'src/layouts' },
        { type: 'feature', pattern: 'src/features/*', capture: ['featureName'] },
        { type: 'shared', pattern: 'src/shared' },
        { type: 'mocks', pattern: 'src/mocks' },
        { type: 'config', pattern: 'src/config' },
      ],
      'boundaries/ignore': ['src/main.jsx'],
    },
    rules: {
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      'react/prop-types': 'off', // kontrak data dijaga zod + JSDoc
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]', argsIgnorePattern: '^_' }],
      'boundaries/dependencies': [
        'error',
        {
          default: 'disallow',
          policies: [
            // Paket npm & file non-elemen (main.jsx, css) selalu boleh
            { allow: { to: { module: { origin: 'external' } } } },
            {
              from: { element: { type: 'app' } },
              allow: {
                to: {
                  element: {
                    types: { anyOf: ['app', 'layouts', 'feature', 'shared', 'mocks', 'config'] },
                  },
                },
              },
            },
            {
              from: { element: { type: 'layouts' } },
              allow: {
                to: { element: { types: { anyOf: ['layouts', 'feature', 'shared', 'config'] } } },
              },
            },
            {
              from: { element: { type: 'shared' } },
              allow: { to: { element: { types: { anyOf: ['shared', 'config'] } } } },
            },
            {
              from: { element: { type: 'mocks' } },
              allow: { to: { element: { types: { anyOf: ['mocks', 'shared', 'config'] } } } },
            },
            {
              from: { element: { type: 'config' } },
              allow: { to: { element: { type: 'config' } } },
            },
            // Fitur: boleh pakai shared/config, dan HANYA fitur yang sama dengan dirinya
            {
              from: { element: { type: 'feature' } },
              allow: { to: { element: { types: { anyOf: ['shared', 'config'] } } } },
            },
            {
              from: { element: { type: 'feature' } },
              allow: {
                to: {
                  element: {
                    type: 'feature',
                    captured: { featureName: '{{from.captured.featureName}}' },
                  },
                },
              },
            },
          ],
        },
      ],
    },
  },
]
