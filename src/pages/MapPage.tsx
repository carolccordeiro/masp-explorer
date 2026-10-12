import { Layers, MapPin, Navigation } from "lucide-react";
import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArtImage } from "@/components/ArtImage";
import { Header } from "@/components/Shell";
import { Sheet } from "@/components/Sheet";
import { Page } from "@/components/ui";
import { useMuseum } from "@/context/Museum";
import { useSettings } from "@/context/Settings";
import { cn, tr } from "@/lib/utils";
import { setFloor, useVisit } from "@/lib/visit";
import { exhibitionState } from "./MuseumHome";

export default function MapPage() {
  const m = useMuseum();
  const { t, lang } = useSettings();
  const [params, setParams] = useSearchParams();
  const selected = params.get("espaco");
  const here = useVisit(m.id).floor;

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

        <p className="mt-6 rounded-2xl bg-ink/[0.04] p-3 text-[13.5px] text-muted">{t("map.pickFloor")}</p>
        <ul className="mt-4 space-y-2">
          {spaces.map((s) => {
            const n = counts.get(s.id) ?? 0;
            const hasExpo = m.exhibitions.some((e) => e.space === s.id && exhibitionState(e) === "now");
            const isHere = here === s.id;
            return (
              <li key={s.id}>
                <button
                  onClick={() => setParams({ espaco: s.id }, { replace: true })}
                  className={cn(
                    "tap flex w-full items-center gap-4 rounded-3xl border hairline bg-surface p-4 text-left transition-colors duration-150",
                    isHere && "border-transparent ring-2 ring-success",
                    selected === s.id && "ring-2 ring-accent",
                  )}
                >
                  <span className="num grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-ink text-[17px] text-bg">{s.badge ?? levelLabel(s.level)}</span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="truncate text-[16px] font-bold leading-tight">{s.name}</span>
                      {isHere && (
                        <span className="flex shrink-0 items-center gap-1 rounded-full bg-success px-2 py-0.5 text-[11px] font-bold text-white">
                          <Navigation size={11} className="fill-current" /> {t("map.here")}
                        </span>
                      )}
                    </span>
                    <span className="mt-0.5 line-clamp-1 block text-[13px] text-muted">{tr(s.description, lang)}</span>
                    {(n > 0 || hasExpo) && (
                      <span className="mt-1.5 flex flex-wrap gap-x-3 text-[12.5px] font-semibold">
                        {n > 0 && (
                          <span>
                            {n} {t("map.worksN")}
                          </span>
                        )}
                        {hasExpo && <span className="text-accent">{t("map.expoNow")}</span>}
                      </span>
                    )}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <p className="mt-8 flex items-center gap-2 text-[13px] text-muted">
          <Layers size={15} /> Mapa esquemático. Consulte a sinalização do museu.
        </p>
      </Page>

      <Sheet open={!!sel} onClose={() => setParams({}, { replace: true })} title={sel?.name}>
        {sel && (
          <div>
            <p className="body-copy">{tr(sel.description, lang)}</p>
            <button
              onClick={() => {
                setFloor(m.id, here === sel.id ? undefined : sel.id);
                setParams({}, { replace: true });
              }}
              className={cn("tap mt-4 flex w-full items-center justify-center gap-2 rounded-full py-3 text-[15px] font-bold", here === sel.id ? "bg-ink/[0.06]" : "bg-success text-white")}
            >
              <Navigation size={16} /> {here === sel.id ? t("map.here") : t("map.imHere")}
            </button>
            {selExpos.map((e) => (
              <div key={e.id} className="mt-4 rounded-2xl bg-accent/10 p-4">
                <p className="eyebrow text-accent">{t("home.exhibitions")}</p>
                <p className="mt-1 font-bold">{e.title}</p>
                <p className="text-[13px] text-muted">{e.dates}</p>
              </div>
            ))}
            {selWorks.length > 0 && (
              <>
                <p className="mb-2 mt-5 flex items-center gap-1.5 text-[13px] font-semibold text-muted">
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
