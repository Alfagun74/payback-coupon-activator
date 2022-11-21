import dotenv from "dotenv";
import { chromium } from "playwright";
import cron from "node-cron";

async function activateCoupons() {
  if (!process.env.USER) {
    console.error("No USER env var provided");
    return;
  }

  if (!process.env.PASS) {
    console.error("No USER env var provided");
    return;
  }

  console.log("Starting Browser...");
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const navigationPromise = page.waitForNavigation();

  console.log("Navigating to /login...");
  await page.goto("https://www.payback.de/login");
  await page.setViewportSize({ width: 1536, height: 818 });
  await navigationPromise;

  // ACCEPT COOKIES
  console.log("Accepting Cookies...");
  await page.waitForSelector("#onetrust-accept-btn-handler");
  await page.click("#onetrust-accept-btn-handler");
  await page.waitForTimeout(2000);

  // ENTER USERNAME
  console.log("Entering Username...");
  await page.waitForSelector("#aliasInputSecure");
  await page.click("#aliasInputSecure");
  await page.type("#aliasInputSecure", process.env.USER);

  // ENTER PASSWORD
  console.log("Entering Password...");
  await page.waitForSelector("#passwordInput");
  await page.click("#passwordInput");
  await page.type("#passwordInput", process.env.PASS);

  // CLICK LOGIN
  console.log("Logging in...");
  await page.waitForSelector("#loginSubmitButtonSecure");
  await page.click("#loginSubmitButtonSecure");
  await navigationPromise;

  // OPEN COUPON PAGE
  console.log("Opening Coupons...");
  await page.goto("https://www.payback.de/coupons");

  // FIND ALL COUPONS AND CLICK THEM
  console.log("Counting Coupons...");
  const count = await page
    .locator('button:has-text("Jetzt aktivieren")')
    .count();
  console.log(`Found ${count} coupons...`);

  if (count > 0) {
    for (let i = count; i > 0; i--) {
      console.log(`Activating Coupon #${i}...`);
      await page.click('button:has-text("Jetzt aktivieren")');
    }
  } else {
    console.log(`No Coupons found. Trying again in ${xhours} Hours...`);
  }

  // CLOSE BROWSER
  console.log("Closing Browser...");
  await page.waitForTimeout(3000);
  await browser.close();
}

dotenv.config();
let xhours = process.env.EVERY_X_HOURS;

if (!xhours) {
  console.warn("WARN: No EVERY_X_HOURS env var provided, defaulting to 6");
  xhours = 6;
}

await activateCoupons();
cron.schedule(`0 */${xhours} * * *`, () => activateCoupons());
