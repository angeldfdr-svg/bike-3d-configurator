import nextConfig from 'eslint-config-next';

/**
 * Project lint rules.
 *
 * `eslint-config-next` ships a flat config that wires the Next.js, React,
 * React Hooks, jsx-a11y and import plugins, plus the Babel parser for plain
 * JavaScript and the TypeScript parser for `.ts`/`.tsx`.
 *
 * ESLint is pinned to the 9.x line: the React plugin bundled with
 * eslint-config-next 16 still calls `context.getFilename()`, which ESLint 10
 * removed. Type-level strictness is enforced separately by `tsc --noEmit`.
 */
export default [
  ...nextConfig,
  {
    name: 'project/quality',
    rules: {
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      'object-shorthand': ['error', 'always'],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'error',
      'no-var': 'error',
      'import/no-anonymous-default-export': 'off',
    },
  },
  {
    // CLI tooling legitimately writes to stdout.
    name: 'project/scripts',
    files: ['scripts/**/*.mjs'],
    rules: {
      'no-console': 'off',
    },
  },
];
