import { AnimatePresence, motion } from "framer-motion";
import { Baby, Headphones, Heart, MapPin, Maximize2, Share2, Sparkles, Square, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArtImage } from "@/components/ArtImage";
import { Header } from "@/components/Shell";
import { Button, IconButton, Page, Skeleton } from "@/components/ui";
import { useMuseum } from "@/context/Museum";
import { useSettings } from "@/context/Settings";
import { loadArtIndex, museumMeta, type ArtIndexItem } from "@/data/museums";
import { track } from "@/lib/analytics";
import { similarTo } from "@/lib/clip";
import { useFavorites } from "@/lib/favorites";
import { useSpeech } from "@/lib/speech";
import { cn, tr } from "@/lib/utils";

function Similar({ id }: { id: string }) {
  const { t } = useSettings();
  const [items, setItems] = useState<(ArtIndexItem & { score: number })[] | null>(null);
  useEffect(() => {
    let alive = true;
    Promise.all([similarTo(id, 8), loadArtIndex()])
      .then(([matches, index]) => {
        if (!alive) return;
        const byId = new Map(index.map((i) => [i.id, i]));
        setItems(matches.map((m) => ({ ...byId.get(m.id)!, score: m.score })).filter((x) => x.id));
      })
      .catch(() => alive && setItems([]));
    return () => {
      alive = false;
    };
  }, [id]);

  if (items && items.length === 0) return null;
  return (
    <section className="mt-12">
      <h2 className="text-[22px] font-extrabold">{t("art.similar")}</h2>
      <p className="mb-4 text-[13px] text-muted">{t("art.similar.desc")}</p>
      <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-2 md:-mx-8 md:px-8">
        {!items
          ? Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="aspect-[4/5] w-36 shrink-0" />)
          : items.map((a) => {
              const meta = museumMeta(a.museum);
              return (
                <Link key={a.id} to={`/${a.museum}/obra/${a.id}`} className="tap w-36 shrink-0 md:w-44">
                  <div className="relative">
                    <ArtImage src={a.thumb} alt={a.title} color={a.color} className="aspect-[4/5] rounded-2xl" />
                    <span className="absolute left-2 top-2 rounded-md px-1.5 py-0.5 text-[11px] font-extrabold text-white" style={{ backgroundColor: meta?.accent }}>
                      {meta?.short}
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-[13px] font-bold leading-snug">{a.title}</p>
                  <p className="truncate text-[12px] text-muted">{a.artist}</p>
                </Link>
              );
            })}
      </div>
    </section>
  );
}

