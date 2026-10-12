import { motion } from "framer-motion";
import { ArrowRight, Baby, CalendarClock, ChevronRight, Compass, HelpCircle, LayoutGrid, Map as MapIcon, Route, ScanLine, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArtworkCard } from "@/components/ArtworkCard";
import { Header } from "@/components/Shell";
import { PartnerCard } from "@/components/PartnerCard";
import { CrowdChip } from "@/components/CrowdChip";
import { MuseumMark } from "@/components/MuseumMark";
import { openLine } from "@/components/OpenLine";
import { brandColors } from "@/data/museums";
import { Page, SectionTitle, StatusDot, Switch } from "@/components/ui";
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
  const { t, lang, family, set } = useSettings();
  const st = openStatus(m);
  const base = `/${m.id}`;
  const exhibitions = m.exhibitions.filter((e) => exhibitionState(e) !== "past");
  const highlights = m.artworks.slice(0, 4);
  const A = (k: StringKey) => t(k);

  return (
    <>
      <Header />
      <Page className="pt-2">
        <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className={cn("rounded-4xl p-6 md:p-10", m.brandBg && "border hairline")} style={{ backgroundColor: brandColors(m).bg, color: brandColors(m).ink }}>
          <div className="flex flex-wrap items-center gap-2">
            <span className={cn("flex items-center gap-2 rounded-full px-3 py-1.5 text-[12.5px] font-semibold", m.brandBg ? "bg-black/[0.06]" : "bg-black/20")}>
              <StatusDot color={st.open ? "success" : "danger"} />
              {openLine(m, t, lang)}
            </span>
            <CrowdChip museum={m.id} />
            {st.freeToday && (
              <span className="rounded-full bg-success px-3 py-1.5 text-[12.5px] font-bold text-white">
                {t("home.freeToday")}
                {st.freeFrom ? ` · ${st.freeFrom}` : ""}
              </span>
            )}
          </div>
          <MuseumMark m={m} className="mt-6 block text-[64px] font-extrabold leading-[0.85] tracking-[-0.05em] md:text-[110px]" />
          <h1 className="mt-4 max-w-2xl text-[22px] font-extrabold leading-[1.15] tracking-[-0.02em] md:text-[30px]">{tr(m.tagline, lang)}</h1>
        </motion.section>

        <PartnerCard museum={m.id} className="mt-4" />

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

        <div className={cn("mt-4 flex w-full items-center gap-3 rounded-3xl p-4 transition-colors duration-150", family ? "bg-warning/15" : "border hairline")}>
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-warning/20 text-warning">
            <Baby size={20} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[15.5px] font-bold">{family ? t("home.family.on") : t("home.family.cta")}</span>
            <span className="block text-[13px] text-muted">{t("home.family.ctaDesc")}</span>
          </span>
          <Switch checked={family} onChange={(v) => set("family", v)} label={t("home.family.cta")} />
        </div>

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

      </Page>
    </>
  );
}
