import type { I18n, MuseumId } from "../types";

/** O "plus" de cada museu: um conteúdo exclusivo da instituição. */
export const EXTRAS: Record<MuseumId, { path: string; icon: "history" | "library" | "courses"; title: I18n; desc: I18n }> = {
  masp: {
    path: "historia",
    icon: "history",
    title: { pt: "A história do MASP", en: "The story of MASP", es: "La historia del MASP" },
    desc: {
      pt: "Da rua Sete de Abril ao vão livre de 74 metros",
      en: "From Sete de Abril Street to the 74 m free span",
      es: "De la calle Sete de Abril al vano libre de 74 metros",
    },
  },
  ims: {
    path: "biblioteca",
    icon: "library",
    title: { pt: "Biblioteca de Fotografia", en: "Photography Library", es: "Biblioteca de Fotografía" },
    desc: {
      pt: "Pesquise no catálogo e saiba como chegar ao 1º andar",
      en: "Search the catalog and find your way to the 1st floor",
      es: "Busca en el catálogo y llega al 1.er piso",
    },
  },
  mam: {
    path: "cursos",
    icon: "courses",
    title: { pt: "Cursos do MAM", en: "MAM courses", es: "Cursos del MAM" },
    desc: {
      pt: "Veja a programação e descubra qual curso é para você",
      en: "See the schedule and find the course for you",
      es: "Mira la programación y descubre tu curso",
    },
  },
};
