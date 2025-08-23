import { test, expect } from '@playwright/test';

test('Click all post options and hold for 7 seconds', async ({ page }) => {
  // Extend test timeout (6 options × 7s + login time ≈ 60s)
  test.setTimeout(60000); // 1 minute max

  // Go to login page
  await page.goto('https://connester.octalinfotech.com/login');

  // Login
  await page.fill('input[type="email"]', 'niravv.octal8@gmail.com');
  await page.fill('input[type="password"]', 'Nirav@#$123');
  await page.check('input[type="checkbox"]');
  await page.click('button:has-text("Sign In")');

  // ✅ Verify login success
  await expect(page).toHaveURL(/https:\/\/connester\.octalinfotech\.com\/home/);

  // The tab bar container
  const tabBar = page.locator('div[role="tablist"]');

  // Use the exact tab names from UI
  const options = ["Content", "Media", "Document", "Event", "Job", "Poll"];

  for (const option of options) {
    console.log(`👉 Clicking ${option}...`);

    const optionButton = tabBar.getByRole('tab', { name: option });

    // Ensure visible & click
    await optionButton.first().click();

    // Hold 7 seconds per option
    await page.waitForTimeout(5000);
  }

   await page.pause();
});
