// Connester/community/community.spec.js
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

test('Navigate to Community and start Create New Community flow', async ({ page }) => {
    test.setTimeout(60000);

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

    // Click Community in sidebar
    await page.getByRole('link', { name: "Community" }).click();

    // ✅ Verify navigation
    await expect(page).toHaveURL(/\/community/, { timeout: 10000 });
    console.log("✅ Navigated to Community page");

    await page.waitForTimeout(1000);

    // ✅ Click "Create New Community" (use role=link)
    await page.getByRole('link', { name: "Create New Community" }).click();
    console.log("➕ Create New Community clicked");

    // -------------------------
    // Fill Create Community Form
    // -------------------------

    // Step 1 & 2: Upload profile + background image (pick 2 random from uploads/)
    const uploadsDir = path.join(__dirname, '../../uploads');
    const files = fs.readdirSync(uploadsDir).filter(f => /\.(png|jpe?g|gif)$/i.test(f));

    if (files.length < 2) {
        throw new Error("⚠️ Need at least 2 images in uploads folder!");
    }

    // Shuffle and select 2
    const shuffled = files.sort(() => 0.5 - Math.random());
    const selectedFiles = shuffled.slice(0, 2);
    const filePaths = selectedFiles.map(f => path.join(uploadsDir, f));

    console.log(`📷 Uploading files: ${selectedFiles.join(', ')}`);

    await page.locator('input[type="file"]').nth(0).setInputFiles(filePaths[0]);
    console.log("🖼️ Uploaded profile image");

    if (await page.locator('input[type="file"]').nth(1).count()) {
        await page.locator('input[type="file"]').nth(1).setInputFiles(filePaths[1]);
        console.log("🌆 Uploaded background image");
    }

    // Step 3: Community Name (random)
    const communityName = `Community_${Math.floor(Math.random() * 10000)}`;
    await page.fill('input[placeholder="Enter Community Name"]', communityName);
    console.log(`🏷️ Community Name: ${communityName}`);

    // Step 4: Username (random)
    const username = `user_${Math.floor(Math.random() * 10000)}`;
    await page.fill('input[placeholder="Enter username"]', username);
    console.log(`👤 Username: ${username}`);

    // Step 5: Community Visibility (random)
    const visibilityOptions = ["Anyone", "Followers Only", "Only Me"];
    const randomVisibility = visibilityOptions[Math.floor(Math.random() * visibilityOptions.length)];
    await page.getByText("Select Community Visibility").click();
    await page.getByRole('option', { name: randomVisibility }).click();
    console.log(`👁️ Visibility: ${randomVisibility}`);

    // Step 6: Headline (random)
    const headline = `Headline_${Math.floor(Math.random() * 1000)}`;
    await page.fill('input[placeholder="Headline"]', headline);
    console.log(`📰 Headline: ${headline}`);

    // Step 7: Description (random, rich text editor - Quill)
    const description = `This is a test community description ${Math.floor(Math.random() * 1000)}.`;
    await page.locator('.ql-editor').fill(description);
    console.log(`📝 Description: ${description}`);

    // Step 8: Click "Create Community"
    await page.getByRole('button', { name: "Create Community" }).click();
    console.log("🚀 Submitted Create Community form");

    // Pause to inspect result
    await page.pause();

});
