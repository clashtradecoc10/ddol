import { FlatCompat } from '@eslint/eslintrc'

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
})

export default [
  ...compat.config({
    extends: ['next/core-web-vitals'],
    rules: {
      'no-unused-vars': 'off',
      'no-var': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      '@next/next/no-img-element': 'off',
      '@next/next/no-html-link-for-pages': 'off',
      'jsx-a11y/alt-text': 'off',
      'react-hooks/exhaustive-deps': 'off',
      '@typescript-eslint/no-non-null-asserted-optional-chain': 'off'
    },
  }),
]
