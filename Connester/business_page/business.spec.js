// Connester/business/business-page.spec.js
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

test('Create a new Business Page', async ({ page }) => {
    test.setTimeout(120000); // Increased timeout

    // Go to login page
    await page.goto('https://connester.com/login');

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

    // Click Business Pages in sidebar
    await page.getByRole('link', { name: "Business Pages" }).click();
    await expect(page).toHaveURL(/\/business-page/);
    console.log("✅ Navigated to Business Pages page");

    // Click Create New Page
    await page.getByRole('link', { name: "Create New Page" }).click();
    console.log("➕ Create New Page clicked");

    // Wait for the Business Page Name field to appear → faster and reliable
    await page.getByPlaceholder('Enter Business Page Name').waitFor({ state: 'visible', timeout: 10000 });
    console.log("📋 Form loaded and ready");


    // Take a screenshot for debugging
    await page.screenshot({ path: 'form-debug.png' });
    console.log("📸 Took screenshot for debugging");

    // -------------------------------
    // Fill the Create Business Page form
    // -------------------------------

    // Step 1 & 2: Upload profile + background image
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

    // Step 2: Business Page Name
    const businessName = `Business_${Math.floor(Math.random() * 10000)}`;
    await page.getByPlaceholder('Enter Business Page Name').fill(businessName);
    console.log(`🏢 Business Page Name: ${businessName}`);
    await page.waitForTimeout(1000);

    // Step 3: Username
    const username = `biz_${Math.floor(Math.random() * 10000)}`;
    await page.getByPlaceholder('Enter Username').fill(username);
    console.log(`👤 Username: ${username}`);
    await page.waitForTimeout(1000);

    // Step 4: Page Visibility
    const visibilityOptions = ['Anyone', 'Only Followers', 'Only Me'];
    const randomVisibility = visibilityOptions[Math.floor(Math.random() * visibilityOptions.length)];

    await page.getByText("Select Page Visibility").click();
    await page.getByRole('option', { name: randomVisibility }).click();
    console.log(`👁️ Visibility: ${randomVisibility}`);
    await page.waitForTimeout(1000);

    // Step 6: Tagline - Try multiple approaches
    const tagline = `Tagline_${Math.floor(Math.random() * 1000)}`;

    const taglineSelectors = [
        'input[placeholder="Enter Tagline"]',
        'input[name="tagline"]',
        '#tagline',
        'label:has-text("Tagline") + input',
        'input[aria-label="Tagline"]'
    ];

    let taglineFilled = false;
    for (const selector of taglineSelectors) {
        try {
            if (await page.locator(selector).count() > 0) {
                await page.locator(selector).fill(tagline);
                console.log(`📰 Tagline: ${tagline} (using selector: ${selector})`);
                taglineFilled = true;
                break;
            }
        } catch (error) {
            console.log(`Selector ${selector} failed, trying next...`);
        }
    }

    if (!taglineFilled) {
        const inputs = await page.locator('input[type="text"]').all();
        for (let i = 0; i < inputs.length; i++) {
            const placeholder = await inputs[i].getAttribute('placeholder');
            if (placeholder && placeholder.toLowerCase().includes('tagline')) {
                await inputs[i].fill(tagline);
                console.log(`📰 Tagline: ${tagline} (found by placeholder)`);
                taglineFilled = true;
                break;
            }
        }
    }

    if (!taglineFilled) {
        console.log("❌ Could not find tagline field");
    }

    // Step 7: Description
    const description = `This is a test business description ${Math.floor(Math.random() * 1000)}.`;

    try {
        const editor = page.locator('.ql-editor').first();
        await editor.click();
        await editor.type(description, { delay: 20 });
        console.log(`📝 Description: ${description}`);
    } catch (error) {
        console.log("Quill editor not found, trying textarea...");
        try {
            await page.locator('textarea').fill(description);
            console.log(`📝 Description: ${description}`);
        } catch (error) {
            console.log("Textarea not found, trying contenteditable...");
            await page.locator('[contenteditable="true"]').fill(description);
            console.log(`📝 Description: ${description}`);
        }
    }

    // -------------------------------
    // NEW: Industry, Business Size, Business Type
    // -------------------------------

    // Industry
    const industryOptions = ["Education", "Technology", "Healthcare", "Finance", "Manufacturing", "Retail", "Hospitality", "Construction"];
    const randomIndustry = industryOptions[Math.floor(Math.random() * industryOptions.length)];
    await page.locator('label:has-text("Industry") + div').click();
    await page.getByRole('option', { name: randomIndustry }).click();
    console.log(`🏭 Industry: ${randomIndustry}`);
    await page.waitForTimeout(1000);

    // Business Size
    const sizeOptions = ["0-10 Employees", "11-50 Employees", "51-100 Employees", "101-150 Employees", "151-200 Employees"];
    const randomSize = sizeOptions[Math.floor(Math.random() * sizeOptions.length)];
    await page.locator('label:has-text("Business Size") + div').click();
    await page.getByRole('option', { name: randomSize }).click();
    console.log(`👥 Business Size: ${randomSize}`);
    await page.waitForTimeout(1000);

    // Business Type
    const typeOptions = ["Public company", "Self-employed", "Government agency", "Nonprofit", "Sole proprietorship", "Privately held", "Partnership"];
    const randomType = typeOptions[Math.floor(Math.random() * typeOptions.length)];
    await page.locator('label:has-text("Business Type") + div').click();
    await page.getByRole('option', { name: randomType }).click();
    console.log(`🏢 Business Type: ${randomType}`);
    await page.waitForTimeout(1000);

    console.log("✅ Form filled successfully");

    // Click Create Business Page button
    await page.getByRole('button', { name: "Create Business Page" }).click();
    console.log("✅ Create Business Page clicked");

    // Pause for inspection
    await page.pause();
});
