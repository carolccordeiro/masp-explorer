import { motion } from "framer-motion";
import { ArrowRight, Baby, CalendarClock, ChevronRight, Compass, HelpCircle, LayoutGrid, MapPin, Map as MapIcon, Route, ScanLine, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArtImage } from "@/components/ArtImage";
import { ArtworkCard } from "@/components/ArtworkCard";
import { Header } from "@/components/Shell";
import { Page, SectionTitle, StatusDot } from "@/components/ui";
import { useMuseum } from "@/context/Museum";
import { useSettings } from "@/context/Settings";
import type { Exhibition } from "@/data/types";
import type { StringKey } from "@/i18n/strings";
import { openStatus } from "@/lib/hours";
import { cn, tr } from "@/lib/utils";

export function exhibitionState(e: Exhibition, now = new Date()): "now" | "soon" | "past" {
  const today = now.toISOString().slice(0, 10);
  if (e.start && e.start > today) return "soon";
  if (e.end && e.end < today) return "past";
  return "now";
}

function Action({ to, icon, title, desc, className, dark }: { to: string; icon: ReactNode; title: string; desc: string; className?: string; dark?: boolean }) {
  return (
    <Link
      to={to}
      className={cn(
        "tap group flex flex-col justify-between gap-6 rounded-3xl border hairline p-5 shadow-soft transition-shadow hover:shadow-lift",
        dark ? "border-transparent bg-accent text-accent-ink" : "bg-surface",
        className,
      )}
    >
      <span className={cn("grid h-11 w-11 place-items-center rounded-2xl", dark ? "bg-white/20" : "bg-accent/10 text-accent")}>{icon}</span>
      <span>
        <span className="flex items-center gap-1 text-[17px] font-extrabold leading-tight">
          {title}
          <ChevronRight size={16} className="opacity-50 transition-transform group-hover:translate-x-0.5" />
        </span>
        <span className={cn("mt-1 block text-[13px] leading-snug", dark ? "text-white/80" : "text-muted")}>{desc}</span>
      </span>
    </Link>
  );
}

