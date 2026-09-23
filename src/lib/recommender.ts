import type { Artwork, Theme } from "@/data/types";

export type Profile = "solo" | "couple" | "family" | "group";

export interface PlanInput {
  minutes: number;
  profile: Profile;
  themes: Theme[];
  favorites?: string[]; // ids de obras salvas
}

export interface Stop {
  art: Artwork;
  score: number;
  reason: "theme" | "favorite" | "kids" | "highlight" | "variety";
}

const THEMES: Theme[] = ["classica", "moderna", "contemporanea", "brasil", "fotografia", "mundo"];

/** Vetor de características de uma obra: tema (one-hot) + sinais leves das tags. */
function features(a: Artwork): number[] {
  const v: number[] = THEMES.map((t) => (a.theme === t ? 1 : 0));
  const tags = a.tags.join(" ").toLowerCase();
  if (/brasil|brasileir/.test(tags)) v[3] = Math.max(v[3], 0.6);
  if (/retrato|paisagem|natureza/.test(tags)) v.push(0.5);
  else v.push(0);
  return v;
}

function cosine(a: number[], b: number[]) {
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return na && nb ? dot / Math.sqrt(na * nb) : 0;
}

/**
 * Recomendação por similaridade de cosseno entre o perfil do visitante e cada obra,
 * com bônus para favoritas, obras icônicas (ordem do acervo) e textos para crianças.
 * O número de paradas vem do tempo disponível (cerca de 6 min por obra, com deslocamento).
 */
export function planRoute(artworks: Artwork[], input: PlanInput, spaceOrder: Map<string, number> = new Map()): Stop[] {
  const pref: number[] = THEMES.map((t) => (input.themes.length === 0 || input.themes.includes(t) ? 1 : 0));
  pref.push(0.3);
  const perStop = input.profile === "family" ? 8 : input.profile === "group" ? 7 : 6;
  const count = Math.max(3, Math.min(14, Math.round(input.minutes / perStop)));

  const scored = artworks.map((a, i) => {
    let score = cosine(pref, features(a));
    let reason: Stop["reason"] = "theme";
    const iconic = 1 - i / artworks.length; // o acervo já vem ordenado por destaque
    score += iconic * 0.35;
    if (input.favorites?.includes(a.id)) {
      score += 0.6;
      reason = "favorite";
    } else if (input.themes.length === 0) reason = "highlight";
    if (input.profile === "family" && a.kids.pt) {
      score += 0.15;
      if (reason !== "favorite") reason = "kids";
    }
    return { art: a, score, reason };
  });

  scored.sort((a, b) => b.score - a.score);

  // Diversidade: evita mais de 2 obras do mesmo artista
  const picked: Stop[] = [];
  const perArtist = new Map<string, number>();
  for (const s of scored) {
    const n = perArtist.get(s.art.artist) ?? 0;
    if (n >= 2) continue;
    perArtist.set(s.art.artist, n + 1);
    picked.push(s);
    if (picked.length >= count) break;
  }
  // Ordena pelo percurso (espaço do mapa) para andar menos
  const ord = (s: Stop) => spaceOrder.get(s.art.space ?? "") ?? 99;
  return picked.sort((a, b) => ord(a) - ord(b));
}
