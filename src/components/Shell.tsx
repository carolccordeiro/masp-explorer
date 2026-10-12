import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Building2,
  CalendarClock,
  Compass,
  Grid2x2,
  HelpCircle,
  Home,
  Info,
  LayoutGrid,
  Map,
  Route,
  ScanLine,
  Settings2,
  Sparkles,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useMaybeMuseum } from "@/context/Museum";
import { useSettings } from "@/context/Settings";
import type { StringKey } from "@/i18n/strings";
import { resetSession } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { Attract } from "./Attract";
import { KoraIcon, KoraWordmark } from "./KoraMark";
import { SettingsSheet } from "./SettingsSheet";
import { Sheet } from "./Sheet";
import { IconButton } from "./ui";

export function Header({ back, title, right }: { back?: boolean | string; title?: ReactNode; right?: ReactNode }) {
  const museum = useMaybeMuseum();
  const navigate = useNavigate();
  const { t } = useSettings();
  const [settings, setSettings] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(scrollY > 8);
    fn();
    addEventListener("scroll", fn, { passive: true });
    return () => removeEventListener("scroll", fn);
  }, []);

  const goBack = () => {
    if (typeof back === "string") navigate(back);
    else if (history.length > 1) navigate(-1);
    else navigate(museum ? `/${museum.id}` : "/museus");
  };

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 transition-[background,box-shadow] duration-150",
          scrolled ? "glass shadow-[0_1px_0_rgb(var(--line)/var(--line-alpha))]" : "bg-transparent",
        )}
      >
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4 md:h-16 md:px-8">
          {back ? (
            <IconButton label={t("common.back")} onClick={goBack}>
              <ArrowLeft size={19} />
            </IconButton>
          ) : museum ? (
            <Link to="/museus" className="tap" aria-label="KORA">
              <KoraIcon size={40} className="text-ink" />
            </Link>
          ) : (
            <Link to="/museus" className="tap">
              <KoraWordmark size="sm" />
            </Link>
          )}
          <div className="min-w-0 flex-1">
            {title ? (
              <p className="truncate text-[17px] font-extrabold">{title}</p>
            ) : museum ? (
              <Link to={`/${museum.id}`} className="flex items-center gap-2">
                <span className="rounded-lg bg-accent px-2 py-0.5 text-[14px] font-extrabold tracking-tight text-accent-ink">{museum.short}</span>
                <span className="hidden truncate text-[13px] font-semibold text-muted sm:inline">{museum.name}</span>
              </Link>
            ) : null}
          </div>
          {right}
          <IconButton label={t("settings.title")} onClick={() => setSettings(true)}>
            <Settings2 size={18} />
          </IconButton>
        </div>
      </header>
      <SettingsSheet open={settings} onClose={() => setSettings(false)} />
    </>
  );
}

type Tab = { to: string; icon: ReactNode; label: StringKey; end?: boolean };

