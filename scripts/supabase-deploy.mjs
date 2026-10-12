// Publica o banco (migrations), a função de IA e o segredo do Gemini no Supabase,
// usando a API de gerenciamento. Uso:
//   SUPABASE_ACCESS_TOKEN=sbp_... SUPABASE_PROJECT_REF=xxxx GEMINI_API_KEY=... npm run supabase:deploy
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const token = process.env.SUPABASE_ACCESS_TOKEN;
const ref = process.env.SUPABASE_PROJECT_REF;
const gemini = process.env.GEMINI_API_KEY;
if (!token || !ref) {
  console.error("Defina SUPABASE_ACCESS_TOKEN e SUPABASE_PROJECT_REF.");
  process.exit(1);
}
const api = (path, init = {}) =>
  fetch(`https://api.supabase.com/v1/projects/${ref}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${token}`, ...(init.headers ?? {}) },
  });

// 1. Migrations
for (const f of readdirSync("supabase/migrations").sort()) {
  const query = readFileSync(join("supabase/migrations", f), "utf8");
  const r = await api("/database/query", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ query }) });
  console.log(`migration ${f}:`, r.status);
}

// 2. Segredo do Gemini
if (gemini) {
  const r = await api("/secrets", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify([{ name: "GEMINI_API_KEY", value: gemini }]),
  });
  console.log("secret GEMINI_API_KEY:", r.status);
}

// 3. Função kora-ai
const form = new FormData();
form.append("metadata", JSON.stringify({ entrypoint_path: "index.ts", name: "kora-ai", verify_jwt: false }));
form.append("file", new Blob([readFileSync("supabase/functions/kora-ai/index.ts")], { type: "application/typescript" }), "index.ts");
const r = await api("/functions/deploy?slug=kora-ai", { method: "POST", body: form });
console.log("function kora-ai:", r.status, (await r.text()).slice(0, 200));
