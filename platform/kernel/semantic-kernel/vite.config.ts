import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.spec.ts'],
    coverage: {
      reportsDirectory: '../../../coverage/platform/kernel/semantic-kernel',
      provider: 'v8',
    },
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
});