export function BottomNav() {
  const museum = useMaybeMuseum();
  const { t } = useSettings();
  const [more, setMore] = useState(false);
  const loc = useLocation();
  useEffect(() => setMore(false), [loc.pathname]);

  const base = museum ? `/${museum.id}` : "";
  const tabs: Tab[] = museum
    ? [
        { to: base, icon: <Home size={22} />, label: "nav.home", end: true },
        { to: `${base}/scanner`, icon: <ScanLine size={22} />, label: "nav.scan" },
        { to: `${base}/acervo`, icon: <LayoutGrid size={22} />, label: "nav.collection" },
        { to: `${base}/kora`, icon: <Sparkles size={22} />, label: "nav.assistant" },
      ]
    : [
        { to: "/museus", icon: <Building2 size={22} />, label: "nav.museums", end: true },
        { to: "/scanner", icon: <ScanLine size={22} />, label: "nav.scan" },
        { to: "/rotas", icon: <Route size={22} />, label: "act.routes" },
        { to: "/sobre", icon: <Info size={22} />, label: "nav.about" },
      ];

  const moreItems: { to: string; icon: ReactNode; label: StringKey; desc: StringKey }[] = museum
    ? [
        { to: `${base}/planejar`, icon: <Compass size={20} />, label: "act.plan", desc: "act.plan.desc" },
        { to: `${base}/mapa`, icon: <Map size={20} />, label: "act.map", desc: "act.map.desc" },
        { to: `${base}/quiz`, icon: <HelpCircle size={20} />, label: "act.quiz", desc: "act.quiz.desc" },
        { to: `${base}/visite`, icon: <CalendarClock size={20} />, label: "act.info", desc: "act.info.desc" },
        { to: "/rotas", icon: <Route size={20} />, label: "act.routes", desc: "act.routes.desc" },
        { to: "/museus", icon: <Building2 size={20} />, label: "nav.museums", desc: "hub.subtitle" },
      ]
    : [];

  return (
    <>
      <nav className="safe-bottom fixed inset-x-0 bottom-0 z-40 md:bottom-5 md:flex md:justify-center" aria-label="Navegação">
        <div className="glass mx-auto flex w-full items-stretch justify-around border-t hairline px-1 pt-1 md:w-auto md:gap-1 md:rounded-full md:border md:p-1.5 md:shadow-lift">
          {tabs.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.end}
              className={({ isActive }) =>
                cn(
                  "tap flex min-w-[64px] flex-1 flex-col items-center gap-0.5 rounded-2xl px-2 py-1.5 text-[10.5px] font-semibold transition-colors md:flex-none md:flex-row md:gap-2 md:rounded-full md:px-4 md:py-2.5 md:text-[14px]",
                  isActive ? "text-accent md:bg-accent md:text-accent-ink" : "text-muted hover:text-ink",
                )
              }
            >
              {tab.icon}
              <span>{t(tab.label)}</span>
            </NavLink>
          ))}
          {museum && (
            <button
              onClick={() => setMore(true)}
              className="tap flex min-w-[64px] flex-1 flex-col items-center gap-0.5 rounded-2xl px-2 py-1.5 text-[10.5px] font-semibold text-muted hover:text-ink md:flex-none md:flex-row md:gap-2 md:rounded-full md:px-4 md:py-2.5 md:text-[14px]"
            >
              <Grid2x2 size={22} />
              <span>{t("nav.more")}</span>
            </button>
          )}
        </div>
      </nav>
      <Sheet open={more} onClose={() => setMore(false)} title={t("nav.more")}>
        <div className="grid grid-cols-2 gap-3">
          {moreItems.map((i) => (
            <Link key={i.to + i.label} to={i.to} className="tap card flex flex-col gap-2 p-4">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent/10 text-accent">{i.icon}</span>
              <span className="text-[15px] font-bold leading-tight">{t(i.label)}</span>
              <span className="line-clamp-2 text-[12px] leading-snug text-muted">{t(i.desc)}</span>
            </Link>
          ))}
        </div>
      </Sheet>
    </>
  );
}

/** Pede a tela de descanso de qualquer lugar do app (ex.: botão "Encerrar sessão"). */
export const showAttract = () => dispatchEvent(new Event("kora:attract"));

/**
 * Tela de descanso: no modo totem aparece sozinha após inatividade;
 * em qualquer modo pode ser chamada ao encerrar a sessão.
 */
export function IdleOverlay({ timeoutMs = 60_000 }: { timeoutMs?: number }) {
  const { totem } = useSettings();
  const museum = useMaybeMuseum();
  const navigate = useNavigate();
  const [idle, setIdle] = useState(false);

  useEffect(() => {
    const open = () => {
      setIdle(true);
      resetSession(museum?.id);
    };
    addEventListener("kora:attract", open);
    return () => removeEventListener("kora:attract", open);
  }, [museum?.id]);

  useEffect(() => {
    if (!totem || idle) return;
    let timer: ReturnType<typeof setTimeout>;
    const reset = () => {
      clearTimeout(timer);
      timer = setTimeout(showAttract, timeoutMs);
    };
    const events = ["pointerdown", "keydown", "scroll", "touchstart"];
    events.forEach((e) => addEventListener(e, reset, { passive: true }));
    reset();
    return () => {
      clearTimeout(timer);
      events.forEach((e) => removeEventListener(e, reset));
    };
  }, [totem, timeoutMs, idle]);

  return (
    <AnimatePresence>
      {idle && (
        <Attract
          museum={museum?.id}
          onStart={() => {
            setIdle(false);
            navigate("/museus");
          }}
        />
      )}
    </AnimatePresence>
  );
}

/** Widget oficial VLibras (governo federal), carregado só quando ativado. */
export function LibrasWidget() {
  const { libras } = useSettings();
  useEffect(() => {
    if (!libras) {
      document.getElementById("kora-vlibras")?.remove();
      return;
    }
    if (document.getElementById("kora-vlibras")) return;
    const wrap = document.createElement("div");
    wrap.id = "kora-vlibras";
    wrap.innerHTML =
      '<div vw class="enabled"><div vw-access-button class="active"></div><div vw-plugin-wrapper><div class="vw-plugin-top-wrapper"></div></div></div>';
    document.body.appendChild(wrap);
    const s = document.createElement("script");
    s.src = "https://vlibras.gov.br/app/vlibras-plugin.js";
    s.onload = () => {
      const w = window as unknown as { VLibras?: { Widget: new (url: string) => unknown } };
      if (w.VLibras) new w.VLibras.Widget("https://vlibras.gov.br/app");
      // o plugin inicializa no evento load da janela
      dispatchEvent(new Event("load"));
    };
    wrap.appendChild(s);
  }, [libras]);
  return null;
}
