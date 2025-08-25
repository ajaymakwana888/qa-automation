// Connester/institute/institute-page.spec.js
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

test('Create a new Institute Page', async ({ page }) => {
    test.setTimeout(120000);

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
    await page.waitForTimeout(1000);

    // Click Institutes in sidebar
    await page.getByRole('link', { name: "Institutes" }).click();
    await expect(page).toHaveURL(/\/institute/);
    console.log("✅ Navigated to Institutes page");

    // Click Create New Institute
    await page.getByRole('link', { name: "Create New Institute" }).click();
    console.log("➕ Create New Institute clicked");

    // Wait for the Institute Page Name field → more reliable than networkidle
    await page.getByPlaceholder('Enter Institute Page Name').waitFor({ state: 'visible', timeout: 10000 });
    console.log("📋 Institute form loaded and ready");

    // -------------------------------
    // Fill the Create Institute Page form
    // -------------------------------

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

    // Upload profile image
    await page.locator('input[type="file"]').first().setInputFiles(filePaths[0]);
    console.log("🖼️ Uploaded profile image");
    await page.waitForTimeout(1000);

    // Upload background image
    if (await page.locator('input[type="file"]').nth(1).count()) {
        await page.locator('input[type="file"]').nth(1).setInputFiles(filePaths[1]);
        console.log("🌆 Uploaded background image");
        await page.waitForTimeout(1000);
    }

    // Institute Page Name
    const instituteName = `Institute_${Math.floor(Math.random() * 10000)}`;
    await page.getByPlaceholder('Enter Institute Page Name').fill(instituteName);
    console.log(`🏫 Institute Page Name: ${instituteName}`);

    // Username
    const username = `inst_${Math.floor(Math.random() * 10000)}`;
    await page.getByPlaceholder('Enter Username').fill(username);
    console.log(`👤 Username: ${username}`);

    // Page Visibility
    const visibilityOptions = ['Anyone', 'Only Followers', 'Only Me'];
    const randomVisibility = visibilityOptions[Math.floor(Math.random() * visibilityOptions.length)];
    await page.getByText("Select Page Visibility").click();
    await page.getByRole('option', { name: randomVisibility }).click();
    console.log(`👁️ Visibility: ${randomVisibility}`);

    // Tagline
    const tagline = `Institute Tagline ${Math.floor(Math.random() * 1000)}`;
    await page.getByPlaceholder('Enter Institute headline').fill(tagline);
    console.log(`📰 Tagline: ${tagline}`);

    // Description
    const description = `This is a test institute description ${Math.floor(Math.random() * 1000)}.`;
    try {
        const editor = page.locator('.ql-editor').first();
        await editor.click();
        await editor.type(description, { delay: 20 });
        console.log(`📝 Description: ${description}`);
    } catch (error) {
        await page.locator('textarea').fill(description);
        console.log(`📝 Description (fallback): ${description}`);
    }

    // -------------------------------
    // Institute Details
    // -------------------------------

    // Industry
    const industryOptions = ["Education", "Technology", "Healthcare", "Finance", "Manufacturing", "Retail", "Hospitality", "Construction"];
    const randomIndustry = industryOptions[Math.floor(Math.random() * industryOptions.length)];
    await page.locator('label:has-text("Industry") + div').click();
    await page.getByRole('option', { name: randomIndustry }).click();
    console.log(`🏭 Industry: ${randomIndustry}`);

    // Institute Size
    const sizeOptions = ["0-10 Employees", "11-50 Employees", "51-100 Employees", "101-150 Employees", "151-200 Employees"];
    const randomSize = sizeOptions[Math.floor(Math.random() * sizeOptions.length)];
    await page.locator('label:has-text("Institute Size") + div').click();
    await page.getByRole('option', { name: randomSize }).click();
    console.log(`👥 Institute Size: ${randomSize}`);

    // Institute Type
    const typeOptions = ["Public", "Private", "Nonprofit", "Government", "Research", "Training Center"];
    const randomType = typeOptions[Math.floor(Math.random() * typeOptions.length)];
    await page.locator('label:has-text("Institute Type") + div').click();
    await page.getByRole('option', { name: randomType }).click();
    console.log(`🏢 Institute Type: ${randomType}`);

    // -------------------------------
    // Submit Form
    // -------------------------------
    await page.getByRole('button', { name: "Create Institute Page" }).click();
    console.log("✅ Create Institute Page clicked");

    // Pause for inspection
    await page.pause();
});
