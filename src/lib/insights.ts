// Análises do painel do museu: transforma eventos anônimos em indicadores para a gestão.
import type { ArtIndexItem } from "@/data/museums";
import type { MuseumMeta, Theme } from "@/data/types";

export type Ev = {
  id: number;
  created_at: string;
  museum: string;
  type: string;
  path: string | null;
  artwork_id: string | null;
  session_id: string;
  device: string | null;
  lang: string | null;
  value: number | null;
};

export const FEATURE_TYPES = ["scan_match", "chat", "audio", "plan", "quiz_done", "hunt_found", "favorite", "scan_ai", "qr"] as const;

/** São Paulo está em UTC-3 o ano todo (sem horário de verão desde 2019). */
export function spParts(iso: string) {
  const d = new Date(new Date(iso).getTime() - 3 * 3600e3);
  return { day: d.getUTCDay(), hour: d.getUTCHours(), date: d.toISOString().slice(0, 10) };
}

const median = (xs: number[]) => {
  if (!xs.length) return 0;
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

const countBy = <T,>(xs: T[], key: (x: T) => string | null | undefined) => {
  const out: Record<string, number> = {};
  for (const x of xs) {
    const k = key(x);
    if (k) out[k] = (out[k] ?? 0) + 1;
  }
  return out;
};

const top = (rec: Record<string, number>, n = 99) =>
  Object.entries(rec)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n);

type Session = {
  id: string;
  museum: string;
  start: number;
  end: number;
  device: string;
  lang: string;
  types: Set<string>;
  prefs: Set<string>;
  n: number;
};

export function analyze(events: Ev[], index: Map<string, ArtIndexItem>) {
  // sessões
  const byId = new Map<string, Session & { museums: Record<string, number> }>();
  for (const e of events) {
    if (e.type === "people") continue;
    const t = new Date(e.created_at).getTime();
    let s = byId.get(e.session_id);
    if (!s) {
      s = { id: e.session_id, museum: "hub", start: t, end: t, device: e.device ?? "mobile", lang: e.lang ?? "pt", types: new Set(), prefs: new Set(), n: 0, museums: {} };
      byId.set(e.session_id, s);
    }
    s.start = Math.min(s.start, t);
    s.end = Math.max(s.end, t);
    s.types.add(e.type);
    s.n++;
    if (e.museum !== "hub") s.museums[e.museum] = (s.museums[e.museum] ?? 0) + 1;
    if (e.type === "pref" && e.path) {
      const [k, v] = e.path.split(":");
      const on = v === "true" || (k === "fontScale" && Number(v) > 1);
      if (on) s.prefs.add(k);
    }
    if (e.lang && e.lang !== "pt") s.lang = e.lang;
  }
  const sessions = [...byId.values()].map((s) => ({ ...s, museum: top(s.museums, 1)[0]?.[0] ?? "hub" }));
  const visitors = sessions.length;
  const durations = sessions.filter((s) => s.n >= 2).map((s) => (s.end - s.start) / 60000);
  const avgMinutes = Math.round(median(durations));
  const nonView = events.filter((e) => !["view", "session_start", "people", "pref", "scan", "ad_view", "ad_click"].includes(e.type));
  const perVisitor = visitors ? nonView.length / visitors : 0;

  // scanner
  const matches = events.filter((e) => e.type === "scan_match").length;
  const attempts = Math.max(matches, events.filter((e) => e.type === "scan").length);
  const scanRate = attempts ? Math.round((matches / attempts) * 100) : null;
  const chats = events.filter((e) => e.type === "chat").length;

  // quando: dia da semana x hora (início das sessões)
  const heat = Array.from({ length: 7 }, () => Array<number>(24).fill(0));
  const hourly = Array<number>(24).fill(0);
  for (const s of sessions) {
    const p = spParts(new Date(s.start).toISOString());
    heat[p.day][p.hour]++;
    hourly[p.hour]++;
  }
  let peak = { day: 0, hour: 0, v: 0 };
  heat.forEach((row, d) => row.forEach((v, h) => v > peak.v && (peak = { day: d, hour: h, v })));
  const byDay = heat.map((row) => row.reduce((a, b) => a + b, 0));
  const peakHour = hourly.indexOf(Math.max(...hourly));

  // por dia (tendência)
  const daily = top(countBy(sessions, (s) => spParts(new Date(s.start).toISOString()).date))
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, v]) => ({ date, v }));

  // uso dos recursos
  const features = top(countBy(nonView, (e) => e.type));
  // funil aninhado: cada etapa conta só quem passou pela anterior
  const has = (s: Session, types: string[]) => types.some((t) => s.types.has(t));
  const st1 = sessions.filter((s) => has(s, ["artwork_view", "scan_match"]));
  const st2 = st1.filter((s) => has(s, ["scan_match", "chat", "audio", "plan", "quiz_done", "hunt_found"]));
  const st3 = st2.filter((s) => has(s, ["favorite"]));
  const funnel = [
    { key: "enter", v: visitors },
    { key: "artwork", v: st1.length },
    { key: "feature", v: st2.length },
    { key: "favorite", v: st3.length },
  ];

  // preferências de conteúdo
  const artEvents = events.filter((e) => e.artwork_id && (e.type === "artwork_view" || e.type === "scan_match" || e.type === "audio" || e.type === "favorite"));
  const works = top(countBy(artEvents, (e) => e.artwork_id), 8);
  const themes = top(countBy(artEvents, (e) => index.get(e.artwork_id!)?.theme)) as [Theme, number][];
  const artists = top(countBy(artEvents, (e) => index.get(e.artwork_id!)?.artist), 6);
  const favorites = top(countBy(events.filter((e) => e.type === "favorite"), (e) => e.artwork_id), 5);

  // perfil
  const langs = top(countBy(sessions, (s) => s.lang));
  const devices = top(countBy(sessions, (s) => s.device));
  const prefCount = (k: string) => sessions.filter((s) => s.prefs.has(k)).length;
  const access = [
    { key: "family", v: prefCount("family") },
    { key: "fontScale", v: prefCount("fontScale") },
    { key: "highContrast", v: prefCount("highContrast") },
    { key: "libras", v: prefCount("libras") },
    { key: "reduceMotion", v: prefCount("reduceMotion") },
  ];
  const quiz = events.filter((e) => e.type === "quiz_done" && e.value != null).map((e) => e.value!);
  const quizAvg = quiz.length ? quiz.reduce((a, b) => a + b, 0) / quiz.length : null;

  // mídia: impressões e cliques (cupons) por parceiro
  const adMap: Record<string, { views: number; clicks: number }> = {};
  for (const e of events) {
    if ((e.type === "ad_view" || e.type === "ad_click") && e.path) {
      const a = (adMap[e.path] ??= { views: 0, clicks: 0 });
      if (e.type === "ad_view") a.views++;
      else a.clicks++;
    }
  }
  const ads = Object.entries(adMap)
    .map(([id, v]) => ({ id, ...v, ctr: v.views ? (v.clicks / v.views) * 100 : 0 }))
    .sort((a, b) => b.views - a.views);

  return {
    ads,
    sessions,
    visitors,
    avgMinutes,
    perVisitor,
    scanRate,
    chats,
    matches,
    heat,
    hourly,
    peak,
    peakHour,
    byDay,
    daily,
    features,
    funnel,
    works,
    themes,
    artists,
    favorites,
    langs,
    devices,
    access,
    quizAvg,
  };
}

