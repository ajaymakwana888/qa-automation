// playwright.config.js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    browserName: 'chromium',
    headless: false, // set true if you don't want browser UI
    viewport: { width: 1280, height: 720 },
    screenshot: 'on',
    video: 'retain-on-failure'
  },
  testDir: './tests',
});
