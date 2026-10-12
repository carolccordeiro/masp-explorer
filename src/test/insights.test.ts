import index from "@/data/generated/index.json";
import { MUSEUMS, type ArtIndexItem } from "@/data/museums";
import { analyze, generateDemo, spParts } from "@/lib/insights";

describe("painel", () => {
  const items = index as ArtIndexItem[];
  const map = new Map(items.map((i) => [i.id, i]));
  const demo = generateDemo(items, MUSEUMS, Date.UTC(2026, 9, 20, 18));

  it("horário de São Paulo", () => {
    expect(spParts("2026-10-12T15:00:00Z")).toMatchObject({ hour: 12, day: 1 });
  });

  it("simulação gera indicadores plausíveis", () => {
    const d = analyze(demo, map);
    expect(d.visitors).toBeGreaterThan(1000);
    expect(d.avgMinutes).toBeGreaterThan(3);
    expect(d.scanRate).toBeGreaterThan(80);
    expect(d.peak.hour).toBeGreaterThanOrEqual(10);
    expect(d.peak.hour).toBeLessThanOrEqual(20);
    expect(d.heat[1].reduce((a, b) => a + b, 0)).toBe(0); // segunda: museus fechados
    expect(d.funnel[0].v).toBeGreaterThanOrEqual(d.funnel[1].v);
    expect(d.funnel[1].v).toBeGreaterThanOrEqual(d.funnel[2].v);
    expect(d.ads.length).toBe(0);
    expect(d.langs[0][0]).toBe("pt");
  });
});
