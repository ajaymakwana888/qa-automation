// Connester/events/events.spec.ts
import { test, expect } from '@playwright/test';

test('Open Events from sidebar and apply filters', async ({ page }) => {
  test.setTimeout(90000);

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
  await page.waitForTimeout(2000);

  // Click Events
  await page.getByRole('link', { name: "Events" }).click();

  // ✅ Verify navigation to Events page
  await expect(page).toHaveURL(/\/events/, { timeout: 10000 });
  console.log("✅ Navigated to Events page");

  // ⏳ Wait 3 seconds before reopening sidebar
  await page.waitForTimeout(1500);

  // 🔄 Reopen sidebar to show filters
  await sidebarButton.click();
  console.log("👁️ Sidebar opened to view filters");

  // -------------------------
  // 1. Start Date (pick today + 1 to 7 days randomly)
  // -------------------------
  const today = new Date();
  const offset = Math.floor(Math.random() * 7) + 1;
  const startDate = new Date(today.setDate(today.getDate() + offset));
  console.log(`📅 Selecting Start Date: ${startDate.toDateString()}`);

  // Open calendar
  await page.getByText("Select Date").click();

  // Flexible locator for the day number
  const dayToSelect = String(startDate.getDate());
  await page
    .locator(
      `//button[normalize-space(text())="${dayToSelect}"] | 
       //div[normalize-space(text())="${dayToSelect}"] | 
       //span[normalize-space(text())="${dayToSelect}"]`
    )
    .first()
    .click();

  console.log("📅 Date selected successfully");

  // -------------------------
  // 2. Event Type (pick 1 or 2 options)
  // -------------------------
  const eventTypes = ['Online', 'In Person'];
  const numToPick = Math.floor(Math.random() * 2) + 1;
  const shuffled = eventTypes.sort(() => 0.5 - Math.random());
  const selectedTypes = shuffled.slice(0, numToPick);

  for (const type of selectedTypes) {
    await page.getByRole('button', { name: type }).click();
    await page.waitForTimeout(1000);
  }
  console.log(`🎭 Selected Event Type(s): ${selectedTypes.join(', ')}`);

  // -------------------------
  // 3. Location -> Nearby
  // -------------------------
  const nearbyDropdown = page.getByText('Select nearby locations', { exact: true });
  await nearbyDropdown.click();
  await page.waitForTimeout(1000);

  const nearbyOptions = await page.locator('li[role="option"]').allTextContents();
  if (nearbyOptions.length > 0) {
    const randomNearby = nearbyOptions[Math.floor(Math.random() * nearbyOptions.length)];
    await page.getByRole('option', { name: randomNearby }).click();
    console.log(`📍 Selected Nearby Location: ${randomNearby}`);
  } else {
    console.log("⚠️ No nearby options found.");
  }

  // -------------------------
  // 4. Country (select one)
  // -------------------------
  await page.getByText('Select Country', { exact: true }).click();
  await page.waitForTimeout(1000);

  const countryOptions = await page.locator('li[role="option"]').allTextContents();
  const randomCountry = countryOptions[Math.floor(Math.random() * countryOptions.length)];
  await page.getByRole('option', { name: randomCountry }).click();
  console.log(`🌍 Selected Country: ${randomCountry}`);

  // -------------------------
  // 5. City (depends on selected country)
  // -------------------------
  const cityMap = {
    India: ["Surat", "Ahmedabad", "Mumbai", "Jaipur", "Rajkot", "Jamnagar"],
    "United States": ["New York", "Los Angeles", "Chicago", "Houston", "San Francisco", "Miami"]
  };

  let randomCity = "TestCity"; // fallback if country not mapped
  if (cityMap[randomCountry]) {
    const cities = cityMap[randomCountry];
    randomCity = cities[Math.floor(Math.random() * cities.length)];
  }

  const cityInput = page.locator('input[placeholder="Enter City"]');
  await cityInput.fill(randomCity);
  console.log(`🏙️ Entered City: ${randomCity}`);

  // -------------------------
// ✅ Verify results
// -------------------------
await page.waitForTimeout(5000); // allow results to render

// Try broader locator first
const eventCards = page.locator('div, article, li'); 
const foundCount = await eventCards.count();

if (foundCount === 0) {
  const snippet = await page.locator('body').innerHTML();
  console.log("⚠️ No event cards found. Page snippet:\n", snippet.slice(0, 1500));
  throw new Error("No events found with current filters. Check selector!");
} else {
  console.log(`✅ Found ${foundCount} event elements`);
}

  // Pause for debugging
  await page.pause();
});
