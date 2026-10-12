import type { I18n } from "../types";

/** Eixos da programação de cursos do MAM São Paulo. */
export type CourseAxis = "historia" | "temas" | "gestao" | "praticas";

export interface Course {
  id: string;
  title: string; // título oficial, como o MAM publica
  teacher: string;
  axis: CourseAxis;
  start: string; // ISO
  end: string;
  weekday: "seg" | "ter" | "qua" | "qui" | "sab";
  time: string;
  sessions: number;
  price: string;
  format: I18n;
  summary: I18n;
  url: string;
}

export const AXIS_LABEL: Record<CourseAxis, I18n> = {
  historia: { pt: "Narrativas da história da arte", en: "Art history narratives", es: "Narrativas de la historia del arte" },
  temas: { pt: "Temas contemporâneos da cultura", en: "Contemporary cultural topics", es: "Temas contemporáneos de la cultura" },
  gestao: { pt: "Gestão cultural", en: "Cultural management", es: "Gestión cultural" },
  praticas: { pt: "Práticas artísticas", en: "Artistic practices", es: "Prácticas artísticas" },
};

const ONLINE: I18n = { pt: "Online, ao vivo", en: "Online, live", es: "En línea, en vivo" };
const HYBRID: I18n = {
  pt: "Online, ao vivo, com um encontro presencial no MAM",
  en: "Online, live, with one in-person session at MAM",
  es: "En línea, en vivo, con un encuentro presencial en el MAM",
};

