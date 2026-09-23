import { chromium } from "@playwright/test";
import { createServer } from "vite";
const server = await createServer({ server: { port: 5198, host: "127.0.0.1" }, logLevel: "error" }); await server.listen();
const b = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH }); const p = await b.newPage();
await p.goto("http://127.0.0.1:5198/tools/scantest.html");
while (true) { const s = await p.textContent("#s"); if (s === "pronto" || s.startsWith("erro")) { if (s.startsWith("erro")) console.log(s); break; } await p.waitForTimeout(2000); }
const { res, neg } = await p.evaluate(() => window.__R__);
const acc = res.filter((r) => r.ok).length / res.length;
const q = (arr, f) => { const a = [...arr].sort((x, y) => x - y); return a[Math.floor(f * (a.length - 1))].toFixed(3); };
console.log("top1:", (acc * 100).toFixed(1) + "%", "n=", res.length);
console.log("score acertos p10/p50/p90:", q(res.filter(r=>r.ok).map(r=>r.top),.1), q(res.filter(r=>r.ok).map(r=>r.top),.5), q(res.filter(r=>r.ok).map(r=>r.top),.9));
console.log("score erros:", res.filter(r=>!r.ok).map(r=>`${r.id}->${r.best} ${r.top.toFixed(3)}`).join(" | "));
console.log("negativos p50/p90/max:", q(neg,.5), q(neg,.9), Math.max(...neg).toFixed(3));
console.log("margem (top-second) acertos p10:", q(res.filter(r=>r.ok).map(r=>r.top-r.second),.1));
await b.close(); await server.close();
