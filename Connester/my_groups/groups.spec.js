// Connester/my-groups/my-groups.spec.js
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

test('Navigate to My Groups and start Create New My Groups flow', async ({ page }) => {
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

    // Click my-groups in sidebar
    await page.getByRole('link', { name: "My Groups" }).click();

    // ✅ Verify navigation
    await expect(page).toHaveURL(/\/my-groups/, { timeout: 10000 });
    console.log("✅ Navigated to My Groups page");

    await page.waitForTimeout(1000);

    // ✅ Click "Create New Group"
    await page.getByRole('link', { name: "Create New Group" }).click();
    console.log("➕ Create New Group clicked");

    // -----------------------------
    // Step 1 & 2: Upload images
    // -----------------------------
    const uploadsDir = path.join(__dirname, '../../uploads');
    const files = fs.readdirSync(uploadsDir).filter(f => /\.(png|jpe?g|gif)$/i.test(f));

    if (files.length < 2) {
        throw new Error("⚠️ Need at least 2 images in uploads folder!");
    }

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

    // -----------------------------
    // Step 3: Group Name (random)
    // -----------------------------
    const groupName = `Group_${Math.floor(Math.random() * 10000)}`;
    await page.fill('input[placeholder="Enter Group Name"]', groupName);
    console.log(`🏷️ Group Name: ${groupName}`);

    // -----------------------------
    // Step 4: Username (random)
    // -----------------------------
    const username = `group_user_${Math.floor(Math.random() * 10000)}`;
    await page.fill('input[placeholder="Enter username"]', username);
    console.log(`👤 Username: ${username}`);

    // -----------------------------
    // Step 5: Group Visibility (random)
    // -----------------------------
    const visibilities = ["Private", "Public"];
    const visibility = visibilities[Math.floor(Math.random() * visibilities.length)];
    await page.getByText("Select Group Visibility", { exact: true }).click();
    await page.getByRole('option', { name: visibility }).click();
    console.log(`👁️ Visibility: ${visibility}`);

    // -----------------------------
    // Step 6: Headline (random)
    // -----------------------------
    const headline = `Headline_${Math.floor(Math.random() * 1000)}`;
    await page.fill('input[placeholder="Headline"]', headline);
    console.log(`📰 Headline: ${headline}`);

    // -----------------------------
    // Step 7: Description (random in Quill editor)
    // -----------------------------
    const description = `This is a test group description ${Math.floor(Math.random() * 1000)}.`;
    const editor = page.locator('.ql-editor'); // target correct editor div
    await editor.click();
    await editor.fill(description);
    console.log(`📝 Description: ${description}`);

    // -----------------------------
    // Step 8: Click Next
    // -----------------------------
    await page.getByRole('button', { name: "Next" }).click();
    console.log("✅ Clicked Next button");

    // -----------------------------
    // Step 9: On members page - Add first user only
    // -----------------------------
    const firstAddButton = page.locator('button:has-text("Add")').first();
    await firstAddButton.click();
    console.log("👥 Added first user to group");

    // wait 1 sec before proceeding
    await page.waitForTimeout(1000);

    // -----------------------------
    // Step 10: Click "Create New Groups"
    // -----------------------------
    await page.getByRole('button', { name: "Create New Groups" }).click();
    console.log("🚀 Clicked Create New Groups");

    // Pause for inspection
    await page.pause();
});