/** Programação publicada em mam.org.br/cursos (consulta de 12/10/2026). Preços sem as taxas da plataforma. */
export const MAM_COURSES: Course[] = [
  {
    id: "arte-e-loucura",
    title: "Arte e loucura?",
    teacher: "Flavia Corpas",
    axis: "temas",
    start: "2026-09-09",
    end: "2026-10-28",
    weekday: "qua",
    time: "19h às 21h",
    sessions: 8,
    price: "R$ 640,00",
    format: ONLINE,
    summary: {
      pt: "Das imagens do inconsciente a Bispo do Rosário: como a arte e a loucura se encontram, na história e na clínica.",
      en: "From images of the unconscious to Bispo do Rosário: how art and madness meet, in history and in clinical practice.",
      es: "De las imágenes del inconsciente a Bispo do Rosário: cómo se encuentran el arte y la locura, en la historia y en la clínica.",
    },
    url: "https://mam.org.br/curso/arte-e-loucura/",
  },
  {
    id: "conservacao-preventiva",
    title: "Conservação preventiva e gestão de riscos para instituições culturais",
    teacher: "Juliana Saft",
    axis: "gestao",
    start: "2026-09-15",
    end: "2026-10-27",
    weekday: "ter",
    time: "19h às 21h",
    sessions: 7,
    price: "R$ 610,00",
    format: HYBRID,
    summary: {
      pt: "Um método para avaliar riscos a acervos e pessoas, com atividade prática nas instalações do MAM.",
      en: "A method to assess risks to collections and people, with a hands-on activity at MAM's facilities.",
      es: "Un método para evaluar riesgos para acervos y personas, con actividad práctica en las instalaciones del MAM.",
    },
    url: "https://mam.org.br/curso/conservacao-preventiva-e-gestao-de-riscos-para-instituicoes-culturais/",
  },
  {
    id: "espacos-independentes",
    title: "Gestão de espaços de arte independentes",
    teacher: "Thais Rivitti, do Ateliê397",
    axis: "gestao",
    start: "2026-09-17",
    end: "2026-10-17",
    weekday: "qui",
    time: "19h às 21h",
    sessions: 6,
    price: "R$ 480,00",
    format: {
      pt: "Online, ao vivo; o último encontro é uma visita presencial ao Ateliê397",
      en: "Online, live; the last session is an in-person visit to Ateliê397",
      es: "En línea, en vivo; el último encuentro es una visita presencial al Ateliê397",
    },
    summary: {
      pt: "Como criar e sustentar um espaço de arte independente: programação, autogestão e financiamento.",
      en: "How to start and sustain an independent art space: programming, self-management and funding.",
      es: "Cómo crear y sostener un espacio de arte independiente: programación, autogestión y financiamiento.",
    },
    url: "https://mam.org.br/curso/gestao-de-espacos-de-arte-independentes/",
  },
  {
    id: "imigracao",
    title: "Arte, imigração e deslocamentos",
    teacher: "Marina Mazze Cerchiaro",
    axis: "historia",
    start: "2026-10-13",
    end: "2026-11-17",
    weekday: "ter",
    time: "19h às 21h",
    sessions: 5,
    price: "R$ 440,00",
    format: ONLINE,
    summary: {
      pt: "Artistas migrantes e a arte moderna brasileira, com casos do acervo do MAM. Não exige conhecimento prévio.",
      en: "Migrant artists and Brazilian modern art, with cases from MAM's collection. No prior knowledge needed.",
      es: "Artistas migrantes y el arte moderno brasileño, con casos del acervo del MAM. No requiere conocimiento previo.",
    },
    url: "https://mam.org.br/curso/arte-imigracao-e-deslocamentos/",
  },
  {
    id: "saude-mental",
    title: "Arte e saúde mental: experiências do sensível",
    teacher: "André Alves e Lucas Liedke",
    axis: "temas",
    start: "2026-10-13",
    end: "2026-11-18",
    weekday: "qua",
    time: "19h às 21h",
    sessions: 4,
    price: "R$ 480,00",
    format: ONLINE,
    summary: {
      pt: "A arte diante do excesso de estímulos, da ansiedade e da vida online, entre psicanálise e filosofia.",
      en: "Art facing overstimulation, anxiety and online life, between psychoanalysis and philosophy.",
      es: "El arte ante el exceso de estímulos, la ansiedad y la vida en línea, entre psicoanálisis y filosofía.",
    },
    url: "https://mam.org.br/curso/arte-e-saude-mental-experiencias-do-sensivel/",
  },
  {
    id: "inventario",
    title: "Inventário de acervos e novas tecnologias",
    teacher: "Gabriel Moore Bevilacqua",
    axis: "gestao",
    start: "2026-10-19",
    end: "2026-11-23",
    weekday: "seg",
    time: "19h às 21h30",
    sessions: 5,
    price: "R$ 400,00",
    format: ONLINE,
    summary: {
      pt: "Como planejar e manter o inventário de um acervo, com sistemas, aplicativos e painéis de controle.",
      en: "How to plan and keep a collection inventory, with systems, apps and dashboards.",
      es: "Cómo planificar y mantener el inventario de un acervo, con sistemas, aplicaciones y tableros.",
    },
    url: "https://mam.org.br/curso/inventario-de-acervos-e-novas-tecnologias/",
  },
  {
    id: "ancestralidade",
    title: "Tempo e ancestralidade na arte contemporânea",
    teacher: "Alexandre Araujo Bispo",
    axis: "temas",
    start: "2026-10-19",
    end: "2026-11-23",
    weekday: "seg",
    time: "19h às 21h",
    sessions: 5,
    price: "R$ 400,00",
    format: ONLINE,
    summary: {
      pt: "Memória e ancestralidade na arte brasileira, de Bispo do Rosário a artistas de hoje, sob o olhar decolonial.",
      en: "Memory and ancestry in Brazilian art, from Bispo do Rosário to today's artists, through a decolonial lens.",
      es: "Memoria y ancestralidad en el arte brasileño, de Bispo do Rosário a artistas de hoy, con mirada decolonial.",
    },
    url: "https://mam.org.br/curso/tempo-e-ancestralidade-na-arte-contemporanea/",
  },
  {
    id: "formacao-do-brasil",
    title: "Arte na formação do Brasil",
    teacher: "Filipe Barrocas",
    axis: "historia",
    start: "2026-10-22",
    end: "2026-11-12",
    weekday: "qui",
    time: "19h às 21h",
    sessions: 4,
    price: "R$ 350,00",
    format: ONLINE,
    summary: {
      pt: "Como a pintura, a literatura e o cinema construíram (e hoje questionam) a imagem do Brasil.",
      en: "How painting, literature and film built (and now question) the image of Brazil.",
      es: "Cómo la pintura, la literatura y el cine construyeron (y hoy cuestionan) la imagen de Brasil.",
    },
    url: "https://mam.org.br/curso/arte-na-formacao-do-brasil/",
  },
  {
    id: "videoarte",
    title: "Introdução à videoarte",
    teacher: "Ruy Luduvice",
    axis: "praticas",
    start: "2026-10-24",
    end: "2026-11-28",
    weekday: "sab",
    time: "10h às 12h",
    sessions: 6,
    price: "R$ 520,00",
    format: ONLINE,
    summary: {
      pt: "A história da videoarte, de Nam June Paik à produção brasileira de hoje.",
      en: "The history of video art, from Nam June Paik to today's Brazilian production.",
      es: "La historia del videoarte, de Nam June Paik a la producción brasileña actual.",
    },
    url: "https://mam.org.br/curso/introducao-a-videoarte/",
  },
];

export const MAM_COURSES_INFO = {
  discounts: {
    pt: "Desconto de 20% para Amigo MAM e de 10% para estudantes, professores e aposentados. Há política de bolsas. Todos os cursos dão certificado.",
    en: "20% off for MAM Friends and 10% for students, teachers and retirees. Scholarships available. All courses include a certificate.",
    es: "20% de descuento para Amigos MAM y 10% para estudiantes, profesores y jubilados. Hay becas. Todos los cursos dan certificado.",
  },
  contact: "cursos@mam.org.br",
  page: "https://mam.org.br/cursos/",
};
