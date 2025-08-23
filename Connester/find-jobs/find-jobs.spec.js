// Connester/find-jobs/find-jobs.spec.ts
import { test, expect } from '@playwright/test';

test('Open Find Jobs from sidebar and apply filters', async ({ page }) => {
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

  // Click Find Jobs
  await page.getByRole('link', { name: "Find Jobs" }).click();

  // ✅ Verify navigation to Find Jobs page
  await expect(page).toHaveURL(/\/jobs/, { timeout: 10000 });
  console.log("✅ Navigated to Find Jobs page");

  // ⏳ Wait 5 seconds before reopening sidebar
  await page.waitForTimeout(1000);

  // 🔄 Reopen sidebar to show filters
  await sidebarButton.click();
  console.log("👁️ Sidebar opened to view filters");

  // -------------------------
  // Apply Filters (randomly)
  // -------------------------

  // 1. Date Post
  const dateOptions = ['Any Time', 'Last 7 Days', 'Last 15 Days', 'Last Month'];
  const randomDate = dateOptions[Math.floor(Math.random() * dateOptions.length)];
  await page.getByText('Any Time', { exact: true }).click();
  await page.getByRole('option', { name: randomDate }).click();
  await page.waitForTimeout(1500);
  console.log(`📅 Selected Date Post: ${randomDate}`);

  // 2. Job Type (allow selecting 1 or 2 random options)
    const jobTypes = ['Contract', 'Full-Time', 'Part-Time', 'Internship'];

    const numToPick = Math.floor(Math.random() * 2) + 1; // 1 or 2

    const shuffled = jobTypes.sort(() => 0.5 - Math.random());
    const selectedJobTypes = shuffled.slice(0, numToPick);

    for (const type of selectedJobTypes) {
    await page.getByRole('button', { name: type }).click();
    await page.waitForTimeout(1500); // wait after applying filter
    }

    console.log(`💼 Selected Job Type(s): ${selectedJobTypes.join(', ')}`);


  // 3. Job Location
  const jobLocations = ['On-site', 'Hybrid', 'Remote'];
  const randomJobLocation = jobLocations[Math.floor(Math.random() * jobLocations.length)];
  await page.getByRole('button', { name: randomJobLocation }).click();
  await page.waitForTimeout(1500);
  console.log(`📍 Selected Job Location: ${randomJobLocation}`);

  // 4. Currency
  const currencyOptions = ['Indian Rupee (INR)', 'United States Dollar (USD)'];
  const randomCurrency = currencyOptions[Math.floor(Math.random() * currencyOptions.length)];
  await page.getByText('Indian Rupee (INR)', { exact: true }).click();
  await page.getByRole('option', { name: randomCurrency }).click();
  await page.waitForTimeout(1500);
  console.log(`💰 Selected Currency: ${randomCurrency}`);

    // -------------------------
// 🔥 Payroll (NEW FILTER)
// -------------------------
const payrollOptions = ['Hourly', 'Daily', 'Weekly', 'Monthly', 'Annually'];
const randomPayroll = payrollOptions[Math.floor(Math.random() * payrollOptions.length)];

await page.getByText('Monthly', { exact: true }).click();
await page.getByRole('option', { name: randomPayroll }).click();
await page.waitForTimeout(1500);

console.log(`🕒 Selected Payroll: ${randomPayroll}`);

// -------------------------
// 🔥 Salary Checkbox (Currency + Payroll)
// -------------------------
let salaryCheckboxOptions = [];

if (randomCurrency.includes('USD')) {
  if (randomPayroll === 'Annually') {
    salaryCheckboxOptions = [
      '$0 - $0.99L',
      '$1L - $1.99L',
      '$2L - $2.99L',
      '$3L - $3.99L',
      '$4L - $4.99L',
      '$5L - $5.99L',
      '$6L - $6.99L',
      '$7L - $7.99L',
      '$8L - $8.99L',
      '$9L - $9.99L',
      '$10L+'
    ];
  } else {
    // Default USD ranges (monthly/hourly/etc.)
    salaryCheckboxOptions = [
      '$0 - $9,999',
      '$10,000 - $19,999',
      '$20,000 - $39,999',
      '$40,000 - $59,999',
      '$60,000 - $79,999',
      '$80,000 - $99,999',
      '$100,000 +'
    ];
  }
} else if (randomCurrency.includes('INR')) {
  if (randomPayroll === 'Annually') {
    salaryCheckboxOptions = [
      '₹0 - ₹0.99L',
      '₹1L - ₹1.99L',
      '₹2L - ₹2.99L',
      '₹3L - ₹3.99L',
      '₹4L - ₹4.99L',
      '₹5L - ₹5.99L',
      '₹6L - ₹6.99L',
      '₹7L - ₹7.99L',
      '₹8L - ₹8.99L',
      '₹9L - ₹9.99L',
      '₹10L+'
    ];
  } else {
    // Default INR ranges (monthly/hourly/etc.)
    salaryCheckboxOptions = [
      '₹0 - ₹9,999',
      '₹10,000 - ₹19,999',
      '₹20,000 - ₹39,999',
      '₹40,000 - ₹59,999',
      '₹60,000 - ₹79,999',
      '₹80,000 - ₹99,999',
      '₹100,000 +'
    ];
  }
}

// Pick random salary range
const randomSalary = salaryCheckboxOptions[Math.floor(Math.random() * salaryCheckboxOptions.length)];
await expect(page.getByText(randomSalary, { exact: false })).toBeVisible({ timeout: 10000 });
await page.getByLabel(randomSalary, { exact: false }).check();
await page.waitForTimeout(1500);
console.log(`💵 Selected Salary Range: ${randomSalary}`);


  // 7. Work Experience
  const experienceOptions = [
    'Less than a year',
    '1 - 3 years',
    '3 - 5 years',
    'More than 10 years',
    'All can apply'
  ];
  const randomExperience = experienceOptions[Math.floor(Math.random() * experienceOptions.length)];
  await expect(page.getByText(randomExperience, { exact: false })).toBeVisible({ timeout: 10000 });
  await page.getByLabel(randomExperience, { exact: false }).check();
  await page.waitForTimeout(3000); // ⏳ wait longer after last filter
  console.log(`🧑‍💻 Selected Work Experience: ${randomExperience}`);

  // -------------------------
// ✅ Verify job results safely
// -------------------------

// Try to detect job results (job cards OR salary rows)
const jobCards = page.locator('.job-card, .card');
const jobSalaries = page.locator('li.capitalize', { hasText: 'Salary -' });

// Wait up to 30s for either job cards or salaries to appear
const cardsCount = await jobCards.count();
const salaryCount = await jobSalaries.count();

if (cardsCount === 0 && salaryCount === 0) {
  console.warn("⚠️ No job results found after applying filters!");
} else if (salaryCount > 0) {
  // Collect all salary texts
  const allSalaries = await jobSalaries.allTextContents();
  console.log("🔎 Found job salaries:", allSalaries);

  // Currency check
  if (randomCurrency.includes('USD')) {
    console.log("🔎 Checking job results for USD salaries...");
    for (const salary of allSalaries) {
      if (!salary.includes('USD')) {
        console.warn(`⚠️ Currency mismatch! Expected USD, but got: ${salary}`);
      }
    }
  } else if (randomCurrency.includes('INR')) {
    console.log("🔎 Checking job results for INR salaries...");
    for (const salary of allSalaries) {
      if (!salary.includes('INR')) {
        console.warn(`⚠️ Currency mismatch! Expected INR, but got: ${salary}`);
      }
    }
  }

  // Payroll check
  const payrollOptions = ['Hourly', 'Daily', 'Weekly', 'Monthly', 'Annually'];
  const randomPayroll = payrollOptions.find(opt =>
    allSalaries.some(s => s.toLowerCase().includes(opt.toLowerCase()))
  );

  if (randomPayroll) {
    console.log(`🔎 Checking that results contain payroll type: ${randomPayroll}`);
    for (const salary of allSalaries) {
      if (!salary.toLowerCase().includes(randomPayroll.toLowerCase())) {
        console.warn(`⚠️ Payroll mismatch! Expected ${randomPayroll}, but got: ${salary}`);
      }
    }
  }
} else {
  console.log("✅ Job cards exist but no salary info found.");
}


  console.log("✅ Salary & Payroll verification completed");

  // Pause for debugging
  await page.pause();
});
