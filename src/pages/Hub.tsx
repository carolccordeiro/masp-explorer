import { motion } from "framer-motion";
import { ArrowRight, BarChart3, Info, Route, ScanLine, Settings2 } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { KoraWordmark } from "@/components/KoraMark";
import { SettingsSheet } from "@/components/SettingsSheet";
import { StatusDot } from "@/components/ui";
import { useSettings } from "@/context/Settings";
import type { Lang } from "@/data/types";
import { MUSEUMS } from "@/data/museums";
import { openStatus } from "@/lib/hours";
import { cn, tr } from "@/lib/utils";

/**
 * Escolha do museu: a primeira tela depois da tela de descanso.
 * Cada museu aparece com a sua própria identidade (cor, capa e nome).
 */
export default function Hub() {
  const { t, lang, set } = useSettings();
  const [hover, setHover] = useState<string | null>(null);
  const [settings, setSettings] = useState(false);
  const [, tick] = useState(0);

  // atualiza o "aberto agora" a cada minuto (o totem fica ligado o dia todo)
  useEffect(() => {
    const id = setInterval(() => tick((x) => x + 1), 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex min-h-[100dvh] flex-col bg-bg">
      <header className="mx-auto flex w-full max-w-[1600px] items-center gap-3 px-4 pb-2 pt-4 md:px-8 md:pt-6">
        <Link to="/" aria-label="KORA">
          <KoraWordmark size="sm" />
        </Link>
        <div className="ml-auto flex items-center gap-1 rounded-full bg-ink/[0.06] p-1">
          {(["pt", "en", "es"] as Lang[]).map((l) => (
            <button
              key={l}
              onClick={() => set("lang", l)}
              className={cn(
                "tap h-8 rounded-full px-3 text-[13px] font-bold uppercase transition-colors duration-150",
                lang === l ? "bg-ink text-bg" : "text-muted hover:text-ink",
              )}
              aria-pressed={lang === l}
            >
              {l}
            </button>
          ))}
        </div>
        <button onClick={() => setSettings(true)} className="tap grid h-10 w-10 place-items-center rounded-full bg-ink/[0.06]" aria-label={t("settings.title")}>
          <Settings2 size={18} />
        </button>
      </header>

      <div className="mx-auto w-full max-w-[1600px] px-4 pb-4 pt-4 md:px-8 md:pb-6 md:pt-6">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[38px] font-extrabold leading-[1.02] tracking-[-0.035em] md:text-[60px]"
        >
          {t("hub.title")}
          <span className="text-muted">.</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.08 }} className="mt-2 text-[16px] text-muted md:text-[18px]">
          {t("hub.pick")}
        </motion.p>
      </div>

      {/* os três museus */}
      <div className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col gap-3 px-4 md:flex-row md:gap-4 md:px-8">
        {MUSEUMS.map((m, i) => {
          const st = openStatus(m);
          const active = hover === m.id;
          return (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0, flexGrow: hover ? (active ? 1.5 : 0.85) : 1 }}
              transition={{ delay: hover ? 0 : 0.08 * i, duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
              className="min-h-[248px] min-w-0 basis-0 md:min-h-[460px]"
              onMouseEnter={() => setHover(m.id)}
              onMouseLeave={() => setHover(null)}
            >
              <Link
                to={`/${m.id}`}
                className="tap group relative flex h-full flex-col justify-between overflow-hidden rounded-4xl p-5 text-white shadow-lift md:p-7"
                style={{ backgroundColor: m.accent }}
              >
                {/* capa com a cor do museu por cima */}
                <img
                  src={m.cover}
                  alt=""
                  aria-hidden
                  loading={i === 0 ? "eager" : "lazy"}
                  className="absolute inset-0 h-full w-full object-cover opacity-55 mix-blend-luminosity transition-transform duration-700 group-hover:scale-[1.05]"
                />
                <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${m.accent}cc 0%, ${m.accent}33 45%, rgba(0,0,0,0.75) 100%)` }} />

                <div className="relative">
                  <span className="inline-flex items-center gap-2 rounded-full bg-black/35 px-3 py-1.5 text-[12px] font-semibold backdrop-blur">
                    <StatusDot color={st.open ? "success" : "danger"} />
                    {st.open ? t("home.openNow") : t("home.closedNow")}
                    {st.freeToday && <span className="text-[#7CF29A]">· {t("common.free")}</span>}
                  </span>
                  <p className="mt-3 text-[56px] font-extrabold leading-[0.85] tracking-[-0.05em] md:text-[84px] lg:text-[104px]">{m.short}</p>
                </div>

                <div className="relative">
                  <p className="hidden text-[13px] font-semibold text-white/80 md:block">{m.name}</p>
                  <p className="mt-1 max-w-md text-[18px] font-extrabold leading-tight md:text-[24px]">{tr(m.tagline, lang)}</p>
                  <div className="mt-3 flex items-center justify-between gap-3 md:mt-4">
                    <span className="text-[12.5px] text-white/70">{m.city}</span>
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-[15px] font-bold transition-transform duration-150 group-hover:translate-x-0.5"
                      style={{ color: m.accent }}
                    >
                      {t("hub.enter")} <ArrowRight size={17} />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* atalhos da rede */}
      <nav className="mx-auto grid w-full max-w-[1600px] grid-cols-2 gap-2 px-4 pb-6 pt-4 md:flex md:flex-wrap md:items-center md:gap-3 md:px-8">
        <Shortcut to="/scanner" icon={<ScanLine size={18} />} label={t("hub.scanAll")} />
        <Shortcut to="/rotas" icon={<Route size={18} />} label={t("hub.routes")} />
        <Shortcut to="/sobre" icon={<Info size={18} />} label={t("hub.about")} />
        <Shortcut to="/painel" icon={<BarChart3 size={18} />} label={t("admin.title")} />
        <span className="hidden text-[12.5px] text-muted md:ml-auto md:block">
          <Link to="/privacidade" className="hover:text-ink">
            {t("settings.privacy")}
          </Link>
        </span>
      </nav>

      <SettingsSheet open={settings} onClose={() => setSettings(false)} />
    </div>
  );
}

function Shortcut({ to, icon, label }: { to: string; icon: ReactNode; label: string }) {
  return (
    <Link to={to} className="tap chip h-11 justify-center px-4 text-[14px] md:justify-start">
      {icon}
      {label}
    </Link>
  );
}
