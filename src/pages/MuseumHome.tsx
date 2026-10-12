import { motion } from "framer-motion";
import { ArrowRight, Baby, CalendarClock, ChevronRight, Compass, HelpCircle, LayoutGrid, Map as MapIcon, Route, ScanLine, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArtImage } from "@/components/ArtImage";
import { ArtworkCard } from "@/components/ArtworkCard";
import { Header } from "@/components/Shell";
import { PartnerCard } from "@/components/PartnerCard";
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

/** Atalho principal: grande, poucas palavras. */
function Action({ to, icon, title, desc, primary }: { to: string; icon: ReactNode; title: string; desc: string; primary?: boolean }) {
  return (
    <Link
      to={to}
      className={cn(
        "tap group flex items-center gap-4 rounded-3xl p-4 transition-colors duration-150 md:p-5",
        primary ? "bg-accent text-accent-ink" : "bg-ink/[0.04] hover:bg-ink/[0.07]",
      )}
    >
      <span className={cn("grid h-12 w-12 shrink-0 place-items-center rounded-2xl", primary ? "bg-white/20" : "bg-surface text-accent")}>{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block text-[17px] font-extrabold leading-tight">{title}</span>
        <span className={cn("mt-0.5 block text-[13.5px] leading-snug", primary ? "opacity-80" : "text-muted")}>{desc}</span>
      </span>
      <ChevronRight size={18} className="shrink-0 opacity-40 transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}

/** Atalho secundário: só ícone e nome. */
function Mini({ to, icon, title }: { to: string; icon: ReactNode; title: string }) {
  return (
    <Link to={to} className="tap flex flex-col items-center gap-2 rounded-2xl py-3 text-center text-[13px] font-semibold hover:bg-ink/[0.04]">
      <span className="grid h-11 w-11 place-items-center rounded-full bg-ink/[0.05] text-ink">{icon}</span>
      {title}
    </Link>
  );
}

export default function MuseumHome() {
  const m = useMuseum();
  const { t, lang, family } = useSettings();
  const st = openStatus(m);
  const base = `/${m.id}`;
  const exhibitions = m.exhibitions.filter((e) => exhibitionState(e) !== "past");
  const highlights = m.artworks.slice(0, 4);
  const A = (k: StringKey) => t(k);

  return (
    <>
      <Header />
      <Page className="pt-2">
        <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-4xl">
          <ArtImage src={m.cover} alt={m.name} eager className="aspect-[4/3] sm:aspect-[16/9] md:aspect-[21/8]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/5" />
          <div className="absolute inset-x-0 bottom-0 p-5 text-white md:p-8">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="glass flex items-center gap-2 rounded-full px-3 py-1.5 text-[12px] font-semibold text-ink">
                <StatusDot color={st.open ? "success" : "danger"} />
                {st.open ? t("home.openNow") : t("home.closedNow")}
                {st.today && <span className="text-muted">{st.today[0]} às {st.today[1]}</span>}
              </span>
              {st.freeToday && (
                <span className="rounded-full bg-success px-3 py-1.5 text-[12px] font-bold text-white">
                  {t("home.freeToday")}
                  {st.freeFrom ? ` · ${st.freeFrom}` : ""}
                </span>
              )}
            </div>
            <h1 className="max-w-3xl text-[32px] font-extrabold leading-[1.05] tracking-[-0.03em] md:text-[52px]">{tr(m.tagline, lang)}</h1>
          </div>
        </motion.section>

        {family && (
          <Link to={`${base}/planejar`} className="tap mt-4 flex items-center gap-3 rounded-3xl bg-warning/15 p-4 text-[14px] font-semibold">
            <Baby className="text-warning" />
            <span className="flex-1">{t("home.family.on")}</span>
            <ArrowRight size={16} />
          </Link>
        )}

        <section className="mt-6 grid gap-3 md:grid-cols-3">
          <Action primary to={`${base}/scanner`} icon={<ScanLine size={22} />} title={A("act.scan")} desc={A("act.scan.desc")} />
          <Action to={`${base}/kora`} icon={<Sparkles size={22} />} title={A("act.assistant")} desc={A("act.assistant.desc")} />
          <Action to={`${base}/planejar`} icon={<Compass size={22} />} title={A("act.plan")} desc={A("act.plan.desc")} />
        </section>

        <nav className="mt-3 grid grid-cols-5 gap-1" aria-label={t("home.actions")}>
          <Mini to={`${base}/acervo`} icon={<LayoutGrid size={19} />} title={t("nav.collection")} />
          <Mini to={`${base}/mapa`} icon={<MapIcon size={19} />} title={A("act.map")} />
          <Mini to={`${base}/quiz`} icon={<HelpCircle size={19} />} title={A("act.quiz")} />
          <Mini to={`${base}/visite`} icon={<CalendarClock size={19} />} title={A("act.info")} />
          <Mini to="/rotas" icon={<Route size={19} />} title={A("act.routes")} />
        </nav>

        {exhibitions.length > 0 && (
          <section className="mt-12">
            <SectionTitle title={t("home.exhibitions")} action={<Link to={`${base}/visite`} className="text-[14px] font-semibold text-accent">{t("home.seeAll")}</Link>} />
            <ul className="divide-y divide-[rgb(var(--line)/var(--line-alpha))] border-y hairline">
              {exhibitions.slice(0, 3).map((e) => {
                const state = exhibitionState(e);
                return (
                  <li key={e.id}>
                    <a href={e.url} target="_blank" rel="noreferrer" className="tap flex items-center gap-4 py-4">
                      <span className="min-w-0 flex-1">
                        <span className="block text-[16.5px] font-bold leading-snug">{e.title}</span>
                        <span className="mt-0.5 flex items-center gap-1.5 text-[13px] text-muted">
                          {state === "soon" && <span className="font-semibold text-warning">{t("home.soon")},</span>}
                          {e.dates}
                        </span>
                      </span>
                      <ChevronRight size={18} className="shrink-0 text-muted" />
                    </a>
                  </li>
                );
              })}
            </ul>
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

        <PartnerCard museum={m.id} className="mt-12" />
      </Page>
    </>
  );
}
