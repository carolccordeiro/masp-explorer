import { motion } from "framer-motion";
import { Header } from "@/components/Shell";
import { Page } from "@/components/ui";
import { useSettings } from "@/context/Settings";
import type { I18n } from "@/data/types";
import { tr } from "@/lib/utils";

/**
 * A história do MASP contada a partir da construção do prédio de Lina Bo Bardi.
 * Fontes: Wikipédia (Museu de Arte de São Paulo), Agência Brasil (28/03/2025) e textos do próprio museu.
 */
const T = {
  title: { pt: "A história do MASP", en: "The story of MASP", es: "La historia del MASP" },
  lead: {
    pt: "Um museu que nasceu no centro, ganhou uma praça suspensa na Paulista e mudou a forma de mostrar arte.",
    en: "A museum born downtown that gained a suspended plaza on Paulista Avenue and changed the way art is shown.",
    es: "Un museo que nació en el centro, ganó una plaza suspendida en la Paulista y cambió la forma de mostrar el arte.",
  },
  span: { pt: "74 m de vão livre", en: "74 m free span", es: "74 m de vano libre" },
  height: { pt: "8 m", en: "8 m", es: "8 m" },
  pillars: { pt: "4 pilares", en: "4 pillars", es: "4 pilares" },
  box: { pt: "pinacoteca suspensa", en: "suspended gallery", es: "pinacoteca suspendida" },
  sources: { pt: "Fontes", en: "Sources", es: "Fuentes" },
  caption: { pt: "Esquema simplificado do prédio de Lina Bo Bardi, fora de escala.", en: "Simplified diagram of Lina Bo Bardi's building, not to scale.", es: "Esquema simplificado del edificio de Lina Bo Bardi, fuera de escala." },
};

