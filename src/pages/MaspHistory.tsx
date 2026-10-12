import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArtImage } from "@/components/ArtImage";
import { Header } from "@/components/Shell";
import { Segmented } from "@/components/ui";
import { useMuseum } from "@/context/Museum";
import { useSettings } from "@/context/Settings";
import type { I18n, Lang } from "@/data/types";
import { cn, tr } from "@/lib/utils";

/**
 * A história do MASP contada pela construção do prédio de Lina Bo Bardi.
 * Fontes: Wikipédia (Museu de Arte de São Paulo), Agência Brasil (28/03/2025) e masp.org.br.
 */
const RED = "#E30613";

const T = {
  kicker: { pt: "A história do MASP", en: "The story of MASP", es: "La historia del MASP" },
  hero: {
    pt: "Uma caixa de vidro suspensa sobre a Paulista",
    en: "A glass box hovering over Paulista Avenue",
    es: "Una caja de vidrio suspendida sobre la Paulista",
  },
  heroLead: {
    pt: "Como uma exigência sobre uma vista virou um dos prédios mais famosos do Brasil.",
    en: "How a condition about a view became one of Brazil's most famous buildings.",
    es: "Cómo una exigencia sobre una vista se convirtió en uno de los edificios más famosos de Brasil.",
  },
  scroll: { pt: "Role para construir o MASP", en: "Scroll to build MASP", es: "Desliza para construir el MASP" },
  numbers: { pt: "O prédio em números", en: "The building in numbers", es: "El edificio en números" },
  easels: { pt: "Os cavaletes de cristal", en: "The crystal easels", es: "Los caballetes de cristal" },
  easelsLead: {
    pt: "Lina tirou os quadros das paredes. Cada obra fica num vidro preso a um bloco de concreto, com a ficha no verso. O visitante anda entre elas, como numa floresta.",
    en: "Lina took paintings off the walls. Each work stands on glass set in a concrete block, with its label on the back. Visitors walk among them, as in a forest.",
    es: "Lina sacó los cuadros de las paredes. Cada obra está en un vidrio fijado a un bloque de hormigón, con la ficha al dorso. El visitante camina entre ellas, como en un bosque.",
  },
  modeEasels: { pt: "Cavaletes (1968 e 2015)", en: "Easels (1968 and 2015)", es: "Caballetes (1968 y 2015)" },
  modeWalls: { pt: "Paredes (1996)", en: "Walls (1996)", es: "Paredes (1996)" },
  wallsNote: {
    pt: "Em 1996 os cavaletes saíram e a pinacoteca ganhou paredes. Eles voltaram em dezembro de 2015.",
    en: "In 1996 the easels were removed and walls went up. They came back in December 2015.",
    es: "En 1996 se retiraron los caballetes y se levantaron paredes. Volvieron en diciembre de 2015.",
  },
  easelsNote: {
    pt: "Toque numa obra para ver a ficha completa.",
    en: "Tap a work to see its full record.",
    es: "Toca una obra para ver su ficha completa.",
  },
  plaza: { pt: "Uma praça embaixo do museu", en: "A plaza under the museum", es: "Una plaza bajo el museo" },
  plazaText: {
    pt: "Como o prédio não toca o chão no meio, sobrou embaixo uma praça aberta de 74 metros, continuação da calçada da Paulista. O vão livre virou ponto de encontro da cidade e a vista para o centro, pedida lá em 1951, continua lá.",
    en: "Since the building doesn't touch the ground in the middle, a 74-meter open plaza remained underneath, an extension of the Paulista sidewalk. The free span became a city meeting point, and the view to downtown, required back in 1951, is still there.",
    es: "Como el edificio no toca el suelo en el medio, quedó abajo una plaza abierta de 74 metros, continuación de la vereda de la Paulista. El vano libre se volvió punto de encuentro de la ciudad y la vista al centro, exigida en 1951, sigue allí.",
  },
  timeline: { pt: "Linha do tempo", en: "Timeline", es: "Línea de tiempo" },
  sources: { pt: "Fontes", en: "Sources", es: "Fuentes" },
};

