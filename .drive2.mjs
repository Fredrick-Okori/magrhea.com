import { chromium } from "playwright";

const outDir = process.argv[2];
const browser = await chromium.launch({ args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on("pageerror", (err) => errors.push(String(err)));
page.on("console", (msg) => { if (msg.type() === "error") errors.push(msg.text()); });

await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page.waitForTimeout(1200);

// Hero scroll-linked scale/opacity/y check (framer-motion useScroll)
const heroBefore = await page.evaluate(() => {
  const h1 = document.querySelector("h1");
  return h1 ? getComputedStyle(h1.parentElement).transform : null;
});
console.log("HERO_TRANSFORM_BEFORE:", heroBefore);

await page.mouse.wheel(0, 500);
await page.waitForTimeout(1200);
const heroAfter = await page.evaluate(() => {
  const h1 = document.querySelector("h1");
  return h1 ? getComputedStyle(h1.parentElement).transform : null;
});
console.log("HERO_TRANSFORM_AFTER_SCROLL:", heroAfter);

// Approach (Shape) pinned horizontal scroll
const approachEl = await page.locator("#approach").first();
await approachEl.scrollIntoViewIfNeeded();
await page.waitForTimeout(900);
await page.screenshot({ path: `${outDir}/ss-approach-1.png` });
for (let i = 0; i < 6; i++) {
  await page.mouse.wheel(0, 300);
  await page.waitForTimeout(350);
}
await page.screenshot({ path: `${outDir}/ss-approach-2.png` });
const approachHeight = await page.evaluate(() => document.getElementById("approach")?.getBoundingClientRect().height);
console.log("APPROACH_HEIGHT_MID_SCROLL:", approachHeight);

// Gallery pinned horizontal scroll
const galleryEl = await page.locator("text=A handful of rooms").first();
await galleryEl.scrollIntoViewIfNeeded();
await page.waitForTimeout(900);
await page.screenshot({ path: `${outDir}/ss-gallery-1.png` });
for (let i = 0; i < 8; i++) {
  await page.mouse.wheel(0, 300);
  await page.waitForTimeout(350);
}
await page.screenshot({ path: `${outDir}/ss-gallery-2.png` });

console.log("ERRORS:", JSON.stringify(errors));
await browser.close();
