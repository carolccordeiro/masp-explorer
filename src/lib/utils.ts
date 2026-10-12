import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { I18n, Lang } from "@/data/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Escolhe o texto no idioma pedido, com PT como reserva. */
export function tr(v: I18n | string | undefined, lang: Lang): string {
  if (!v) return "";
  if (typeof v === "string") return v;
  return v[lang] || v.pt || "";
}

/** localStorage que nunca quebra (modo privado, bloqueios, etc.). */
export const store = {
  get<T>(key: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(key);
      return raw == null ? fallback : (JSON.parse(raw) as T);
    } catch {
      return fallback;
    }
  },
  set(key: string, value: unknown) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* sem armazenamento: segue só em memória */
    }
  },
};

export function hexToRgb(hex: string): string {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
}

export function normalize(s: string) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

export function shuffle<T>(arr: T[], seed = Date.now()): T[] {
  const a = [...arr];
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const isTouch = () => typeof window !== "undefined" && matchMedia("(pointer: coarse)").matches;

export function deviceKind(): "totem" | "mobile" | "desktop" {
  if (typeof window === "undefined") return "desktop";
  if (new URLSearchParams(location.search).has("totem") || sessionStorage.getItem("kora-totem") === "1") return "totem";
  return matchMedia("(max-width: 768px)").matches ? "mobile" : "desktop";
}