const CHAPTERS: { year: string; title: I18n; text: I18n }[] = [
  {
    year: "1947",
    title: { pt: "Um museu no centro", en: "A museum downtown", es: "Un museo en el centro" },
    text: {
      pt: "Em 2 de outubro de 1947, Assis Chateaubriand e Pietro Maria Bardi abrem o MASP no 2º andar do Edifício Guilherme Guinle, na rua Sete de Abril. Em poucos anos, o museu reúne a coleção de arte europeia mais importante do hemisfério sul.",
      en: "On October 2, 1947, Assis Chateaubriand and Pietro Maria Bardi open MASP on the 2nd floor of the Guilherme Guinle Building, on Sete de Abril Street. Within a few years it gathers the most important collection of European art in the southern hemisphere.",
      es: "El 2 de octubre de 1947, Assis Chateaubriand y Pietro Maria Bardi abren el MASP en el 2.º piso del Edificio Guilherme Guinle, en la calle Sete de Abril. En pocos años reúne la colección de arte europeo más importante del hemisferio sur.",
    },
  },
  {
    year: "1951",
    title: { pt: "Um terreno com uma condição", en: "A site with one condition", es: "Un terreno con una condición" },
    text: {
      pt: "No alto da Paulista ficava o Belvedere Trianon, demolido em 1951. O terreno tinha sido doado à cidade por Joaquim Eugênio de Lima com uma exigência: a vista para o centro, sobre o vale da avenida Nove de Julho, teria de ser preservada. Qualquer prédio ali não poderia tapar a paisagem.",
      en: "At the top of Paulista stood the Belvedere Trianon, demolished in 1951. Joaquim Eugênio de Lima had donated the land to the city on one condition: the view to downtown, over the Nove de Julho valley, had to be preserved. No building there could block the landscape.",
      es: "En lo alto de la Paulista estaba el Belvedere Trianon, demolido en 1951. Joaquim Eugênio de Lima había donado el terreno a la ciudad con una exigencia: la vista al centro, sobre el valle de la avenida Nove de Julho, debía preservarse. Ningún edificio podía tapar el paisaje.",
    },
  },
  {
    year: "1958",
    title: { pt: "A resposta de Lina", en: "Lina's answer", es: "La respuesta de Lina" },
    text: {
      pt: "Lina Bo Bardi projeta um museu que flutua: o corpo do prédio fica suspenso a 8 metros do chão, preso a duas enormes vigas de concreto apoiadas em quatro pilares laterais. Embaixo, sobra uma praça aberta e a vista continua livre. O cálculo estrutural é do engenheiro José Carlos de Figueiredo Ferraz.",
      en: "Lina Bo Bardi designs a floating museum: the main volume hangs 8 meters above the ground, held by two huge concrete beams resting on four side pillars. Underneath, an open plaza remains and the view stays free. The structural design is by engineer José Carlos de Figueiredo Ferraz.",
      es: "Lina Bo Bardi proyecta un museo que flota: el cuerpo del edificio queda suspendido a 8 metros del suelo, sujeto a dos enormes vigas de hormigón apoyadas en cuatro pilares laterales. Abajo queda una plaza abierta y la vista sigue libre. El cálculo estructural es del ingeniero José Carlos de Figueiredo Ferraz.",
    },
  },
  {
    year: "1958–1968",
    title: { pt: "Dez anos de obra", en: "Ten years of construction", es: "Diez años de obra" },
    text: {
      pt: "A construção leva cerca de dez anos. As vigas usam concreto protendido e vencem um vão livre de 74 metros, na época considerado o maior do mundo. O resultado é uma das imagens mais conhecidas de São Paulo.",
      en: "Construction takes about ten years. The beams use prestressed concrete and span 74 meters, then considered the largest free span in the world. The result is one of São Paulo's best-known images.",
      es: "La construcción dura cerca de diez años. Las vigas usan hormigón pretensado y salvan un vano libre de 74 metros, entonces considerado el mayor del mundo. El resultado es una de las imágenes más conocidas de São Paulo.",
    },
  },
  {
    year: "1968",
    title: { pt: "A inauguração", en: "The opening", es: "La inauguración" },
    text: {
      pt: "Em novembro de 1968, o novo MASP é inaugurado na presença da rainha Elizabeth II. Lá dentro, as obras não ficam nas paredes: flutuam sobre os cavaletes de cristal criados por Lina, placas de vidro presas em blocos de concreto, e o visitante circula livre entre elas.",
      en: "In November 1968 the new MASP opens in the presence of Queen Elizabeth II. Inside, works are not on walls: they float on Lina's crystal easels, glass panels set in concrete blocks, and visitors walk freely among them.",
      es: "En noviembre de 1968 se inaugura el nuevo MASP en presencia de la reina Isabel II. Dentro, las obras no están en las paredes: flotan sobre los caballetes de cristal creados por Lina, placas de vidrio fijadas en bloques de hormigón, y el visitante circula libremente entre ellas.",
    },
  },
  {
    year: "1969",
    title: { pt: "Um acervo protegido", en: "A protected collection", es: "Un acervo protegido" },
    text: {
      pt: "A pedido do próprio museu, o acervo é tombado pelo IPHAN em 1969. O prédio receberia o mesmo reconhecimento federal em 2003.",
      en: "At the museum's own request, IPHAN lists the collection as national heritage in 1969. The building would receive the same federal recognition in 2003.",
      es: "A pedido del propio museo, el IPHAN declara el acervo patrimonio nacional en 1969. El edificio recibiría el mismo reconocimiento federal en 2003.",
    },
  },
  {
    year: "1996",
    title: { pt: "Paredes no lugar dos cavaletes", en: "Walls replace the easels", es: "Paredes en lugar de caballetes" },
    text: {
      pt: "Os cavaletes de cristal são aposentados e a pinacoteca passa a ser dividida por paredes. Entre 1996 e 2001, as vigas do prédio recebem uma nova protensão.",
      en: "The crystal easels are retired and the gallery is divided by walls. Between 1996 and 2001, the building's beams are prestressed again.",
      es: "Los caballetes de cristal se retiran y la pinacoteca pasa a dividirse con paredes. Entre 1996 y 2001, las vigas del edificio reciben un nuevo pretensado.",
    },
  },
  {
    year: "2007",
    title: { pt: "Três minutos de roubo", en: "A three-minute theft", es: "Un robo de tres minutos" },
    text: {
      pt: "Na madrugada de 20 de dezembro de 2007, ladrões levam O Lavrador de Café, de Portinari, e o Retrato de Suzanne Bloch, de Picasso, em cerca de três minutos. As duas obras são recuperadas em 8 de janeiro de 2008.",
      en: "Early on December 20, 2007, thieves take Portinari's The Coffee Farmer and Picasso's Portrait of Suzanne Bloch in about three minutes. Both works are recovered on January 8, 2008.",
      es: "La madrugada del 20 de diciembre de 2007, ladrones se llevan El labrador de café, de Portinari, y el Retrato de Suzanne Bloch, de Picasso, en unos tres minutos. Ambas obras se recuperan el 8 de enero de 2008.",
    },
  },
  {
    year: "2015",
    title: { pt: "Os cavaletes voltam", en: "The easels return", es: "Vuelven los caballetes" },
    text: {
      pt: "Em dezembro de 2015, os cavaletes de cristal voltam ao 2º andar com a exposição Acervo em transformação, e o MASP retoma a ideia de Lina de mostrar a coleção como uma floresta de obras.",
      en: "In December 2015 the crystal easels return to the 2nd floor with the exhibition Collection in Transformation, and MASP revives Lina's idea of showing the collection as a forest of works.",
      es: "En diciembre de 2015 los caballetes de cristal vuelven al 2.º piso con la exposición Acervo en transformación, y el MASP retoma la idea de Lina de mostrar la colección como un bosque de obras.",
    },
  },
  {
    year: "2025",
    title: { pt: "Um segundo prédio", en: "A second building", es: "Un segundo edificio" },
    text: {
      pt: "Em 28 de março de 2025, o MASP abre o Edifício Pietro Maria Bardi, com 14 andares e cinco galerias. A área do museu passa de cerca de 10,5 mil para quase 22 mil metros quadrados.",
      en: "On March 28, 2025, MASP opens the 14-story Pietro Maria Bardi Building with five galleries. The museum's area grows from about 10,500 to almost 22,000 square meters.",
      es: "El 28 de marzo de 2025, el MASP abre el Edificio Pietro Maria Bardi, de 14 pisos y cinco galerías. El área del museo pasa de unos 10.500 a casi 22.000 metros cuadrados.",
    },
  },
];

