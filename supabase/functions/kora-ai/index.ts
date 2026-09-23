// KORA AI · Supabase Edge Function
// Ações:
//   chat      → conversa com o assistente do museu (streaming de texto)
//   identify  → identifica uma obra a partir de uma foto (reserva do scanner)
//   translate → traduz um texto curto (uso interno)
// A chave do Gemini fica só aqui, como segredo (GEMINI_API_KEY). Nunca vai para o navegador.

const API = "https://generativelanguage.googleapis.com/v1beta/models";
const KEY = Deno.env.get("GEMINI_API_KEY") ?? "";
// Cadeia de modelos: tenta o primeiro; se estiver sem cota ou fora do ar, cai para o próximo.
const MODELS = (Deno.env.get("GEMINI_MODELS") ?? "gemini-3.6-flash,gemini-flash-lite-latest,gemma-4-31b-it")
  .split(",").map((m) => m.trim()).filter(Boolean);

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type Msg = { role: "user" | "assistant"; content: string };
type Part = { text?: string; inline_data?: { mime_type: string; data: string } };

const LANG_NAME: Record<string, string> = { pt: "português do Brasil", en: "English", es: "español" };

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });
}

function buildBody(model: string, system: string, contents: { role: string; parts: Part[] }[], extra: Record<string, unknown> = {}) {
  // Modelos Gemma não aceitam instrução de sistema: o texto vai junto da primeira mensagem.
  if (model.startsWith("gemma")) {
    const [first, ...rest] = contents;
    const merged = { role: first.role, parts: [{ text: `${system}\n\n---\n\n` }, ...first.parts] };
    return { contents: [merged, ...rest], ...extra };
  }
  return { systemInstruction: { parts: [{ text: system }] }, contents, ...extra };
}

async function callModels(
  system: string,
  contents: { role: string; parts: Part[] }[],
  opts: { stream: boolean; generationConfig?: Record<string, unknown> },
): Promise<{ res: Response; model: string }> {
  let last = "";
  for (const model of MODELS) {
    const url = `${API}/${model}:${opts.stream ? "streamGenerateContent?alt=sse" : "generateContent"}`;
    const thinking = model.startsWith("gemini-3")
      ? { thinkingConfig: { thinkingLevel: "minimal" } }
      : model.startsWith("gemini") ? { thinkingConfig: { thinkingBudget: 0 } } : {};
    const body = buildBody(model, system, contents, { generationConfig: { temperature: 0.4, ...thinking, ...(opts.generationConfig ?? {}) } });
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 35_000);
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": KEY },
        body: JSON.stringify(body),
        signal: ctrl.signal,
      });
      clearTimeout(timer);
      if (res.ok) return { res, model };
      last = `${model}: ${res.status} ${(await res.text()).slice(0, 200)}`;
    } catch (e) {
      last = `${model}: ${String(e)}`;
    }
  }
  throw new Error(last || "sem modelos disponíveis");
}

function textOf(data: any): string {
  const parts = data?.candidates?.[0]?.content?.parts ?? [];
  return parts.filter((p: any) => !p.thought).map((p: any) => p.text ?? "").join("");
}

async function chat(payload: any) {
  const lang = LANG_NAME[payload.lang] ?? LANG_NAME.pt;
  const museumName = String(payload.museumName ?? "museu").slice(0, 120);
  const context = String(payload.context ?? "").slice(0, 24_000);
  const family = payload.family === true;
  const messages: Msg[] = (payload.messages ?? []).slice(-12);
  if (!messages.length) return json({ error: "mensagem vazia" }, 400);

  const system = [
    `Você é a KORA, guia inteligente do ${museumName}. Você está em um totem e no celular dos visitantes.`,
    `Responda sempre em ${lang}, de forma calorosa, didática e curta (até 120 palavras, salvo pedido explícito).`,
    family ? "O visitante está no modo família: use linguagem simples para crianças e proponha uma brincadeira de observação." : "",
    "Use os DADOS DO MUSEU abaixo como fonte principal. Quando citar uma obra do acervo, escreva o título exatamente como está nos dados, entre asteriscos duplos.",
    "Se a pergunta for sobre algo que não está nos dados, responda com conhecimento geral confiável e deixe claro quando algo deve ser confirmado na recepção.",
    "Nunca invente horários, preços ou exposições. Não use travessão.",
    "Assuntos fora de arte, cultura e visita: responda com gentileza em uma frase e traga a conversa de volta ao museu.",
    "\nDADOS DO MUSEU:\n" + context,
  ].filter(Boolean).join("\n");

  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: String(m.content).slice(0, 2000) }],
  }));

  const { res, model } = await callModels(system, contents, { stream: true, generationConfig: { maxOutputTokens: 700 } });

  // Converte o SSE do Gemini em texto puro, pedaço a pedaço.
  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      let buf = "";
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buf += decoder.decode(value, { stream: true });
          let idx;
          while ((idx = buf.indexOf("\n")) >= 0) {
            const line = buf.slice(0, idx).trim();
            buf = buf.slice(idx + 1);
            if (!line.startsWith("data:")) continue;
            const data = line.slice(5).trim();
            if (!data || data === "[DONE]") continue;
            try {
              const t = textOf(JSON.parse(data));
              if (t) controller.enqueue(encoder.encode(t));
            } catch { /* pedaço parcial */ }
          }
        }
      } finally {
        controller.close();
      }
    },
  });
  return new Response(stream, {
    headers: { ...cors, "Content-Type": "text/plain; charset=utf-8", "X-Kora-Model": model, "Cache-Control": "no-cache" },
  });
}

async function identify(payload: any) {
  const image = String(payload.image ?? "");
  if (!image || image.length > 3_000_000) return json({ error: "imagem inválida" }, 400);
  const lang = LANG_NAME[payload.lang] ?? LANG_NAME.pt;
  const candidates = String(payload.candidates ?? "").slice(0, 8000);
  const system = `Você é especialista em história da arte. Identifique a obra de arte da foto. Responda em ${lang}. ` +
    "Responda SOMENTE com JSON válido, sem markdown, no formato: " +
    '{"found":true|false,"match_id":"id da lista de candidatos ou vazio","title":"","artist":"","year":"","medium":"","summary":"2 a 3 frases sobre a obra e o artista","confidence":0.0}. ' +
    "Se a obra estiver na lista de candidatos, preencha match_id. Se não reconhecer com segurança, use found=false e descreva o que vê em summary. Não invente. Não use travessão.";
  const contents = [{
    role: "user",
    parts: [
      { inline_data: { mime_type: "image/jpeg", data: image.replace(/^data:image\/\w+;base64,/, "") } },
      { text: `Candidatos do acervo (id | título | artista):\n${candidates}` },
    ],
  }];
  const { res, model } = await callModels(system, contents, { stream: false, generationConfig: { temperature: 0.1, maxOutputTokens: 600 } });
  const t = textOf(await res.json());
  const m = t.match(/\{[\s\S]*\}/);
  try {
    return json({ ...JSON.parse(m ? m[0] : t), model });
  } catch {
    return json({ found: false, summary: t.slice(0, 600), model });
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "use POST" }, 405);
  if (!KEY) return json({ error: "GEMINI_API_KEY não configurada" }, 500);
  try {
    const payload = await req.json();
    if (payload.action === "chat") return await chat(payload);
    if (payload.action === "identify") return await identify(payload);
    return json({ error: "ação desconhecida" }, 400);
  } catch (e) {
    return json({ error: String(e).slice(0, 300) }, 502);
  }
});
