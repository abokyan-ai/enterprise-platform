import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.spec.ts'],
    coverage: {
      reportsDirectory: '../../../coverage/platform/model/model-core',
      provider: 'v8',
    },
  },
  resolve: {
    alias: {
      '@ecosystem/semantic-kernel': resolve(
        __dirname,
        '../../kernel/semantic-kernel/src/index.ts',
      ),
    },
    extensions: ['.ts', '.js'],
  },
});
