import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, CalendarDays, Clock, GraduationCap, RotateCcw, Sparkles, User } from "lucide-react";
import { useMemo, useState } from "react";
import { Header } from "@/components/Shell";
import { Button, Chip, Page } from "@/components/ui";
import { useSettings } from "@/context/Settings";
import { AXIS_LABEL, MAM_COURSES, MAM_COURSES_INFO, type Course, type CourseAxis } from "@/data/extras/mamCourses";
import type { I18n, Lang } from "@/data/types";
import { track } from "@/lib/analytics";
import { cn, tr } from "@/lib/utils";

const T = {
  title: { pt: "Cursos do MAM", en: "MAM courses", es: "Cursos del MAM" },
  lead: {
    pt: "Cursos de arte e cultura com profissionais da área. Responda 4 perguntas e descubra qual combina com você.",
    en: "Art and culture courses taught by professionals. Answer 4 questions to find the one for you.",
    es: "Cursos de arte y cultura con profesionales del área. Responde 4 preguntas y descubre cuál te va.",
  },
  questCta: { pt: "Me ajude a escolher", en: "Help me choose", es: "Ayúdame a elegir" },
  questDesc: { pt: "4 perguntas, menos de 1 minuto", en: "4 questions, under a minute", es: "4 preguntas, menos de 1 minuto" },
  all: { pt: "Todos", en: "All", es: "Todos" },
  sessions: { pt: "encontros", en: "sessions", es: "encuentros" },
  plusFees: { pt: "+ taxas", en: "+ fees", es: "+ tasas" },
  running: { pt: "Em andamento", en: "In progress", es: "En curso" },
  startsOn: { pt: "Começa em", en: "Starts on", es: "Empieza el" },
  enroll: { pt: "Ver e inscrever-se no site do MAM", en: "See and enroll on MAM's website", es: "Ver e inscribirse en el sitio del MAM" },
  resultTitle: { pt: "O curso para você", en: "The course for you", es: "El curso para ti" },
  alsoLike: { pt: "Também combinam", en: "Also a good fit", es: "También te pueden gustar" },
  restart: { pt: "Refazer", en: "Start over", es: "Rehacer" },
  source: {
    pt: "Programação consultada em mam.org.br/cursos em 12/10/2026. Confira datas e vagas no site do MAM antes de se inscrever.",
    en: "Schedule taken from mam.org.br/cursos on 10/12/2026. Check dates and availability on MAM's site before enrolling.",
    es: "Programación consultada en mam.org.br/cursos el 12/10/2026. Confirma fechas y cupos en el sitio del MAM antes de inscribirte.",
  },
};

const WEEKDAY: Record<Course["weekday"], I18n> = {
  seg: { pt: "Segundas", en: "Mondays", es: "Lunes" },
  ter: { pt: "Terças", en: "Tuesdays", es: "Martes" },
  qua: { pt: "Quartas", en: "Wednesdays", es: "Miércoles" },
  qui: { pt: "Quintas", en: "Thursdays", es: "Jueves" },
  sab: { pt: "Sábados", en: "Saturdays", es: "Sábados" },
};

type Answer = { goal?: CourseAxis; when?: "semana" | "sabado" | "tanto"; length?: "curto" | "medio" | "longo"; profile?: "curioso" | "estudo" | "trabalho" };

const QUESTIONS: { key: keyof Answer; q: I18n; options: { value: string; label: I18n }[] }[] = [
  {
    key: "goal",
    q: { pt: "O que você quer com um curso?", en: "What do you want from a course?", es: "¿Qué buscas en un curso?" },
    options: [
      { value: "historia", label: { pt: "Entender a história da arte", en: "Understand art history", es: "Entender la historia del arte" } },
      { value: "temas", label: { pt: "Discutir temas de hoje pela arte", en: "Discuss today's issues through art", es: "Discutir temas actuales con el arte" } },
      { value: "gestao", label: { pt: "Trabalhar com museus e espaços culturais", en: "Work with museums and art spaces", es: "Trabajar con museos y espacios culturales" } },
      { value: "praticas", label: { pt: "Conhecer uma linguagem artística", en: "Learn an artistic medium", es: "Conocer un lenguaje artístico" } },
    ],
  },
  {
    key: "when",
    q: { pt: "Quando você consegue assistir?", en: "When can you attend?", es: "¿Cuándo puedes asistir?" },
    options: [
      { value: "semana", label: { pt: "À noite, durante a semana", en: "Weekday evenings", es: "Por la noche, entre semana" } },
      { value: "sabado", label: { pt: "Sábado de manhã", en: "Saturday morning", es: "Sábado por la mañana" } },
      { value: "tanto", label: { pt: "Tanto faz", en: "Either works", es: "Me da igual" } },
    ],
  },
  {
    key: "length",
    q: { pt: "Quantos encontros cabem na sua agenda?", en: "How many sessions fit your schedule?", es: "¿Cuántos encuentros caben en tu agenda?" },
    options: [
      { value: "curto", label: { pt: "Até 4", en: "Up to 4", es: "Hasta 4" } },
      { value: "medio", label: { pt: "5 ou 6", en: "5 or 6", es: "5 o 6" } },
      { value: "longo", label: { pt: "Mais de 6 sem problema", en: "More than 6 is fine", es: "Más de 6 sin problema" } },
    ],
  },
  {
    key: "profile",
    q: { pt: "Qual é a sua relação com arte?", en: "What's your relationship with art?", es: "¿Cuál es tu relación con el arte?" },
    options: [
      { value: "curioso", label: { pt: "Sou curioso, quero começar", en: "I'm curious and want to start", es: "Soy curioso, quiero empezar" } },
      { value: "estudo", label: { pt: "Estudo ou pesquiso", en: "I study or do research", es: "Estudio o investigo" } },
      { value: "trabalho", label: { pt: "Trabalho na área", en: "I work in the field", es: "Trabajo en el área" } },
    ],
  },
];