/** Desenho do prédio: a caixa suspensa, as vigas, os 4 pilares e as medidas que tornaram o MASP famoso. */
function BuildingDrawing({ lang }: { lang: "pt" | "en" | "es" }) {
  return (
    <figure className="mt-8 overflow-hidden rounded-4xl border hairline bg-surface p-4 md:p-8">
      <svg viewBox="0 0 800 335" className="w-full" role="img" aria-label={tr(T.span, lang)}>
        {/* chão e praça */}
        <line x1="20" y1="290" x2="780" y2="290" stroke="rgb(var(--ink))" strokeWidth="2" />
        {/* pilares */}
        {[110, 130, 670, 690].map((x) => (
          <rect key={x} x={x - 6} y="62" width="12" height="228" fill="#E30613" rx="2" />
        ))}
        {/* vigas */}
        <rect x="96" y="56" width="608" height="18" fill="#E30613" rx="3" />
        <rect x="96" y="96" width="608" height="14" fill="#E30613" rx="3" opacity="0.9" />
        {/* caixa de vidro suspensa */}
        <rect x="150" y="80" width="500" height="120" fill="rgb(var(--ink) / 0.06)" stroke="rgb(var(--ink) / 0.55)" strokeWidth="2" rx="4" />
        {Array.from({ length: 11 }).map((_, i) => (
          <line key={i} x1={150 + (i + 1) * 41.6} y1="80" x2={150 + (i + 1) * 41.6} y2="200" stroke="rgb(var(--ink) / 0.15)" />
        ))}
        <text x="400" y="148" textAnchor="middle" fontSize="26" fontWeight="700" fill="rgb(var(--ink))">
          {tr(T.box, lang)}
        </text>
        {/* vão livre */}
        <line x1="136" y1="250" x2="664" y2="250" stroke="rgb(var(--ink))" strokeWidth="1.5" markerStart="url(#a)" markerEnd="url(#a)" />
        <rect x="250" y="230" width="300" height="40" rx="20" fill="rgb(var(--surface))" />
        <text x="400" y="260" textAnchor="middle" fontSize="28" fontWeight="800" fill="rgb(var(--ink))">
          {tr(T.span, lang)}
        </text>
        {/* altura */}
        <line x1="728" y1="200" x2="728" y2="290" stroke="rgb(var(--ink))" strokeWidth="1.5" markerStart="url(#a)" markerEnd="url(#a)" />
        <text x="740" y="252" fontSize="24" fontWeight="800" fill="rgb(var(--ink))">
          {tr(T.height, lang)}
        </text>
        <text x="120" y="324" textAnchor="middle" fontSize="22" fontWeight="600" fill="rgb(var(--muted))">
          {tr(T.pillars, lang)}
        </text>
        <defs>
          <marker id="a" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0 10 5 0 10z" fill="rgb(var(--ink))" />
          </marker>
        </defs>
      </svg>
      <figcaption className="mt-2 text-[12.5px] text-muted">{tr(T.caption, lang)}</figcaption>
    </figure>
  );
}

export default function MaspHistory() {
  const { lang } = useSettings();
  return (
    <>
      <Header back="/masp" title={tr(T.title, lang)} />
      <Page className="max-w-3xl">
        <h1 className="text-[36px] font-extrabold leading-[1.05] tracking-tight md:text-[52px]">{tr(T.title, lang)}</h1>
        <p className="mt-3 max-w-2xl text-[17px] text-muted">{tr(T.lead, lang)}</p>

        <BuildingDrawing lang={lang} />

        <ol className="relative mt-12 space-y-10 border-l-2 border-accent/30 pl-6 md:pl-10">
          {CHAPTERS.map((c, i) => (
            <motion.li key={c.year} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.4, delay: i === 0 ? 0 : 0.05 }} className="relative">
              <span className="absolute -left-[33px] top-2 h-4 w-4 rounded-full border-4 border-bg bg-accent md:-left-[49px]" />
              <p className="num text-[44px] leading-none text-accent md:text-[56px]">{c.year}</p>
              <h2 className="mt-2 text-[22px] font-extrabold">{tr(c.title, lang)}</h2>
              <p className="body-copy mt-2 text-[16px]">{tr(c.text, lang)}</p>
            </motion.li>
          ))}
        </ol>

        <p className="mt-12 text-[12.5px] text-muted">
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
      </Page>
    </>
  );
}
