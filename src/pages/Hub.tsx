import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Info, Route, ScanLine } from "lucide-react";
import { Link } from "react-router-dom";
import { ArtImage } from "@/components/ArtImage";
import { KoraWordmark } from "@/components/KoraMark";
import { Header } from "@/components/Shell";
import { Page, StatusDot } from "@/components/ui";
import { useSettings } from "@/context/Settings";
import { MUSEUMS } from "@/data/museums";
import { openStatus } from "@/lib/hours";
import { tr } from "@/lib/utils";

export default function Hub() {
  const { t, lang } = useSettings();
  return (
    <>
      <Header />
      <Page className="pt-2">
        <section className="pb-8 pt-4 md:pb-12 md:pt-10">
          <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="eyebrow mb-3">
            {t("hub.network")} · São Paulo
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="max-w-3xl text-[40px] font-extrabold leading-[1.02] tracking-[-0.035em] md:text-[68px]"
          >
            {t("app.tagline")}
            <span className="text-muted">.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.12 }} className="body-copy mt-4 max-w-xl text-[17px] text-muted">
            {t("hub.subtitle")}
          </motion.p>
          <div className="mt-8 grid max-w-2xl grid-cols-3 gap-4 border-t hairline pt-6">
            <div>
              <div className="num text-[40px] leading-none md:text-[52px]">3</div>
              <div className="mt-1 text-[12px] font-semibold uppercase tracking-wider text-muted">{t("nav.museums")}</div>
            </div>
            <div>
              <div className="num text-[40px] leading-none md:text-[52px]">150</div>
              <div className="mt-1 text-[12px] font-semibold uppercase tracking-wider text-muted">{t("hub.works")}</div>
            </div>
            <div>
              <div className="num text-[40px] leading-none md:text-[52px]">3</div>
              <div className="mt-1 text-[12px] font-semibold uppercase tracking-wider text-muted">{t("hub.languages")}</div>
            </div>
          </div>
        </section>

        <h2 className="mb-4 text-[22px] font-extrabold md:text-[26px]">{t("hub.title")}</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {MUSEUMS.map((m, i) => {
            const st = openStatus(m);
            return (
              <motion.div key={m.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 * i }}>
                <Link
                  to={`/${m.id}`}
                  className="tap group relative block overflow-hidden rounded-4xl shadow-lift"
                  style={{ ["--card-accent" as string]: m.accent }}
                >
                  <ArtImage src={m.cover} alt={m.name} className="aspect-[4/5] md:aspect-[3/4]" imgClassName="transition-transform duration-700 group-hover:scale-[1.04]" eager={i === 0} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/0" />
                  <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
                    <span className="rounded-xl px-2.5 py-1 text-[20px] font-extrabold tracking-tight text-white" style={{ backgroundColor: m.accent }}>
                      {m.short}
                    </span>
                    <span className="glass flex items-center gap-2 rounded-full px-3 py-1.5 text-[12px] font-semibold text-ink">
                      <StatusDot color={st.open ? "success" : "danger"} />
                      {st.open ? t("home.openNow") : t("home.closedNow")}
                      {st.freeToday && <span className="text-success">· {t("common.free")}</span>}
                    </span>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                    <p className="text-[12px] font-semibold uppercase tracking-wider text-white/70">{m.city}</p>
                    <p className="mt-1 text-[22px] font-extrabold leading-tight">{tr(m.tagline, lang)}</p>
                    <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-[14px] font-bold text-black transition-transform group-hover:translate-x-0.5">
                      {t("hub.enter")} <ArrowRight size={16} />
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <Link to="/scanner" className="tap card flex items-center gap-4 p-5">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-ink text-bg">
              <ScanLine size={26} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[17px] font-bold">{t("hub.scanAll")}</span>
              <span className="block text-[14px] text-muted">{t("hub.scanAll.desc")}</span>
            </span>
            <ArrowUpRight className="text-muted" />
          </Link>
          <Link to="/rotas" className="tap card flex items-center gap-4 p-5">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-ink text-bg">
              <Route size={26} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[17px] font-bold">{t("hub.routes")}</span>
              <span className="block text-[14px] text-muted">{t("hub.routes.desc")}</span>
            </span>
            <ArrowUpRight className="text-muted" />
          </Link>
          <Link to="/sobre" className="tap card flex items-center gap-4 p-5">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-ink text-bg">
              <Info size={26} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[17px] font-bold">{t("hub.about")}</span>
              <span className="block text-[14px] text-muted">{t("hub.about.desc")}</span>
            </span>
            <ArrowUpRight className="text-muted" />
          </Link>
        </div>

        <footer className="mt-14 flex flex-col items-start gap-3 border-t hairline pt-6 text-[13px] text-muted md:flex-row md:items-center md:justify-between">
          <KoraWordmark size="sm" />
          <p>Plataforma white label para museus · Demonstração com dados públicos · doNEXT 2026</p>
          <div className="flex gap-4">
            <Link to="/sobre" className="hover:text-ink">
              {t("nav.about")}
            </Link>
            <Link to="/descanso" className="hover:text-ink">
              {t("attract.title")}
            </Link>
            <Link to="/privacidade" className="hover:text-ink">
              {t("settings.privacy")}
            </Link>
            <Link to="/painel" className="hover:text-ink">
              {t("admin.title")}
            </Link>
          </div>
        </footer>
      </Page>
    </>
  );
}
