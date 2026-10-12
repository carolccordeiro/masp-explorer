import { motion } from "framer-motion";
import { Check, Gift, ScanLine, Trophy } from "lucide-react";
import { addBadge } from "@/lib/visit";
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArtImage } from "@/components/ArtImage";
import { Header } from "@/components/Shell";
import { Button, Page } from "@/components/ui";
import { useMuseum } from "@/context/Museum";
import { useSettings } from "@/context/Settings";
import { track } from "@/lib/analytics";
import { cn, store, tr } from "@/lib/utils";

/** Roteiro no celular (abre pelo QR Code): caça ao tesouro com prêmio no final. */
export default function Hunt() {
  const m = useMuseum();
  const { t, lang } = useSettings();
  const [params] = useSearchParams();
  const ids = (params.get("obras") ?? "").split(",").filter(Boolean);
  const stops = useMemo(() => ids.map((id) => m.artworks.find((a) => a.id === id)).filter(Boolean) as typeof m.artworks, [ids.join(","), m]); // eslint-disable-line react-hooks/exhaustive-deps
  const key = `kora-hunt-${m.id}-${ids.join(",").slice(0, 60)}`;
  const [found, setFound] = useState<string[]>(() => store.get<string[]>(key, []));

  useEffect(() => store.set(key, found), [key, found]);

  const done = stops.length > 0 && found.length >= stops.length;

  useEffect(() => {
    if (!done) return;
    track({ museum: m.id, type: "hunt_found", value: stops.length });
    addBadge(m.id, "hunt");
  }, [done, m.id, stops.length]);

  if (!stops.length) {
    return (
      <>
        <Header back={`/${m.id}`} title={t("plan.hunt")} />
        <Page className="max-w-xl pt-10 text-center">
          <Trophy className="mx-auto text-accent" size={44} />
          <h1 className="mt-4 text-[28px] font-extrabold">{t("plan.hunt")}</h1>
          <p className="body-copy mx-auto mt-2 max-w-sm text-muted">{t("hunt.empty.desc")}</p>
          <Link to={`/${m.id}/roteiro?obras=${m.artworks.slice(0, 5).map((a) => a.id).join(",")}`} className="mt-6 inline-block">
            <Button size="lg">{t("hunt.empty.cta")}</Button>
          </Link>
          <Link to={`/${m.id}/planejar`} className="mt-3 block text-[14px] font-semibold text-accent">
            {t("act.plan")}
          </Link>
        </Page>
      </>
    );
  }

  return (
    <>
      <Header back={`/${m.id}`} title={t("plan.hunt")} />
      <Page className="max-w-2xl pb-16">
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <p className="text-[15px] font-semibold text-muted">{t("plan.hunt")}</p>
            <p className="num text-[28px]">
              {found.length}
              <span className="text-muted">/{stops.length}</span>
            </p>
          </div>
          <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-ink/10">
            <motion.div className="h-full rounded-full bg-accent" animate={{ width: `${(found.length / stops.length) * 100}%` }} />
          </div>
          <p className="mt-3 text-[13.5px] text-muted">{t("plan.hunt.desc")}</p>
        </div>

        {done && (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mt-4 rounded-3xl bg-accent p-6 text-center text-accent-ink shadow-lift">
            <Trophy className="mx-auto" size={40} />
            <p className="mt-2 text-[24px] font-extrabold">{t("plan.done")}</p>
            <p className="mt-1 opacity-90">{t("badge.hunt")}</p>
            <Link to={`/${m.id}/visita`} className="tap mt-4 inline-flex rounded-full bg-white/20 px-5 py-2.5 text-[14px] font-bold">
              {t("visit.title")}
            </Link>
          </motion.div>
        )}

        <ol className="mt-5 space-y-3">
          {stops.map((a, i) => {
            const ok = found.includes(a.id);
            return (
              <li key={a.id} className={cn("flex items-center gap-3 rounded-3xl bg-surface p-2.5 shadow-soft transition-opacity", ok && "opacity-60")}>
                <Link to={`/${m.id}/obra/${a.id}`} className="flex min-w-0 flex-1 items-center gap-3">
                  <span className="num w-6 text-center text-[17px] text-muted">{i + 1}</span>
                  <ArtImage src={a.thumb} alt="" color={a.color} className="h-16 w-14 shrink-0 rounded-xl" />
                  <span className="min-w-0">
                    <span className={cn("line-clamp-1 text-[15px] font-bold", ok && "line-through")}>{tr(a.title, lang)}</span>
                    <span className="block truncate text-[13px] text-muted">
                      {a.artist} · {m.spaces.find((s) => s.id === a.space)?.name ?? ""}
                    </span>
                  </span>
                </Link>
                <button
                  onClick={() => setFound((f) => (f.includes(a.id) ? f.filter((x) => x !== a.id) : [...f, a.id]))}
                  aria-pressed={ok}
                  className={cn("tap grid h-11 w-11 shrink-0 place-items-center rounded-full", ok ? "bg-success text-white" : "bg-ink/[0.06]")}
                  aria-label={t("plan.found")}
                >
                  {ok ? <Check size={20} /> : <Gift size={18} />}
                </button>
              </li>
            );
          })}
        </ol>
        <Link to={`/${m.id}/scanner`} className="mt-6 block">
          <Button variant="secondary" className="w-full" icon={<ScanLine size={18} />}>
            {t("act.scan")}
          </Button>
        </Link>
      </Page>
    </>
  );
}