export default function MuseumHome() {
  const m = useMuseum();
  const { t, lang, family } = useSettings();
  const st = openStatus(m);
  const base = `/${m.id}`;
  const exhibitions = m.exhibitions.filter((e) => exhibitionState(e) !== "past");
  const highlights = m.artworks.slice(0, 8);
  const A = (k: StringKey) => t(k);

  return (
    <>
      <Header />
      <Page className="pt-2">
        <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-4xl shadow-lift">
          <ArtImage src={m.cover} alt={m.name} eager className="aspect-[4/5] sm:aspect-[16/10] md:aspect-[21/9]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/5" />
          <div className="absolute inset-x-0 bottom-0 p-5 text-white md:p-8">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="glass flex items-center gap-2 rounded-full px-3 py-1.5 text-[12px] font-semibold text-ink">
                <StatusDot color={st.open ? "success" : "danger"} />
                {st.open ? t("home.openNow") : t("home.closedNow")}
                {st.today && <span className="text-muted">· {st.today[0]} às {st.today[1]}</span>}
              </span>
              {st.freeToday && (
                <span className="rounded-full bg-success px-3 py-1.5 text-[12px] font-bold text-white">
                  {t("home.freeToday")}
                  {st.freeFrom ? ` · ${st.freeFrom}` : ""}
                </span>
              )}
            </div>
            <h1 className="max-w-3xl text-[32px] font-extrabold leading-[1.05] tracking-[-0.03em] md:text-[52px]">{tr(m.tagline, lang)}</h1>
            <p className="mt-2 flex items-center gap-1.5 text-[14px] text-white/75">
              <MapPin size={14} /> {m.address}
            </p>
          </div>
        </motion.section>

        {family && (
          <Link to={`${base}/planejar`} className="tap mt-4 flex items-center gap-3 rounded-3xl bg-warning/15 p-4 text-[14px] font-semibold">
            <Baby className="text-warning" />
            <span className="flex-1">{t("home.family.on")} · {t("settings.family.desc")}</span>
            <ArrowRight size={16} />
          </Link>
        )}

        <section className="mt-8 grid grid-cols-3 gap-4 border-b hairline pb-8">
          {m.stats.slice(0, 3).map((s) => (
            <div key={s.value}>
              <div className="num text-[30px] leading-none text-ink md:text-[48px]">{s.value}</div>
              <div className="mt-1.5 text-[11.5px] font-semibold uppercase leading-tight tracking-wider text-muted md:text-[12px]">{tr(s.label, lang)}</div>
            </div>
          ))}
        </section>

        <section className="mt-8">
          <SectionTitle eyebrow={m.short} title={t("home.hello")} />
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            <Action dark to={`${base}/scanner`} icon={<ScanLine size={22} />} title={A("act.scan")} desc={A("act.scan.desc")} className="col-span-2 md:row-span-2 md:min-h-[260px]" />
            <Action to={`${base}/planejar`} icon={<Compass size={22} />} title={A("act.plan")} desc={A("act.plan.desc")} />
            <Action to={`${base}/kora`} icon={<Sparkles size={22} />} title={A("act.assistant")} desc={A("act.assistant.desc")} />
            <Action to={`${base}/acervo`} icon={<LayoutGrid size={22} />} title={A("act.collection")} desc={A("act.collection.desc")} />
            <Action to={`${base}/mapa`} icon={<MapIcon size={22} />} title={A("act.map")} desc={A("act.map.desc")} />
            <Action to={`${base}/quiz`} icon={<HelpCircle size={22} />} title={A("act.quiz")} desc={A("act.quiz.desc")} />
            <Action to={`${base}/visite`} icon={<CalendarClock size={22} />} title={A("act.info")} desc={A("act.info.desc")} />
            <Action to="/rotas" icon={<Route size={22} />} title={A("act.routes")} desc={A("act.routes.desc")} className="col-span-2 md:col-span-2" />
          </div>
        </section>

        {exhibitions.length > 0 && (
          <section className="mt-12">
            <SectionTitle title={t("home.exhibitions")} action={<Link to={`${base}/visite`} className="text-[14px] font-semibold text-accent">{t("home.seeAll")}</Link>} />
            <div className="no-scrollbar -mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 md:-mx-8 md:px-8">
              {exhibitions.map((e) => {
                const state = exhibitionState(e);
                return (
                  <a
                    key={e.id}
                    href={e.url}
                    target="_blank"
                    rel="noreferrer"
                    className="tap card w-[78%] shrink-0 snap-start overflow-hidden sm:w-[340px]"
                  >
                    {e.image ? (
                      <ArtImage src={e.image} alt={e.title} className="aspect-[16/10]" />
                    ) : (
                      <div className="grid aspect-[16/10] place-items-center bg-accent/10 p-6 text-center text-[22px] font-extrabold text-accent">{e.title}</div>
                    )}
                    <div className="p-4">
                      <div className="mb-2 flex items-center gap-2 text-[12px] font-semibold">
                        <StatusDot color={state === "now" ? "success" : "warning"} />
                        <span className={state === "now" ? "text-success" : "text-warning"}>{state === "now" ? t("home.exhibitions") : t("home.soon")}</span>
                        <span className="text-muted">· {e.dates}</span>
                      </div>
                      <p className="text-[17px] font-extrabold leading-snug">{e.title}</p>
                      {e.location && <p className="mt-0.5 text-[13px] text-muted">{e.location}</p>}
                      <p className="mt-2 line-clamp-3 text-[13.5px] leading-snug text-ink/75">{tr(e.description, lang)}</p>
                    </div>
                  </a>
                );
              })}
            </div>
          </section>
        )}

        <section className="mt-12">
          <SectionTitle
            title={t("home.highlights")}
            action={
              <Link to={`${base}/acervo`} className="text-[14px] font-semibold text-accent">
                {t("home.seeAll")}
              </Link>
            }
          />
          <div className="grid grid-cols-2 gap-x-3 gap-y-6 md:grid-cols-4 md:gap-x-5">
            {highlights.map((a) => (
              <ArtworkCard key={a.id} art={a} />
            ))}
          </div>
        </section>
      </Page>
    </>
  );
}
