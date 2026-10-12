import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Building2, Bus, Footprints, Landmark, Lightbulb, MapPin, Palette } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArtImage } from "@/components/ArtImage";
import { Header } from "@/components/Shell";
import { PartnerCard } from "@/components/PartnerCard";
import { Chip, Page, SectionTitle, Skeleton } from "@/components/ui";
import { useSettings } from "@/context/Settings";
import { accentOn, inkOn, loadArtIndex, MUSEUMS, museumMeta, type ArtIndexItem } from "@/data/museums";
import { KIND_LABEL, mapsUrl, NEARBY, type NearbyPlace, type PlaceKind } from "@/data/nearby";
import type { I18n, MuseumId } from "@/data/types";
import { dot, loadEmbeddings } from "@/lib/clip";
import { tr } from "@/lib/utils";

function km(a: [number, number], b: [number, number]) {
  const R = 6371;
  const dLat = ((b[0] - a[0]) * Math.PI) / 180;
  const dLon = ((b[1] - a[1]) * Math.PI) / 180;
  const x = Math.sin(dLat / 2) ** 2 + Math.cos((a[0] * Math.PI) / 180) * Math.cos((b[0] * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
}

/** Distância (km) de um ponto ao trecho a-b, em projeção plana local (suficiente para a escala da cidade). */
function kmToSegment(p: [number, number], a: [number, number], b: [number, number]) {
  const k = [110.57, 111.32 * Math.cos((a[0] * Math.PI) / 180)];
  const P = [p[0] * k[0], p[1] * k[1]];
  const A = [a[0] * k[0], a[1] * k[1]];
  const B = [b[0] * k[0], b[1] * k[1]];
  const AB = [B[0] - A[0], B[1] - A[1]];
  const t = Math.max(0, Math.min(1, ((P[0] - A[0]) * AB[0] + (P[1] - A[1]) * AB[1]) / (AB[0] ** 2 + AB[1] ** 2 || 1)));
  return Math.hypot(P[0] - (A[0] + t * AB[0]), P[1] - (A[1] + t * AB[1]));
}

/** Lugares no caminho de um roteiro: até 1,2 km do trajeto, os mais próximos primeiro. */
function onTheWay(stops: MuseumId[]) {
  const pts = stops.map((s) => museumMeta(s)!.coords);
  return NEARBY.map((p) => {
    let d = Infinity;
    for (let i = 0; i < pts.length - 1; i++) d = Math.min(d, kmToSegment(p.coords, pts[i], pts[i + 1]));
    for (const q of pts) d = Math.min(d, km(p.coords, q));
    return { p, d };
  })
    .filter((x) => x.d <= 1.2)
    .sort((a, b) => a.d - b.d)
    .slice(0, 3);
}

const KIND_ICON: Record<PlaceKind, JSX.Element> = { museu: <Landmark size={15} />, galeria: <Palette size={15} />, centro: <Building2 size={15} /> };

const TXT = {
  way: { pt: "No caminho", en: "On the way", es: "En el camino" },
  more: { pt: "Mais arte por perto", en: "More art nearby", es: "Más arte cerca" },
  moreDesc: { pt: "Museus, galerias e centros culturais perto da rede KORA", en: "Museums, galleries and cultural centers near the KORA network", es: "Museos, galerías y centros culturales cerca de la red KORA" },
  all: { pt: "Todos", en: "All", es: "Todos" },
  fromRoute: { pt: "do trajeto", en: "from the route", es: "del trayecto" },
  fromMuseum: { pt: "do", en: "from", es: "del" },
  stop: { pt: "Pare no caminho", en: "Stop along the way", es: "Para en el camino" },
};

const ROUTES: { id: string; title: I18n; desc: I18n; stops: MuseumId[]; tip: I18n }[] = [
  {
    id: "paulista",
    title: { pt: "Um dia na Paulista", en: "A day on Paulista", es: "Un día en la Paulista" },
    desc: {
      pt: "Pintura de todos os tempos no MASP e o Brasil em fotografias no IMS, a poucas quadras um do outro.",
      en: "Art from every era at MASP and Brazil in photographs at IMS, a few blocks apart.",
      es: "Pintura de todas las épocas en el MASP y Brasil en fotografías en el IMS, a pocas cuadras.",
    },
    stops: ["masp", "ims"],
    tip: {
      pt: "Vá numa terça: o MASP é gratuito o dia todo e o IMS é sempre gratuito.",
      en: "Go on a Tuesday: MASP is free all day and IMS is always free.",
      es: "Ve un martes: el MASP es gratis todo el día y el IMS siempre es gratis.",
    },
  },
  {
    id: "ibirapuera",
    title: { pt: "Da Paulista ao Ibirapuera", en: "From Paulista to Ibirapuera", es: "De la Paulista al Ibirapuera" },
    desc: {
      pt: "Do vão livre de Lina Bo Bardi à marquise de Niemeyer: o MASP pela manhã e o MAM à tarde.",
      en: "From Lina Bo Bardi's open span to Niemeyer's marquee: MASP in the morning, MAM in the afternoon.",
      es: "Del vano libre de Lina Bo Bardi a la marquesina de Niemeyer: el MASP por la mañana y el MAM por la tarde.",
    },
    stops: ["masp", "mam"],
    tip: {
      pt: "No domingo o MAM é gratuito e a Paulista fica aberta a pedestres.",
      en: "On Sundays MAM is free and Paulista Avenue is open to pedestrians.",
      es: "Los domingos el MAM es gratis y la Paulista está abierta a peatones.",
    },
  },
  {
    id: "tres",
    title: { pt: "Os três museus", en: "All three museums", es: "Los tres museos" },
    desc: {
      pt: "Um fim de semana para ver como a arte brasileira dialoga com o mundo, da pintura à fotografia.",
      en: "A weekend to see how Brazilian art dialogues with the world, from painting to photography.",
      es: "Un fin de semana para ver cómo el arte brasileño dialoga con el mundo, de la pintura a la fotografía.",
    },
    stops: ["ims", "masp", "mam"],
    tip: {
      pt: "Salve obras favoritas em cada museu: elas aparecem juntas na sua coleção.",
      en: "Save favorite works in each museum: they appear together in your collection.",
      es: "Guarda obras favoritas en cada museo: aparecen juntas en tu colección.",
    },
  },
];

type Pair = { a: ArtIndexItem; b: ArtIndexItem; score: number };

function Connections() {
  const [pairs, setPairs] = useState<Pair[] | null>(null);
  useEffect(() => {
    Promise.all([loadEmbeddings(), loadArtIndex()])
      .then(([e, idx]) => {
        const by = new Map(idx.map((i) => [i.id, i]));
        const out: Pair[] = [];
        for (let i = 0; i < e.items.length; i++) {
          for (let j = i + 1; j < e.items.length; j++) {
            const x = e.items[i];
            const y = e.items[j];
            if (x.museum === y.museum) continue;
            out.push({ a: by.get(x.id)!, b: by.get(y.id)!, score: dot(x.v[0], y.v[0]) });
          }
        }
        out.sort((p, q) => q.score - p.score);
        // no máximo uma aparição por obra
        const used = new Set<string>();
        const best: Pair[] = [];
        for (const p of out) {
          if (!p.a || !p.b || used.has(p.a.id) || used.has(p.b.id)) continue;
          used.add(p.a.id);
          used.add(p.b.id);
          best.push(p);
          if (best.length >= 4) break;
        }
        setPairs(best);
      })
      .catch(() => setPairs([]));
  }, []);

  if (pairs && !pairs.length) return null;
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {!pairs
        ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-36" />)
        : pairs.map((p) => (
            <div key={p.a.id + p.b.id} className="card flex items-center gap-3 p-3">
              {[p.a, p.b].map((x, k) => (
                <Link key={x.id} to={`/${x.museum}/obra/${x.id}`} className={`tap flex min-w-0 flex-1 items-center gap-2.5 ${k === 1 ? "flex-row-reverse text-right" : ""}`}>
                  <ArtImage src={x.thumb} alt="" color={x.color} className="h-24 w-20 shrink-0 rounded-xl" />
                  <span className="min-w-0">
                    <span className="inline-block rounded px-1.5 text-[10.5px] font-extrabold text-white" style={{ backgroundColor: museumMeta(x.museum)?.accent }}>
                      {museumMeta(x.museum)?.short}
                    </span>
                    <span className="mt-1 line-clamp-2 block text-[12.5px] font-bold leading-tight">{x.title}</span>
                    <span className="block truncate text-[11.5px] text-muted">{x.artist}</span>
                  </span>
                </Link>
              ))}
            </div>
          ))}
    </div>
  );
}

function PlaceCard({ p, note, onHover }: { p: NearbyPlace; note: string; onHover?: (id: string | null) => void }) {
  const { lang } = useSettings();
  return (
    <a
      href={mapsUrl(p)}
      target="_blank"
      rel="noreferrer"
      onMouseEnter={() => onHover?.(p.id)}
      onMouseLeave={() => onHover?.(null)}
      className="tap flex items-center gap-4 py-3.5"
    >
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ink/[0.05]" title={tr(KIND_LABEL[p.kind], lang)}>
        {KIND_ICON[p.kind]}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[15.5px] font-bold">{p.name}</span>
        <span className="block truncate text-[13px] text-muted">{tr(p.desc, lang)}</span>
      </span>
      <span className="shrink-0 text-right text-[12.5px] text-muted">{note}</span>
    </a>
  );
}

function WayList({ stops, onHover }: { stops: MuseumId[]; onHover: (id: string | null) => void }) {
  const { lang } = useSettings();
  const list = onTheWay(stops);
  if (!list.length) return null;
  return (
    <div className="mt-5 flex flex-wrap items-center gap-2">
      <span className="mr-1 text-[13px] font-semibold text-muted">{tr(TXT.way, lang)}:</span>
      {list.map(({ p }) => (
        <a
          key={p.id}
          href={mapsUrl(p)}
          target="_blank"
          rel="noreferrer"
          onMouseEnter={() => onHover(p.id)}
          onMouseLeave={() => onHover(null)}
          className="tap chip"
        >
          {KIND_ICON[p.kind]}
          {p.name}
        </a>
      ))}
    </div>
  );
}

export default function RoutesBetween() {
  const { t, lang } = useSettings();
  // mini mapa: projeção simples das coordenadas
  const { isDark } = useSettings();
  const [kind, setKind] = useState<PlaceKind | "all">("all");
  const [hoverPlace, setHoverPlace] = useState<string | null>(null);
  const lats = [...MUSEUMS.map((m) => m.coords[0]), ...NEARBY.map((p) => p.coords[0])];
  const lngs = [...MUSEUMS.map((m) => m.coords[1]), ...NEARBY.map((p) => p.coords[1])];
  const places = useMemo(() => {
    return NEARBY.filter((p) => kind === "all" || p.kind === kind)
      .map((p) => {
        const near = MUSEUMS.map((m) => ({ m, d: km(p.coords, m.coords) })).sort((a, b) => a.d - b.d)[0];
        return { p, near };
      })
      .sort((a, b) => a.near.d - b.near.d);
  }, [kind]);
  const [minLat, maxLat, minLng, maxLng] = [Math.min(...lats), Math.max(...lats), Math.min(...lngs), Math.max(...lngs)];
  const pos = (c: [number, number]) => ({
    x: 8 + ((c[1] - minLng) / (maxLng - minLng || 1)) * 84,
    y: 10 + ((maxLat - c[0]) / (maxLat - minLat || 1)) * 78,
  });

  return (
    <>
      <Header back="/museus" title={t("routes.title")} />
      <Page>
        <h1 className="text-[34px] font-extrabold leading-tight tracking-tight md:text-[44px]">{t("routes.title")}</h1>
        <p className="mt-1 text-[15px] text-muted">{t("routes.subtitle")}</p>

        <div className="card relative mt-6 aspect-[4/3] overflow-hidden md:aspect-[21/9]">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
            {[["masp", "ims"], ["masp", "mam"]].map(([a, b]) => {
              const pa = pos(museumMeta(a)!.coords);
              const pb = pos(museumMeta(b)!.coords);
              return <line key={a + b} x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y} stroke="rgb(var(--ink) / 0.25)" strokeWidth="0.6" strokeDasharray="1.5 1.2" vectorEffect="non-scaling-stroke" />;
            })}
          </svg>
          {NEARBY.map((pl) => {
            const p = pos(pl.coords);
            const on = hoverPlace === pl.id;
            return (
              <a
                key={pl.id}
                href={mapsUrl(pl)}
                target="_blank"
                rel="noreferrer"
                onMouseEnter={() => setHoverPlace(pl.id)}
                onMouseLeave={() => setHoverPlace(null)}
                className="group absolute z-10 -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${p.x}%`, top: `${p.y}%` }}
                aria-label={pl.name}
              >
                <span className={`block rounded-full border-2 border-surface bg-ink/55 transition-transform duration-150 ${on ? "h-4 w-4 bg-ink" : "h-2.5 w-2.5"}`} />
                <span className={`pointer-events-none absolute left-1/2 top-4 -translate-x-1/2 whitespace-nowrap rounded-lg bg-ink px-2 py-1 text-[11px] font-bold text-bg shadow-lift transition-opacity duration-150 ${on ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
                  {pl.name}
                </span>
              </a>
            );
          })}
          {MUSEUMS.map((m, i) => {
            const p = pos(m.coords);
            return (
              <Link key={m.id} to={`/${m.id}`} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${p.x}%`, top: `${p.y}%` }}>
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1 * i, type: "spring" }}
                  className="relative z-20 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-extrabold shadow-lift"
                  style={{ backgroundColor: accentOn(m, isDark), color: inkOn(m, isDark), boxShadow: `0 0 0 6px ${accentOn(m, isDark)}33, 0 0 28px ${accentOn(m, isDark)}88` }}
                >
                  <MapPin size={13} /> {m.short}
                </motion.span>
              </Link>
            );
          })}
          <span className="absolute bottom-3 left-4 text-[12.5px] font-semibold text-muted">São Paulo · esquemático</span>
        </div>

        <div className="mt-8 space-y-4">
          {ROUTES.map((r) => {
            const legs = r.stops.slice(1).map((s, i) => {
              const a = museumMeta(r.stops[i])!;
              const b = museumMeta(s)!;
              const d = km(a.coords, b.coords) * 1.3; // fator de ruas
              return { a, b, d, walk: Math.round((d / 4.8) * 60), bus: Math.max(10, Math.round((d / 18) * 60 + 8)) };
            });
            return (
              <section key={r.id} className="card p-5 md:p-6">
                <h2 className="text-[22px] font-extrabold">{tr(r.title, lang)}</h2>
                <p className="body-copy mt-1">{tr(r.desc, lang)}</p>
                <div className="mt-5 flex flex-wrap items-center gap-2">
                  {r.stops.map((s, i) => {
                    const m = museumMeta(s)!;
                    const leg = legs[i];
                    return (
                      <div key={s} className="flex items-center gap-2">
                        <Link to={`/${s}`} className="tap rounded-xl px-3 py-2 text-[15px] font-extrabold" style={{ backgroundColor: accentOn(m, isDark), color: inkOn(m, isDark) }}>
                          {m.short}
                        </Link>
                        {leg && (
                          <span className="flex items-center gap-2 text-[12.5px] font-semibold text-muted">
                            <ArrowRight size={14} />
                            {leg.d < 2 ? (
                              <span className="flex items-center gap-1">
                                <Footprints size={14} /> {leg.walk} min {t("routes.walk")}
                              </span>
                            ) : (
                              <span className="flex items-center gap-1">
                                <Bus size={14} /> ~{leg.bus} min {t("routes.transit")}
                              </span>
                            )}
                            <span className="num">· {leg.d.toFixed(1)} km</span>
                            <ArrowRight size={14} />
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
                <WayList stops={r.stops} onHover={setHoverPlace} />
                <p className="mt-4 flex gap-2 rounded-2xl bg-ink/[0.04] p-3 text-[14px] font-medium">
                  <Lightbulb size={17} className="mt-0.5 shrink-0 text-warning" /> {tr(r.tip, lang)}
                </p>
              </section>
            );
          })}
        </div>

        <section className="mt-12">
          <SectionTitle title={tr(TXT.more, lang)} eyebrow={tr(TXT.moreDesc, lang)} />
          <div className="no-scrollbar -mx-4 mb-4 flex gap-2 overflow-x-auto px-4">
            <Chip on={kind === "all"} onClick={() => setKind("all")}>
              {tr(TXT.all, lang)}
            </Chip>
            {(Object.keys(KIND_LABEL) as PlaceKind[]).map((k) => (
              <Chip key={k} on={kind === k} onClick={() => setKind(k)}>
                {tr(KIND_LABEL[k], lang)}
              </Chip>
            ))}
          </div>
          <div className="grid divide-y divide-[rgb(var(--line)/var(--line-alpha))] md:grid-cols-2 md:gap-x-10 md:divide-y-0">
            {places.map(({ p, near }) => (
              <PlaceCard key={p.id} p={p} onHover={setHoverPlace} note={`${near.d.toFixed(1).replace(".", ",")} km`} />
            ))}
          </div>
        </section>

        <section className="mt-12">
          <SectionTitle title={tr(TXT.stop, lang)} />
          <PartnerCard />
        </section>

        <section className="mt-12">
          <SectionTitle title={t("routes.connections")} eyebrow={t("art.similar.desc")} />
          <Connections />
        </section>
      </Page>
    </>
  );
}