const today = () => new Date(Date.now() - 3 * 3600e3).toISOString().slice(0, 10);
const fmtDate = (iso: string, lang: Lang) =>
  new Intl.DateTimeFormat(lang === "pt" ? "pt-BR" : lang, { day: "2-digit", month: "short", timeZone: "UTC" }).format(new Date(iso + "T12:00:00Z"));

/** Pontua cada curso pelas respostas; cursos já começados perdem prioridade. */
function rank(a: Answer, list: Course[]) {
  const t = today();
  return list
    .map((c) => {
      let s = 0;
      if (a.goal === c.axis) s += 5;
      if (a.when === "sabado") s += c.weekday === "sab" ? 3 : -2;
      if (a.when === "semana") s += c.weekday !== "sab" ? 2 : -2;
      if (a.length === "curto") s += c.sessions <= 4 ? 2 : c.sessions <= 5 ? 0 : -1;
      if (a.length === "medio") s += c.sessions >= 5 && c.sessions <= 6 ? 2 : 0;
      if (a.length === "longo") s += c.sessions >= 6 ? 1 : 0;
      if (a.profile === "trabalho" && c.axis === "gestao") s += 2;
      if (a.profile === "curioso" && (c.axis === "historia" || c.axis === "praticas")) s += 1;
      if (a.profile === "estudo" && (c.axis === "historia" || c.axis === "temas")) s += 1;
      if (c.start < t) s -= 3;
      return { c, s };
    })
    .sort((x, y) => y.s - x.s || x.c.start.localeCompare(y.c.start))
    .map((x) => x.c);
}

function CourseCard({ c, lang, highlight }: { c: Course; lang: Lang; highlight?: boolean }) {
  const started = c.start < today();
  return (
    <article className={cn("rounded-3xl p-5", highlight ? "bg-accent text-accent-ink" : "border hairline bg-surface")}>
      <div className="flex flex-wrap items-center gap-2 text-[12.5px] font-semibold">
        <span className={cn("rounded-full px-2.5 py-0.5", highlight ? "bg-white/20" : "bg-ink/[0.05]")}>{tr(AXIS_LABEL[c.axis], lang)}</span>
        <span className={cn("rounded-full px-2.5 py-0.5", started ? (highlight ? "bg-white/20" : "bg-warning/15 text-warning") : highlight ? "bg-white/20" : "bg-success/15 text-success")}>
          {started ? tr(T.running, lang) : `${tr(T.startsOn, lang)} ${fmtDate(c.start, lang)}`}
        </span>
      </div>
      <h3 className="mt-3 text-[19px] font-extrabold leading-snug">{c.title}</h3>
      <p className={cn("mt-1 flex items-center gap-1.5 text-[13.5px]", highlight ? "opacity-85" : "text-muted")}>
        <User size={14} /> {c.teacher}
      </p>
      <p className={cn("mt-3 text-[14.5px] leading-snug", highlight ? "opacity-95" : "")}>{tr(c.summary, lang)}</p>
      <dl className={cn("mt-4 grid grid-cols-2 gap-x-4 gap-y-1.5 text-[13.5px]", highlight ? "opacity-90" : "text-muted")}>
        <dd className="flex items-center gap-1.5">
          <CalendarDays size={14} /> {tr(WEEKDAY[c.weekday], lang)}, {c.time}
        </dd>
        <dd className="flex items-center gap-1.5">
          <Clock size={14} /> {c.sessions} {tr(T.sessions, lang)}
        </dd>
        <dd className="col-span-2">{tr(c.format, lang)}</dd>
      </dl>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="num text-[22px]">
          {c.price} <span className="text-[13px] font-semibold opacity-70">{tr(T.plusFees, lang)}</span>
        </p>
        <a
          href={c.url}
          target="_blank"
          rel="noreferrer"
          className={cn("tap inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[13.5px] font-bold", highlight ? "bg-white text-black" : "bg-ink text-bg")}
        >
          {tr(T.enroll, lang)} <ArrowUpRight size={15} />
        </a>
      </div>
    </article>
  );
}

