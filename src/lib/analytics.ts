// Métricas anônimas de uso. Nada de nome, e-mail, rosto ou localização:
// só o tipo de ação, a tela, a obra e um identificador aleatório da sessão.
import type { SupabaseClient } from "@supabase/supabase-js";
import { deviceKind } from "./utils";

export type EventType =
  | "session_start"
  | "view"
  | "artwork_view"
  | "scan"
  | "scan_match"
  | "scan_ai"
  | "chat"
  | "plan"
  | "hunt_found"
  | "quiz_done"
  | "favorite"
  | "audio"
  | "qr"
  | "people";

export interface KoraEvent {
  museum: string;
  type: EventType;
  path?: string;
  artwork_id?: string;
  value?: number;
}

const URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const KEY = (import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY) as string | undefined;
export const backendReady = Boolean(URL && KEY);

let clientPromise: Promise<SupabaseClient> | null = null;
export function supabase(): Promise<SupabaseClient> {
  if (!backendReady) return Promise.reject(new Error("backend não configurado"));
  if (!clientPromise) {
    clientPromise = import("@supabase/supabase-js").then(({ createClient }) =>
      createClient(URL!, KEY!, { auth: { persistSession: false, autoRefreshToken: false } }),
    );
  }
  return clientPromise;
}

function sessionId(): string {
  try {
    let id = sessionStorage.getItem("kora-sid");
    if (!id) {
      id = crypto.randomUUID().slice(0, 18);
      sessionStorage.setItem("kora-sid", id);
    }
    return id;
  } catch {
    return "anon";
  }
}

let queue: Record<string, unknown>[] = [];
let timer: ReturnType<typeof setTimeout> | null = null;

async function flush() {
  timer = null;
  if (!queue.length || !backendReady) return;
  const batch = queue;
  queue = [];
  try {
    const sb = await supabase();
    await sb.from("events").insert(batch);
  } catch {
    /* métricas nunca atrapalham a experiência */
  }
}

export function track(e: KoraEvent) {
  const lang = (document.documentElement.lang || "pt").slice(0, 2);
  queue.push({
    museum: e.museum,
    type: e.type,
    path: e.path?.slice(0, 120),
    artwork_id: e.artwork_id,
    value: e.value,
    session_id: sessionId(),
    device: deviceKind(),
    lang: ["pt", "en", "es"].includes(lang) ? lang : "pt",
  });
  if (!timer) timer = setTimeout(flush, 1200);
}

if (typeof window !== "undefined") {
  addEventListener("pagehide", () => void flush());
}
