import { ArrowUpRight, BookOpen, CalendarCheck, Check, Clock, Library, MapPin, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Shell";
import { Button, Chip, Page } from "@/components/ui";
import { useSettings } from "@/context/Settings";
import type { I18n } from "@/data/types";
import { track } from "@/lib/analytics";
import { normalize, tr } from "@/lib/utils";
import { ArtImage } from "@/components/ArtImage";
import { useMuseum } from "@/context/Museum";

/** Fontes: ims.com.br/acervos/biblioteca-ims-paulista e ims.com.br/acessibilidade/informacoes-ims-paulista (out/2026). */
const CATALOG = "https://biblioteca.sophia.com.br/terminal/7273";
const SCHEDULE = "https://forms.gle/7AW3UJRma27ZEHPD8";
const FOTOPTICA = "https://revistas.biblioteca.ims.com.br/fotoptica/";

const T = {
  title: { pt: "Biblioteca de Fotografia", en: "Photography Library", es: "Biblioteca de Fotografía" },
  lead: {
    pt: "Uma iniciativa única no Brasil: publicações de e sobre fotografia, com capacidade para 30 mil itens. A entrada é gratuita.",
    en: "A one-of-a-kind initiative in Brazil: publications by and about photography, with room for 30,000 items. Free admission.",
    es: "Una iniciativa única en Brasil: publicaciones de y sobre fotografía, con capacidad para 30 mil ítems. Entrada gratuita.",
  },
  where: { pt: "Onde fica", en: "Where it is", es: "Dónde está" },
  floor: { pt: "1º andar do IMS Paulista", en: "1st floor of IMS Paulista", es: "1.er piso del IMS Paulista" },
  steps: [
    {
      pt: "Do térreo, suba pela escada rolante (ou elevador preferencial) até o 5º andar.",
      en: "From the ground floor, take the escalator (or priority elevator) up to the 5th floor.",
      es: "Desde la planta baja, sube por la escalera mecánica (o el ascensor preferencial) hasta el 5.º piso.",
    },
    {
      pt: "No 5º andar ficam o balcão de atendimento e o guarda-volumes: deixe ali mochilas e bolsas grandes.",
      en: "The 5th floor has the front desk and the cloakroom: leave large backpacks and bags there.",
      es: "En el 5.º piso están el mostrador de atención y el guardarropa: deja allí mochilas y bolsos grandes.",
    },
    {
      pt: "Pegue o elevador ou as escadas e desça até o 1º andar.",
      en: "Take the elevator or the stairs down to the 1st floor.",
      es: "Toma el ascensor o las escaleras y baja al 1.er piso.",
    },
    {
      pt: "Na biblioteca, o balcão de referência com bibliotecário fica no meio do espaço. Mostre a ficha do livro que você achou no catálogo.",
      en: "Inside, the reference desk with a librarian is in the middle of the space. Show the record of the book you found in the catalog.",
      es: "Dentro, el mostrador de referencia con bibliotecario está en el centro del espacio. Muestra la ficha del libro que encontraste en el catálogo.",
    },
  ] as I18n[],
  hours: { pt: "Terça a domingo e feriados, das 10h às 20h. Fechado às segundas.", en: "Tuesday to Sunday and holidays, 10am to 8pm. Closed on Mondays.", es: "De martes a domingo y feriados, de 10 a 20 h. Cerrado los lunes." },
  seeMap: { pt: "Ver no mapa do IMS", en: "See on the IMS map", es: "Ver en el mapa del IMS" },
  search: { pt: "Pesquise no catálogo", en: "Search the catalog", es: "Busca en el catálogo" },
  searchDesc: {
    pt: "Busque por fotógrafo, tema ou lugar. A KORA mostra na hora as fotografias do acervo do IMS e leva você aos livros da biblioteca.",
    en: "Search by photographer, subject or place. KORA instantly shows photographs from the IMS collection and takes you to the library's books.",
    es: "Busca por fotógrafo, tema o lugar. KORA muestra al instante las fotografías del acervo del IMS y te lleva a los libros de la biblioteca.",
  },
  inApp: { pt: "No acervo do IMS", en: "In the IMS collection", es: "En el acervo del IMS" },
  none: { pt: "Nenhuma fotografia do acervo na KORA com esse termo.", en: "No photograph in KORA's collection matches this term.", es: "Ninguna fotografía del acervo en KORA coincide con este término." },
  books: { pt: "Livros na biblioteca", en: "Books in the library", es: "Libros en la biblioteca" },
  booksDesc: {
    pt: "O catálogo de livros abre em outra aba com o termo já copiado: é só colar na busca.",
    en: "The book catalog opens in a new tab with your term copied: just paste it in the search.",
    es: "El catálogo de libros se abre en otra pestaña con el término copiado: solo pégalo en la búsqueda.",
  },
  booksBtn: { pt: "Buscar livros sobre", en: "Search books on", es: "Buscar libros sobre" },
  integration: {
    pt: "Com o acesso ao catálogo liberado pelo IMS, os livros passam a aparecer aqui dentro, com a localização na estante.",
    en: "Once IMS grants access to its catalog, books will show up right here, with their shelf location.",
    es: "Cuando el IMS libere el acceso a su catálogo, los libros aparecerán aquí mismo, con su ubicación en el estante.",
  },
  placeholder: { pt: "Ex.: Thomaz Farkas, fotolivro, Amazônia", en: "E.g. Thomaz Farkas, photobook, Amazon", es: "Ej.: Thomaz Farkas, fotolibro, Amazonia" },
  go: { pt: "Abrir no catálogo", en: "Open in the catalog", es: "Abrir en el catálogo" },
  copied: { pt: "Termo copiado. Cole na busca do catálogo.", en: "Term copied. Paste it in the catalog search.", es: "Término copiado. Pégalo en la búsqueda del catálogo." },
  ideas: { pt: "Ideias de busca", en: "Search ideas", es: "Ideas de búsqueda" },
  special: { pt: "Coleções especiais", en: "Special collections", es: "Colecciones especiales" },
  specialDesc: {
    pt: "Além do acervo geral, a biblioteca guarda coleções de nomes como estes:",
    en: "Besides the general collection, the library keeps collections from names such as:",
    es: "Además del acervo general, la biblioteca guarda colecciones de nombres como:",
  },
  periodicals: { pt: "Revistas", en: "Magazines", es: "Revistas" },
  periodicalsDesc: {
    pt: "Os 136 números da Novidades Fotoptica (1953 a 1987), editada por Thomaz Farkas, estão disponíveis online. Na biblioteca há assinaturas de ZUM, Aperture, FOAM, British Journal of Photography, Artforum e outras.",
    en: "All 136 issues of Novidades Fotoptica (1953 to 1987), edited by Thomaz Farkas, are online. The library subscribes to ZUM, Aperture, FOAM, British Journal of Photography, Artforum and others.",
    es: "Los 136 números de Novidades Fotoptica (1953 a 1987), editada por Thomaz Farkas, están en línea. La biblioteca tiene suscripciones a ZUM, Aperture, FOAM, British Journal of Photography, Artforum y otras.",
  },
  readFotoptica: { pt: "Ler a Novidades Fotoptica", en: "Read Novidades Fotoptica", es: "Leer Novidades Fotoptica" },
  schedule: { pt: "Vai pesquisar? Agende", en: "Doing research? Book a visit", es: "¿Vas a investigar? Agenda" },
  scheduleDesc: {
    pt: "Pesquisadores podem garantir lugar e pedir o material com pelo menos 24 horas de antecedência.",
    en: "Researchers can book a seat and request material at least 24 hours in advance.",
    es: "Los investigadores pueden reservar lugar y pedir el material con al menos 24 horas de anticipación.",
  },
  scheduleBtn: { pt: "Agendar pesquisa", en: "Book research", es: "Agendar investigación" },
  source: { pt: "Informações do site do IMS, consultadas em outubro de 2026.", en: "Information from the IMS website, checked in October 2026.", es: "Información del sitio del IMS, consultada en octubre de 2026." },
};

/** Termos que levam a livros ligados às obras que o visitante vê no IMS. */
const IDEAS = ["Marc Ferrez", "Marcel Gautherot", "José Medeiros", "Thomaz Farkas", "Maureen Bisilliat", "Claudia Andujar", "Hildegard Rosenthal", "fotolivro", "fotojornalismo", "zine"];
const SPECIAL = ["Stefania Bril", "Thomaz Farkas", "Iatã Cannabrava", "Vania Toledo", "Steidl"];

export default function ImsLibrary() {
  const { lang } = useSettings();
  const [q, setQ] = useState("");
  const [copied, setCopied] = useState(false);
  const m = useMuseum();
  const hits = useMemo(() => {
    const nq = normalize(q.trim());
    if (nq.length < 2) return [];
    const words = nq.split(/\s+/);
    return m.artworks.filter((a) => {
      const hay = normalize([a.title.pt, tr(a.title, lang), a.artist, a.year, ...(a.tags ?? []), tr(a.description, lang)].join(" "));
      return words.every((w) => hay.includes(w));
    });
  }, [q, m, lang]);

  const open = async (term: string) => {
    const t = term.trim();
    if (t) {
      try {
        await navigator.clipboard.writeText(t);
        setCopied(true);
        setTimeout(() => setCopied(false), 4000);
      } catch {
        /* sem área de transferência: abre o catálogo mesmo assim */
      }
    }
    track({ museum: "ims", type: "plan", path: "biblioteca_busca" });
    window.open(CATALOG, "_blank", "noopener");
  };

  return (
    <>
      <Header back="/ims" title={tr(T.title, lang)} />
      <Page className="max-w-4xl">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-accent text-accent-ink">
          <Library size={26} />
        </span>
        <h1 className="mt-4 text-[34px] font-extrabold leading-tight tracking-tight md:text-[44px]">{tr(T.title, lang)}</h1>
        <p className="mt-2 max-w-2xl text-[16px] text-muted">{tr(T.lead, lang)}</p>

        {/* busca */}
        <section className="mt-8 rounded-4xl bg-ink/[0.04] p-5 md:p-7">
          <h2 className="flex items-center gap-2 text-[22px] font-extrabold">
            <Search size={20} /> {tr(T.search, lang)}
          </h2>
          <p className="mt-1 text-[14px] text-muted">{tr(T.searchDesc, lang)}</p>
          <label className="mt-4 flex h-12 items-center gap-2 rounded-2xl border hairline bg-surface px-4 focus-within:ring-2 focus-within:ring-ink/20">
            <Search size={18} className="text-muted" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={tr(T.placeholder, lang)}
              aria-label={tr(T.search, lang)}
              className="h-full flex-1 bg-transparent text-[16px] outline-none placeholder:text-muted"
            />
          </label>
          <div className="mt-3 flex flex-wrap gap-2">
            {IDEAS.map((i) => (
              <Chip key={i} on={q === i} onClick={() => setQ(i)}>
                {i}
              </Chip>
            ))}
          </div>

          {q.trim().length >= 2 && (
            <div className="mt-6 space-y-6">
              <div>
                <p className="text-[14px] font-bold">
                  {tr(T.inApp, lang)} <span className="font-semibold text-muted">· {hits.length}</span>
                </p>
                {hits.length ? (
                  <div className="no-scrollbar -mx-5 mt-3 flex gap-3 overflow-x-auto px-5 md:-mx-7 md:px-7">
                    {hits.map((a) => (
                      <Link key={a.id} to={`/ims/obra/${a.id}`} className="tap w-32 shrink-0">
                        <ArtImage src={a.thumb} alt={tr(a.title, lang)} color={a.color} className="aspect-square rounded-2xl" />
                        <p className="mt-1.5 line-clamp-2 text-[12.5px] font-semibold leading-tight">{tr(a.title, lang)}</p>
                        <p className="truncate text-[11.5px] text-muted">{a.artist}</p>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 text-[13.5px] text-muted">{tr(T.none, lang)}</p>
                )}
              </div>
              <div className="rounded-2xl bg-surface p-4">
                <p className="flex items-center gap-2 text-[14px] font-bold">
                  <BookOpen size={16} /> {tr(T.books, lang)}
                </p>
                <p className="mt-1 text-[13.5px] text-muted">{tr(T.booksDesc, lang)}</p>
                <Button className="mt-3" icon={<ArrowUpRight size={17} />} onClick={() => void open(q)}>
                  {tr(T.booksBtn, lang)} “{q.trim()}”
                </Button>
                {copied && (
                  <p className="mt-2 flex items-center gap-1.5 text-[13.5px] font-semibold text-success">
                    <Check size={15} /> {tr(T.copied, lang)}
                  </p>
                )}
                <p className="mt-3 text-[12px] text-muted">{tr(T.integration, lang)}</p>
              </div>
            </div>
          )}
        </section>

        {/* onde fica */}
        <section className="mt-10">
          <h2 className="flex items-center gap-2 text-[22px] font-extrabold">
            <MapPin size={20} /> {tr(T.where, lang)}
          </h2>
          <p className="mt-1 text-[17px] font-bold">{tr(T.floor, lang)}</p>
          <ol className="mt-4 space-y-3">
            {T.steps.map((s, i) => (
              <li key={i} className="flex gap-3">
                <span className="num grid h-8 w-8 shrink-0 place-items-center rounded-full bg-ink text-[14px] text-bg">{i + 1}</span>
                <span className="pt-1 text-[15px] leading-snug">{tr(s, lang)}</span>
              </li>
            ))}
          </ol>
          <p className="mt-4 flex items-center gap-2 text-[14px] text-muted">
            <Clock size={15} /> {tr(T.hours, lang)}
          </p>
          <Link to="/ims/mapa?espaco=biblioteca" className="mt-3 inline-block text-[14px] font-semibold text-accent">
            {tr(T.seeMap, lang)}
          </Link>
        </section>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <section className="rounded-3xl border hairline p-5">
            <h2 className="text-[18px] font-extrabold">{tr(T.special, lang)}</h2>
            <p className="mt-1 text-[14px] text-muted">{tr(T.specialDesc, lang)}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {SPECIAL.map((s) => (
                <Chip key={s} onClick={() => { setQ(s); scrollTo({ top: 0, behavior: "smooth" }); }}>
                  {s}
                </Chip>
              ))}
            </div>
          </section>
          <section className="rounded-3xl border hairline p-5">
            <h2 className="flex items-center gap-2 text-[18px] font-extrabold">
              <BookOpen size={18} /> {tr(T.periodicals, lang)}
            </h2>
            <p className="mt-1 text-[14px] text-muted">{tr(T.periodicalsDesc, lang)}</p>
            <a href={FOTOPTICA} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-[14px] font-semibold text-accent">
              {tr(T.readFotoptica, lang)} <ArrowUpRight size={14} />
            </a>
          </section>
        </div>

        <section className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-ink/[0.04] p-5">
          <div className="max-w-md">
            <h2 className="flex items-center gap-2 text-[18px] font-extrabold">
              <CalendarCheck size={18} /> {tr(T.schedule, lang)}
            </h2>
            <p className="mt-1 text-[14px] text-muted">{tr(T.scheduleDesc, lang)}</p>
          </div>
          <a href={SCHEDULE} target="_blank" rel="noreferrer" className="tap inline-flex h-11 items-center gap-1.5 rounded-full bg-ink px-5 text-[14.5px] font-bold text-bg">
            {tr(T.scheduleBtn, lang)} <ArrowUpRight size={15} />
          </a>
        </section>

        <p className="mt-6 text-[12.5px] text-muted">
          {tr(T.source, lang)}{" "}
          <a href="https://ims.com.br/acervos/biblioteca-ims-paulista/" target="_blank" rel="noreferrer" className="underline underline-offset-2">
            ims.com.br
          </a>
        </p>
      </Page>
    </>
  );
}
