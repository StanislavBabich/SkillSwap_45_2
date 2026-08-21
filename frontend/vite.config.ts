/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'node:url';
const dirname =
  typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig(async ({ command }) => {
  const isVitestRun = process.env.VITEST === 'true';

  const config = {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@shared': path.resolve(__dirname, './src/shared'),
        '@widgets': path.resolve(__dirname, './src/widgets'),
        '@pages': path.resolve(__dirname, './src/pages'),
      },
    },
    server: {
      port: 5173,
      host: isVitestRun ? '127.0.0.1' : true,
    },
  } as const;

  if (!isVitestRun) {
    return config;
  }

  let storybookTest: typeof import('@storybook/addon-vitest/vitest-plugin').storybookTest | null =
    null;
  let playwright: typeof import('@vitest/browser-playwright').playwright | null = null;

  try {
    ({ storybookTest } = await import('@storybook/addon-vitest/vitest-plugin'));
    ({ playwright } = await import('@vitest/browser-playwright'));
  } catch {
    return config;
  }

  return {
    ...config,
    test: {
      projects: [
        {
          extends: true,
          plugins: storybookTest
            ? [
                // The plugin will run tests for the stories defined in your Storybook config
                // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
                storybookTest({
                  configDir: path.join(dirname, '.storybook'),
                }),
              ]
            : [],
          test: {
            name: 'storybook',
            browser: {
              enabled: true,
              headless: true,
              provider: playwright ? playwright({}) : undefined,
              instances: [
                {
                  browser: 'chromium',
                },
              ],
            },
            setupFiles: ['.storybook/vitest.setup.ts'],
          },
        },
      ],
    },
  };
});
