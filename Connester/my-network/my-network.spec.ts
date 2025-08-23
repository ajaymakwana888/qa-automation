import { test, expect } from '@playwright/test';

test('Click My Network tabs and hold for 5 seconds', async ({ page }) => {
  test.setTimeout(60000);

  // Go to login page
  await page.goto('https://connester.octalinfotech.com/login');

  // Login
  await page.fill('input[type="email"]', 'niravv.octal8@gmail.com');
  await page.fill('input[type="password"]', 'Nirav@#$123');
  await page.check('input[type="checkbox"]');
  await page.click('button:has-text("Sign In")');

  // ✅ Verify login success before sidebar
  await expect(page).toHaveURL(/\/home/);

  // 🔹 Step 1: Open sidebar (hamburger menu SVG)
  console.log("👉 Clicking sidebar menu...");
  const sidebarButton = page.locator('svg.h-6.w-6.cursor-pointer.text-gray-600[data-slot="icon"]');
  await sidebarButton.click();

  // 🔹 Step 2: Click "My Network" inside sidebar
  console.log("👉 Clicking My Network...");
  await page.getByRole('link', { name: "My Network" }).click();

  // ✅ Ensure the My Network page loaded
  await expect(page).toHaveURL(/\/my-networks/);

  // 🔹 Step 3: Click each top option
  const options = ["Connections", "Follow Requests", "Invitations", "Followers", "Following"];

  for (const option of options) {
    console.log(`👉 Clicking ${option}...`);
    const tab = page.getByRole('tab', { name: option });

    await tab.waitFor({ state: 'visible', timeout: 10000 });
    await tab.click();

    // Hold for 5 seconds
    await page.waitForTimeout(5000);
  }

  console.log("✅ Finished clicking all My Network tabs.");

  // 🔹 Pause for debugging
  await page.pause();
});
