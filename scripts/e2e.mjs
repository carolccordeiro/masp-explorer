// Teste ponta a ponta das funções principais. Uso: node scripts/e2e.mjs <baseUrl>
import { chromium } from "@playwright/test";
const base = process.argv[2];
const b = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH });
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
const p = await ctx.newPage();
const errors = [];
p.on("pageerror", (e) => errors.push(e.message));
const ok = (name, cond, extra = "") => console.log(`${cond ? "✅" : "❌"} ${name} ${extra}`);

// 1. Scanner por upload de foto
await p.goto(base + "/masp/scanner");
await p.waitForFunction(() => !document.body.innerText.includes("Preparando o reconhecimento"), null, { timeout: 180000 });
await p.setInputFiles('input[type="file"]', "/home/claude/test-photo.jpg");
await p.waitForSelector("text=Obra encontrada", { timeout: 60000 }).catch(() => {});
const scan = await p.textContent("body");
ok("scanner reconhece O escolar", scan.includes("O escolar"));
await p.screenshot({ path: "/home/claude/shots/e2e-scanner.png" });

// 2. Assistente (resposta instantânea + IA)
await p.goto(base + "/masp/kora");
await p.fill("input", "Qual o horário de funcionamento?");
await p.keyboard.press("Enter");
await p.waitForSelector("text=Resposta instantânea", { timeout: 10000 }).catch(() => {});
ok("resposta instantânea de horário", (await p.textContent("body")).includes("10h às 20h"));
await p.fill("input", "Me conte uma curiosidade sobre o quadro Rosa e Azul");
await p.keyboard.press("Enter");
const t0 = Date.now();
await p.waitForFunction(() => {
  const bubbles = [...document.querySelectorAll(".prose-kora")];
  const last = bubbles[bubbles.length - 1];
  return last && last.textContent.length > 80;
}, null, { timeout: 90000 }).catch(() => {});
const bubbles = await p.$$eval(".prose-kora", (els) => els.map((e) => e.textContent));
ok("IA respondeu", (bubbles.at(-1) || "").length > 80, `(${Math.round((Date.now() - t0) / 1000)}s) ${(bubbles.at(-1) || "").slice(0, 120)}`);
await p.screenshot({ path: "/home/claude/shots/e2e-chat.png" });

// 3. Planejar visita -> roteiro -> QR
await p.goto(base + "/masp/planejar");
await p.click("text=60");
await p.click("text=Família com crianças");
await p.click("text=Gerar meu roteiro");
await p.waitForSelector("text=Seu roteiro");
const stops = await p.$$eval("ol li", (els) => els.length);
ok("roteiro gerado", stops >= 5, `${stops} paradas`);
ok("QR code presente", (await p.$$("svg")).length > 0);
await p.screenshot({ path: "/home/claude/shots/e2e-plan.png", fullPage: true });

// 4. Painel
await p.waitForTimeout(2500);
await p.goto(base + "/painel");
await p.keyboard.press("Enter");
await p.waitForSelector("text=Quando o público vem", { timeout: 20000 }).catch(() => {});
await p.waitForTimeout(2000);
const dash = await p.textContent("body");
ok("painel abre (dados reais ou simulação)", dash.includes("Quando o público vem") && (dash.includes("Ao vivo") || dash.includes("Simulação")));
await p.screenshot({ path: "/home/claude/shots/e2e-dash.png", fullPage: true });

ok("sem erros de página", errors.length === 0, errors.join(" | ").slice(0, 300));
await b.close();
