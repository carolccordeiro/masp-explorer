import { CalendarPlus, Check, Clock, MapPin, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useSettings } from "@/context/Settings";
import { track } from "@/lib/analytics";
import { eventKind, icsFor, type VenueEvent } from "@/lib/events";
import { cn } from "@/lib/utils";
import { Button } from "./ui";

export const say = (lang: string) => (pt: string, en: string, es: string) => (lang === "en" ? en : lang === "es" ? es : pt);

export function whenEvent(iso: string, lang: string) {
  const d = new Date(iso);
  const now = new Date();
  const same = (a: Date, b: Date) => a.toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" }) === b.toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" });
  const tomorrow = new Date(now.getTime() + 864e5);
  const hh = d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", timeZone: "America/Sao_Paulo" });
  const l = say(lang);
  if (same(d, now)) return l(`Hoje, ${hh}`, `Today, ${hh}`, `Hoy, ${hh}`);
  if (same(d, tomorrow)) return l(`Amanhã, ${hh}`, `Tomorrow, ${hh}`, `Mañana, ${hh}`);
  const day = d.toLocaleDateString(lang === "en" ? "en-US" : lang === "es" ? "es-ES" : "pt-BR", { weekday: "short", day: "2-digit", month: "2-digit", timeZone: "America/Sao_Paulo" });
  return `${day}, ${hh}`;
}

