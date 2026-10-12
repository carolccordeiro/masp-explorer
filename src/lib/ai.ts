import type { Lang, Museum } from "@/data/types";
import { backendReady } from "./analytics";
import { normalize, tr } from "./utils";

const FN_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/kora-ai`;
const KEY = (import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY) as string;

export type ChatMsg = { role: "user" | "assistant"; content: string };

/** Resumo do museu enviado como contexto para a IA (fonte de verdade). */
export function museumContext(m: Museum, lang: Lang): string {
  const lines: string[] = [];
  lines.push(`${m.name} (${m.short}). ${tr(m.about, lang)}`);
  lines.push(`Endereço: ${m.address}. Transporte: ${m.metro}.${m.phone ? ` Telefone: ${m.phone}.` : ""} Site: ${m.site}`);
  lines.push("Horários: " + m.hours.map((h) => `${tr(h.days, lang)} ${h.time}${h.note ? ` (${tr(h.note, lang)})` : ""}`).join("; "));
  lines.push("Ingressos: " + m.tickets.map((t) => `${tr(t.label, lang)} ${t.price}`).join("; "));
  lines.push("Gratuidade: " + m.free.map((f) => tr(f, lang)).join("; "));
  lines.push("Acessibilidade: " + m.accessibility.map((f) => tr(f, lang)).join("; "));
  lines.push("Serviços: " + m.services.map((f) => tr(f, lang)).join("; "));
  lines.push("Exposições: " + m.exhibitions.map((e) => `${e.title}${e.artist ? ` (${e.artist})` : ""}, ${e.dates}, ${e.location ?? ""}: ${tr(e.description, lang)}`).join(" | "));
  lines.push("Espaços: " + m.spaces.map((s) => `${s.name}: ${tr(s.description, lang)}`).join(" | "));
  lines.push("História: " + m.timeline.map((t) => `${t.year} ${tr(t.text, lang)}`).join("; "));
  lines.push("ACERVO (obras disponíveis no app):");
  for (const a of m.artworks) {
    lines.push(`- ${tr(a.title, lang)} | ${a.artist} | ${a.year ?? ""} | ${tr(a.medium, lang)} | ${tr(a.description, lang).slice(0, 180)}`);
  }
  return lines.join("\n");
}

/** Respostas instantâneas para perguntas frequentes (funcionam sem internet e sem IA). */
export function instantAnswer(q: string, m: Museum, lang: Lang): string | null {
  const s = normalize(q);
  const has = (...w: string[]) => w.some((x) => s.includes(x));
  if (has("horario", "hora abre", "abre", "fecha", "funciona", "hours", "open", "horario", "abierto")) {
    return m.hours.map((h) => `**${tr(h.days, lang)}**: ${h.time}${h.note ? ` · ${tr(h.note, lang)}` : ""}`).join("\n");
  }
  if (has("ingresso", "preco", "quanto custa", "valor", "ticket", "price", "entrada", "precio", "gratis", "gratuit", "free")) {
    const t = m.tickets.map((x) => `**${tr(x.label, lang)}**: ${x.price}`).join("\n");
    const f = m.free.map((x) => `• ${tr(x, lang)}`).join("\n");
    return `${t}\n\n${f}`;
  }
  if (has("endereco", "onde fica", "como chegar", "metro", "address", "where is", "direccion", "como llegar")) {
    return `**${m.address}**\n${m.metro}`;
  }
  if (has("acessib", "cadeira de roda", "libras", "accessib", "wheelchair", "accesib")) {
    return m.accessibility.map((x) => `• ${tr(x, lang)}`).join("\n");
  }
  return null;
}

/**
 * Plano B quando a IA está fora do ar ou sem cota: busca no próprio acervo.
 * Se a pergunta cita uma obra ou artista, responde com a ficha; senão, sugere destaques.
 */
export function localAnswer(q: string, m: Museum, lang: Lang): string {
  const s = normalize(q);
  const words = s.split(/[^a-z0-9]+/).filter((w) => w.length > 3);
  let best: { score: number; a: Museum["artworks"][number] } | null = null;
  for (const a of m.artworks) {
    const hay = normalize(`${a.title.pt} ${tr(a.title, lang)} ${a.artist} ${a.tags.join(" ")}`);
    let score = 0;
    for (const w of words) if (hay.includes(w)) score += w.length;
    if (normalize(a.artist).split(" ").some((p) => p.length > 3 && s.includes(p))) score += 6;
    if (!best || score > best.score) best = { score, a };
  }
  const intro = { pt: "Enquanto a IA não responde, aqui vai o que sei pelo acervo:", en: "While the AI is unavailable, here is what the collection says:", es: "Mientras la IA no responde, esto dice la colección:" }[lang];
  if (best && best.score >= 5) {
    const a = best.a;
    return `${intro}\n\n**${tr(a.title, lang)}**, ${a.artist}${a.year ? ` (${a.year})` : ""}.\n\n${tr(a.description, lang)}\n\n${tr(a.history, lang)}`;
  }
  const picks = m.artworks.slice(0, 5).map((a) => `• **${tr(a.title, lang)}**, ${a.artist}`).join("\n");
  const more = { pt: "Algumas obras imperdíveis:", en: "Some unmissable works:", es: "Algunas obras imperdibles:" }[lang];
  return `${intro}\n\n${tr(m.about, lang)}\n\n${more}\n${picks}`;
}

/** Tema da pergunta (só a categoria vai para as métricas, nunca o texto). */
export function topicOf(q: string, m: Museum): string {
  const s = normalize(q);
  const has = (...w: string[]) => w.some((x) => s.includes(x));
  if (has("horario", "abre", "fecha", "hours", "open", "abierto", "cierra")) return "horarios";
  if (has("ingresso", "preco", "quanto custa", "gratis", "ticket", "price", "free", "precio", "entrada")) return "ingressos";
  if (has("acessib", "cadeira", "libras", "accessib", "wheelchair", "accesib")) return "acessibilidade";
  if (has("banheiro", "toilet", "bathroom", "bano", "chapelaria", "guarda-volume")) return "servicos";
  if (has("cafe", "restaurante", "comer", "food", "eat", "comida", "lanchonete")) return "comida";
  if (has("chegar", "metro", "onde fica", "endereco", "estacion", "address", "llegar")) return "como_chegar";
  if (has("crianca", "filho", "kid", "child", "nino", "familia", "family")) return "criancas";
  if (has("exposic", "exhibit", "em cartaz", "on view")) return "exposicoes";
  if (has("roteiro", "o que ver", "tenho 1 hora", "imperdive", "must see", "que ver")) return "o_que_ver";
  const words = s.split(/[^a-z0-9]+/).filter((w) => w.length > 3);
  if (m.artworks.some((a) => words.some((w) => normalize(`${a.title.pt} ${a.artist}`).includes(w)))) return "obras_artistas";
  return "outros";
}

export async function* chatStream(opts: {
  museum: Museum;
  lang: Lang;
  messages: ChatMsg[];
  family: boolean;
  signal?: AbortSignal;
}): AsyncGenerator<string> {
  if (!backendReady) throw new Error("offline");
  const res = await fetch(FN_URL, {
    method: "POST",
    signal: opts.signal,
    headers: { "Content-Type": "application/json", apikey: KEY, Authorization: `Bearer ${KEY}` },
    body: JSON.stringify({
      action: "chat",
      lang: opts.lang,
      family: opts.family,
      museumName: opts.museum.name,
      context: museumContext(opts.museum, opts.lang),
      messages: opts.messages,
    }),
  });
  if (!res.ok || !res.body) throw new Error(`erro ${res.status}`);
  const reader = res.body.getReader();
  const dec = new TextDecoder();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    yield dec.decode(value, { stream: true });
  }
}

export interface IdentifyResult {
  found: boolean;
  match_id?: string;
  title?: string;
  artist?: string;
  year?: string;
  medium?: string;
  summary?: string;
  confidence?: number;
}

export async function identifyArtwork(imageDataUrl: string, lang: Lang, candidates: string): Promise<IdentifyResult> {
  if (!backendReady) throw new Error("offline");
  const res = await fetch(FN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: KEY, Authorization: `Bearer ${KEY}` },
    body: JSON.stringify({ action: "identify", image: imageDataUrl, lang, candidates }),
  });
  if (!res.ok) throw new Error(`erro ${res.status}`);
  return res.json();
}