/** Etapas da construção, ligadas à rolagem. */
const STAGES: { year: string; title: I18n; text: I18n }[] = [
  {
    year: "1947",
    title: { pt: "Um museu no centro", en: "A museum downtown", es: "Un museo en el centro" },
    text: {
      pt: "Assis Chateaubriand e Pietro Maria Bardi abrem o MASP em 2 de outubro de 1947, num andar de prédio na rua Sete de Abril. A coleção cresce rápido e o espaço fica pequeno.",
      en: "Assis Chateaubriand and Pietro Maria Bardi open MASP on October 2, 1947, on one floor of a building on Sete de Abril Street. The collection grows fast and the space gets small.",
      es: "Assis Chateaubriand y Pietro Maria Bardi abren el MASP el 2 de octubre de 1947, en un piso de un edificio de la calle Sete de Abril. La colección crece rápido y el espacio queda chico.",
    },
  },
  {
    year: "1951",
    title: { pt: "O terreno e a vista", en: "The site and the view", es: "El terreno y la vista" },
    text: {
      pt: "No alto da Paulista ficava o Belvedere Trianon, demolido em 1951. O terreno fora doado à cidade com uma condição: manter livre a vista para o centro, sobre o vale da Nove de Julho.",
      en: "The Belvedere Trianon stood atop Paulista until it was demolished in 1951. The land had been donated to the city on one condition: keep the view to downtown, over the Nove de Julho valley, open.",
      es: "En lo alto de la Paulista estaba el Belvedere Trianon, demolido en 1951. El terreno se había donado a la ciudad con una condición: mantener libre la vista al centro, sobre el valle de la Nove de Julho.",
    },
  },
  {
    year: "1958",
    title: { pt: "Quatro pilares", en: "Four pillars", es: "Cuatro pilares" },
    text: {
      pt: "A resposta de Lina Bo Bardi: em vez de ocupar o terreno, apoiar tudo em apenas quatro pilares nas laterais. O cálculo é do engenheiro José Carlos de Figueiredo Ferraz.",
      en: "Lina Bo Bardi's answer: instead of filling the site, rest everything on just four pillars at the sides. The structural design is by engineer José Carlos de Figueiredo Ferraz.",
      es: "La respuesta de Lina Bo Bardi: en vez de ocupar el terreno, apoyar todo en solo cuatro pilares laterales. El cálculo es del ingeniero José Carlos de Figueiredo Ferraz.",
    },
  },
  {
    year: "74 m",
    title: { pt: "Duas vigas gigantes", en: "Two giant beams", es: "Dos vigas gigantes" },
    text: {
      pt: "Duas vigas de concreto protendido vencem 74 metros sem nenhum apoio no meio, o maior vão livre do mundo na época. A obra leva cerca de dez anos.",
      en: "Two prestressed concrete beams span 74 meters with no support in the middle, the world's largest free span at the time. Construction takes about ten years.",
      es: "Dos vigas de hormigón pretensado salvan 74 metros sin apoyo en el medio, el mayor vano libre del mundo en la época. La obra dura cerca de diez años.",
    },
  },
  {
    year: "1968",
    title: { pt: "A caixa suspensa", en: "The suspended box", es: "La caja suspendida" },
    text: {
      pt: "O museu fica pendurado a 8 metros do chão. Em novembro de 1968 é inaugurado na presença da rainha Elizabeth II, com as obras flutuando nos cavaletes de cristal.",
      en: "The museum hangs 8 meters above the ground. It opens in November 1968 in the presence of Queen Elizabeth II, with the works floating on crystal easels.",
      es: "El museo queda colgado a 8 metros del suelo. Se inaugura en noviembre de 1968 en presencia de la reina Isabel II, con las obras flotando en caballetes de cristal.",
    },
  },
];

