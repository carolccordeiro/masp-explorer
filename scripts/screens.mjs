// Captura telas do app para revisão visual. Uso: node scripts/screens.mjs <baseUrl> <outDir> [rotas...]
import { chromium } from "@playwright/test";
const [base, out, ...routes] = process.argv.slice(2);
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
for (const vp of [{ name: "m", width: 390, height: 844, dpr: 2 }, { name: "d", width: 1440, height: 900, dpr: 1 }]) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: vp.dpr, colorScheme: process.env.DARK ? "dark" : "light" });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => console.log("[pageerror]", e.message));
  page.on("console", (m) => m.type() === "error" && console.log("[console]", m.text().slice(0, 200)));
  for (const r of routes) {
    await page.goto(base + r, { waitUntil: "networkidle" }).catch(() => {});
    await page.waitForTimeout(900);
    const file = `${out}/${vp.name}-${r.replace(/[^a-z0-9]+/gi, "_") || "home"}.png`;
    await page.screenshot({ path: file, fullPage: process.env.FULL === "1" });
  }
  await ctx.close();
}
await browser.close();
