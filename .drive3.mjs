import { chromium } from "playwright";

const outDir = process.argv[2];
const browser = await chromium.launch({ args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on("pageerror", (err) => errors.push(String(err)));
page.on("console", (msg) => { if (msg.type() === "error") errors.push(msg.text()); });

await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page.waitForTimeout(1200);

const approachEl = await page.locator("#approach").first();
await approachEl.scrollIntoViewIfNeeded();
await page.waitForTimeout(1000);
await page.screenshot({ path: `${outDir}/paced-approach-0.png` });

// small, well-paced increments with generous settle time
for (let i = 1; i <= 4; i++) {
  await page.mouse.wheel(0, 150);
  await page.waitForTimeout(900);
}
await page.screenshot({ path: `${outDir}/paced-approach-1.png` });

const galleryEl = await page.locator("text=A handful of rooms").first();
await galleryEl.scrollIntoViewIfNeeded();
await page.waitForTimeout(1000);
await page.screenshot({ path: `${outDir}/paced-gallery-0.png` });

for (let i = 1; i <= 4; i++) {
  await page.mouse.wheel(0, 150);
  await page.waitForTimeout(900);
}
await page.screenshot({ path: `${outDir}/paced-gallery-1.png` });

console.log("ERRORS:", JSON.stringify(errors));
await browser.close();