const TIMELINE: { year: string; text: I18n }[] = [
  { year: "1947", text: { pt: "Fundação na rua Sete de Abril", en: "Founded on Sete de Abril Street", es: "Fundación en la calle Sete de Abril" } },
  { year: "1968", text: { pt: "Inauguração na Paulista", en: "Opening on Paulista", es: "Inauguración en la Paulista" } },
  { year: "1969", text: { pt: "Acervo tombado pelo IPHAN", en: "Collection listed by IPHAN", es: "Acervo declarado por el IPHAN" } },
  { year: "1996", text: { pt: "Cavaletes saem; vigas recebem nova protensão até 2001", en: "Easels removed; beams re-prestressed until 2001", es: "Salen los caballetes; nuevo pretensado de vigas hasta 2001" } },
  { year: "2003", text: { pt: "Prédio tombado pelo IPHAN", en: "Building listed by IPHAN", es: "Edificio declarado por el IPHAN" } },
  { year: "2007", text: { pt: "Portinari e Picasso roubados em 3 minutos; recuperados em 2008", en: "Portinari and Picasso stolen in 3 minutes; recovered in 2008", es: "Portinari y Picasso robados en 3 minutos; recuperados en 2008" } },
  { year: "2015", text: { pt: "Os cavaletes de cristal voltam", en: "The crystal easels return", es: "Vuelven los caballetes de cristal" } },
  { year: "2025", text: { pt: "Edifício Pietro Maria Bardi: 14 andares, área quase dobra", en: "Pietro Maria Bardi Building: 14 floors, area nearly doubles", es: "Edificio Pietro Maria Bardi: 14 pisos, el área casi se duplica" } },
];

const NUMBERS: { n: string; label: I18n }[] = [
  { n: "74 m", label: { pt: "de vão livre, sem apoio no meio", en: "free span, no middle support", es: "de vano libre, sin apoyo al medio" } },
  { n: "8 m", label: { pt: "do chão até o museu", en: "from the ground to the museum", es: "del suelo al museo" } },
  { n: "4", label: { pt: "pilares sustentam tudo", en: "pillars hold everything", es: "pilares sostienen todo" } },
  { n: "~10", label: { pt: "anos de obra", en: "years of construction", es: "años de obra" } },
];

