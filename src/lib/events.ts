// Eventos do lugar (visita guiada, oficina, palestra...), com vagas, inscrição por apelido
// e patrocínio. Os dados ficam no Supabase; sem conexão, mostra eventos de exemplo marcados como tal.
import { useCallback, useEffect, useState } from "react";
import { backendReady, supabase, track } from "./analytics";
import { store } from "./utils";

export type EventKind = "visita" | "oficina" | "palestra" | "familia" | "acessivel" | "outro";

export const EVENT_KINDS: { id: EventKind; emoji: string; pt: string; en: string; es: string }[] = [
  { id: "visita", emoji: "🧭", pt: "Visita guiada", en: "Guided tour", es: "Visita guiada" },
  { id: "oficina", emoji: "✂️", pt: "Oficina", en: "Workshop", es: "Taller" },
  { id: "palestra", emoji: "🎤", pt: "Conversa", en: "Talk", es: "Charla" },
  { id: "familia", emoji: "🧸", pt: "Para famílias", en: "For families", es: "Para familias" },
  { id: "acessivel", emoji: "🤟", pt: "Acessível (Libras)", en: "Accessible (sign language)", es: "Accesible (lengua de señas)" },
  { id: "outro", emoji: "✨", pt: "Outro", en: "Other", es: "Otro" },
];
export const eventKind = (k: string) => EVENT_KINDS.find((x) => x.id === k) ?? EVENT_KINDS[EVENT_KINDS.length - 1];

export interface VenueEvent {
  id: string;
  venue: string;
  kind: EventKind;
  title: string;
  description?: string | null;
  starts_at: string;
  duration_min: number;
  meeting_point?: string | null;
  capacity: number;
  price?: string | null;
  lang?: string | null;
  sponsor?: string | null;
  sponsor_color?: string | null;
  sponsor_offer?: string | null;
  signups: number;
  demo?: boolean;
}

/** Chave aleatória do aparelho (sem conta, sem dado pessoal). Compartilhada com os rolês. */
export function deviceKey(): string {
  try {
    let k = localStorage.getItem("kora-key");
    if (!k) {
      k = Array.from(crypto.getRandomValues(new Uint8Array(16)), (b) => b.toString(16).padStart(2, "0")).join("");
      localStorage.setItem("kora-key", k);
    }
    return k;
  } catch {
    return "sem-armazenamento-" + Math.random().toString(36).slice(2, 12);
  }
}

/** Eventos de exemplo (só aparecem quando o lugar ainda não cadastrou nenhum). */
function demoEvents(venue: string): VenueEvent[] {
  const day = (d: number, h: number, m = 0) => {
    const t = new Date();
    t.setDate(t.getDate() + d);
    t.setHours(h, m, 0, 0);
    return t.toISOString();
  };
  const base: Record<string, Omit<VenueEvent, "id" | "venue" | "signups" | "demo">[]> = {
    masp: [
      { kind: "visita", title: "Os cavaletes de cristal em 40 minutos", description: "Uma volta pela pinacoteca para entender por que as obras flutuam no espaço e como ler a etiqueta no verso.", starts_at: day(1, 11), duration_min: 40, meeting_point: "2º andar, entrada da pinacoteca", capacity: 20, price: "Incluído no ingresso", lang: "Português" },
      { kind: "familia", title: "Caça às cores no acervo", description: "Mediação para crianças de 5 a 10 anos com um jogo de observação.", starts_at: day(2, 15), duration_min: 50, meeting_point: "Térreo, bilheteria", capacity: 15, price: "Gratuito", lang: "Português", sponsor: "Marca Exemplo", sponsor_color: "#1F4E9E", sponsor_offer: "Kit de lápis de cor para cada criança" },
      { kind: "acessivel", title: "Visita em Libras", description: "Percurso com mediadora surda pelas obras mais conhecidas.", starts_at: day(4, 14), duration_min: 60, meeting_point: "Térreo, bilheteria", capacity: 12, price: "Gratuito", lang: "Libras" },
    ],
    ims: [
      { kind: "visita", title: "Como ler uma fotografia", description: "Conversa diante das fotos em cartaz: enquadramento, luz e contexto histórico.", starts_at: day(1, 16), duration_min: 45, meeting_point: "5º andar, recepção", capacity: 18, price: "Gratuito", lang: "Português" },
      { kind: "oficina", title: "Cianotipia de bolso", description: "Oficina rápida de impressão fotográfica com luz do sol.", starts_at: day(3, 11), duration_min: 90, meeting_point: "Sala de oficinas", capacity: 12, price: "Gratuito", lang: "Português", sponsor: "Marca Exemplo", sponsor_color: "#111111", sponsor_offer: "Materiais oferecidos pela marca" },
    ],
    mam: [
      { kind: "visita", title: "Do Jardim de Esculturas à sala", description: "Passeio entre o jardim de Burle Marx e a exposição em cartaz.", starts_at: day(1, 11, 30), duration_min: 50, meeting_point: "Jardim de Esculturas", capacity: 20, price: "Incluído no ingresso", lang: "Português" },
      { kind: "palestra", title: "Arte moderna em 20 minutos", description: "Conversa curta com educadora sobre o modernismo brasileiro.", starts_at: day(2, 17), duration_min: 20, meeting_point: "Foyer", capacity: 40, price: "Gratuito", lang: "Português", sponsor: "Marca Exemplo", sponsor_color: "#E30613", sponsor_offer: "Café oferecido ao final" },
    ],
  };
  return (base[venue] ?? []).map((e, i) => ({ ...e, id: `demo-${venue}-${i}`, venue, signups: 4 + ((i * 5) % 9), demo: true }));
}

