// Connester/messaging/messaging.spec.ts
import { test, expect } from '@playwright/test';

test('Send multiple messages in Messaging', async ({ page }) => {
  test.setTimeout(90000);

  // Go to login page
  await page.goto('https://connester.octalinfotech.com/login');

  // Login
  await page.fill('input[type="email"]', 'niravv.octal8@gmail.com');
  await page.fill('input[type="password"]', 'Nirav@#$123');
  await page.check('input[type="checkbox"]');
  await page.click('button:has-text("Sign In")');

  // ✅ Wait for sidebar button
  const sidebarButton = page.locator('svg.h-6.w-6.cursor-pointer.text-gray-600[data-slot="icon"]');
  await sidebarButton.waitFor({ state: 'visible', timeout: 20000 });

  // Open sidebar
  await sidebarButton.click();
  await page.waitForTimeout(2000);

  // Click Messaging
  await page.getByRole('link', { name: "Messaging" }).click();
  await expect(page).toHaveURL(/\/messaging/, { timeout: 10000 });

  // ✅ Fix locator to support input or textarea
  const messageBox = page.locator('input[placeholder="Type a message"], textarea[placeholder="Type a message"]');
  const sendButton = page.getByRole('button', { name: 'Send', exact: true });

  // 🔹 First message
  await messageBox.click();
  await messageBox.fill('Hyyyyy');
  await sendButton.click();
  console.log("✅ First message 'Hyyyyy' sent");

  await page.waitForTimeout(1500); // small delay to mimic user typing

  // 🔹 Second message
  await messageBox.click();
  await messageBox.fill('How Are You');
  await sendButton.click();
  console.log("✅ Second message 'How Are You' sent");

  // Pause for debugging
  await page.pause();
});