/** O prédio sendo construído conforme a rolagem (0 a 1). */
function Building({ p }: { p: MotionValue<number> }) {
  const view = useTransform(p, [0.2, 0.28], [0, 1]);
  const pillars = useTransform(p, [0.4, 0.48], [0, 1]);
  const beams = useTransform(p, [0.6, 0.68], [0, 1]);
  const beamsX = useTransform(p, [0.6, 0.68], [-40, 0]);
  const box = useTransform(p, [0.8, 0.87], [0, 1]);
  const boxY = useTransform(p, [0.8, 0.87], [-30, 0]);
  const easels = useTransform(p, [0.87, 0.95], [0, 1]);
  const people = useTransform(p, [0.84, 0.93], [0, 1]);
  const oldBldg = useTransform(p, [0.16, 0.22], [1, 0]);

  return (
    <svg viewBox="0 0 800 420" className="h-full w-full" aria-hidden>
      {/* cidade ao fundo (o centro, do outro lado do vale) */}
      <g fill="rgb(var(--ink) / 0.12)">
        {[560, 600, 625, 660, 690, 720, 750].map((x, i) => (
          <rect key={x} x={x} y={150 - (i % 3) * 30} width="26" height={190 + (i % 3) * 30} rx="2" />
        ))}
      </g>
      {/* primeira sede, prédio comum no centro, que some */}
      <motion.g style={{ opacity: oldBldg }}>
        <rect x="300" y="120" width="160" height="220" rx="4" fill="rgb(var(--ink) / 0.18)" />
        {Array.from({ length: 6 }).map((_, i) => (
          <rect key={i} x="316" y={136 + i * 34} width="128" height="16" rx="2" fill="rgb(var(--bg) / 0.6)" />
        ))}
        <rect x="316" y="170" width="128" height="16" rx="2" fill={RED} />
      </motion.g>
      {/* chão */}
      <line x1="0" y1="340" x2="800" y2="340" stroke="rgb(var(--ink))" strokeWidth="3" />
      {/* a vista preservada */}
      <motion.g style={{ opacity: view }}>
        <circle cx="80" cy="312" r="10" fill="rgb(var(--ink))" />
        <rect x="74" y="322" width="12" height="18" rx="4" fill="rgb(var(--ink))" />
        <line x1="92" y1="310" x2="600" y2="250" stroke={RED} strokeWidth="3" strokeDasharray="10 8" />
      </motion.g>
      {/* pilares */}
      <motion.g style={{ scaleY: pillars, transformOrigin: "0px 340px" }}>
        {[150, 172, 628, 650].map((x) => (
          <rect key={x} x={x - 8} y="60" width="16" height="280" fill={RED} rx="3" />
        ))}
      </motion.g>
      {/* vigas */}
      <motion.g style={{ opacity: beams, x: beamsX }}>
        <rect x="134" y="54" width="532" height="22" fill={RED} rx="4" />
        <rect x="134" y="104" width="532" height="16" fill={RED} rx="4" />
      </motion.g>
      {/* caixa de vidro */}
      <motion.g style={{ opacity: box, y: boxY }}>
        <rect x="190" y="80" width="420" height="140" rx="6" fill="rgb(var(--ink) / 0.07)" stroke="rgb(var(--ink) / 0.6)" strokeWidth="2.5" />
        {Array.from({ length: 9 }).map((_, i) => (
          <line key={i} x1={190 + (i + 1) * 42} y1="80" x2={190 + (i + 1) * 42} y2="220" stroke="rgb(var(--ink) / 0.14)" />
        ))}
      </motion.g>
      {/* cavaletes dentro */}
      <motion.g style={{ opacity: easels }}>
        {[230, 290, 350, 410, 470, 530].map((x, i) => (
          <g key={x}>
            <rect x={x} y={150 + (i % 2) * 6} width="30" height="38" fill="rgb(var(--ink) / 0.55)" rx="2" />
            <rect x={x - 3} y={188 + (i % 2) * 6} width="36" height="10" fill="rgb(var(--ink) / 0.3)" rx="2" />
          </g>
        ))}
      </motion.g>
      {/* gente no vão livre */}
      <motion.g style={{ opacity: people }} fill="rgb(var(--ink))">
        {[260, 300, 380, 470, 520].map((x, i) => (
          <g key={x}>
            <circle cx={x} cy={312 - (i % 2) * 2} r="8" />
            <rect x={x - 6} y={320 - (i % 2) * 2} width="12" height={20 + (i % 2) * 2} rx="4" />
          </g>
        ))}
      </motion.g>
    </svg>
  );
}

