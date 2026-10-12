import { track } from "@/lib/analytics";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Lang } from "@/data/types";
import { translate, type StringKey } from "@/i18n/strings";
import { store } from "@/lib/utils";

export type Appearance = "light" | "dark" | "system";

interface SettingsState {
  lang: Lang;
  appearance: Appearance;
  fontScale: number; // 0.9 a 1.3
  highContrast: boolean;
  reduceMotion: boolean;
  family: boolean;
  libras: boolean;
  totem: boolean;
}

interface SettingsApi extends SettingsState {
  set: <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => void;
  t: (key: StringKey) => string;
  isDark: boolean;
}

const KEY = "kora-settings-v2";

function initialLang(): Lang {
  // Produto brasileiro: começa sempre em português; o visitante troca em Preferências.
  return "pt";
}

function initialTotem(): boolean {
  try {
    const q = new URLSearchParams(location.search);
    if (q.has("totem")) {
      sessionStorage.setItem("kora-totem", q.get("totem") === "0" ? "0" : "1");
    }
    return sessionStorage.getItem("kora-totem") === "1";
  } catch {
    return false;
  }
}

const defaults: SettingsState = {
  lang: initialLang(),
  appearance: "system",
  fontScale: 1,
  highContrast: false,
  reduceMotion: typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches,
  family: false,
  libras: false,
  totem: false,
};

const Ctx = createContext<SettingsApi | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SettingsState>(() => ({
    ...defaults,
    ...store.get<Partial<SettingsState>>(KEY, {}),
    totem: initialTotem(),
  }));
  const [systemDark, setSystemDark] = useState(() => typeof matchMedia !== "undefined" && matchMedia("(prefers-color-scheme: dark)").matches);

  useEffect(() => {
    const mq = matchMedia("(prefers-color-scheme: dark)");
    const fn = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);

  const isDark = state.appearance === "dark" || (state.appearance === "system" && systemDark);

  useEffect(() => {
    const { totem, ...persist } = state;
    store.set(KEY, persist);
    try {
      sessionStorage.setItem("kora-totem", totem ? "1" : "0");
    } catch {
      /* ignora */
    }
    const root = document.documentElement;
    root.classList.toggle("dark", isDark);
    root.classList.toggle("hc", state.highContrast);
    root.classList.toggle("reduce-motion", state.reduceMotion);
    root.style.setProperty("--font-scale", String(state.fontScale));
    root.lang = state.lang === "pt" ? "pt-BR" : state.lang;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", isDark ? "#000000" : "#F5F5F7");
  }, [state, isDark]);

  const set = useCallback(<K extends keyof SettingsState>(key: K, value: SettingsState[K]) => {
    setState((s) => ({ ...s, [key]: value }));
    // preferência de acessibilidade/idioma vira métrica anônima para o painel
    const seg = location.pathname.split("/")[1];
    track({ museum: ["masp", "ims", "mam"].includes(seg) ? seg : "hub", type: "pref", path: `${String(key)}:${String(value)}` });
  }, []);

  const t = useCallback((key: StringKey) => translate(state.lang, key), [state.lang]);

  const value = useMemo(() => ({ ...state, set, t, isDark }), [state, set, t, isDark]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSettings() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useSettings fora do provider");
  return v;
}
