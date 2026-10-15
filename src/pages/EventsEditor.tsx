import { Check, KeyRound, Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { say } from "@/components/EventCard";
import { Header } from "@/components/Shell";
import { Button, Chip, Page } from "@/components/ui";
import { useMuseum } from "@/context/Museum";
import { useSettings } from "@/context/Settings";
import { supabase } from "@/lib/analytics";
import { EVENT_KINDS, eventKind, useVenueEvents, type EventKind, type VenueEvent } from "@/lib/events";
import { cn } from "@/lib/utils";

type Proposal = { id: number; brand: string; brand_color: string | null; contact: string; kind: EventKind; title: string; description: string | null; wanted_at: string | null; capacity: number | null; offer: string | null; status: string; created_at: string };
type Form = { id: string; kind: EventKind; title: string; description: string; when: string; duration_min: number; meeting_point: string; capacity: number; price: string; lang: string; sponsor: string; sponsor_color: string; sponsor_offer: string };

const EMPTY: Form = { id: "", kind: "visita", title: "", description: "", when: "", duration_min: 60, meeting_point: "", capacity: 20, price: "Gratuito", lang: "Português", sponsor: "", sponsor_color: "#1F4E9E", sponsor_offer: "" };
const input = "h-11 w-full rounded-2xl border hairline bg-surface px-3 text-[14.5px] outline-none focus:border-accent";
const toLocal = (iso: string) => {
  const d = new Date(iso);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60_000).toISOString().slice(0, 16);
};