function ScrollStory({ lang }: { lang: Lang }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [stage, setStage] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const i = Math.min(STAGES.length - 1, Math.max(0, Math.floor(v * STAGES.length)));
    setStage((cur) => (cur === i ? cur : i));
  });
  const s = STAGES[stage];
  return (
    <div ref={ref} className="relative" style={{ height: `${STAGES.length * 90 + 60}vh` }}>
      <div className="sticky top-14 grid h-[calc(100dvh-3.5rem)] grid-rows-[1fr_auto] gap-4 pb-24 md:top-16 md:h-[calc(100dvh-4rem)] md:grid-cols-[1fr_1.3fr] md:grid-rows-1 md:items-center md:gap-12 md:pb-0">
        <div className="relative flex min-h-0 items-center md:order-2">
          <Building p={scrollYProgress} />
        </div>
        <div className="md:order-1">
          {/* progresso por etapas */}
          <div className="mb-5 flex gap-1.5">
            {STAGES.map((_, i) => (
              <span key={i} className="h-1 flex-1 rounded-full transition-colors duration-300" style={{ background: i <= stage ? RED : "rgb(var(--ink) / 0.1)" }} />
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={stage} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>
              <p className="num text-[48px] leading-none md:text-[80px]" style={{ color: RED }}>
                {s.year}
              </p>
              <h2 className="mt-2 text-[24px] font-extrabold leading-tight md:text-[36px]">{tr(s.title, lang)}</h2>
              <p className="mt-2 max-w-md text-[15.5px] leading-relaxed text-ink/80 md:text-[17px]">{tr(s.text, lang)}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function Easels({ lang }: { lang: Lang }) {
  const m = useMuseum();
  const [mode, setMode] = useState<"easels" | "walls">("easels");
  const works = ["renoir-rosa-e-azul", "van-gogh-escolar", "rafael-ressurreicao", "modigliani-renee", "monet-canoa-epte", "portinari-retirantes"]
    .map((id) => m.artworks.find((a) => a.id === id))
    .filter(Boolean) as typeof m.artworks;
  return (
    <section className="mx-auto mt-24 max-w-6xl px-4 md:px-8">
      <h2 className="text-[34px] font-extrabold leading-tight tracking-tight md:text-[48px]">{tr(T.easels, lang)}</h2>
      <p className="mt-3 max-w-2xl text-[17px] text-muted">{tr(T.easelsLead, lang)}</p>
      <div className="mt-6">
        <Segmented
          value={mode}
          onChange={setMode}
          options={[
            { value: "easels", label: tr(T.modeEasels, lang) },
            { value: "walls", label: tr(T.modeWalls, lang) },
          ]}
        />
      </div>
      <div className="relative mt-6 overflow-hidden rounded-4xl bg-ink/[0.04] p-6 md:p-10">
        {/* piso */}
        <div className={cn("grid gap-6 transition-all duration-500", mode === "easels" ? "grid-cols-3 md:grid-cols-6" : "grid-cols-3 md:grid-cols-6")}>
          {works.map((a, i) => (
            <Link key={a.id} to={`/masp/obra/${a.id}`} className="tap group flex flex-col items-center">
              <motion.div
                layout
                transition={{ type: "spring", stiffness: 160, damping: 22 }}
                className="flex w-full flex-col items-center"
                style={mode === "easels" ? { marginTop: (i % 3) * 18 } : { marginTop: 0 }}
              >
                {/* vidro */}
                <div className={cn("w-full rounded-md p-1.5 transition-colors duration-500", mode === "easels" ? "bg-white/60 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.9),0_10px_30px_-12px_rgba(0,0,0,0.35)] dark:bg-white/10" : "bg-transparent")}>
                  <ArtImage src={a.thumb} alt={tr(a.title, lang)} color={a.color} className="aspect-[4/5] rounded-sm" />
                </div>
                {/* bloco de concreto ou parede */}
                {mode === "easels" ? (
                  <div className="mt-0 h-6 w-3/4 rounded-sm bg-[#B9B4AC] dark:bg-[#6E6A64]" />
                ) : (
                  <div className="h-6 w-full" />
                )}
              </motion.div>
              <p className="mt-2 line-clamp-1 text-center text-[12px] font-semibold">{tr(a.title, lang)}</p>
            </Link>
          ))}
        </div>
        {mode === "walls" && <div className="pointer-events-none absolute inset-x-6 top-6 bottom-16 -z-0 rounded-xl border-y-8 border-ink/10 md:inset-x-10" />}
        <p className="mt-6 text-[14px] text-muted">{mode === "walls" ? tr(T.wallsNote, lang) : tr(T.easelsNote, lang)}</p>
      </div>
    </section>
  );
}

export default function MaspHistory() {
  const { lang } = useSettings();
  return (
    <>
      <Header back="/masp" title={tr(T.kicker, lang)} />
      <main className="pb-32">
        {/* abertura */}
        <section className="flex min-h-[calc(100dvh-3.5rem)] flex-col justify-end px-4 pb-10 md:min-h-[calc(100dvh-4rem)] md:px-8" style={{ background: RED, color: "#fff" }}>
          <div className="mx-auto w-full max-w-6xl">
            <p className="text-[15px] font-semibold opacity-80">{tr(T.kicker, lang)}</p>
            <h1 className="mt-3 max-w-4xl text-[44px] font-extrabold leading-[0.98] tracking-[-0.04em] md:text-[92px]">{tr(T.hero, lang)}</h1>
            <p className="mt-5 max-w-xl text-[18px] opacity-90">{tr(T.heroLead, lang)}</p>
            <p className="mt-10 flex items-center gap-2 text-[14px] font-semibold opacity-80">
              <ArrowDown size={16} className="animate-bounce" /> {tr(T.scroll, lang)}
            </p>
          </div>
        </section>

        {/* construção guiada pela rolagem */}
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <ScrollStory lang={lang} />
        </div>

        {/* números */}
        <section className="mx-auto mt-10 max-w-6xl px-4 md:px-8">
          <h2 className="text-[15px] font-semibold text-muted">{tr(T.numbers, lang)}</h2>
          <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-10 border-t hairline pt-8 md:grid-cols-4">
            {NUMBERS.map((x) => (
              <div key={x.n}>
                <p className="num text-[56px] leading-none md:text-[88px]" style={{ color: RED }}>
                  {x.n}
                </p>
                <p className="mt-2 text-[15px] font-semibold">{tr(x.label, lang)}</p>
              </div>
            ))}
          </div>
        </section>

        <Easels lang={lang} />

        {/* a praça */}
        <section className="mx-auto mt-24 max-w-6xl px-4 md:px-8">
          <div className="rounded-4xl bg-ink p-8 text-bg md:p-14">
            <h2 className="text-[34px] font-extrabold leading-tight tracking-tight md:text-[48px]">{tr(T.plaza, lang)}</h2>
            <p className="mt-4 max-w-2xl text-[17px] leading-relaxed opacity-85">{tr(T.plazaText, lang)}</p>
          </div>
        </section>

        {/* linha do tempo */}
        <section className="mx-auto mt-24 max-w-6xl px-4 md:px-8">
          <h2 className="text-[34px] font-extrabold tracking-tight md:text-[48px]">{tr(T.timeline, lang)}</h2>
          <div className="no-scrollbar -mx-4 mt-6 flex snap-x gap-3 overflow-x-auto px-4 pb-2 md:-mx-8 md:px-8">
            {TIMELINE.map((x) => (
              <div key={x.year} className="w-[220px] shrink-0 snap-start rounded-3xl border hairline bg-surface p-5">
                <p className="num text-[40px] leading-none" style={{ color: RED }}>
                  {x.year}
                </p>
                <p className="mt-3 text-[15px] font-semibold leading-snug">{tr(x.text, lang)}</p>
              </div>
            ))}
          </div>
        </section>

        <p className="mx-auto mt-16 max-w-6xl px-4 text-[12.5px] text-muted md:px-8">
          {tr(T.sources, lang)}:{" "}
          <a href="https://pt.wikipedia.org/wiki/Museu_de_Arte_de_S%C3%A3o_Paulo" target="_blank" rel="noreferrer" className="underline underline-offset-2">
            Wikipédia
          </a>
          {" · "}
          <a href="https://agenciabrasil.ebc.com.br/cultura/noticia/2025-03/masp-inaugura-novo-predio-nesta-sexta-feira-com-cinco-exposicoes" target="_blank" rel="noreferrer" className="underline underline-offset-2">
            Agência Brasil
          </a>
          {" · "}
          <a href="https://masp.org.br" target="_blank" rel="noreferrer" className="underline underline-offset-2">
            masp.org.br
          </a>
        </p>
      </main>
    </>
  );
}
