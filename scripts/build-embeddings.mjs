// Gera public/museums/embeddings.json abrindo tools/embed.html em um Chromium sem tela.
// Uso: npm run data:embeddings   (sobe o servidor de desenvolvimento automaticamente)
import { chromium } from "@playwright/test";
import { createServer } from "vite";
import { writeFileSync } from "node:fs";

const server = await createServer({ server: { port: 5199, host: "127.0.0.1" }, logLevel: "error" });
await server.listen();
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
const page = await browser.newPage();
page.on("console", (m) => m.type() === "error" && console.error("[page]", m.text()));
await page.goto("http://127.0.0.1:5199/tools/embed.html");
const t0 = Date.now();
while (true) {
  const s = await page.textContent("#s");
  if (s === "pronto" || s?.startsWith("erro")) break;
  if (Date.now() - t0 > 20 * 60_000) throw new Error("timeout");
  process.stdout.write(`\r${s}   `);
  await page.waitForTimeout(1500);
}
const err = await page.evaluate(() => window.__EMBEDS_ERR__);
if (err) throw new Error(err);
const data = await page.evaluate(() => window.__EMBEDS__);
// Quantiza para int8 (vetores normalizados cabem em [-1, 1]); arquivo ~5x menor, precisão suficiente.
const packed = {
  dim: data.dim,
  n: data.items[0].v.length,
  items: data.items.map((it) => {
    const flat = it.v.flat();
    const buf = Buffer.alloc(flat.length);
    flat.forEach((x, i) => buf.writeInt8(Math.max(-127, Math.min(127, Math.round(x * 127))), i));
    return { id: it.id, museum: it.museum, q: buf.toString("base64") };
  }),
};
writeFileSync("public/museums/embeddings.json", JSON.stringify(packed));
console.log(`\nok: ${data.items.length} obras, dimensão ${data.dim}`);
await browser.close();
await server.close();