/** Gestão de eventos do museu: criar, editar, ver inscritos e aprovar propostas de patrocínio. */
export default function EventsEditor() {
  const m = useMuseum();
  const { lang } = useSettings();
  const l = say(lang);
  const ev = useVenueEvents(m.id);
  const [pin, setPin] = useState(() => sessionStorage.getItem(`kora-pin-${m.id}`) ?? "");
  const [ok, setOk] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [form, setForm] = useState<Form | null>(null);
  const [props, setProps] = useState<Proposal[]>([]);

  const rpc = useCallback(async (fn: string, args: Record<string, unknown>) => {
    const sb = await supabase();
    const { data, error } = await sb.rpc(fn, args);
    if (error) throw error;
    return data;
  }, []);

  const loadProps = useCallback(async (p: string) => setProps(((await rpc("list_proposals", { p_venue: m.id, p_pin: p })) ?? []) as Proposal[]), [rpc, m.id]);

  const login = async (p: string, silent = false) => {
    setBusy(true);
    try {
      const good = await rpc("check_pin", { p_venue: m.id, p_pin: p });
      if (good) {
        sessionStorage.setItem(`kora-pin-${m.id}`, p);
        setOk(true);
        setErr("");
        await loadProps(p);
      } else if (!silent) setErr("Código incorreto.");
    } catch {
      if (!silent) setErr("Sem conexão com o servidor.");
    } finally {
      setBusy(false);
    }
  };
  useEffect(() => {
    if (pin) void login(pin, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const save = async () => {
    if (!form || form.title.trim().length < 3 || !form.when) return setErr("Preencha título, data e hora.");
    setBusy(true);
    try {
      const { id, when, ...rest } = form;
      await rpc("upsert_event", { p_venue: m.id, p_pin: pin, p_id: id || null, p: { ...rest, starts_at: new Date(when).toISOString() } });
      setForm(null);
      setErr("");
      await ev.reload();
    } catch (e) {
      setErr("Erro ao salvar: " + String((e as Error).message ?? e).slice(0, 80));
    } finally {
      setBusy(false);
    }
  };

  const fromProposal = async (p: Proposal) => {
    setForm({ ...EMPTY, kind: p.kind, title: p.title, description: p.description ?? "", when: p.wanted_at ? toLocal(p.wanted_at) : "", capacity: p.capacity ?? 20, sponsor: p.brand, sponsor_color: p.brand_color ?? "#333333", sponsor_offer: p.offer ?? "" });
    await rpc("decide_proposal", { p_venue: m.id, p_pin: pin, p_id: p.id, p_status: "aprovada" });
    await loadProps(pin);
    scrollTo({ top: 0, behavior: "smooth" });
  };

  const real = (ev.list ?? []).filter((e) => !e.demo);
  const totalSignups = real.reduce((a, e) => a + e.signups, 0);
  const sponsored = real.filter((e) => e.sponsor);

  return (
    <>
      <Header back={`/${m.id}/eventos`} title={l("Gestão de eventos", "Event management", "Gestión de eventos")} />
      <Page className="max-w-5xl pt-2">
        <p className="eyebrow">{m.short}</p>
        <h1 className="mt-1 text-[30px] font-extrabold tracking-tight md:text-[40px]">Eventos e patrocínio</h1>
        {!ok ? (
          <form onSubmit={(e) => (e.preventDefault(), void login(pin))} className="card mt-6 max-w-md p-6">
            <p className="flex items-center gap-2 text-[16px] font-extrabold">
              <KeyRound size={18} /> Código da equipe
            </p>
            <input value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 8))} inputMode="numeric" placeholder="••••••" className={cn(input, "mt-4 text-center text-[22px] tracking-[0.4em]")} />
            {err && <p className="mt-2 text-[13.5px] font-semibold text-danger">{err}</p>}
            <Button className="mt-4 w-full" disabled={busy || pin.length < 4}>
              {busy ? <Loader2 size={16} className="animate-spin" /> : "Entrar"}
            </Button>
          </form>
        ) : (
          <>
            <div className="mt-5 grid grid-cols-3 gap-3">
              <Stat n={real.length} label="eventos agendados" />
              <Stat n={totalSignups} label="inscritos" />
              <Stat n={sponsored.length} label="patrocinados" />
            </div>

            {props.some((p) => p.status === "pendente") && (
              <section className="card mt-5 p-5">
                <h2 className="text-[18px] font-extrabold">Propostas de patrocínio</h2>
                <ul className="mt-3 space-y-2">
                  {props
                    .filter((p) => p.status === "pendente")
                    .map((p) => (
                      <li key={p.id} className="rounded-2xl bg-ink/[0.04] p-4">
                        <p className="flex flex-wrap items-center gap-2 text-[15px] font-extrabold">
                          <span className="h-3 w-3 rounded-full" style={{ background: p.brand_color ?? "#333" }} />
                          {p.brand} · {eventKind(p.kind).pt}
                        </p>
                        <p className="mt-1 text-[14.5px] font-bold">{p.title}</p>
                        {p.description && <p className="text-[13.5px] text-muted">{p.description}</p>}
                        <p className="mt-1 text-[12.5px] text-muted">
                          {p.wanted_at ? new Date(p.wanted_at).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" }) : "sem data"} · {p.capacity ?? "?"} vagas {p.offer && `· oferece: ${p.offer}`} · contato: <b className="text-ink">{p.contact}</b>
                        </p>
                        <div className="mt-3 flex gap-2">
                          <Button size="sm" icon={<Check size={15} />} onClick={() => void fromProposal(p)}>
                            Aprovar e montar evento
                          </Button>
                          <Button size="sm" variant="ghost" icon={<X size={15} />} onClick={async () => (await rpc("decide_proposal", { p_venue: m.id, p_pin: pin, p_id: p.id, p_status: "recusada" }), await loadProps(pin))}>
                            Recusar
                          </Button>
                        </div>
                      </li>
                    ))}
                </ul>
              </section>
            )}

            {form ? (
              <section className="card mt-5 p-5">
                <h2 className="text-[18px] font-extrabold">{form.id ? "Editar evento" : "Novo evento"}</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {EVENT_KINDS.map((k) => (
                    <Chip key={k.id} on={form.kind === k.id} onClick={() => setForm({ ...form, kind: k.id })}>
                      {k.emoji} {k.pt}
                    </Chip>
                  ))}
                </div>
                <div className="mt-3 grid gap-2 md:grid-cols-6">
                  <input className={cn(input, "md:col-span-4")} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value.slice(0, 90) })} placeholder="Título" />
                  <input type="datetime-local" className={cn(input, "md:col-span-2")} value={form.when} onChange={(e) => setForm({ ...form, when: e.target.value })} />
                  <textarea className={cn(input, "h-20 py-2 md:col-span-6")} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value.slice(0, 400) })} placeholder="Descrição" />
                  <input className={cn(input, "md:col-span-3")} value={form.meeting_point} onChange={(e) => setForm({ ...form, meeting_point: e.target.value.slice(0, 90) })} placeholder="Ponto de encontro" />
                  <label className="flex items-center gap-2 text-[13px] text-muted">
                    Min <input type="number" className={input} value={form.duration_min} onChange={(e) => setForm({ ...form, duration_min: Number(e.target.value) })} />
                  </label>
                  <label className="flex items-center gap-2 text-[13px] text-muted">
                    Vagas <input type="number" className={input} value={form.capacity} onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })} />
                  </label>
                  <input className={input} value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value.slice(0, 40) })} placeholder="Preço" />
                  <input className={cn(input, "md:col-span-2")} value={form.lang} onChange={(e) => setForm({ ...form, lang: e.target.value.slice(0, 20) })} placeholder="Idioma" />
                  <input className={cn(input, "md:col-span-2")} value={form.sponsor} onChange={(e) => setForm({ ...form, sponsor: e.target.value.slice(0, 60) })} placeholder="Patrocinador (opcional)" />
                  <div className="flex gap-2 md:col-span-1">
                    <input type="color" className="h-11 w-14 rounded-xl" value={form.sponsor_color} onChange={(e) => setForm({ ...form, sponsor_color: e.target.value })} aria-label="Cor da marca" />
                  </div>
                  <input className={cn(input, "md:col-span-6")} value={form.sponsor_offer} onChange={(e) => setForm({ ...form, sponsor_offer: e.target.value.slice(0, 120) })} placeholder="O que o patrocinador oferece (opcional)" />
                </div>
                {err && <p className="mt-2 text-[13.5px] font-semibold text-danger">{err}</p>}
                <div className="mt-3 flex gap-2">
                  <Button disabled={busy} onClick={() => void save()}>
                    Publicar evento
                  </Button>
                  <Button variant="ghost" onClick={() => setForm(null)}>
                    Cancelar
                  </Button>
                </div>
              </section>
            ) : (
              <Button className="mt-5" icon={<Plus size={16} />} onClick={() => setForm({ ...EMPTY })}>
                Novo evento
              </Button>
            )}

            <section className="mt-5">
              <h2 className="text-[18px] font-extrabold">Agenda</h2>
              {!real.length && <p className="mt-2 text-[14px] text-muted">Nenhum evento publicado. Enquanto isso, o app mostra eventos de exemplo.</p>}
              <ul className="mt-3 space-y-2">
                {real.map((e: VenueEvent) => {
                  const occ = Math.round((e.signups / e.capacity) * 100);
                  return (
                    <li key={e.id} className="card flex flex-wrap items-center gap-3 p-4">
                      <span className="min-w-0 flex-1">
                        <span className="block text-[15.5px] font-extrabold">
                          {eventKind(e.kind).emoji} {e.title}
                        </span>
                        <span className="block text-[13px] text-muted">
                          {new Date(e.starts_at).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })} {e.sponsor && `· patrocínio: ${e.sponsor}`}
                        </span>
                      </span>
                      <span className="w-40">
                        <span className="flex justify-between text-[12.5px] font-bold">
                          <span>
                            {e.signups}/{e.capacity}
                          </span>
                          <span>{occ}%</span>
                        </span>
                        <span className="mt-1 block h-2 overflow-hidden rounded-full bg-ink/10">
                          <span className="block h-full rounded-full bg-accent" style={{ width: `${Math.min(100, occ)}%` }} />
                        </span>
                      </span>
                      <button
                        onClick={() => setForm({ id: e.id, kind: e.kind, title: e.title, description: e.description ?? "", when: toLocal(e.starts_at), duration_min: e.duration_min, meeting_point: e.meeting_point ?? "", capacity: e.capacity, price: e.price ?? "", lang: e.lang ?? "", sponsor: e.sponsor ?? "", sponsor_color: e.sponsor_color ?? "#333333", sponsor_offer: e.sponsor_offer ?? "" })}
                        className="tap grid h-9 w-9 place-items-center rounded-full bg-ink/[0.06]"
                        aria-label="Editar"
                      >
                        <Pencil size={15} />
                      </button>
                      <button onClick={async () => (await rpc("delete_event", { p_venue: m.id, p_pin: pin, p_id: e.id }), await ev.reload())} className="tap grid h-9 w-9 place-items-center rounded-full bg-ink/[0.06]" aria-label="Apagar">
                        <Trash2 size={15} />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          </>
        )}
      </Page>
    </>
  );
}

function Stat({ n, label }: { n: number; label: string }) {
  return (
    <div className="card p-4">
      <div className="num text-[34px] leading-none">{n}</div>
      <div className="mt-1 text-[12.5px] font-semibold text-muted">{label}</div>
    </div>
  );
}
