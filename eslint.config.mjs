import nx from '@nx/eslint-plugin';

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: ['**/dist', '**/node_modules', '**/*.spec.ts'],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$'],
          depConstraints: [
            // ─── Kernel: zero platform dependencies ─────────────────────────
            {
              sourceTag: 'layer:kernel',
              onlyDependOnLibsWithTags: [],
              notDependOnLibsWithTags: [
                'layer:model',
                'layer:compiler',
                'layer:runtime',
                'layer:adapter',
                'layer:app',
                'framework:nestjs',
                'framework:angular',
                'framework:primeng',
              ],
            },
            // ─── Model: only depends on kernel ───────────────────────────────
            {
              sourceTag: 'layer:model',
              onlyDependOnLibsWithTags: ['layer:kernel'],
              notDependOnLibsWithTags: [
                'layer:compiler',
                'layer:runtime',
                'layer:adapter',
                'layer:app',
                'framework:nestjs',
                'framework:angular',
                'framework:primeng',
              ],
            },
            // ─── Compiler: depends on model + kernel ──────────────────────────
            {
              sourceTag: 'layer:compiler',
              onlyDependOnLibsWithTags: ['layer:kernel', 'layer:model'],
              notDependOnLibsWithTags: [
                'layer:runtime',
                'layer:adapter',
                'layer:app',
                'framework:nestjs',
                'framework:angular',
                'framework:primeng',
              ],
            },
            // ─── Runtime: depends on kernel + platform-contracts ──────────────
            {
              sourceTag: 'layer:runtime',
              onlyDependOnLibsWithTags: ['layer:kernel', 'layer:contracts'],
              notDependOnLibsWithTags: [
                'layer:model',
                'layer:compiler',
                'layer:adapter',
                'layer:app',
                'framework:nestjs',
                'framework:angular',
                'framework:primeng',
              ],
            },
            // ─── Contracts (shared frontend-safe) ────────────────────────────
            {
              sourceTag: 'layer:contracts',
              onlyDependOnLibsWithTags: [],
              notDependOnLibsWithTags: [
                'framework:nestjs',
                'framework:angular',
                'framework:primeng',
              ],
            },
            // ─── NestJS Adapters: platform APIs + nestjs ──────────────────────
            {
              sourceTag: 'framework:nestjs',
              notDependOnLibsWithTags: ['framework:angular', 'framework:primeng', 'layer:app'],
            },
            // ─── Angular Adapters: frontend-safe contracts + angular + primeng ─
            {
              sourceTag: 'framework:angular',
              notDependOnLibsWithTags: ['framework:nestjs', 'layer:app'],
            },
          ],
        },
      ],
    },
  },
  {
    files: ['platform/**/*.ts', 'platform/**/*.tsx'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@nestjs/*', '@nestjs/**'],
              message:
                'Architecture violation: NestJS must remain in backend hosts and adapters. Platform Core must remain Pure TypeScript.',
            },
            {
              group: ['@angular/*', '@angular/**', 'primeng', 'primeng/**'],
              message:
                'Architecture violation: Angular and PrimeNG must remain in frontend presentation layers. Platform Core must remain Pure TypeScript.',
            },
            {
              group: ['@ecosystem/*/src/*', '@ecosystem/*/dist/*'],
              message:
                'Architecture violation: Deep imports into internal files are forbidden. Import only from public package entry points.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['adapters/shared/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                '@nestjs/*',
                '@nestjs/**',
                '@angular/*',
                '@angular/**',
                'primeng',
                'primeng/**',
              ],
              message:
                'Architecture violation: Shared contracts must be frontend-safe and framework-agnostic.',
            },
            {
              group: ['@ecosystem/*/src/*', '@ecosystem/*/dist/*'],
              message:
                'Architecture violation: Deep imports are forbidden. Use public package entry points.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
  },
];

