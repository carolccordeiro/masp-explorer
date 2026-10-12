import { AnimatePresence, motion } from "framer-motion";
import { MapPin, Megaphone, Ticket } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useRef, useState } from "react";
import { useSettings } from "@/context/Settings";
import { partnersOf, type Partner } from "@/data/partners";
import { track } from "@/lib/analytics";
import { tr } from "@/lib/utils";
import { Sheet } from "./Sheet";

const ROTATE_MS = 7000;

/** Cupom único por visita (base do parceiro + código da sessão), para o parceiro saber de onde veio a venda. */
function couponFor(p: Partner) {
  let sid = "";
  try {
    sid = sessionStorage.getItem("kora-sid") ?? "";
  } catch {
    /* sem sessão */
  }
  const tail = (sid.replace(/[^a-z0-9]/gi, "").slice(-4) || Math.random().toString(36).slice(-4)).toUpperCase();
  return `${p.coupon}-${tail}`;
}
const T = {
  ad: { pt: "Anúncio", en: "Sponsored", es: "Anuncio" },
  example: { pt: "Parceiro de exemplo", en: "Example partner", es: "Socio de ejemplo" },
  cta: { pt: "Ver cupom", en: "Get coupon", es: "Ver cupón" },
  show: { pt: "Mostre este código no caixa", en: "Show this code at the counter", es: "Muestra este código en caja" },
  advertise: { pt: "Quer anunciar aqui? Fale com o museu.", en: "Want to advertise here? Talk to the museum.", es: "¿Quieres anunciar aquí? Habla con el museo." },
};

/** Espaço de mídia do museu: parceiros do entorno com cupom (impressões e cliques vão para o painel). */
export function PartnerCard({ museum, className }: { museum?: string; className?: string }) {
  const { lang } = useSettings();
  const list = partnersOf(museum);
  const [i, setI] = useState(0);
  const [open, setOpen] = useState<Partner | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const seen = useRef(new Set<string>());
  const p = list[i % Math.max(1, list.length)];

  useEffect(() => {
    if (list.length < 2) return;
    const id = setInterval(() => setI((x) => x + 1), ROTATE_MS);
    return () => clearInterval(id);
  }, [list.length]);

  // impressão: conta uma vez por parceiro quando o card aparece na tela
  useEffect(() => {
    const el = ref.current;
    if (!el || !p) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !seen.current.has(p.id)) {
          seen.current.add(p.id);
          track({ museum: p.museum, type: "ad_view", path: p.id });
        }
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [p]);

  if (!p) return null;

  return (
    <>
      <div ref={ref} className={className}>
        <button
          onClick={() => {
            setOpen(p);
            track({ museum: p.museum, type: "ad_click", path: p.id });
          }}
          className="tap card relative block w-full overflow-hidden text-left"
        >
          <AnimatePresence mode="wait">
            <motion.div key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }} className="flex items-stretch">
              <div className="grid w-20 shrink-0 place-items-center text-white md:w-32" style={{ backgroundColor: p.color }}>
                <span className="px-2 text-center text-[13px] font-extrabold leading-tight">{p.name}</span>
              </div>
              <div className="min-w-0 flex-1 p-4">
                <p className="flex items-center gap-1.5 text-[12.5px] font-semibold text-muted">
                  <Megaphone size={12} /> {tr(T.ad, lang)} · {tr(p.kind, lang)}
                </p>
                <p className="mt-1 text-[16px] font-extrabold leading-snug">{tr(p.headline, lang)}</p>
                <p className="mt-0.5 text-[13.5px] text-muted">{tr(p.offer, lang)}</p>
                <div className="mt-2 flex items-center justify-between gap-2">
                  <span className="flex items-center gap-1 text-[12px] text-muted">
                    <MapPin size={12} /> {p.distance}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-[12.5px] font-bold text-accent-ink">
                    <Ticket size={13} /> {tr(T.cta, lang)}
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          {list.length > 1 && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-ink/[0.06]">
              <motion.div key={p.id} className="h-full bg-accent" initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: ROTATE_MS / 1000, ease: "linear" }} />
            </div>
          )}
        </button>
        <p className="mt-1.5 text-right text-[11.5px] text-muted">
          {tr(T.example, lang)}. {tr(T.advertise, lang)}
        </p>
      </div>

      <Sheet open={!!open} onClose={() => setOpen(null)} title={open?.name}>
        {open && (
          <div className="text-center">
            <p className="text-[15px] font-semibold">{tr(open.offer, lang)}</p>
            <div className="mx-auto mt-5 w-fit rounded-3xl bg-white p-4">
              <QRCodeSVG value={`KORA:${open.id}:${couponFor(open)}`} size={150} level="M" />
            </div>
            <p className="num mt-4 text-[28px] tracking-[0.08em]">{couponFor(open)}</p>
            <p className="mt-1 text-[13px] text-muted">{tr(T.show, lang)}</p>
            <p className="mt-4 text-[11.5px] text-muted">{tr(T.example, lang)}</p>
          </div>
        )}
      </Sheet>
    </>
  );
}
