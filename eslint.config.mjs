import { defineConfig } from 'eslint/config';
import globals from 'globals';
import js from '@eslint/js';
import ts from 'typescript-eslint';
import astro from 'eslint-plugin-astro';
import prettierConfig from 'eslint-config-prettier';

// Parsers
const tsParser = ts.parser;
const astroParser = astro.parser;

export default defineConfig([
  // Global configuration
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },

  // Base configs
  js.configs.recommended,
  ts.configs.strict,
  ts.configs.stylistic,

  // Astro setup with a11y
  astro.configs.recommended,
  astro.configs['jsx-a11y-recommended'],
  {
    files: ['**/*.astro'],
    languageOptions: {
      parser: astroParser,
      parserOptions: {
        parser: tsParser,
        extraFileExtensions: ['.astro'],
        sourceType: 'module',
        ecmaVersion: 'latest',
        project: './tsconfig.json',
      },
    },

    rules: {
      // 'no-undef': 'off', // Disable "not defined" errors for specific Astro types that are globally available (ImageMetadata)
      // '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
    },
  },

  // Ignore patterns
  {
    ignores: ['dist/**', '**/*.d.ts', 'mocks/**'],
  },

  // Prettier config
  prettierConfig,
]);
