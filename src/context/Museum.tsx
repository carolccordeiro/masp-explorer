import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useSettings } from "@/context/Settings";
import { accentOn, inkOn, loadMuseum, museumMeta } from "@/data/museums";
import type { Museum, MuseumId } from "@/data/types";
import { hexToRgb } from "@/lib/utils";

const Ctx = createContext<Museum | null>(null);

/** Aplica a cor do museu em toda a interface (white label). */
export function applyAccent(hex?: string, ink = "#FFFFFF") {
  const root = document.documentElement;
  if (!hex) {
    root.style.removeProperty("--accent");
    root.style.removeProperty("--accent-ink");
    return;
  }
  root.style.setProperty("--accent", hexToRgb(hex));
  root.style.setProperty("--accent-ink", hexToRgb(ink));
}

export function MuseumProvider({ id, children, fallback }: { id: MuseumId; children: ReactNode; fallback: ReactNode }) {
  const [museum, setMuseum] = useState<Museum | null>(null);
  const [error, setError] = useState(false);

  const { isDark } = useSettings();
  useEffect(() => {
    const meta = museumMeta(id);
    applyAccent(accentOn(meta, isDark), inkOn(meta, isDark));
  }, [id, isDark]);

  useEffect(() => {
    let alive = true;
    setMuseum(null);
    loadMuseum(id)
      .then((m) => alive && setMuseum(m))
      .catch(() => alive && setError(true));
    return () => {
      alive = false;
    };
  }, [id]);

  if (error) return <>{fallback}</>;
  if (!museum) return <>{fallback}</>;
  return <Ctx.Provider value={museum}>{children}</Ctx.Provider>;
}

export function useMuseum(): Museum {
  const m = useContext(Ctx);
  if (!m) throw new Error("useMuseum fora do provider");
  return m;
}

export function useMaybeMuseum(): Museum | null {
  return useContext(Ctx);
}