const LOCAL = "kora-events-mine";

export function useVenueEvents(venue: string) {
  const [list, setList] = useState<VenueEvent[] | null>(null);
  const [mine, setMine] = useState<string[]>(() => store.get<string[]>(LOCAL, []));
  const [server, setServer] = useState(false);

  const load = useCallback(async () => {
    if (!backendReady) return setList(demoEvents(venue));
    try {
      const sb = await supabase();
      const [{ data, error }, my] = await Promise.all([
        sb.from("venue_events_public").select("*").eq("venue", venue).order("starts_at"),
        sb.rpc("my_events", { p_key: deviceKey() }),
      ]);
      if (error) throw error;
      const rows = (data ?? []) as VenueEvent[];
      setServer(true);
      setList(rows.length ? rows : demoEvents(venue));
      if (Array.isArray(my.data)) setMine((m) => [...new Set([...(my.data as string[]), ...m.filter((x) => x.startsWith("demo"))])]);
    } catch {
      setServer(false);
      setList(demoEvents(venue));
    }
  }, [venue]);

  useEffect(() => {
    void load();
    const id = setInterval(() => void load(), 60_000);
    return () => clearInterval(id);
  }, [load]);
  useEffect(() => store.set(LOCAL, mine), [mine]);

  return {
    list,
    mine,
    server,
    reload: load,
    /** devolve erro legível ou null */
    async signup(e: VenueEvent, nick: string, on: boolean): Promise<string | null> {
      track({ museum: venue, type: on ? "event_signup" : "event_cancel", path: e.id });
      if (e.demo || !server) {
        setMine((m) => (on ? [...m, e.id] : m.filter((x) => x !== e.id)));
        return null;
      }
      try {
        const sb = await supabase();
        const { error } = await sb.rpc("event_signup", { p_id: e.id, p_key: deviceKey(), p_nick: nick, p_on: on });
        if (error) return /lotado/.test(error.message) ? "full" : /bloqueado/.test(error.message) ? "blocked" : "error";
        setMine((m) => (on ? [...m, e.id] : m.filter((x) => x !== e.id)));
        await load();
        return null;
      } catch {
        return "error";
      }
    },
  };
}

/** Arquivo de calendário (.ics) para o visitante salvar o evento. */
export function icsFor(e: VenueEvent, place: string) {
  const f = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const start = new Date(e.starts_at);
  const end = new Date(start.getTime() + e.duration_min * 60_000);
  const esc = (s: string) => s.replace(/[,;\\]/g, (c) => "\\" + c).replace(/\n/g, "\\n");
  const body = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//KORA//PT",
    "BEGIN:VEVENT",
    `UID:${e.id}@kora`,
    `DTSTAMP:${f(new Date())}`,
    `DTSTART:${f(start)}`,
    `DTEND:${f(end)}`,
    `SUMMARY:${esc(e.title)}`,
    `LOCATION:${esc(`${place}${e.meeting_point ? ", " + e.meeting_point : ""}`)}`,
    `DESCRIPTION:${esc(e.description ?? "")}`,
    "BEGIN:VALARM",
    "TRIGGER:-PT15M",
    "ACTION:DISPLAY",
    "DESCRIPTION:Começa em 15 minutos",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([body], { type: "text/calendar;charset=utf-8" }));
  a.download = `kora-${e.id}.ics`;
  a.click();
}

export async function proposeEvent(p: { venue: string; brand: string; color: string; contact: string; kind: EventKind; title: string; description: string; wanted: string; capacity: number; offer: string }) {
  track({ museum: p.venue, type: "sponsor_proposal", path: p.kind });
  const sb = await supabase();
  const { error } = await sb.rpc("propose_event", {
    p_venue: p.venue,
    p_brand: p.brand,
    p_color: p.color,
    p_contact: p.contact,
    p_kind: p.kind,
    p_title: p.title,
    p_description: p.description,
    p_wanted: p.wanted ? new Date(p.wanted).toISOString() : null,
    p_capacity: p.capacity || null,
    p_offer: p.offer,
  });
  if (error) throw error;
}