export default function MamCourses() {
  const { lang } = useSettings();
  const [axis, setAxis] = useState<CourseAxis | "all">("all");
  const [quest, setQuest] = useState<number | null>(null);
  const [ans, setAns] = useState<Answer>({});
  const done = quest != null && quest >= QUESTIONS.length;
  const ranked = useMemo(() => (done ? rank(ans, MAM_COURSES) : []), [done, ans]);
  const list = useMemo(() => {
    const t = today();
    return MAM_COURSES.filter((c) => c.end >= t && (axis === "all" || c.axis === axis)).sort((a, b) => a.start.localeCompare(b.start));
  }, [axis]);

  return (
    <>
      <Header back="/mam" title={tr(T.title, lang)} />
      <Page className="max-w-4xl">
        <h1 className="text-[34px] font-extrabold leading-tight tracking-tight md:text-[44px]">{tr(T.title, lang)}</h1>
        <p className="mt-2 max-w-2xl text-[16px] text-muted">{tr(T.lead, lang)}</p>

        {/* questionário */}
        <section className="mt-6 rounded-4xl bg-ink/[0.04] p-5 md:p-7">
          {quest == null && (
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-accent text-accent-ink">
                  <Sparkles size={22} />
                </span>
                <div>
                  <p className="text-[18px] font-extrabold">{tr(T.questCta, lang)}</p>
                  <p className="text-[13.5px] text-muted">{tr(T.questDesc, lang)}</p>
                </div>
              </div>
              <Button onClick={() => setQuest(0)}>{tr(T.questCta, lang)}</Button>
            </div>
          )}

          <AnimatePresence mode="wait">
            {quest != null && !done && (
              <motion.div key={quest} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }}>
                <div className="mb-4 flex gap-1.5">
                  {QUESTIONS.map((_, i) => (
                    <span key={i} className={cn("h-1.5 flex-1 rounded-full", i <= quest ? "bg-accent" : "bg-ink/10")} />
                  ))}
                </div>
                <p className="text-[22px] font-extrabold leading-snug">{tr(QUESTIONS[quest].q, lang)}</p>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {QUESTIONS[quest].options.map((o) => (
                    <button
                      key={o.value}
                      onClick={() => {
                        const next = { ...ans, [QUESTIONS[quest].key]: o.value };
                        setAns(next);
                        setQuest(quest + 1);
                        if (quest + 1 >= QUESTIONS.length) track({ museum: "mam", type: "plan", path: "curso_quest" });
                      }}
                      className="tap rounded-2xl border hairline bg-surface p-4 text-left text-[15.5px] font-semibold hover:border-accent"
                    >
                      {tr(o.label, lang)}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {done && ranked[0] && (
              <motion.div key="result" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                <div className="mb-3 flex items-center justify-between">
                  <p className="flex items-center gap-2 text-[18px] font-extrabold">
                    <GraduationCap size={20} /> {tr(T.resultTitle, lang)}
                  </p>
                  <button
                    onClick={() => {
                      setAns({});
                      setQuest(0);
                    }}
                    className="tap flex items-center gap-1.5 text-[13.5px] font-semibold text-muted"
                  >
                    <RotateCcw size={14} /> {tr(T.restart, lang)}
                  </button>
                </div>
                <CourseCard c={ranked[0]} lang={lang} highlight />
                <p className="mb-2 mt-5 text-[14px] font-semibold text-muted">{tr(T.alsoLike, lang)}</p>
                <div className="grid gap-3 md:grid-cols-2">
                  {ranked.slice(1, 3).map((c) => (
                    <CourseCard key={c.id} c={c} lang={lang} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* lista */}
        <div className="no-scrollbar -mx-4 mt-10 flex gap-2 overflow-x-auto px-4">
          <Chip on={axis === "all"} onClick={() => setAxis("all")}>
            {tr(T.all, lang)}
          </Chip>
          {(Object.keys(AXIS_LABEL) as CourseAxis[]).map((k) => (
            <Chip key={k} on={axis === k} onClick={() => setAxis(k)}>
              {tr(AXIS_LABEL[k], lang)}
            </Chip>
          ))}
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {list.map((c) => (
            <CourseCard key={c.id} c={c} lang={lang} />
          ))}
        </div>

        <p className="mt-8 text-[13.5px] text-muted">{tr(MAM_COURSES_INFO.discounts, lang)}</p>
        <p className="mt-2 text-[12.5px] text-muted">
          {tr(T.source, lang)}{" "}
          <a href={MAM_COURSES_INFO.page} target="_blank" rel="noreferrer" className="underline underline-offset-2">
            mam.org.br/cursos
          </a>
          {" · "}
          <a href={`mailto:${MAM_COURSES_INFO.contact}`} className="underline underline-offset-2">
            {MAM_COURSES_INFO.contact}
          </a>
        </p>
      </Page>
    </>
  );
}
