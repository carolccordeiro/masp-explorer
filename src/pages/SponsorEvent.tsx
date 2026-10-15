import { CheckCircle2, Send } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { EventCard, say } from "@/components/EventCard";
import { Header } from "@/components/Shell";
import { Button, Chip, Page } from "@/components/ui";
import { useMuseum } from "@/context/Museum";
import { useSettings } from "@/context/Settings";
import { EVENT_KINDS, proposeEvent, type EventKind, type VenueEvent } from "@/lib/events";

const SWATCHES = ["#E30613", "#111111", "#1F4E9E", "#0E7C5A", "#D9A400", "#7A3E9D", "#F26A21"];
const input = "mt-1.5 h-12 w-full rounded-2xl border hairline bg-surface px-4 text-[15px] outline-none focus:border-accent";

/** A marca monta o próprio evento patrocinado, vê a prévia e envia para a equipe do museu aprovar. */
export default function SponsorEvent() {
  const m = useMuseum();
  const { lang } = useSettings();
  const l = say(lang);
  const [f, setF] = useState({ brand: "", color: "#1F4E9E", contact: "", kind: "visita" as EventKind, title: "", description: "", wanted: "", capacity: 20, offer: "" });
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [err, setErr] = useState("");
  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) => setF((x) => ({ ...x, [k]: v }));

  const preview: VenueEvent = {
    id: "preview",
    venue: m.id,
    kind: f.kind,
    title: f.title || l("Título do seu evento", "Your event title", "Título de tu evento"),
    description: f.description || l("Conte em uma frase o que o público vai viver.", "Tell in one sentence what people will experience.", "Cuenta en una frase lo que vivirá el público."),
    starts_at: f.wanted ? new Date(f.wanted).toISOString() : new Date(Date.now() + 3 * 864e5).toISOString(),
    duration_min: 60,
    meeting_point: m.name,
    capacity: f.capacity || 20,
    price: l("Gratuito", "Free", "Gratis"),
    sponsor: f.brand || l("Sua marca", "Your brand", "Tu marca"),
    sponsor_color: f.color,
    sponsor_offer: f.offer || null,
    signups: 0,
  };

  const send = async () => {
    if (f.brand.trim().length < 2 || f.title.trim().length < 3) return setErr(l("Preencha a marca e o título.", "Fill in the brand and title.", "Completa la marca y el título."));
    if (!/@|\d{8,}/.test(f.contact)) return setErr(l("Coloque um e-mail ou telefone de contato.", "Add a contact email or phone.", "Pon un email o teléfono de contacto."));
    setErr("");
    setState("sending");
    try {
      await proposeEvent({ venue: m.id, ...f, brand: f.brand.trim(), title: f.title.trim(), description: f.description.trim(), offer: f.offer.trim(), contact: f.contact.trim() });
      setState("sent");
    } catch {
      setState("error");
    }
  };

  if (state === "sent")
    return (
      <>
        <Header back={`/${m.id}/eventos`} title={l("Patrocinar um evento", "Sponsor an event", "Patrocinar un evento")} />
        <Page className="max-w-xl pt-10 text-center">
          <CheckCircle2 size={56} className="mx-auto text-success" />
          <h1 className="mt-4 text-[30px] font-extrabold leading-tight">{l("Proposta enviada!", "Proposal sent!", "¡Propuesta enviada!")}</h1>
          <p className="mt-2 text-[15.5px] text-muted">{l(`A equipe do ${m.short} recebe agora no painel e responde pelo contato que você deixou. Quando aprovado, o evento aparece no app com a sua marca.`, `The ${m.short} team gets it now on their dashboard and will reply to your contact. Once approved, the event shows up in the app with your brand.`, `El equipo del ${m.short} la recibe ahora y responderá a tu contacto. Al aprobarse, el evento aparece en la app con tu marca.`)}</p>
          <Link to={`/${m.id}/eventos`} className="tap mt-6 inline-flex h-12 items-center rounded-full bg-accent px-6 text-[15px] font-bold text-accent-ink">
            {l("Ver eventos", "See events", "Ver eventos")}
          </Link>
        </Page>
      </>
    );

  return (
    <>
      <Header back={`/${m.id}/eventos`} title={l("Patrocinar um evento", "Sponsor an event", "Patrocinar un evento")} />
      <Page className="max-w-6xl pt-2">
        <h1 className="text-[32px] font-extrabold leading-tight tracking-[-0.03em] md:text-[44px]">{l("Monte o seu evento patrocinado", "Build your sponsored event", "Arma tu evento patrocinado")}</h1>
        <p className="mt-1 max-w-2xl text-[15px] text-muted">
          {l(
            `Sua marca oferece uma experiência ao público do ${m.short} (visita guiada, oficina, conversa) e aparece no app para quem está no museu. Você recebe o relatório de alcance e de inscritos.`,
            `Your brand offers an experience to ${m.short} visitors (tour, workshop, talk) and appears in the app for people at the museum. You get a reach and sign-up report.`,
            `Tu marca ofrece una experiencia al público del ${m.short} y aparece en la app para quien está en el museo. Recibes el informe de alcance e inscritos.`,
          )}
        </p>
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
          <form className="space-y-5" onSubmit={(e) => (e.preventDefault(), void send())}>
            <div>
              <span className="text-[13.5px] font-semibold text-muted">{l("Tipo de evento", "Event type", "Tipo de evento")}</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {EVENT_KINDS.filter((k) => k.id !== "outro").map((k) => (
                  <Chip key={k.id} on={f.kind === k.id} onClick={() => set("kind", k.id)}>
                    {k.emoji} {l(k.pt, k.en, k.es)}
                  </Chip>
                ))}
              </div>
            </div>
            <label className="block">
              <span className="text-[13.5px] font-semibold text-muted">{l("Título", "Title", "Título")}</span>
              <input className={input} maxLength={90} value={f.title} onChange={(e) => set("title", e.target.value)} placeholder={l("Ex.: Visita guiada pelos impressionistas", "E.g.: Guided tour of the impressionists", "Ej.: Visita guiada por los impresionistas")} />
            </label>
            <label className="block">
              <span className="text-[13.5px] font-semibold text-muted">{l("Descrição curta", "Short description", "Descripción corta")}</span>
              <textarea className={`${input} h-24 py-3`} maxLength={400} value={f.description} onChange={(e) => set("description", e.target.value)} />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-[13.5px] font-semibold text-muted">{l("Data e hora desejadas", "Preferred date and time", "Fecha y hora deseadas")}</span>
                <input type="datetime-local" className={input} value={f.wanted} onChange={(e) => set("wanted", e.target.value)} />
              </label>
              <label className="block">
                <span className="text-[13.5px] font-semibold text-muted">{l("Vagas", "Spots", "Cupos")}</span>
                <input type="number" min={1} max={500} className={input} value={f.capacity} onChange={(e) => set("capacity", Number(e.target.value))} />
              </label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-[13.5px] font-semibold text-muted">{l("Nome da marca", "Brand name", "Nombre de la marca")}</span>
                <input className={input} maxLength={60} value={f.brand} onChange={(e) => set("brand", e.target.value)} />
              </label>
              <label className="block">
                <span className="text-[13.5px] font-semibold text-muted">{l("Contato (e-mail ou telefone)", "Contact (email or phone)", "Contacto (email o teléfono)")}</span>
                <input className={input} maxLength={120} value={f.contact} onChange={(e) => set("contact", e.target.value)} />
              </label>
            </div>
            <label className="block">
              <span className="text-[13.5px] font-semibold text-muted">{l("O que a marca oferece ao público (opcional)", "What the brand offers visitors (optional)", "Qué ofrece la marca al público (opcional)")}</span>
              <input className={input} maxLength={120} value={f.offer} onChange={(e) => set("offer", e.target.value)} placeholder={l("Ex.: café ao final, kit para crianças", "E.g.: coffee at the end, kids' kit", "Ej.: café al final, kit infantil")} />
            </label>
            <div>
              <span className="text-[13.5px] font-semibold text-muted">{l("Cor da marca", "Brand color", "Color de la marca")}</span>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {SWATCHES.map((c) => (
                  <button key={c} type="button" aria-label={c} onClick={() => set("color", c)} className="tap h-10 w-10 rounded-full border-2" style={{ backgroundColor: c, borderColor: f.color === c ? "rgb(var(--ink))" : "transparent" }} />
                ))}
                <input type="color" value={f.color} onChange={(e) => set("color", e.target.value)} className="h-10 w-12 cursor-pointer rounded-xl border hairline bg-surface" aria-label={l("Cor", "Color", "Color")} />
              </div>
            </div>
            {err && <p className="text-[13.5px] font-semibold text-danger">{err}</p>}
            {state === "error" && <p className="text-[13.5px] font-semibold text-danger">{l("Não deu para enviar agora. Tente de novo.", "Couldn't send now. Try again.", "No se pudo enviar. Intenta de nuevo.")}</p>}
            <Button size="lg" icon={<Send size={18} />} disabled={state === "sending"}>
              {l(`Enviar proposta ao ${m.short}`, `Send proposal to ${m.short}`, `Enviar propuesta al ${m.short}`)}
            </Button>
            <p className="text-[12px] text-muted">{l("O contato fica visível só para a equipe do museu.", "Your contact is only visible to the museum team.", "El contacto solo lo ve el equipo del museo.")}</p>
          </form>
          <div className="lg:sticky lg:top-24 lg:self-start">
            <p className="mb-3 text-[13.5px] font-semibold text-muted">{l("Prévia no app", "Preview in the app", "Vista previa en la app")}</p>
            <EventCard e={preview} place={m.name} going={false} onSignup={async () => null} />
          </div>
        </div>
      </Page>
    </>
  );
}
