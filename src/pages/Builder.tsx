import { ArrowRight, ChevronRight, Compass, Mail, ScanLine, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { KoraWordmark } from "@/components/KoraMark";
import { Header } from "@/components/Shell";
import { Page, StatusDot } from "@/components/ui";
import { useSettings } from "@/context/Settings";
import { tr } from "@/lib/utils";

const CONTACT = ((import.meta.env.VITE_CONTACT_EMAIL as string | undefined) || "carolinafc.scs@gmail.com").trim();
const SWATCHES = ["#E30613", "#111111", "#1F4E9E", "#0E7C5A", "#D9A400", "#7A3E9D", "#F26A21", "#2B2B2B"];

const T = {
  title: { pt: "Monte o seu museu", en: "Build your museum", es: "Arma tu museo" },
  lead: {
    pt: "Digite o nome e escolha a cor: veja como a KORA fica com a identidade da sua instituição.",
    en: "Type the name and pick a color: see KORA with your institution's identity.",
    es: "Escribe el nombre y elige el color: mira cómo queda KORA con la identidad de tu institución.",
  },
  name: { pt: "Nome da instituição", en: "Institution name", es: "Nombre de la institución" },
  short: { pt: "Sigla", en: "Short name", es: "Sigla" },
  tagline: { pt: "Frase de apresentação", en: "Tagline", es: "Frase de presentación" },
  color: { pt: "Cor principal", en: "Main color", es: "Color principal" },
  preview: { pt: "Prévia", en: "Preview", es: "Vista previa" },
  enter: { pt: "Entrar", en: "Enter", es: "Entrar" },
  open: { pt: "Aberto agora", en: "Open now", es: "Abierto ahora" },
  scan: { pt: "Scanner de obra", en: "Artwork scanner", es: "Escáner de obra" },
  ask: { pt: "Pergunte à KORA", en: "Ask KORA", es: "Pregunta a KORA" },
  plan: { pt: "Planejar visita", en: "Plan your visit", es: "Planear visita" },
  cta: { pt: "Quero a KORA no meu museu", en: "I want KORA in my museum", es: "Quiero KORA en mi museo" },
  note: {
    pt: "Prévia ilustrativa. Na implantação, a KORA recebe o acervo, os horários e a identidade completa do museu.",
    en: "Illustrative preview. At setup, KORA receives the museum's collection, hours and full identity.",
    es: "Vista previa ilustrativa. En la implementación, KORA recibe la colección, los horarios y la identidad completa del museo.",
  },
};

/** Texto escuro ou claro, conforme o contraste com a cor escolhida. */
function inkFor(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  const L = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return L > 0.4 ? "#111111" : "#FFFFFF";
}

export default function Builder() {
  const { lang } = useSettings();
  const [name, setName] = useState("Museu da Cidade");
  const [short, setShort] = useState("MDC");
  const [tagline, setTagline] = useState("A história da cidade contada pelo seu acervo");
  const [color, setColor] = useState("#1F4E9E");
  const ink = useMemo(() => inkFor(color), [color]);
  const s = short.trim().toUpperCase().slice(0, 6) || "MUSEU";

  return (
    <>
      <Header back="/sobre" title={tr(T.title, lang)} />
      <Page className="max-w-6xl">
        <h1 className="text-[34px] font-extrabold leading-tight tracking-tight md:text-[48px]">{tr(T.title, lang)}</h1>
        <p className="mt-2 max-w-xl text-[16px] text-muted">{tr(T.lead, lang)}</p>

        <div className="mt-8 grid gap-8 lg:grid-cols-[360px_1fr]">
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            {[
              { label: T.name, value: name, set: setName, max: 60 },
              { label: T.short, value: short, set: setShort, max: 6 },
              { label: T.tagline, value: tagline, set: setTagline, max: 80 },
            ].map((f) => (
              <label key={f.label.pt} className="block">
                <span className="text-[13.5px] font-semibold text-muted">{tr(f.label, lang)}</span>
                <input
                  value={f.value}
                  maxLength={f.max}
                  onChange={(e) => f.set(e.target.value)}
                  className="mt-1.5 h-12 w-full rounded-2xl border hairline bg-surface px-4 text-[16px] outline-none focus:ring-2 focus:ring-ink/20"
                />
              </label>
            ))}
            <div>
              <span className="text-[13.5px] font-semibold text-muted">{tr(T.color, lang)}</span>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {SWATCHES.map((c) => (
                  <button
                    key={c}
                    type="button"
                    aria-label={c}
                    onClick={() => setColor(c)}
                    className="tap h-10 w-10 rounded-full border-2 transition-transform"
                    style={{ backgroundColor: c, borderColor: color === c ? "rgb(var(--ink))" : "transparent" }}
                  />
                ))}
                <input type="color" value={color} onChange={(e) => setColor(e.target.value)} aria-label={tr(T.color, lang)} className="h-10 w-12 cursor-pointer rounded-xl border hairline bg-surface" />
              </div>
            </div>
            <a
              href={`mailto:${CONTACT}?subject=${encodeURIComponent(`KORA para ${name}`)}`}
              className="tap inline-flex h-12 items-center gap-2 rounded-full bg-ink px-6 text-[15px] font-bold text-bg"
            >
              <Mail size={17} /> {tr(T.cta, lang)}
            </a>
          </form>

          <div>
            <p className="mb-3 text-[13.5px] font-semibold text-muted">{tr(T.preview, lang)}</p>
            <div className="grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
              {/* cartão de escolha */}
              <div className="flex min-h-[360px] flex-col justify-between rounded-4xl p-6" style={{ backgroundColor: color, color: ink }}>
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full bg-black/15 px-3 py-1.5 text-[12px] font-semibold">
                    <StatusDot /> {tr(T.open, lang)}
                  </span>
                  <p className="mt-3 break-words text-[64px] font-extrabold leading-[0.85] tracking-[-0.05em]">{s}</p>
                </div>
                <div>
                  <p className="text-[13px] font-semibold opacity-75">{name}</p>
                  <p className="mt-1 text-[20px] font-extrabold leading-tight">{tagline}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-[15px] font-bold" style={{ backgroundColor: ink, color }}>
                    {tr(T.enter, lang)} <ArrowRight size={17} />
                  </span>
                </div>
              </div>

              {/* celular */}
              <div className="mx-auto w-full max-w-[320px] rounded-[44px] border-[10px] border-ink/90 bg-bg p-3 shadow-lift">
                <div className="flex items-center justify-between px-1 py-1.5">
                  <span className="flex items-center gap-2">
                    <KoraWordmark size="sm" className="scale-75 origin-left" />
                  </span>
                  <span className="rounded-lg px-2 py-0.5 text-[12px] font-extrabold" style={{ backgroundColor: color, color: ink }}>
                    {s}
                  </span>
                </div>
                <div className="mt-2 rounded-3xl p-4" style={{ backgroundColor: color, color: ink }}>
                  <p className="text-[40px] font-extrabold leading-[0.9] tracking-[-0.04em]">{s}</p>
                  <p className="mt-2 text-[14px] font-bold leading-snug">{tagline}</p>
                </div>
                <div className="mt-3 space-y-2">
                  {[
                    { icon: <ScanLine size={18} />, label: T.scan, primary: true },
                    { icon: <Sparkles size={18} />, label: T.ask },
                    { icon: <Compass size={18} />, label: T.plan },
                  ].map((a) => (
                    <div
                      key={a.label.pt}
                      className="flex items-center gap-3 rounded-2xl p-3 text-[14px] font-bold"
                      style={a.primary ? { backgroundColor: color, color: ink } : { backgroundColor: "rgb(var(--ink) / 0.05)" }}
                    >
                      <span className="grid h-9 w-9 place-items-center rounded-xl" style={a.primary ? { backgroundColor: "rgba(255,255,255,0.2)" } : { color }}>
                        {a.icon}
                      </span>
                      <span className="flex-1">{tr(a.label, lang)}</span>
                      <ChevronRight size={16} className="opacity-40" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <p className="mt-4 text-[12.5px] text-muted">{tr(T.note, lang)}</p>
          </div>
        </div>
      </Page>
    </>
  );
}
