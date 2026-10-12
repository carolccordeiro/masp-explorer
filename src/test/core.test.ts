import { describe, expect, it } from "vitest";
import masp from "@/data/generated/masp.json";
import ims from "@/data/generated/ims.json";
import mam from "@/data/generated/mam.json";
import index from "@/data/generated/index.json";
import { MUSEUMS } from "@/data/museums";
import type { Museum } from "@/data/types";
import { instantAnswer, localAnswer } from "@/lib/ai";
import { openStatus } from "@/lib/hours";
import { planRoute } from "@/lib/recommender";

const full = (id: string, data: unknown) => ({ ...MUSEUMS.find((m) => m.id === id)!, ...(data as object) }) as Museum;
const museums = [full("masp", masp), full("ims", ims), full("mam", mam)];

describe("dados dos museus", () => {
  it("cada museu tem 50 obras com imagem, texto e tema", () => {
    for (const m of museums) {
      expect(m.artworks.length).toBe(50);
      for (const a of m.artworks) {
        expect(a.image).toMatch(/^\/museums\//);
        expect(a.description.pt.length).toBeGreaterThan(40);
        expect(a.kids.pt.length).toBeGreaterThan(20);
      }
    }
  });
  it("ids únicos na rede e índice completo", () => {
    const ids = index.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.length).toBe(150);
  });
  it("nenhum texto usa travessão", () => {
    const all = JSON.stringify([masp, ims, mam]);
    expect(all).not.toMatch(/[—–]/);
  });
});

describe("horários (fuso de São Paulo)", () => {
  const meta = MUSEUMS.find((m) => m.id === "masp")!;
  it("terça é gratuita no MASP", () => {
    // 2026-10-20 é uma terça, 15h em São Paulo = 18h UTC
    const s = openStatus(meta, new Date("2026-10-20T18:00:00Z"));
    expect(s.open).toBe(true);
    expect(s.freeToday).toBe(true);
  });
  it("segunda está fechado", () => {
    expect(openStatus(meta, new Date("2026-10-19T18:00:00Z")).open).toBe(false);
  });
});

describe("roteiro personalizado", () => {
  it("respeita o tempo e evita repetir artistas demais", () => {
    const r = planRoute(museums[0].artworks, { minutes: 60, profile: "solo", themes: ["moderna"] });
    expect(r.length).toBe(10);
    const perArtist = new Map<string, number>();
    r.forEach((s) => perArtist.set(s.art.artist, (perArtist.get(s.art.artist) ?? 0) + 1));
    expect(Math.max(...perArtist.values())).toBeLessThanOrEqual(2);
    expect(r.filter((s) => s.art.theme === "moderna").length).toBeGreaterThan(5);
  });
});

describe("assistente", () => {
  it("responde horário sem IA", () => {
    expect(instantAnswer("Que horas o museu abre?", museums[0], "pt")).toContain("10h");
  });
  it("plano B encontra a obra citada", () => {
    expect(localAnswer("me fala do quadro rosa e azul do renoir", museums[0], "pt")).toContain("Rosa e Azul");
  });
});
