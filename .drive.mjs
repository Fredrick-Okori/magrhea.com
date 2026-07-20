import { chromium } from "playwright";

const outDir = process.argv[2];
const browser = await chromium.launch({ args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on("pageerror", (err) => errors.push(String(err)));
page.on("console", (msg) => { if (msg.type() === "error") errors.push(msg.text()); });

await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page.waitForTimeout(1500);

// confirm smooth-wrapper/content exist and Navbar is a sibling, not descendant
const structure = await page.evaluate(() => {
  const wrapper = document.getElementById("smooth-wrapper");
  const nav = document.querySelector("header");
  return {
    hasWrapper: !!wrapper,
    navIsInsideWrapper: wrapper ? wrapper.contains(nav) : null,
    navPosition: nav ? getComputedStyle(nav).position : null,
  };
});
console.log("STRUCTURE:", JSON.stringify(structure));

// scroll down and confirm nav stays fixed at top=0
await page.mouse.wheel(0, 800);
await page.waitForTimeout(1200);
const navRectAfterScroll = await page.evaluate(() => {
  const nav = document.querySelector("header");
  return nav ? nav.getBoundingClientRect().top : null;
});
console.log("NAV_TOP_AFTER_SCROLL:", navRectAfterScroll);
await page.screenshot({ path: `${outDir}/ss-scrolled.png` });

console.log("ERRORS:", JSON.stringify(errors));
await browser.close();