export default function ArtworkPage() {
  const { id } = useParams();
  const m = useMuseum();
  const navigate = useNavigate();
  const { t, lang, family } = useSettings();
  const { has, toggle } = useFavorites();
  const { speak, stop, speaking, supported } = useSpeech(lang);
  const [zoom, setZoom] = useState(false);
  const art = m.artworks.find((a) => a.id === id);

  useEffect(() => {
    if (art) track({ museum: m.id, type: "artwork_view", artwork_id: art.id });
    return () => stop();
  }, [art, m.id, stop]);

  if (!art) {
    return (
      <>
        <Header back />
        <Page>
          <p className="text-muted">Obra não encontrada.</p>
        </Page>
      </>
    );
  }

  const key = `${m.id}:${art.id}`;
  const saved = has(key);
  const title = tr(art.title, lang);
  const space = m.spaces.find((s) => s.id === art.space);

  const audioText = family
    ? `${title}. ${art.artist}. ${tr(art.kids, lang)}`
    : `${title}, ${art.artist}${art.year ? `, ${art.year}` : ""}. ${tr(art.description, lang)} ${tr(art.history, lang)}`;

  const share = async () => {
    const url = location.href;
    try {
      if (navigator.share) await navigator.share({ title, text: `${title} · ${art.artist}`, url });
      else await navigator.clipboard.writeText(url);
    } catch {
      /* cancelado */
    }
  };

  const facts: [string, string | undefined][] = [
    [t("art.artist"), art.artistLife ? `${art.artist} (${art.artistLife})` : art.artist],
    [t("art.year"), art.year],
    [t("art.medium"), tr(art.medium, lang)],
    [t("art.dimensions"), art.dimensions],
    [t("art.movement"), tr(art.movement, lang)],
  ];

  return (
    <>
      <Header
        back
        right={
          <>
            <IconButton label={t("common.share")} onClick={share}>
              <Share2 size={18} />
            </IconButton>
            <IconButton label={saved ? t("common.saved") : t("common.save")} active={saved} onClick={() => { toggle(key); if (!saved) track({ museum: m.id, type: "favorite", artwork_id: art.id }); }}>
              <Heart size={18} className={saved ? "fill-current" : ""} />
            </IconButton>
          </>
        }
      />
      <Page className="pt-0 md:pt-2">
        <div className="grid gap-8 md:grid-cols-[1.1fr_1fr] md:gap-12">
          <div className="md:sticky md:top-20 md:self-start">
            <button onClick={() => setZoom(true)} className="group relative block w-full" aria-label="Ampliar">
              <ArtImage
                src={art.image}
                alt={title}
                color={art.color}
                eager
                fit="contain"
                className="max-h-[70dvh] w-full rounded-3xl bg-ink/[0.04]"
                ratio={Math.max(0.6, Math.min(1.6, art.ratio))}
              />
              <span className="glass absolute bottom-3 right-3 grid h-9 w-9 place-items-center rounded-full opacity-0 transition-opacity group-hover:opacity-100">
                <Maximize2 size={16} />
              </span>
            </button>
            <p className="mt-2 text-[11.5px] text-muted">
              {t("art.credit")}: {art.credit}
            </p>
          </div>

          <div>
            <p className="eyebrow">{m.short} · {tr(art.movement, lang) || art.theme}</p>
            <h1 className="mt-2 text-[30px] font-extrabold leading-[1.08] tracking-[-0.025em] md:text-[40px]">{title}</h1>
            <p className="mt-2 text-[17px] text-muted">
              {art.artist}
              {art.year ? ` · ${art.year}` : ""}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {supported && (
                <Button
                  onClick={() => {
                    if (speaking) stop();
                    else {
                      speak(audioText);
                      track({ museum: m.id, type: "audio", artwork_id: art.id });
                    }
                  }}
                  icon={speaking ? <Square size={16} /> : <Headphones size={18} />}
                >
                  {speaking ? t("common.stop") : t("art.audio")}
                </Button>
              )}
              <Button variant="ghost" icon={<Sparkles size={17} />} onClick={() => navigate(`/${m.id}/kora?obra=${art.id}`)}>
                {t("art.ask")}
              </Button>
            </div>

            <AnimatePresence>
              {speaking && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-3 flex h-6 items-end gap-1">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <motion.span
                      key={i}
                      className="w-1 rounded-full bg-accent"
                      animate={{ height: [4, 10 + ((i * 7) % 14), 4] }}
                      transition={{ duration: 0.8 + (i % 5) * 0.12, repeat: Infinity }}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {(family || tr(art.kids, lang)) && (
              <div className={cn("mt-6 rounded-3xl p-5", family ? "bg-warning/15" : "bg-ink/[0.04]")}>
                <p className="mb-1.5 flex items-center gap-2 text-[13px] font-bold uppercase tracking-wider text-warning">
                  <Baby size={16} /> {t("art.kids")}
                </p>
                <p className="body-copy text-[16px]">{tr(art.kids, lang)}</p>
              </div>
            )}

            <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border hairline bg-[rgb(var(--line)/var(--line-alpha))]">
              {facts
                .filter(([, v]) => v)
                .map(([k, v], i, arr) => (
                  <div key={k} className={cn("bg-surface p-4", i === 0 && arr.length % 2 === 1 && "col-span-2")}>
                    <dt className="text-[11.5px] font-bold uppercase tracking-wider text-muted">{k}</dt>
                    <dd className="mt-1 text-[14.5px] font-semibold leading-snug">{v}</dd>
                  </div>
                ))}
            </dl>

            <section className="mt-8">
              <h2 className="text-[20px] font-extrabold">{t("art.about")}</h2>
              <p className="body-copy mt-2 text-[16.5px]">{tr(art.description, lang)}</p>
            </section>
            {tr(art.history, lang) && (
              <section className="mt-6">
                <h2 className="text-[20px] font-extrabold">{t("art.history")}</h2>
                <p className="body-copy mt-2 text-[16.5px]">{tr(art.history, lang)}</p>
              </section>
            )}

            {space && (
              <Link to={`/${m.id}/mapa?espaco=${space.id}`} className="tap card mt-6 flex items-center gap-3 p-4">
                <MapPin className="text-accent" />
                <span className="flex-1">
                  <span className="block text-[12px] font-bold uppercase tracking-wider text-muted">{t("art.where")}</span>
                  <span className="font-semibold">{space.name}</span>
                </span>
              </Link>
            )}

            {art.tags?.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {art.tags.map((tag) => (
                  <Link key={tag} to={`/${m.id}/acervo?q=${encodeURIComponent(tag)}`} className="chip">
                    #{tag}
                  </Link>
                ))}
              </div>
            )}
            {art.source && (
              <a href={art.source} target="_blank" rel="noreferrer" className="mt-6 block text-[12.5px] text-muted underline underline-offset-2">
                Fonte pública da ficha
              </a>
            )}
          </div>
        </div>

        <Similar id={art.id} />
      </Page>

      <AnimatePresence>
        {zoom && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] grid place-items-center bg-black p-2"
            onClick={() => setZoom(false)}
          >
            <img src={art.image} alt={title} className="max-h-full max-w-full object-contain" />
            <button className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white/15 text-white" aria-label={t("common.close")}>
              <X />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
