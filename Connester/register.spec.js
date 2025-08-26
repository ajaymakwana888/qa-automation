// tests/register.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Connester Register Page', () => {

  test('should register a new user successfully', async ({ page }) => {
    // Navigate to signup page
    await page.goto('https://connester.com/sign-up');

    // Fill out the registration form
    await page.fill('input[placeholder="Enter your name"]', 'Test User');
    await page.fill('input[placeholder="Enter your email"]', `test${Date.now()}@example.com`);
    await page.fill('input[placeholder="Enter your password"]', 'Password123!');

    // Check the privacy policy checkbox
    await page.check('input[type="checkbox"]');

    // Click on Sign Up button
    await page.click('button:has-text("Sign Up")');

    // ✅ Expect redirect to home page
    await expect(page).toHaveURL('https://connester.com/home');

    // ⏸ Pause execution here (you can inspect DOM, cookies, etc.)
    await page.pause();
  });

});
