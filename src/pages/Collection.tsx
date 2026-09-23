import { Heart, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ArtworkCard } from "@/components/ArtworkCard";
import { Header } from "@/components/Shell";
import { Chip, Page } from "@/components/ui";
import { useMuseum } from "@/context/Museum";
import { useSettings } from "@/context/Settings";
import type { Theme } from "@/data/types";
import type { StringKey } from "@/i18n/strings";
import { useFavorites } from "@/lib/favorites";
import { normalize, tr } from "@/lib/utils";

export default function Collection() {
  const m = useMuseum();
  const { t, lang } = useSettings();
  const { has } = useFavorites();
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");
  const theme = (params.get("tema") as Theme | null) ?? null;
  const onlySaved = params.get("salvas") === "1";

  const themes = useMemo(() => {
    const set = new Map<Theme, number>();
    m.artworks.forEach((a) => set.set(a.theme, (set.get(a.theme) ?? 0) + 1));
    return [...set.entries()].sort((a, b) => b[1] - a[1]).map(([k]) => k);
  }, [m]);

  const list = useMemo(() => {
    const nq = normalize(q.trim());
    return m.artworks.filter((a) => {
      if (theme && a.theme !== theme) return false;
      if (onlySaved && !has(`${m.id}:${a.id}`)) return false;
      if (!nq) return true;
      const hay = normalize([tr(a.title, lang), a.title.pt, a.artist, a.year, a.medium?.pt, a.movement?.pt, tr(a.medium, lang), ...(a.tags ?? [])].join(" "));
      return nq.split(/\s+/).every((w) => hay.includes(w));
    });
  }, [m, q, theme, onlySaved, has, lang]);

  const setParam = (k: string, v: string | null) => {
    const p = new URLSearchParams(params);
    if (v == null) p.delete(k);
    else p.set(k, v);
    setParams(p, { replace: true });
  };

  return (
    <>
      <Header />
      <Page>
        <h1 className="text-[34px] font-extrabold leading-tight tracking-tight md:text-[44px]">{t("col.title")}</h1>
        <p className="mt-1 text-[15px] text-muted">{t("col.subtitle")}</p>

        <div className="sticky top-14 z-30 -mx-4 mt-5 bg-bg/85 px-4 pb-3 pt-2 backdrop-blur md:top-16 md:-mx-8 md:px-8">
          <label className="flex h-12 items-center gap-2 rounded-2xl border hairline bg-surface px-4 shadow-soft focus-within:ring-2 focus-within:ring-accent/40">
            <Search size={18} className="text-muted" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t("common.search")}
              className="h-full flex-1 bg-transparent text-[16px] outline-none placeholder:text-muted"
              aria-label={t("common.search")}
            />
            {q && (
              <button onClick={() => setQ("")} aria-label="Limpar" className="text-muted">
                <X size={18} />
              </button>
            )}
          </label>
          <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
            <Chip on={onlySaved} onClick={() => setParam("salvas", onlySaved ? null : "1")}>
              <Heart size={14} className={onlySaved ? "fill-current" : ""} /> {t("col.saved")}
            </Chip>
            <Chip on={!theme} onClick={() => setParam("tema", null)}>
              {t("common.all")}
            </Chip>
            {themes.map((th) => (
              <Chip key={th} on={theme === th} onClick={() => setParam("tema", theme === th ? null : th)}>
                {t(`theme.${th}` as StringKey)}
              </Chip>
            ))}
          </div>
        </div>

        <p className="mb-4 mt-2 text-[13px] font-semibold text-muted">
          {list.length} {t("col.results")}
        </p>
        {list.length === 0 ? (
          <div className="card grid place-items-center gap-2 p-10 text-center text-muted">
            <Heart />
            <p>{onlySaved ? t("col.empty") : t("col.none")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 md:grid-cols-4 md:gap-x-5 lg:grid-cols-5">
            {list.map((a) => (
              <ArtworkCard key={a.id} art={a} />
            ))}
          </div>
        )}
      </Page>
    </>
  );
}
