import { Handshake, Settings2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { EventCard, say, useEventReminders } from "@/components/EventCard";
import { Header } from "@/components/Shell";
import { Chip, Page, Skeleton } from "@/components/ui";
import { useMuseum } from "@/context/Museum";
import { useSettings } from "@/context/Settings";
import { EVENT_KINDS, useVenueEvents, type EventKind } from "@/lib/events";

/** Eventos do museu: visitas guiadas, oficinas, conversas, com inscrição e patrocínio. */
export default function VenueEvents() {
  const m = useMuseum();
  const { lang } = useSettings();
  const l = say(lang);
  const ev = useVenueEvents(m.id);
  const [kind, setKind] = useState<EventKind | "all">("all");
  useEventReminders(ev.list, ev.mine);
  const list = (ev.list ?? []).filter((e) => kind === "all" || e.kind === kind);
  const kinds = EVENT_KINDS.filter((k) => (ev.list ?? []).some((e) => e.kind === k.id));

  return (
    <>
      <Header title={l("Eventos", "Events", "Eventos")} />
      <Page className="pt-2">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-[32px] font-extrabold leading-tight tracking-[-0.03em] md:text-[44px]">{l(`Acontece no ${m.short}`, `What's on at ${m.short}`, `Pasa en el ${m.short}`)}</h1>
            <p className="mt-1 max-w-xl text-[15px] text-muted">{l("Visitas guiadas, oficinas e conversas. Inscrição em um toque, só com apelido.", "Guided tours, workshops and talks. Book in one tap, just a nickname.", "Visitas guiadas, talleres y charlas. Inscripción en un toque, solo con apodo.")}</p>
          </div>
        </div>
        {kinds.length > 1 && (
          <div className="no-scrollbar -mx-4 mt-4 flex gap-2 overflow-x-auto px-4">
            <Chip on={kind === "all"} onClick={() => setKind("all")}>
              {l("Todos", "All", "Todos")}
            </Chip>
            {kinds.map((k) => (
              <Chip key={k.id} on={kind === k.id} onClick={() => setKind(k.id)}>
                {k.emoji} {l(k.pt, k.en, k.es)}
              </Chip>
            ))}
          </div>
        )}
        {!ev.list ? (
          <Skeleton className="mt-6 h-64" />
        ) : (
          <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {list.map((e) => (
              <EventCard key={e.id} e={e} place={m.name} going={ev.mine.includes(e.id)} onSignup={(nick, on) => ev.signup(e, nick, on)} />
            ))}
          </div>
        )}
        {ev.list && !list.length && <p className="mt-10 text-center text-muted">{l("Nenhum evento agendado agora.", "No events scheduled right now.", "No hay eventos programados.")}</p>}

        <Link to={`/${m.id}/patrocinar`} className="tap mt-8 flex items-center gap-4 rounded-3xl border-2 border-dashed p-5" style={{ borderColor: "rgb(var(--accent) / 0.5)" }}>
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-accent text-accent-ink">
            <Handshake size={22} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[17px] font-extrabold leading-tight">{l("Sua marca quer patrocinar um evento aqui?", "Want your brand to sponsor an event here?", "¿Tu marca quiere patrocinar un evento aquí?")}</span>
            <span className="mt-0.5 block text-[13.5px] text-muted">{l("Monte a proposta em 2 minutos e veja como fica no app.", "Build the proposal in 2 minutes and preview it in the app.", "Arma la propuesta en 2 minutos y mira cómo queda.")}</span>
          </span>
        </Link>
        <Link to={`/${m.id}/eventos/gestao`} className="mt-6 inline-flex items-center gap-1.5 text-[13px] font-semibold text-muted hover:text-ink">
          <Settings2 size={14} /> {l("Equipe do museu: gerenciar eventos", "Museum staff: manage events", "Equipo del museo: gestionar eventos")}
        </Link>
      </Page>
    </>
  );
}
