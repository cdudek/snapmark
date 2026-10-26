import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config({ ignores: ['dist', 'release', 'node_modules'] }, js.configs.recommended, ...tseslint.configs.recommended, {
  files: ['test/smoke.ts'],
  // main.ts must load after env vars are set, so the smoke test uses require() on purpose.
  rules: { '@typescript-eslint/no-require-imports': 'off' },
});