/** Cartão de evento: tipo, quando, onde, vagas, patrocinador e botão de inscrição. */
export function EventCard({
  e,
  place,
  going,
  onSignup,
  compact,
}: {
  e: VenueEvent;
  place: string;
  going: boolean;
  onSignup: (nick: string, on: boolean) => Promise<string | null>;
  compact?: boolean;
}) {
  const { lang } = useSettings();
  const l = say(lang);
  const k = eventKind(e.kind);
  const left = Math.max(0, e.capacity - e.signups);
  const full = left === 0 && !going;
  const [ask, setAsk] = useState(false);
  const [nick, setNick] = useState(() => {
    try {
      return localStorage.getItem("kora-nick") ?? "";
    } catch {
      return "";
    }
  });
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  // patrocinador visto = impressão de mídia
  useEffect(() => {
    if (e.sponsor) track({ museum: e.venue, type: "ad_view", path: `evento:${e.sponsor}` });
  }, [e.sponsor, e.venue]);

  const go = async (on: boolean) => {
    const n = nick.trim();
    if (on && n.length < 2) return setMsg(l("Coloque um apelido.", "Add a nickname.", "Pon un apodo."));
    setBusy(true);
    const err = await onSignup(n, on);
    setBusy(false);
    if (err === "full") return setMsg(l("Acabaram as vagas.", "Fully booked.", "Sin cupos."));
    if (err === "blocked") return setMsg(l("Escolha outro apelido.", "Pick another nickname.", "Elige otro apodo."));
    if (err) return setMsg(l("Não deu agora. Tente de novo.", "Couldn't do it now. Try again.", "No se pudo. Intenta de nuevo."));
    try {
      localStorage.setItem("kora-nick", n);
    } catch {
      /* ignora */
    }
    setMsg("");
    setAsk(false);
  };

  return (
    <article className={cn("card flex flex-col overflow-hidden", going && "ring-2 ring-accent")}>
      {e.sponsor && (
        <p className="flex items-center gap-2 px-4 py-2 text-[12px] font-bold text-white" style={{ background: e.sponsor_color ?? "#333" }}>
          {l("Oferecido por", "Presented by", "Ofrecido por")} {e.sponsor}
          {e.sponsor_offer && <span className="truncate font-semibold opacity-85">· {e.sponsor_offer}</span>}
        </p>
      )}
      <div className="flex flex-1 flex-col p-4">
        <p className="flex flex-wrap items-center gap-2 text-[12.5px] font-bold text-accent">
          <span>
            {k.emoji} {l(k.pt, k.en, k.es)}
          </span>
          {e.demo && <span className="rounded-md bg-ink/[0.07] px-1.5 py-0.5 text-[10.5px] uppercase tracking-wide text-muted">{l("exemplo", "example", "ejemplo")}</span>}
        </p>
        <h3 className="mt-1.5 text-[18px] font-extrabold leading-tight">{e.title}</h3>
        {!compact && e.description && <p className="mt-1.5 text-[14px] leading-snug text-muted">{e.description}</p>}
        <div className="mt-3 space-y-1 text-[13.5px]">
          <p className="flex items-center gap-2 font-semibold">
            <Clock size={15} className="text-muted" /> {whenEvent(e.starts_at, lang)} · {e.duration_min} min
          </p>
          {e.meeting_point && (
            <p className="flex items-center gap-2 text-muted">
              <MapPin size={15} /> {e.meeting_point}
            </p>
          )}
          <p className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-muted">
            <Users size={15} />
            {full ? l("Lotado", "Fully booked", "Sin cupos") : l(`${left} de ${e.capacity} vagas`, `${left} of ${e.capacity} spots left`, `${left} de ${e.capacity} cupos`)}
            {e.price && <span>· {e.price}</span>}
            {e.lang && <span>· {e.lang}</span>}
          </p>
        </div>
        <div className="mt-auto pt-4">
          {ask && !going && (
            <input value={nick} onChange={(x) => setNick(x.target.value)} maxLength={16} placeholder={l("Seu apelido", "Your nickname", "Tu apodo")} className="mb-2 h-11 w-full rounded-2xl border hairline bg-surface px-4 text-[15px] outline-none focus:border-accent" />
          )}
          <div className="flex gap-2">
            {going ? (
              <>
                <Button size="sm" variant="secondary" className="flex-1" icon={<Check size={15} />} disabled={busy} onClick={() => void go(false)}>
                  {l("Inscrito · cancelar", "Booked · cancel", "Inscrito · cancelar")}
                </Button>
                <Button size="sm" variant="ghost" icon={<CalendarPlus size={15} />} onClick={() => icsFor(e, place)} aria-label={l("Salvar na agenda", "Add to calendar", "Guardar en el calendario")} />
              </>
            ) : (
              <Button size="sm" className="flex-1" disabled={busy || full} onClick={() => (ask ? void go(true) : setAsk(true))}>
                {full ? l("Lotado", "Fully booked", "Sin cupos") : ask ? l("Confirmar inscrição", "Confirm booking", "Confirmar") : l("Quero ir", "I want to go", "Quiero ir")}
              </Button>
            )}
          </div>
          {msg && <p className="mt-2 text-[13px] font-semibold text-danger">{msg}</p>}
          {going && <p className="mt-2 text-[12px] text-muted">{l("Avisamos 15 min antes enquanto a KORA estiver aberta. Salve na agenda para não esquecer.", "We'll remind you 15 min before while KORA is open. Add it to your calendar.", "Avisamos 15 min antes mientras KORA esté abierta. Guárdalo en tu calendario.")}</p>}
        </div>
      </div>
    </article>
  );
}

/** Lembrete 15 min antes dos eventos em que a pessoa se inscreveu (com o app aberto). */
export function useEventReminders(list: VenueEvent[] | null, mine: string[]) {
  useEffect(() => {
    if (!list) return;
    const timers = list
      .filter((e) => mine.includes(e.id))
      .map((e) => {
        const ms = new Date(e.starts_at).getTime() - 15 * 60_000 - Date.now();
        if (ms <= 0 || ms > 12 * 3600_000) return null;
        return setTimeout(() => {
          navigator.vibrate?.([80, 60, 80]);
          if ("Notification" in window && Notification.permission === "granted") new Notification(`${e.title} em 15 min`, { body: e.meeting_point ?? "" });
        }, ms);
      })
      .filter(Boolean) as ReturnType<typeof setTimeout>[];
    return () => timers.forEach(clearTimeout);
  }, [list, mine]);
}