export type Insights = ReturnType<typeof analyze>;

/** Comparação lado a lado dos museus da rede. */
export function compareMuseums(events: Ev[], index: Map<string, ArtIndexItem>, museums: MuseumMeta[]) {
  const all = analyze(events, index);
  return museums.map((m) => {
    const ids = new Set(all.sessions.filter((s) => s.museum === m.id).map((s) => s.id));
    const a = analyze(
      events.filter((e) => ids.has(e.session_id)),
      index,
    );
    return { museum: m, ...a };
  });
}

/* ------------------------------------------------------------------ */
/* Simulação: 30 dias de uso plausível, para demonstrar o painel.      */
/* ------------------------------------------------------------------ */

function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function generateDemo(index: ArtIndexItem[], museums: MuseumMeta[], now = Date.now(), partners: { id: string; museum: string }[] = []): Ev[] {
  const r = rng(20261024);
  const pick = <T,>(xs: [T, number][]) => {
    const total = xs.reduce((a, [, w]) => a + w, 0);
    let x = r() * total;
    for (const [v, w] of xs) if ((x -= w) <= 0) return v;
    return xs[xs.length - 1][0];
  };
  const out: Ev[] = [];
  let id = -1;
  const base: Record<string, number> = { masp: 46, ims: 24, mam: 21 };
  const toMin = (hhmm: string) => Number(hhmm.slice(0, 2)) * 60 + Number(hhmm.slice(3));
  // popularidade: as primeiras obras de cada acervo são os destaques
  const works: Record<string, [ArtIndexItem, number][]> = {};
  for (const m of museums) {
    const list = index.filter((a) => a.museum === m.id);
    works[m.id] = list.map((a, i) => [a, 1 / Math.pow(i + 2, 0.75) + r() * 0.05]);
  }

  const startDay = new Date(now - 29 * 864e5);
  for (let d = 0; d < 30; d++) {
    const day0 = Date.UTC(startDay.getUTCFullYear(), startDay.getUTCMonth(), startDay.getUTCDate() + d) + 3 * 3600e3; // 00:00 em SP
    const weekday = new Date(day0 - 3 * 3600e3).getUTCDay();
    for (const m of museums) {
      const open = m.week[weekday];
      if (!open) continue;
      const free = m.freeDays.find((f) => f.day === weekday);
      const weekend = weekday === 0 || weekday === 6;
      let n = base[m.id] * (weekend ? 1.7 : 1) * (free && !free.from ? 1.45 : 1) * (0.8 + r() * 0.4);
      n = Math.round(n);
      const [o, c] = [toMin(open[0]), toMin(open[1])];
      for (let k = 0; k < n; k++) {
        // chegada: pico no meio da tarde; noite grátis do MASP às sextas
        let minute: number;
        if (free?.from && r() < 0.35) minute = toMin(free.from) + r() * (c - toMin(free.from) - 20);
        else {
          const g = (r() + r() + r()) / 3; // aproxima uma normal
          minute = o + 20 + g * (c - o - 40) + (r() - 0.35) * 60;
        }
        minute = Math.max(o, Math.min(c - 15, minute));
        let t = day0 + minute * 60000;
        if (t > now) continue;
        const sid = `demo-${m.id}-${d}-${k}`;
        const device = pick<string>([["mobile", 78], ["totem", 15], ["desktop", 7]]);
        const lang = pick<string>([["pt", 70], ["en", 19], ["es", 11]]);
        const push = (type: string, extra: Partial<Ev> = {}) => {
          if (t > now) return;
          out.push({ id: id--, created_at: new Date(t).toISOString(), museum: m.id, type, path: null, artwork_id: null, session_id: sid, device, lang, value: null, ...extra });
        };
        const step = (lo: number, hi: number) => (t += (lo + r() * (hi - lo)) * 60000);
        push("session_start", { museum: "hub" });
        push("view", { path: `/${m.id}` });
        const family = r() < (weekend ? 0.2 : 0.09);
        if (family) push("pref", { path: "family:true" });
        if (r() < 0.07) push("pref", { path: "fontScale:1.15" });
        if (r() < 0.035) push("pref", { path: "highContrast:true" });
        if (r() < 0.022) push("pref", { path: "libras:true" });
        if (r() < 0.015) push("pref", { path: "reduceMotion:true" });
        if (r() < 0.24) {
          step(0.5, 2);
          push("plan", { value: pick<number>([[30, 3], [60, 5], [90, 2]]) });
        }
        const seen: ArtIndexItem[] = [];
        const nWorks = r() < 0.12 ? 0 : 1 + Math.floor(r() * (family ? 5 : 9));
        for (let w = 0; w < nWorks; w++) {
          step(1.5, 5);
          const a = pick(works[m.id]);
          seen.push(a);
          if (r() < 0.38) {
            push("scan", { value: 80 + Math.round(r() * 18) });
            if (r() < 0.93) push("scan_match", { artwork_id: a.id, value: 82 + Math.round(r() * 16) });
          } else push("artwork_view", { artwork_id: a.id });
          if (r() < 0.28) {
            step(0.5, 2);
            push("audio", { artwork_id: a.id });
          }
          if (r() < 0.12) push("favorite", { artwork_id: a.id });
        }
        // espaço de mídia na página do museu
        const mine = partners.filter((x) => x.museum === m.id);
        if (mine.length && r() < 0.82) {
          step(0.3, 1.5);
          const ad = mine[Math.floor(r() * mine.length)];
          push("ad_view", { path: ad.id });
          if (r() < 0.35) push("ad_view", { path: mine[(mine.indexOf(ad) + 1) % mine.length].id });
          if (r() < 0.075) push("ad_click", { path: ad.id });
        }
        if (r() < 0.42) {
          const q = 1 + Math.floor(r() * 4);
          for (let i = 0; i < q; i++) {
            step(0.5, 3);
            push("chat");
          }
        }
        if (r() < (family ? 0.4 : 0.14)) {
          step(2, 6);
          push("quiz_done", { value: 2 + Math.floor(r() * 4) });
        }
        if (r() < (family ? 0.22 : 0.05)) {
          step(5, 15);
          push("hunt_found", { value: 5 });
        }
      }
    }
  }
  // sensor de público: leitura recente em cada museu aberto
  for (const m of museums) out.push({ id: id--, created_at: new Date(now - 90e3).toISOString(), museum: m.id, type: "people", path: null, artwork_id: null, session_id: "sensor", device: "totem", lang: "pt", value: 3 + Math.floor(r() * 9) });
  return out.sort((a, b) => b.created_at.localeCompare(a.created_at));
}
