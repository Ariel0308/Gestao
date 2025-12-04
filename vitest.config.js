import { defineConfig, configDefaults } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    exclude: [...configDefaults.exclude, 'docker-data/**', 'View/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      reportsDirectory: './coverage',
      include: ['Controllers/**/*.js', 'Middlewares/**/*.js', 'Routers/**/*.js'],
      exclude: ['node_modules', 'docker-data', 'View'],
    },
    restoreMocks: true,
    clearMocks: true,
    mockReset: true,
  },
});


