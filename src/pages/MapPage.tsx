import { motion } from "framer-motion";
import { Layers, MapPin, Navigation } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArtImage } from "@/components/ArtImage";
import { Header } from "@/components/Shell";
import { Sheet } from "@/components/Sheet";
import { Page } from "@/components/ui";
import { useMuseum } from "@/context/Museum";
import { useSettings } from "@/context/Settings";
import { cn, tr } from "@/lib/utils";
import { exhibitionState } from "./MuseumHome";

export default function MapPage() {
  const m = useMuseum();
  const { t, lang } = useSettings();
  const [params, setParams] = useSearchParams();
  const selected = params.get("espaco");
  const [here] = useState(() => [...m.spaces].sort((a, b) => Math.abs(a.level) - Math.abs(b.level))[0]?.id);

  const spaces = useMemo(() => [...m.spaces].sort((a, b) => b.level - a.level), [m]);
  const counts = useMemo(() => {
    const c = new Map<string, number>();
    m.artworks.forEach((a) => a.space && c.set(a.space, (c.get(a.space) ?? 0) + 1));
    return c;
  }, [m]);
  const sel = m.spaces.find((s) => s.id === selected);
  const selWorks = m.artworks.filter((a) => a.space === selected);
  const selExpos = m.exhibitions.filter((e) => e.space === selected && exhibitionState(e) !== "past");
  const levelLabel = (l: number) => (l === 0 ? "T" : l > 0 ? `${l}º` : `${l}`);

  return (
    <>
      <Header />
      <Page className="max-w-3xl">
        <h1 className="text-[34px] font-extrabold tracking-tight">{t("map.title")}</h1>
        <p className="mt-1 text-[15px] text-muted">{t("map.subtitle")}</p>

        <div className="relative mt-8 [perspective:1400px]">
          <div className="space-y-3 [transform:rotateX(18deg)] [transform-style:preserve-3d]">
            {spaces.map((s, i) => {
              const n = counts.get(s.id) ?? 0;
              const hasExpo = m.exhibitions.some((e) => e.space === s.id && exhibitionState(e) === "now");
              return (
                <motion.button
                  key={s.id}
                  initial={{ opacity: 0, y: -16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setParams({ espaco: s.id }, { replace: true })}
                  className={cn(
                    "tap relative flex w-full items-center gap-4 rounded-3xl border hairline bg-surface p-4 text-left shadow-soft transition-shadow hover:shadow-lift",
                    selected === s.id && "ring-2 ring-accent",
                  )}
                  style={{ marginLeft: `${(i % 2) * 4}%`, width: `${96 - (i % 2) * 4}%` }}
                >
                  <span className="num grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-ink text-[17px] text-bg">{s.badge ?? levelLabel(s.level)}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[16px] font-bold leading-tight">{s.name}</span>
                    <span className="mt-0.5 line-clamp-1 block text-[13px] text-muted">{tr(s.description, lang)}</span>
                  </span>
                  {hasExpo && <span className="h-3 w-3 shrink-0 rounded-full bg-accent shadow-glow" />}
                  {n > 0 && <span className="num shrink-0 rounded-full bg-accent/10 px-2.5 py-1 text-[13px] text-accent">{n}</span>}
                  {here === s.id && (
                    <span className="absolute -top-2.5 left-16 flex items-center gap-1 rounded-full bg-success px-2 py-0.5 text-[11px] font-bold text-white shadow">
                      <Navigation size={11} className="fill-current" /> {t("map.here")}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        <p className="mt-8 flex items-center gap-2 text-[13px] text-muted">
          <Layers size={15} /> Mapa esquemático. Consulte a sinalização do museu.
        </p>
      </Page>

      <Sheet open={!!sel} onClose={() => setParams({}, { replace: true })} title={sel?.name}>
        {sel && (
          <div>
            <p className="body-copy">{tr(sel.description, lang)}</p>
            {selExpos.map((e) => (
              <div key={e.id} className="mt-4 rounded-2xl bg-accent/10 p-4">
                <p className="eyebrow text-accent">{t("home.exhibitions")}</p>
                <p className="mt-1 font-bold">{e.title}</p>
                <p className="text-[13px] text-muted">{e.dates}</p>
              </div>
            ))}
            {selWorks.length > 0 && (
              <>
                <p className="mb-2 mt-5 flex items-center gap-1.5 text-[13px] font-bold uppercase tracking-wider text-muted">
                  <MapPin size={14} /> {t("map.works")}
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {selWorks.slice(0, 9).map((a) => (
                    <Link key={a.id} to={`/${m.id}/obra/${a.id}`} className="tap">
                      <ArtImage src={a.thumb} alt="" color={a.color} className="aspect-square rounded-xl" />
                      <p className="mt-1 line-clamp-2 text-[12px] font-semibold leading-tight">{tr(a.title, lang)}</p>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </Sheet>
    </>
  );
}
