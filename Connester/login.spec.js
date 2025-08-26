import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

test('Create Media Post with caption + 2 random images', async ({ page }) => {
  // Increase test timeout to handle all posts
  test.setTimeout(120000);

  await page.goto('https://connester.com/login');

  // Login
  await page.fill('input[type="email"]', 'niravv.octal8@gmail.com');
  await page.fill('input[type="password"]', 'Nirav@#$123');
  await page.check('input[type="checkbox"]');
  await page.click('button:has-text("Sign In")');
  await expect(page).toHaveURL(/https:\/\/connester\.com(\/home)?/);

  // Step 1: Create a Content Post
  function getRandomText() {
    const phrases = [
      "Hello World 🌍",
      "Automated Content Post 🚀",
      "Testing Playwright ⚡",
      "Random post 🎲",
      "Bot says hi 🤖",
      "Automation in action 🔥",
      "Posting with Playwright 💻"
    ];
    return phrases[Math.floor(Math.random() * phrases.length)];
  }

  await page.click('text=Share Post');
  const editor = page.locator('div[role="textbox"], div[contenteditable="true"]');
  await editor.first().click();

  const randomText = getRandomText();
  await page.keyboard.type(randomText);

  const publishBtn = page.locator('text=Publish Now');
  await publishBtn.waitFor({ state: 'visible' });
  await publishBtn.click();

  // Step 2: Open Content dropdown
  await page.click('text=Share Post');
  const contentBtn = page.locator('text=Content').first();
  await contentBtn.waitFor({ state: 'visible' });
  await contentBtn.click();

  // Step 3: Select Media Post
  const mediaPostOption = page.locator('text=Media Post').nth(0);
  await mediaPostOption.waitFor({ state: 'visible' });
  await mediaPostOption.click();

  // Step 4: Fill random Post Caption
  const randomCaption = `Automated Media Post 🖼️ #${Math.floor(Math.random() * 10000)}`;
  const mediaEditor = page.locator('div[role="textbox"], div[contenteditable="true"]');
  await mediaEditor.first().click();
  await page.keyboard.type(randomCaption);

  // Step 5: Pick 2 random images from uploads folder
  const uploadsDir = path.join(__dirname, '../uploads');
  const files = fs.readdirSync(uploadsDir).filter(f => /\.(png|jpe?g|gif)$/i.test(f));

  if (files.length < 2) {
    throw new Error("Need at least 2 images in uploads folder!");
  }

  // Shuffle and take first 2
  const shuffled = files.sort(() => 0.5 - Math.random());
  const selectedFiles = shuffled.slice(0, 2);
  const filePaths = selectedFiles.map(f => path.join(uploadsDir, f));

  console.log(`📷 Uploading files: ${selectedFiles.join(', ')}`);

  await page.locator('input[type="file"]').setInputFiles(filePaths);

  // Step 6: Publish
  await publishBtn.click();

  // 🔹 Step 7: Select "Document" from dropdown
  await page.click('text=Share Post');
  await contentBtn.waitFor({ state: 'visible' });
  await contentBtn.click();

  const documentOption = page.locator('text=Document').nth(0);
  await documentOption.waitFor({ state: 'visible' });
  await documentOption.click();

  // 🔹 Step 8: Add random caption
  const randomDocCaption = `Automated Document Post 📄 #${Math.floor(Math.random() * 10000)}`;
  await editor.first().click();
  await page.keyboard.type(randomDocCaption);

  // 🔹 Step 9: Pick 1 random PDF from uploads folder
  const pdfFiles = fs.readdirSync(uploadsDir).filter(f => /\.pdf$/i.test(f));
  if (pdfFiles.length < 1) {
    throw new Error("Need at least 1 PDF in uploads folder!");
  }

  const selectedPdf = path.join(uploadsDir, pdfFiles[Math.floor(Math.random() * pdfFiles.length)]);
  console.log(`📄 Uploading PDF: ${selectedPdf}`);

  await page.locator('input[type="file"]').setInputFiles(selectedPdf);

  // 🔹 Step 10: Publish Document Post
  await publishBtn.click();

  // 🔹 Step 11: Open Content dropdown for Event
  await page.click('text=Share Post');
  await contentBtn.waitFor({ state: 'visible' });
  await contentBtn.click();

  // 🔹 Step 12: Select Event option (exact match to avoid "Events" in sidebar)
  const eventOption = page.getByText('Event', { exact: true });
  await eventOption.waitFor({ state: 'visible' });
  await eventOption.click();

  // 🔹 Step 13: Fill Post Caption for Event
  const eventCaption = `Automated Event Post 🎉 #${Math.floor(Math.random() * 10000)}`;
  const captionEditor = page.locator('div[role="textbox"], div[contenteditable="true"]').first();
  await captionEditor.click();
  await captionEditor.fill('');
  await captionEditor.type(eventCaption);

  // 🔹 Step 14: Upload Event Cover Image
  const imageFiles = fs.readdirSync(uploadsDir).filter(f => /\.(png|jpe?g|gif)$/i.test(f));
  if (imageFiles.length < 1) {
    throw new Error("Need at least 1 image in uploads folder!");
  }
  const randomImage = path.join(uploadsDir, imageFiles[Math.floor(Math.random() * imageFiles.length)]);
  console.log(`🖼️ Uploading Event Cover Image: ${randomImage}`);

  await page.locator('input[type="file"]').setInputFiles(randomImage);

  // 🔹 Step 15: Randomly select Event type
  const eventTypes = ["In Person"];
  const randomType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
  console.log(`📌 Selecting Event type: ${randomType}`);
  await page.getByText(randomType, { exact: true }).click();

  // 🔹 Step 17: Fill Event Name (random)
  const randomEventName = `Automation Event #${Math.floor(Math.random() * 10000)}`;
  await page.getByPlaceholder("Enter Event Name").fill(randomEventName);

  // 🔹 Step 18: Time Zone (random from dropdown)
  await page.getByText("Select Time zone").click();
  const timeZones = [
    "China Standard Time (CST)",
    "Eastern European Time (EET)",
    "Central European Time (CET)",
    "India Standard Time (IST)",
    "Japan Standard Time (JST)",
    "Central Time (CT)",
    "Moscow Standard Time (MSK)",
    "South Africa Standard Time (SAST)"
  ];
  const randomTZ = timeZones[Math.floor(Math.random() * timeZones.length)];
  console.log(`🌍 Selecting Time Zone: ${randomTZ}`);
  await page.getByText(randomTZ, { exact: true }).click();

  // 🔹 Step 19: Location
  await page.getByPlaceholder("Enter Location").fill("Surat, Gujarat, India");

  // 🔹 Step 20: Start Date (pick today + 1 to 7 days randomly)
  const today = new Date();
  const offset = Math.floor(Math.random() * 7) + 1;
  const startDate = new Date(today.setDate(today.getDate() + offset));
  console.log(`📅 Selecting Start Date: ${startDate.toDateString()}`);

  // Open calendar
  await page.getByText("Select Start Date").click();

  // More flexible locator (button | div | span with the date text)
  const dayToSelect = String(startDate.getDate());
  await page.locator(`//button[normalize-space(text())="${dayToSelect}"] | //div[normalize-space(text())="${dayToSelect}"] | //span[normalize-space(text())="${dayToSelect}"]`).first().click();

  // 🔹 Step 21: Start Time (open picker and confirm)
  console.log("⏰ Opening Start Time picker...");
  await page.getByPlaceholder("Select Start Time").click();

  // ✅ Wait for the picker to appear and click "Select"
  await page.getByRole("button", { name: "Select" }).click();
  console.log("✅ Start Time selected (kept default/randomized by spinner UI)");

  // 🔹 Step 22: Description (random text into correct rich text editor)
  const descriptions = [
    "This event will cover new updates and discussions.",
    "Join us for a networking and knowledge sharing session.",
    "Exciting event with multiple activities planned!",
    "Don't miss out on this important gathering."
  ];
  const randomDesc = descriptions[Math.floor(Math.random() * descriptions.length)];

  await page.locator('div.ql-editor[contenteditable="true"][data-placeholder="Ex:topic,schedule,etc"]').fill(randomDesc);

  console.log(`📝 Filled Description: ${randomDesc}`);
  
  // 🔹 Publish Event
  await publishBtn.click();

  // Wait for Event post to complete
  await page.waitForTimeout(3000);

  //Create Job Post
  await page.click('text=Share Post');

  // 🔹 Open Content dropdown
  await page.locator('text=Content').first().click();

  // 🔹 Click "Job" and wait for Job form
  await page.getByText('Job', { exact: true }).click();

  // 🔹 Ensure Job form is visible
  await expect(page.getByPlaceholder("Enter Job Title")).toBeVisible({ timeout: 10000 });

  // ========== Job Form Automation ==========

  // 1. Job Title (random)
  const jobTitles = ["Frontend Developer", "Backend Engineer", "QA Tester", "Product Designer", "DevOps Engineer", "Laravel Developer", "React Developer", "Node.js Developer"];
  const randomTitle = jobTitles[Math.floor(Math.random() * jobTitles.length)];
  await page.getByPlaceholder("Enter Job Title").fill(randomTitle);

  // 2. Select Business (always "Individual Profile")
  const businessDropdown = page.getByRole('button', { name: "Select Bussiness" });
  await businessDropdown.click();
  await page.getByRole('option', { name: "Individual Profile" }).click();

  // 3. Workplace Type (randomly pick one of the three)
  const workplaceDropdown = page.getByRole('button', { name: "Select Workplace Type" });
  await workplaceDropdown.click();

  const options = ["On Site", "Hybrid", "Remote"];
  const randomWorkplaceOption = options[Math.floor(Math.random() * options.length)];
  await page.getByRole('option', { name: randomWorkplaceOption }).click();

  // 🔹 Condition for Job Location
  if (randomWorkplaceOption === "On Site" || randomWorkplaceOption === "Hybrid") {
    await page.getByPlaceholder("Enter Location").fill("Surat, Gujarat, India");
  }

  // 4. Salary Currency (random INR or USD)
  const currencyDropdown = page.getByRole('button', { name: /Select Currency|Indian Rupee \(INR\)/ });
  await currencyDropdown.click();

  const currencies = ["Indian Rupee (INR)", "United States Dollar (USD)"];
  const randomCurrency = currencies[Math.floor(Math.random() * currencies.length)];
  await page.getByRole('option', { name: randomCurrency }).click();

  // 5. Salary
  const randomSalary = Math.floor(Math.random() * 90000) + 10000;
  await page.getByPlaceholder("Enter Salary (e.g., 20.00)").fill(randomSalary.toString());

  // 6. Payroll
  await page.getByText("Select Payroll").click();
  const payrollOptions = ["Hourly", "Daily", "Weekly", "Monthly", "Annually"];
  const randomPayroll = payrollOptions[Math.floor(Math.random() * payrollOptions.length)];
  await page.getByText(randomPayroll, { exact: true }).click();

  // 7. Employment Type
  await page.getByText("Select Employment Type").click();
  const empTypes = ["Full-Time", "Part Time", "Contractor", "Temporary", "Intern", "Volunteer"];
  const randomEmpType = empTypes[Math.floor(Math.random() * empTypes.length)];
  await page.getByText(randomEmpType, { exact: true }).click();

  // 7.1 Work Experience (random selection)
  const workExpDropdown = page.getByRole('button', { name: "Select Work Experience" });
  await workExpDropdown.click();

  const workExpOptions = [
    "Less than a year",
    "1 - 3 years",
    "3 - 5 years",
    "More than 10 years",
    "All can apply"
  ];
  const randomWorkExp = workExpOptions[Math.floor(Math.random() * workExpOptions.length)];
  await page.getByRole('option', { name: randomWorkExp }).click();

  // 8. Application Method (always Applications Through)
  await page.getByText("Select Application method").click();
  await page.getByText("Applications Through", { exact: true }).click();

  // 9. Job Short Description
  const shortDesc = "Exciting opportunity to join our growing automation team!";
  await page.locator('div.ql-editor[contenteditable="true"][data-placeholder="Enter Job Short Description"]').fill(shortDesc);

  // 10. Job Full Description
  const fullDesc = "We are looking for a skilled professional who loves automation, testing, and building scalable systems. Apply now!";
  await page.locator('div.ql-editor[contenteditable="true"][data-placeholder="Enter Job Full Description"]').fill(fullDesc);

  // 🔹 Wait for form validation to complete and Publish button to become enabled
  console.log("⏳ Waiting for Job form validation...");
  
  // Wait for Publish button to become enabled
  const enabledPublishBtn = page.locator('button:has-text("Publish Now"):not([disabled])');
  await enabledPublishBtn.waitFor({ state: 'visible', timeout: 15000 });
  
  // Additional short wait to ensure everything is ready
  await page.waitForTimeout(1000);

  // 🔹 Publish Job
  await enabledPublishBtn.click();
  console.log("✅ Job post published successfully!");

  // Wait for Job post to complete
  await page.waitForTimeout(3000);

  // 🔹 Step 11: Open Content dropdown again for Poll
  const sharePostButton = page.locator('text=Share Post').first();
  await sharePostButton.waitFor({ state: 'visible', timeout: 10000 });
  await sharePostButton.click();

  // Wait for the Share Post modal to appear
  await page.waitForTimeout(2000);
  
  // Re-locate the Content button
  const contentBtnAfterJob = page.locator('text=Content').first();
  await contentBtnAfterJob.waitFor({ state: 'visible', timeout: 10000 });
  await contentBtnAfterJob.click();

  // 🔹 Step 12: Select Poll option
  const pollOption = page.locator('text=Poll').first();
  await pollOption.waitFor({ state: 'visible', timeout: 10000 });
  await pollOption.click();

  // 🔹 Step 13: Fill Poll Post Caption
  const pollCaption = `Automated Poll Post 🗳️ #${Math.floor(Math.random() * 10000)}`;
  const pollCaptionEditor = page.locator('div[role="textbox"], div[contenteditable="true"]').first();
  await pollCaptionEditor.click();
  await pollCaptionEditor.fill('');
  await pollCaptionEditor.type(pollCaption);

  // 🔹 Step 14: Random Poll Question
  const pollQuestions = [
    "Which anime do you like the most?",
    "What's your favorite programming language?",
    "Which framework do you prefer?",
    "What's the best time for coding?",
    "Which OS do you use the most?"
  ];
  const pollQuestion = pollQuestions[Math.floor(Math.random() * pollQuestions.length)];
  await page.fill('input[placeholder="Enter Your Question"]', pollQuestion);

  // 🔹 Step 15: Random Poll Options
  const optionSets = [
    ["Naruto 🌀", "One Piece ☠️", "Attack on Titan ⚔️", "Demon Slayer 🔥"],
    ["JavaScript 💛", "Python 🐍", "PHP 🐘", "Java ☕"],
    ["Laravel 🚀", "Django 🐍", "Spring Boot 🌱", "Express ⚡"],
    ["Morning ☀️", "Afternoon 🌤️", "Evening 🌇", "Night 🌙"],
    ["Windows 💻", "Linux 🐧", "MacOS 🍏", "Other 🌐"]
  ];
  const selectedOptions = optionSets[Math.floor(Math.random() * optionSets.length)];

  // Fill Options 1 & 2
  await page.locator('input[placeholder="Enter Options"]').nth(0).fill(selectedOptions[0]);
  await page.locator('input[placeholder="Enter Options"]').nth(1).fill(selectedOptions[1]);

  // Click "+ Add New Option" twice
  const addOptionBtn = page.locator('text=+ Add New Option');
  await addOptionBtn.click();
  await addOptionBtn.click();

  // Fill Options 3 & 4
  await page.locator('input[placeholder="Enter Options"]').nth(2).fill(selectedOptions[2]);
  await page.locator('input[placeholder="Enter Options"]').nth(3).fill(selectedOptions[3]);

  // 🔹 Step 16: Select Poll Duration
  const pollDurationDropdown = page.locator('text=Select Poll Duration');
  await pollDurationDropdown.click();

  const durationOptions = ["1 Day", "5 Days", "1 Week", "1 Month"];
  const randomDurationOption = durationOptions[Math.floor(Math.random() * durationOptions.length)];
  console.log(`🗳️ Selecting Poll Duration: ${randomDurationOption}`);
  await page.locator(`text=${randomDurationOption}`).click();

  // 🔹 Step 17: Publish Poll Post
  await publishBtn.click();

  await page.pause();
});